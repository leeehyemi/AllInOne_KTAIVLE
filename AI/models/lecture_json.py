import os, shutil, json, importlib, warnings
from dotenv import load_dotenv
from langchain_community.chat_models import ChatOpenAI
from langchain.schema import AIMessage, HumanMessage, SystemMessage
from logger import logger
from tqdm import tqdm

# Deprecation 경고 무시
warnings.filterwarnings("ignore", category=DeprecationWarning)

# .env 파일 로드
load_dotenv()

# OpenAI API 키 설정
openai_api_key = os.getenv('OPENAI_API_KEY')

# ChatOpenAI 모델 생성
chat = ChatOpenAI(model="gpt-4-turbo", api_key=openai_api_key)

# 최대 토큰 수 설정
MAX_TOKENS = 3800  # 안전하게 여유를 두고 설정

# 텍스트를 토큰 제한에 맞게 청크로 나누는 함수
def split_text_into_chunks(text, max_tokens=MAX_TOKENS):
    sentences = text.split('.')
    chunks = []
    current_chunk = ""
    current_tokens = 0

    for sentence in sentences:
        sentence_tokens = len(sentence.split())
        if current_tokens + sentence_tokens > max_tokens:
            chunks.append(current_chunk.strip())
            current_chunk = sentence
            current_tokens = sentence_tokens
        else:
            current_chunk += sentence + "."
            current_tokens += sentence_tokens
    
    if current_chunk:
        chunks.append(current_chunk.strip())
    
    return chunks

# 강의 제목 생성 함수
def generate_title(text):
    prompt = f"다음 텍스트를 기반으로 강의 제목을 1개만 생성해주세요:\n\n{text}\n"
    response = chat(messages=[
        SystemMessage(content="You are a helpful assistant."),
        HumanMessage(content=prompt)
    ])
    return response.content.strip()

# 한줄 강의 요약 생성 함수
def generate_summary(text):
    prompt = f"다음 텍스트를 기반으로 한 줄로 강의 요약을 생성해주세요:\n\n{text}\n"
    response = chat(messages=[
        SystemMessage(content="You are a helpful assistant."),
        HumanMessage(content=prompt)
    ])

    summary = response.content.strip()  # 요약된 내용을 가져옵니다
    return summary


# 대주제 생성 함수
def generate_main_topic(text):
    prompt = f"다음 텍스트를 기반으로 대주제를 생성해주세요. 또한 형식은 '대주제는 ~~ 입니다' 가 아닌 '대주제' 만 나오도록 해주세요:\n\n{text}\n"
    response = chat(messages=[
        SystemMessage(content="You are a helpful assistant."),
        HumanMessage(content=prompt)
    ])
    return response.content.strip()

# 소주제와 내용 생성 함수
def generate_json_chunk(text):
    prompt = f"다음 텍스트의 전체를 주제별로 나눠주고, 각 주제별로 내용을 요약하지 말고 빠짐없이 자세하게 작성해주세요. 또한 각 주제는 다음 형식이어야 합니다:\n\n주제 번호: [번호]\n주제 이름: [주제]\n내용: [내용]\n그 주제가 영상에 시작되는 시간: [시간]\n\n텍스트:\n{text}\n"
    response = chat(messages=[
        SystemMessage(content="You are a helpful assistant."),
        HumanMessage(content=prompt)
    ])
    return response.content

# 키워드 추출 함수 (OpenAI 사용)
def extract_keywords(text):
    prompt = f"다음 텍스트에서 중요한 키워드를 추출해 주세요. 2개의 키워드를 추출하되, 쉼표로 구분하여 반환하세요:\n\n{text}\n\n키워드:"
    response = chat(messages=[
        SystemMessage(content="You are a helpful assistant."),
        HumanMessage(content=prompt)
    ])
    return response.content.strip()

# 강의자료 저장 함수
def save_lecture_data_to_file(title, lecture_content, summary, file_path):
    lecture_list = []

    # 강의 제목 추가
    lecture_data = {
        "강의 제목": title,
        "한줄 강의 요약": summary,
        "강의 목차": [],
        "강의 내용": []
    }

    # 강의자료 내용을 파싱하여 JSON 형식으로 변환
    for main_topic, lecture in lecture_content:
        main_topic_dict = {"Big_title": main_topic, "sub_topics": []}
        lecture_lines = lecture.split('\n\n')
        sub_topic_numbers = []

        for idx, lecture in enumerate(lecture_lines):
            lines = lecture.split('\n')
            lecture_dict = {}
            for line in lines:
                key, value = line.split(': ', 1)
                if key == "주제 번호":
                    lecture_dict["Title_Number"] = value
                    sub_topic_numbers.append(value)
                elif key == "주제 이름":
                    lecture_dict["Title_Name"] = value
                elif key == "내용":
                    lecture_dict["text"] = value
                elif key == "그 주제가 영상에 시작되는 시간":
                    lecture_dict["time"] = value
                    # 내용에서 키워드 추출
                    lecture_dict["keywords"] = extract_keywords(lecture_dict["text"]).split(', ')
            main_topic_dict["sub_topics"].append(lecture_dict)

        lecture_list.append(main_topic_dict)
        
        # 강의 목차에 대주제와 소주제 추가
        main_topic_index = len(lecture_data["강의 목차"]) + 1
        sub_topics_indexed = "\n    ".join([f"{i + 1}) {main_topic_dict['sub_topics'][i]['Title_Name']}" for i in range(len(main_topic_dict["sub_topics"]))])
        lecture_data["강의 목차"].append(f"{main_topic_index}. {main_topic}\n    {sub_topics_indexed}")

    # 강의 내용 추가
    lecture_data["강의 내용"] = lecture_list

    # JSON 형식으로 변환하여 파일에 저장
    with open(file_path, 'w', encoding='utf-8') as file:
        json.dump(lecture_data, file, ensure_ascii=False, indent=4)

# 강의자료 생성 및 저장
def create_and_save_lecture_data():

    import models.config
    importlib.reload(models.config)
    from models.config import MERGED_FILE_PATH, JSON_FILE_PATH, JSON_OUTPUT_DIR

    if os.path.exists(JSON_FILE_PATH):
        logger.info(f"Creating lecture data is skipped since {JSON_FILE_PATH} exists")
        return
    
    logger.info("==========Creating lecture data==========")
    
    if os.path.exists(MERGED_FILE_PATH):
        with open(MERGED_FILE_PATH, 'r', encoding='utf-8') as file:
            text = file.read()

        # 텍스트를 청크로 나눔
        chunks = split_text_into_chunks(text)

        all_lecture_content = []
        for chunk in tqdm(chunks):
            main_topic = generate_main_topic(chunk)
            lecture_content = generate_json_chunk(chunk)
            all_lecture_content.append((main_topic, lecture_content))

        # 첫 번째 청크를 사용하여 강의 제목 생성
        title = generate_title(chunks[0])

        # 첫 번째 청크에서 요약 생성
        summary = generate_summary(chunks[0])
        
        os.makedirs(os.path.dirname(JSON_FILE_PATH), exist_ok=True)  # Ensure the directory exists
        save_lecture_data_to_file(title, all_lecture_content, summary, JSON_FILE_PATH)
        logger.info(f"강의 자료가 {JSON_FILE_PATH}에 저장되었습니다.")
    else:
        logger.info(f"병합된 파일이 존재하지 않습니다: {MERGED_FILE_PATH}")

if __name__ == "__main__":
    create_and_save_lecture_data()
