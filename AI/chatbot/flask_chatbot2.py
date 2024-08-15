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
import importlib
import shutil
import time

app = Flask(__name__)

# CORS 설정: 명시적으로 허용할 도메인 지정
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)

# CSRF 보호 비활성화 (개발 환경에서만)
app.config['WTF_CSRF_ENABLED'] = False

# GPT-3.5 Turbo API 키 설정
openai.api_key = os.getenv('OPENAI_API_KEY')


@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

@app.route('/create_db', methods=['POST'])
def create_db():
    data = request.get_json()
    file_name = data.get('file_name')
    file_name_without_ext = os.path.splitext(file_name)[0]
    
    import models.config
    importlib.reload(models.config)
    from models.config import PDF_OUTPUT_DIR, PDF_FILE_EXT
    
    db_dir = "./db"
    
    pdf_path = os.path.join(PDF_OUTPUT_DIR, f"{file_name_without_ext}_lecture{PDF_FILE_EXT}")
    loader = PyPDFLoader(pdf_path)
    documents = loader.load()
    embeddings = OpenAIEmbeddings(model="text-embedding-ada-002")
    
    database = Chroma(persist_directory=db_dir, embedding_function=embeddings)
    database.add_documents(documents)
    
    response_data = {
        'status': 'success',
        'message': 'Database has been created and documents have been added.'
    }
    
    return jsonify(response_data)


@app.route('/chat', methods=['POST'])
def chat():
    
    db_dir = "./db"
    if not os.path.exists(db_dir):
        response_data = {
            'status': 'error',
            'message': 'Database does not exist. Please create the database first.'
        }
        return jsonify(response_data)
    
    data = request.get_json()
    query = data.get('question')
    
    embeddings = OpenAIEmbeddings(model="text-embedding-ada-002")
    database = Chroma(persist_directory=db_dir, embedding_function=embeddings)
    chat = ChatOpenAI(model="gpt-3.5-turbo")
    
    # 리트리버(RAG, 지식DB)
    k = 3
    retriever = database.as_retriever(search_kwargs={"k": k})
    # 대화 메모리 생성
    memory = ConversationBufferMemory(memory_key="chat_history", input_key="question", output_key="answer", return_messages=True)
    qa = ConversationalRetrievalChain.from_llm(llm=chat, retriever=retriever, memory=memory, return_source_documents=True, output_key="answer")
    
    dt = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    
    result = qa({"question": query})
    answer = result['answer'] if isinstance(result, dict) and 'answer' in result else str(result)

    response_data = {
        'result': answer,
        'datetime': dt
    }
    
    return jsonify(response_data)
        
@app.route('/remove', methods=['POST'])
def remove():
    db_dir = "./db"
    if os.path.exists(db_dir):
        try:
            shutil.rmtree(db_dir)
            os.makedirs(db_dir, exist_ok=True)
            response_data = {'status': 'success', 'message': f'{db_dir} has been removed and recreated.'}
        except Exception as e:
            response_data = {'status': 'error', 'message': str(e)}
    else:
        os.makedirs(db_dir, exist_ok=True)
        response_data = {'status': 'success', 'message': f'{db_dir} did not exist but has been created.'}
    
    return jsonify(response_data)
        
   

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
