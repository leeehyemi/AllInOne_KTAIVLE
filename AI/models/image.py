import json
import os
from dotenv import load_dotenv
from openai import OpenAI
import requests
from PIL import Image
from io import BytesIO
import boto3
import importlib
from logger import logger

def generate_and_upload_thumbnail():
    import models.config
    importlib.reload(models.config)
    from models.config import VIDEO_FILE_NAME, S3_BUCKET_NAME, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY
    load_dotenv()

    # 이미지 경로 설정
    output_image_folder = './output/images'
    output_filename = os.path.join(output_image_folder, f"{VIDEO_FILE_NAME}.png")

    if os.path.exists(output_filename):
        logger.info(f"Generating thumbnail is skipped since {output_filename} exists")
    else:
        logger.info("==========Generating thumbnail==========")

        # JSON 파일 경로
        json_file_path = f'./output/json/{VIDEO_FILE_NAME}_lecture.json'

        # JSON 파일에서 데이터 읽기
        with open(json_file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)

        # 강의 제목 추출
        lecture_title = data.get('강의 제목') 
        logger.info(f'강의 제목: {lecture_title}')


        openai_api_key = os.getenv('OPENAI_API_KEY')
        client = OpenAI(api_key=openai_api_key)
        prompt = f"이 텍스트는 '강의 제목' 입니다.: {lecture_title} . 이 텍스트를 기반으로 강의영상 썸네일을 만들어주세요. 이미지의 배경은 흰색으로 해주고 이 강의를 나타내는 피규어를 가운데에 놓아주세요 "

        response = client.images.generate(
        model="dall-e-3",
        prompt=prompt,
        size="1024x1024",
        quality="hd",
        n=1,
        )

        image_url = response.data[0].url
        print("Generated Image URL:", image_url)

        # 이미지 다운로드 및 저장
        image_data = requests.get(image_url)
        image = Image.open(BytesIO(image_data.content))

        # 이미지 크기 조정 (512x512)
        image_resized = image.resize((512, 512), Image.Resampling.LANCZOS)

        # 조정된 이미지 저장
        image_resized.save(output_filename)
        logger.info(f"이미지 저장 완료 : {output_filename}")

    # AWS S3에 이미지 업로드
    s3_client = boto3.client(
        's3',
        aws_access_key_id=AWS_ACCESS_KEY_ID,
        aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
        region_name='ap-northeast-2'  # AWS 리전에 맞게 변경
    )

    s3_bucket_name = S3_BUCKET_NAME
    s3_key = f'images/{VIDEO_FILE_NAME}.png'  # S3 버킷 내 파일 이름

    with open(output_filename, 'rb') as f:
        s3_client.upload_fileobj(f, s3_bucket_name, s3_key)

    logger.info(f"이미지를 S3에 업로드했습니다: s3://{s3_bucket_name}/{s3_key}")

# main.py에서 직접 호출
if __name__ == "__main__":
    generate_and_upload_thumbnail()
