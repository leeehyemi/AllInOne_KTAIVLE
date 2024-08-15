from flask import Flask, jsonify, request, send_file, redirect
from flask_cors import CORS, cross_origin
import openai
from datetime import datetime
from langchain.chains import RetrievalQA
from langchain_community.document_loaders import PyPDFLoader
from langchain_community.chat_models import ChatOpenAI
from langchain_community.embeddings import OpenAIEmbeddings
from langchain_community.vectorstores import Chroma
import os
import importlib
import json
import warnings
import boto3
from botocore.exceptions import NoCredentialsError
from models.video_download import download_video_from_s3
from models.stt import inference_model
from models.ocr import perform_ocr
from models.merge_files import merge_files
from models.quiz import create_and_save_quiz
from models.pdf import create_pdf_from_json
from models.capture import capture_frames
from models.lecture_json import create_and_save_lecture_data
from models.image import generate_and_upload_thumbnail
import ssl

app = Flask(__name__)

# CORS 설정: 명시적으로 허용할 도메인 지정
CORS(app, resources={r"/*": {"origins": "https://allinnone.net"}}, supports_credentials=True)
app.config['WTF_CSRF_ENABLED'] = False

# 경고 메시지 필터링 설정: 모든 경고 메시지를 무시하도록 설정
warnings.filterwarnings('ignore')

# GPT-3.5 Turbo API 키 설정
openai.api_key = os.getenv('OPENAI_API_KEY')

# Chroma 데이터베이스 디렉토리
DB_ROOT_DIR = "./db"
S3_BUCKET_NAME = os.getenv('S3_BUCKET_NAME')

S3_LOCATION = f'http://{S3_BUCKET_NAME}.s3.ap-northeast-2.amazonaws.com/'


# S3에 파일 업로드 함수
def upload_to_s3(file_path, bucket_name, s3_file_name):
    import models.config
    importlib.reload(models.config)
    from models.config import AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, S3_BUCKET_NAME
    S3_LOCATION = f'http://{S3_BUCKET_NAME}.s3.ap-northeast-2.amazonaws.com/'
    s3 = boto3.client(
        's3',
        aws_access_key_id=AWS_ACCESS_KEY_ID,
        aws_secret_access_key=AWS_SECRET_ACCESS_KEY
    )

    try:
        s3.upload_file(file_path, bucket_name, s3_file_name)
        return f"{S3_LOCATION}{s3_file_name}"
    except FileNotFoundError:
        return None
    except NoCredentialsError:
        return None


# 파일 이름을 config.py에 저장하는 함수
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


def get_database_dir(file_name):
    return os.path.join(DB_ROOT_DIR, file_name)


@cross_origin(origins="https://allinnone.net")
@app.route('/video/chat', methods=['POST'])
def chat():
    import models.config
    importlib.reload(models.config)
    from models.config import VIDEO_FILE_NAME, PDF_OUTPUT_DIR, PDF_FILE_EXT

    data = request.get_json()
    file_name = data.get('file_name')
    file_name_without_ext = os.path.splitext(file_name)[0]
    query = data.get('question')

    if not query:
        return jsonify({'error': 'Question is required'}), 400

    db_dir = get_database_dir(file_name_without_ext)

    if not os.path.exists(db_dir):
        # 데이터베이스가 존재하지 않으면 PDF에서 문서를 로드하고 데이터베이스를 생성합니다.
        pdf_path = os.path.join(PDF_OUTPUT_DIR, f"{file_name_without_ext}_lecture{PDF_FILE_EXT}")
        loader = PyPDFLoader(pdf_path)
        documents = loader.load()

        os.makedirs(db_dir)

        embeddings = OpenAIEmbeddings(model="text-embedding-ada-002")
        database = Chroma(persist_directory=db_dir, embedding_function=embeddings)
        database.add_documents(documents)

        save_file_name_to_config(file_name_without_ext)
    else:
        # 데이터베이스가 존재하면 로드합니다.
        embeddings = OpenAIEmbeddings(model="text-embedding-ada-002")
        database = Chroma(persist_directory=db_dir, embedding_function=embeddings)

    chat = ChatOpenAI(model="gpt-3.5-turbo")

    k = 3
    retriever = database.as_retriever(search_kwargs={"k": k})
    qa = RetrievalQA.from_chain_type(llm=chat, chain_type="stuff", retriever=retriever)

    dt = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    # 올바른 입력 키를 사용하여 체인 호출
    result = qa({"query": query})
    answer = result['result'] if isinstance(result, dict) and 'result' in result else str(result)

    response_data = {
        'result': answer,
        'datetime': dt
    }

    return jsonify(response_data)


@cross_origin(origins="https://allinnone.net")
@app.route('/video/timeline', methods=['GET'])
def get_timeline():
    import models.config
    importlib.reload(models.config)
    from models.config import JSON_OUTPUT_DIR, JSON_FILE_EXT

    file_name = request.args.get('fileName')

    if not file_name:
        return jsonify({"error": "fileName parameter is required"}), 400
    base_name = os.path.splitext(file_name)[0]
    json_path = os.path.join(JSON_OUTPUT_DIR, f"{base_name}_lecture{JSON_FILE_EXT}")

    print(json_path)

    if not os.path.exists(json_path):
        return jsonify({"error": f"{json_path} not found"}), 404

    with open(json_path, 'r', encoding='utf-8') as file:
        data = json.load(file)

    lecture_content = data.get("강의 내용", [])

    def convert_time_to_seconds(time_str):
        parts = list(map(int, time_str.split(':')))
        if len(parts) == 3:
            h, m, s = parts
        elif len(parts) == 2:
            h, m, s = 0, parts[0], parts[1]
        else:
            h, m, s = 0, 0, parts[0]
        return h * 3600 + m * 60 + s

    for topic in lecture_content:
        for sub_topic in topic.get("sub_topics", []):
            sub_topic["time"] = convert_time_to_seconds(sub_topic.get("time", "00:00"))

    return jsonify({"강의 내용": lecture_content})


# 1번부터 4번까지의 작업을 한 번만 수행
def process_initial_tasks():
    try:
        import models.config
        importlib.reload(models.config)
        from models.config import VIDEO_FILE_NAME
        print(f'현재 비디오 파일 이름: {VIDEO_FILE_NAME}')

        # 1. 영상 다운로드
        download_video_from_s3()
        # 2. STT 모델을 사용하여 음성 인식
        inference_model()
        # 3. OCR 모델을 사용하여 문자 인식
        perform_ocr()
        # 4. 파일 병합
        merge_files()
    except Exception as e:
        raise RuntimeError(f"Failed during initial processing: {str(e)}")


@cross_origin(origins="https://allinnone.net")
@app.route('/create/process_initial', methods=['POST'])
def api_process_initial():
    try:
        data = request.get_json()
        file_name = data.get('file_name')
        if not file_name:
            return jsonify({"error": "File name is required"}), 400

        save_file_name_to_config(file_name)

        process_initial_tasks()
        return jsonify({"message": "Initial tasks processed successfully"}), 200
    except Exception as e:
        app.logger.error(f"Error during process_initial: {str(e)}")  # 예외를 로그에 출력
        return jsonify({"error": str(e)}), 500


@cross_origin(origins="https://allinnone.net")
@app.route('/create/create_quiz', methods=['POST'])
def api_create_quiz():
    try:
        create_and_save_quiz()

        import models.config
        importlib.reload(models.config)
        from models.config import QUIZ_FILE_PATH
        with open(QUIZ_FILE_PATH, 'r', encoding='utf-8') as file:
            quiz_data = json.load(file)

        app.logger.info(f"Quiz data: {quiz_data}")
        return jsonify(quiz_data), 200

    except Exception as e:
        app.logger.error(f"Error during create_quiz: {str(e)}")  # 예외를 로그에 출력
        return jsonify({"error": str(e)}), 500


@cross_origin(origins="https://allinnone.net")
@app.route('/create/create_pdf', methods=['POST'])
def api_create_pdf():
    import models.config
    importlib.reload(models.config)
    from models.config import PDF_FILE_PATH, S3_BUCKET_NAME

    try:
        data = request.get_json()
        file_name = data.get('file_name')
        print(file_name)
        if not file_name:
            return jsonify({"error": "File name is required"}), 400

        save_file_name_to_config(file_name)
        create_and_save_lecture_data()
        generate_and_upload_thumbnail()
        capture_frames()
        create_pdf_from_json()
        s3_file_url = upload_to_s3(PDF_FILE_PATH, S3_BUCKET_NAME, f"pdf/{file_name}.pdf")
        if s3_file_url:
            return jsonify({"message": "PDF created and uploaded successfully", "url": s3_file_url}), 200
        else:
            return jsonify({"error": "Failed to upload PDF to S3"}), 500
    except Exception as e:
        app.logger.error(f"Error during create_pdf: {str(e)}")  # 예외를 로그에 출력
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    try:
        ssl_context = ssl.SSLContext(ssl.PROTOCOL_TLS)
        ssl_context.load_cert_chain(certfile='/etc/letsencrypt/live/allinone-flask.com/fullchain.pem',
                                    keyfile='/etc/letsencrypt/live/allinone-flask.com/privkey.pem')
        app.run(host="0.0.0.0", port=443, ssl_context=ssl_context)
    except RuntimeError as e:
        print(e)
