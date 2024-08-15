import os, json, tiktoken, warnings, importlib
from dotenv import load_dotenv
from langchain_community.chat_models import ChatOpenAI
from langchain.schema import AIMessage, HumanMessage, SystemMessage
from tqdm import tqdm
from logger import logger

# Deprecation 경고 무시
warnings.filterwarnings("ignore", category=DeprecationWarning)

# .env 파일 로드
load_dotenv()

# OpenAI API 키 설정
openai_api_key = os.getenv('OPENAI_API_KEY')

# ChatOpenAI 모델 생성 /gpt-3.5-turbo = 6만 토큰 / gpt-3.5-turbo-instruct = 9만 토큰
chat = ChatOpenAI(model="gpt-3.5-turbo", api_key=openai_api_key)

# 토큰화 도구 설정
tokenizer = tiktoken.get_encoding("cl100k_base")

# 텍스트를 토큰 단위로 나누는 함수
def split_text_into_chunks(text, chunk_size=10000):
    tokens = tokenizer.encode(text)
    chunks = [tokens[i:i + chunk_size] for i in range(0, len(tokens), chunk_size)]
    return [tokenizer.decode(chunk) for chunk in chunks]

# 퀴즈 생성 함수
def generate_quiz(text, n_questions=10):
    prompt = f"다음 텍스트에서 {n_questions}개의 퀴즈를 생성해 주세요. 정답은 1개만 나오도록 해주고 영상시간으로 퀴즈를 만들지 말아주세요. 또한 각 퀴즈는 다음 형식이어야 합니다.시간은 꼭 나오고 질문은 텍스트와 ','로 이루어져야합니다:\n\n퀴즈번호: [번호]\n퀴즈 질문: [질문]\n사지선다: [선택지1, 선택지2, 선택지3, 선택지4]\n정답: [정답]\n퀴즈에 주제: [주제]\n그 주제가 영상에 시작되는 시간: [시간]\n\n텍스트:\n{text}\n"
    response = chat(messages=[
        SystemMessage(content="You are a helpful assistant."),
        HumanMessage(content=prompt)
    ])
    return response.content

# 퀴즈 저장 함수
def save_quiz_to_file(quiz_content, file_path, source_file_name):
    # 파일명에서 확장자를 제거하고 "_merged" 부분 제거
    lecture_name = os.path.splitext(source_file_name)[0].replace('_merged', '')

    # 퀴즈 내용을 파싱하여 JSON 형식으로 변환
    quiz_lines = quiz_content.split('\n\n')
    quiz_list = []
    
    for quiz in quiz_lines:
        lines = quiz.split('\n')
        quiz_dict = {"lectureName": lecture_name}  # 파일명 추가
        for line in tqdm(lines):
            key, value = line.split(': ', 1)
            if key == "퀴즈 질문":
                quiz_dict["question"] = value
            elif key == "사지선다":
                quiz_dict["options"] = value
            elif key == "정답":
                quiz_dict["answer"] = value
            elif key == "퀴즈에 주제":
                quiz_dict["subject"] = value
            elif key == "그 주제가 영상에 시작되는 시간":
                quiz_dict["time"] = value
        quiz_list.append(quiz_dict)

    # JSON 형식으로 변환
    with open(file_path, 'w', encoding='utf-8') as file:
        json.dump(quiz_list, file, ensure_ascii=False, indent=4)

# 퀴즈 생성 및 저장
def create_and_save_quiz():
    import models.config
    importlib.reload(models.config)
    from models.config import MERGED_FILE_PATH, QUIZ_FILE_PATH, QUIZ_OUTPUT_DIR

    if os.path.exists(QUIZ_FILE_PATH):
        logger.info(f"Creating quiz is skipped since {QUIZ_FILE_PATH} exists")
        return

    logger.info("==========Creating quiz==========")
    
    if os.path.exists(MERGED_FILE_PATH):
        with open(MERGED_FILE_PATH, 'r', encoding='utf-8') as file:
            text = file.read()

        # 텍스트를 10000 토큰 단위로 나누기
        chunks = split_text_into_chunks(text)

        # 청크 개수 출력
        num_chunks = len(chunks)
        logger.info(f"청크 개수: {num_chunks}")

        # 각 청크마다 생성할 문제의 개수 계산
        questions_per_chunk = [10 // num_chunks] * num_chunks
        for i in range(10 % num_chunks):
            questions_per_chunk[i] += 1

        # 각 텍스트 조각에서 퀴즈 생성
        all_quizzes = []
        for idx, chunk in enumerate(tqdm(chunks)):
            quiz_content = generate_quiz(chunk, questions_per_chunk[idx])
            all_quizzes.append(quiz_content)

        # 모든 퀴즈를 하나의 텍스트로 결합
        combined_quiz_content = "\n\n".join(all_quizzes)

        # 퀴즈 저장
        os.makedirs(QUIZ_OUTPUT_DIR, exist_ok=True)  # Ensure the directory exists
        save_quiz_to_file(combined_quiz_content, QUIZ_FILE_PATH, os.path.basename(MERGED_FILE_PATH))
        logger.info(f"퀴즈가 {QUIZ_FILE_PATH}에 저장되었습니다.")
    else:
        logger.info(f"병합된 파일이 존재하지 않습니다: {MERGED_FILE_PATH}")

if __name__ == "__main__":
    create_and_save_quiz()