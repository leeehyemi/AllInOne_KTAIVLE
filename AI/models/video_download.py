import boto3
import importlib
import os
from logger import logger

def download_video_from_s3():
    # S3 클라이언트 생성
    import models.config
    importlib.reload(models.config)
    from models.config import VIDEO_FILE_NAME,VIDEO_FILE_PATH, S3_BUCKET_NAME, VIDEO_FILE_NAME, VIDEO_FILE_EXT, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY

    if os.path.exists(VIDEO_FILE_PATH):
        logger.info(f"Downloading video from S3 is skipped since {VIDEO_FILE_PATH} exists")
        return
    logger.info("==========Downloading video from S3==========")
    logger.info(f'현재 비디오 파일 이름: {VIDEO_FILE_NAME}')
    
    s3_client = boto3.client(
        's3',
        aws_access_key_id=AWS_ACCESS_KEY_ID,
        aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
        region_name='ap-northeast-2'  # AWS 리전에 맞게 변경
    )

    # 다운로드할 버킷 이름과 파일 키
    bucket_name = S3_BUCKET_NAME  # 사용할 S3 버킷 이름
    file_key = f'static/{VIDEO_FILE_NAME}{VIDEO_FILE_EXT}'  # S3 버킷 내 파일 이름

    # 파일 다운로드
    try:
        s3_client.download_file(bucket_name, file_key, VIDEO_FILE_PATH)
        logger.info(f"File downloaded to {VIDEO_FILE_PATH}")
    except Exception as e:
        logger.info(f"Error downloading file: {e}")