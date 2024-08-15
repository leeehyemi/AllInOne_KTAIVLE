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
import os
import shutil

app = Flask(__name__)

# CORS 설정: 명시적으로 허용할 도메인 지정
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)

# CSRF 보호 비활성화 (개발 환경에서만)
app.config['WTF_CSRF_ENABLED'] = False

# GPT-3.5 Turbo API 키 설정
openai.api_key = os.getenv('OPENAI_API_KEY')

# 전역 변수로 데이터베이스, 임베딩, 리트리버, QA 체인 설정
embeddings = OpenAIEmbeddings(model="text-embedding-ada-002")
database = None
retriever = None
qa = None

def initialize_db(mp4_filename):
    global database, retriever, qa

    # .mp4 확장자를 제거하고 _merged.pdf 확장자로 변경
    pdf_filename = mp4_filename.replace('.mp4', '_lecture.pdf')

    if not os.path.exists(pdf_filename):
        raise ValueError(f"File path {pdf_filename} is not a valid file")

    loader = PyPDFLoader(pdf_filename)
    documents = loader.load()

    # 기존 데이터베이스 삭제 및 재생성
    db_dir = "./db"
    if os.path.exists(db_dir):
        shutil.rmtree(db_dir)
    os.makedirs(db_dir)

    # Chroma 데이터베이스 선언
    database = Chroma(persist_directory=db_dir, embedding_function=embeddings)

    # DB에 문서 추가
    database.add_documents(documents)

    # 리트리버(RAG, 지식DB)
    k = 3
    retriever = database.as_retriever(search_kwargs={"k": k})

    # LLM 모델 선언
    chat = ChatOpenAI(model="gpt-3.5-turbo")

    # 대화 메모리 생성
    memory = ConversationBufferMemory(memory_key="chat_history", input_key="question", output_key="answer", return_messages=True)

    # ConversationalRetrievalQA 체인 생성
    qa = ConversationalRetrievalChain.from_llm(llm=chat, retriever=retriever, memory=memory, return_source_documents=True, output_key="answer")

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

@app.route('/refresh_db', methods=['POST'])
def refresh_db():
    try:
        data = request.get_json()
        file_name = data.get('file_name')
        if not file_name:
            return jsonify({"error": "File name is required"}), 400
        
        initialize_db(file_name)
        return jsonify({"message": "Database refreshed successfully"}), 200
    except Exception as e:
        app.logger.error(f"Error during database refresh: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/chat', methods=['POST'])
def chat():
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
