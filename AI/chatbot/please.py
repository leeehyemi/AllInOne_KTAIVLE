from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
from datetime import datetime
from langchain.chains import ConversationalRetrievalChain
from langchain.memory import ConversationBufferMemory
from langchain_community.chat_models import ChatOpenAI
from langchain_community.embeddings import OpenAIEmbeddings
from langchain_community.vectorstores import Chroma
from langchain.docstore.document import Document
import os
from dotenv import load_dotenv
import PyPDF2

app = Flask(__name__)

# CORS 설정: 명시적으로 허용할 도메인 지정
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)

# CSRF 보호 비활성화 (개발 환경에서만)
app.config['WTF_CSRF_ENABLED'] = False

# .env 파일 로드
load_dotenv()

# GPT-3.5 Turbo API 키 설정
openai_api_key = os.getenv('OPENAI_API_KEY')

# 임베딩 모델 지정
embeddings = OpenAIEmbeddings(model="text-embedding-ada-002")

# LLM 모델 선언
chat = ChatOpenAI(model="gpt-3.5-turbo")

# 리트리버(RAG, 지식DB)
k = 3

# 대화 메모리 생성
memory = ConversationBufferMemory(memory_key="chat_history", input_key="question", output_key="answer", return_messages=True)

# ConversationalRetrievalQA 체인 생성
qa = None

# 이전 파일 이름을 저장하는 변수
previous_file_name = None

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

@app.route('/chat', methods=['POST'])
def chat():
    global qa, previous_file_name, database

    dt = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    query = request.json.get('question')
    file_name = request.json.get('file_name')

    # 파일 이름이 변경된 경우 데이터베이스를 초기화하고 새 데이터 로드
    if file_name != previous_file_name:
        previous_file_name = file_name
        file_name = file_name.rsplit('.', 1)[0]
        pdf_path = f'output/pdf/{file_name}_lecture.pdf'

        # PDF 파일 로드 및 텍스트 추출
        text_content = ""
        with open(pdf_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            for page in reader.pages:
                text_content += page.extract_text()

        documents = [Document(page_content=text_content)]

        # Chroma 데이터베이스 초기화 및 재생성
        database = Chroma(persist_directory="./db", embedding_function=embeddings)
        database.add_documents(documents)

        # 리트리버 재생성
        retriever = database.as_retriever(search_kwargs={"k": k})

        # ConversationalRetrievalQA 체인 재생성
        qa = ConversationalRetrievalChain.from_llm(llm=chat, retriever=retriever, memory=memory, return_source_documents=True, output_key="answer")

    # 질문 처리
    result = qa(query)
    answer = result['answer'] if isinstance(result, dict) and 'answer' in result else str(result)
    
    response_data = {
        'result': answer,
        'datetime': dt
    }
    
    return jsonify(response_data)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)