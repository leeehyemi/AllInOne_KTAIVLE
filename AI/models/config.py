import os
from dotenv import load_dotenv

# .env 파일 로드
load_dotenv()

# 상수 설정
VIDEO_FILE_NAME = "컴퓨터구조"
VIDEO_FILE_EXT = ".mp4"
AUDIO_FILE_EXT = ".mp3"
TXT_FILE_EXT = ".txt"
JSON_FILE_EXT = ".json"
PDF_FILE_EXT = ".pdf"

# 디렉토리 설정
DATA_DIR = './data'
VIDEOS_DIR = os.path.join(DATA_DIR, 'videos')
AUDIO_DIR = os.path.join(DATA_DIR, 'audio')
OUTPUT_DIR = './output'
OCR_OUTPUT_DIR = os.path.join(OUTPUT_DIR, 'ocr')
STT_OUTPUT_DIR = os.path.join(OUTPUT_DIR, 'stt')
RESULT_OUTPUT_DIR = os.path.join(OUTPUT_DIR, 'result')
QUIZ_OUTPUT_DIR = os.path.join(OUTPUT_DIR, 'quiz')
PDF_OUTPUT_DIR = './output/pdf'
JSON_OUTPUT_DIR = os.path.join(OUTPUT_DIR, 'json')
# FRAME_OUTPUT_DIR = os.path.join(OUTPUT_DIR, 'frames')  # 프레임 저장 디렉토리 추가
CAPTURED_IMAGES_DIR = os.path.join(OUTPUT_DIR, 'captured_images')

# 파일 경로 설정
VIDEO_FILE_PATH = os.path.join(VIDEOS_DIR, f"{VIDEO_FILE_NAME}{VIDEO_FILE_EXT}")
AUDIO_FILE_PATH = os.path.join(AUDIO_DIR, f"{VIDEO_FILE_NAME}{AUDIO_FILE_EXT}")
OCR_FILE_PATH = os.path.join(OCR_OUTPUT_DIR, f"{VIDEO_FILE_NAME}{TXT_FILE_EXT}")
STT_FILE_PATH = os.path.join(STT_OUTPUT_DIR, f"{VIDEO_FILE_NAME}{TXT_FILE_EXT}")
MERGED_FILE_PATH = os.path.join(RESULT_OUTPUT_DIR, f"{VIDEO_FILE_NAME}_merged{TXT_FILE_EXT}")
QUIZ_FILE_PATH = os.path.join(QUIZ_OUTPUT_DIR, f"{VIDEO_FILE_NAME}_quiz{JSON_FILE_EXT}")
PDF_FILE_PATH = os.path.join(PDF_OUTPUT_DIR, f"{VIDEO_FILE_NAME}_lecture{PDF_FILE_EXT}")
JSON_FILE_PATH = os.path.join(JSON_OUTPUT_DIR, f"{VIDEO_FILE_NAME}_lecture{JSON_FILE_EXT}")
CAPTURED_IMAGES_PATH = os.path.join(CAPTURED_IMAGES_DIR, VIDEO_FILE_NAME)
CAPTURED_PDF_PATH = os.path.join(PDF_OUTPUT_DIR, f"{VIDEO_FILE_NAME}_captured.pdf")


# AWS S3 자격 증명 설정
AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
S3_BUCKET_NAME = os.getenv('S3_BUCKET_NAME')