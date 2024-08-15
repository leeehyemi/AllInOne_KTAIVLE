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


def save_file_name_to_config(file_name):
    try:
        config_file_path = os.path.join(os.path.dirname(__file__), 'models', 'config.py')
        
        # config.py 파일 읽기
        with open(config_file_path, 'r', encoding='utf-8') as file:
            config_lines = file.readlines()

        # config.py 파일 쓰기
        with open(config_file_path, 'w', encoding='utf-8') as file:
            found = False
            for line in config_lines:
                if line.startswith('VIDEO_FILE_NAME'):
                    file.write(f'VIDEO_FILE_NAME = "{file_name}"\n')
                    found = True
                else:
                    file.write(line)
            
            # 만약 VIDEO_FILE_NAME이 파일에 존재하지 않으면 추가합니다.
            if not found:
                file.write(f'\nVIDEO_FILE_NAME = "{file_name}"\n')

        print(f'파일 이름이 성공적으로 {config_file_path}에 저장되었습니다.')

    except Exception as e:
        print(f'파일 이름을 저장하는 중에 오류가 발생했습니다: {e}')


@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

@app.route('/chat', methods=['POST'])
def chat():
    
    import models.config
    importlib.reload(models.config)
    from models.config import VIDEO_FILE_NAME, PDF_OUTPUT_DIR, PDF_FILE_EXT
    
    data = request.get_json()
    file_name = data.get('file_name')
    file_name_without_ext = os.path.splitext(file_name)[0]
    
    
    if file_name_without_ext != VIDEO_FILE_NAME:
        pdf_path = os.path.join(PDF_OUTPUT_DIR, f"{file_name_without_ext}_lecture{PDF_FILE_EXT}")
        loader = PyPDFLoader(pdf_path)
        documents = loader.load()
        

        db_dir = "./db"
        if os.path.exists(db_dir):
            shutil.rmtree(db_dir)
        os.makedirs(db_dir)

        embeddings = OpenAIEmbeddings(model="text-embedding-ada-002")
        # Chroma 데이터베이스 선언 및 문서 추가
        database = Chroma(persist_directory=db_dir, embedding_function=embeddings)
        database.add_documents(documents)
        
        chat = ChatOpenAI(model="gpt-3.5-turbo")
        
        # 리트리버(RAG, 지식DB)
        k = 3
        retriever = database.as_retriever(search_kwargs={"k": k})
        # 대화 메모리 생성
        memory = ConversationBufferMemory(memory_key="chat_history", input_key="question", output_key="answer", return_messages=True)
        qa = ConversationalRetrievalChain.from_llm(llm=chat, retriever=retriever, memory=memory, return_source_documents=True, output_key="answer")
        
        dt = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        query = request.json.get('question')
        
        result = qa({"question": query})
        answer = result['answer'] if isinstance(result, dict) and 'answer' in result else str(result)
    
        response_data = {
            'result': answer,
            'datetime': dt
        }
        save_file_name_to_config(file_name_without_ext)
        return jsonify(response_data)
        
    else:
        embeddings = OpenAIEmbeddings(model="text-embedding-ada-002")
        database = Chroma(persist_directory=db_dir, embedding_function=embeddings)
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
    
        result = qa({"question": query})
        answer = result['answer'] if isinstance(result, dict) and 'answer' in result else str(result)
    
        response_data = {
            'result': answer,
            'datetime': dt
        }
    
        return jsonify(response_data)
        
   
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
