from models.video_download import download_video_from_s3
from models.stt import inference_model
from models.ocr import perform_ocr
from models.merge_files import merge_files
from models.quiz import create_and_save_quiz
from models.lecture_json import create_and_save_lecture_data
from models.capture import capture_frames
from models.pdf import create_pdf_from_json
from models.image import generate_and_upload_thumbnail
import warnings

if __name__ == "__main__":
    # 경고 메시지를 무시하는 함수 정의
    def ignore_warning(message, category, filename, lineno, file=None, line=None):
        pass
    # 경고 메시지 필터링 설정: 모든 경고 메시지를 무시하도록 설정
    warnings.filterwarnings('ignore')

    # 1. 영상 다운로드
    # download_video_from_s3()

    # 2. STT 모델을 사용하여 음성 인식
    inference_model()

    # 3. OCR 모델을 사용하여 문자 인식
    # perform_ocr()

    # 4. 파일 병합
    # merge_files()

    # 5. 퀴즈 생성 및 저장
    # create_and_save_quiz()

    # 6. PDF 생성 전 JSON으로 생성
    # create_and_save_lecture_data()
    
    # 7. JSON 기반 이미지 생성
    # generate_and_upload_thumbnail()

    # 8. 영상 프레임 캡처
    # capture_frames()

    # 9. PDF 생성 및 저장
    # create_pdf_from_json()