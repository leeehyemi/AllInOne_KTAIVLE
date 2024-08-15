from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
from datetime import datetime
from langchain.chains import ConversationalRetrievalChain
from langchain.memory import ConversationBufferMemory
from langchain_community.document_loaders import PyPDFLoader
from langchain_community.chat_models import ChatOpenAI
from langchain_community.embeddings import OpenAIEmbeddings
from langchain_community.vectorstores import Chroma

app = Flask(__name__)

# CORS 설정: 명시적으로 허용할 도메인 지정
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)

# CSRF 보호 비활성화 (개발 환경에서만)
app.config['WTF_CSRF_ENABLED'] = False

# GPT-3.5 Turbo API 키 설정
openai.api_key = 'X'

# PDF 파일 경로
pdf_path = '18분영상_lecture.pdf'

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

@app.route('/chat', methods=['POST'])
def chat():
    # 매번 데이터베이스를 초기화
    loader = PyPDFLoader(pdf_path)
    documents = loader.load()

    # 임베딩 모델 지정
    embeddings = OpenAIEmbeddings(model="text-embedding-ada-002")

    # Chroma 데이터베이스 선언 및 문서 추가
    database = Chroma(persist_directory="./db", embedding_function=embeddings)
    database.add_documents(documents)

    # LLM 모델 선언
    chat = ChatOpenAI(model="gpt-3.5-turbo")

    # 리트리버(RAG, 지식DB)
    k = 3
    retriever = database.as_retriever(search_kwargs={"k": k})

    # 대화 메모리 생성
    memory = ConversationBufferMemory(memory_key="chat_history", input_key="question", output_key="answer", return_messages=True)

    # ConversationalRetrievalQA 체인 생성
    qa = ConversationalRetrievalChain.from_llm(llm=chat, retriever=retriever, memory=memory, return_source_documents=True, output_key="answer")

    dt = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    query = request.json.get('question')
    
    result = qa(query)
    answer = result['answer'] if isinstance(result, dict) and 'answer' in result else str(result)
    
    response_data = {
        'result': answer,
        'datetime': dt
    }
    
    return jsonify(response_data)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)