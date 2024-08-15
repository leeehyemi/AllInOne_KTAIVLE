import os, cv2, requests, json, base64
from logger import logger
from tqdm import tqdm

import importlib
def perform_ocr():
    import models.config
    importlib.reload(models.config)
    from models.config import VIDEO_FILE_PATH, OCR_FILE_PATH, OCR_OUTPUT_DIR

    if os.path.exists(OCR_FILE_PATH):
        logger.info(f"Performing OCR model is skipped since {OCR_FILE_PATH} exists")
        return

    logger.info("==========Performing OCR==========")
    
    api_url = os.getenv('OCR_API_URL')
    api_key = os.getenv('OCR_API_KEY')

    headers = {
        "Content-Type": "application/json",
        "X-OCR-SECRET": api_key
    }

    cap = cv2.VideoCapture(VIDEO_FILE_PATH)

    if not cap.isOpened():
        print("Error: 동영상 파일을 열 수 없습니다.")
        exit()

    second_interval = 20
    all_results = []
    seen_texts = set()

    fps = cap.get(cv2.CAP_PROP_FPS)
    if fps == 0:
        print("Error: FPS를 가져올 수 없습니다.")
        exit()
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    total_seconds = total_frames / fps

    for sec in tqdm(range(0, int(total_seconds), second_interval)):
        cap.set(cv2.CAP_PROP_POS_MSEC, sec * 1000)
        success, frame = cap.read()
        if success:
            _, buffer = cv2.imencode('.png', frame)
            image_data = base64.b64encode(buffer).decode('utf-8')

            data = {
                "version": "V1",
                "requestId": f"request_{sec}",
                "timestamp": 0,
                "images": [
                    {
                        "name": "image",
                        "format": "png",
                        "data": image_data
                    }
                ]
            }

            response = requests.post(api_url, headers=headers, data=json.dumps(data))

            if response.status_code == 200:
                result = response.json()
                texts = []
                for image in result.get('images', []):
                    for field in image.get('fields', []):
                        infer_text = field.get('inferText', '')
                        if infer_text not in seen_texts:
                            seen_texts.add(infer_text)
                            texts.append(infer_text)

                # time_formatted = f"{int(sec // 3600):02}:{int((sec % 3600) // 60):02}:{int(sec % 60):02}"
                time_formatted = f"{int(sec // 60):02}:{int(sec % 60):02} ~ {int((sec + second_interval) // 60):02}:{int((sec + second_interval) % 60):02}"

                if texts:  # 텍스트가 있는 경우에만 추가
                    all_results.append({
                        "time": time_formatted,
                        "texts": " ".join(texts)
                    })
            else:
                logger.error("Error:", response.status_code, response.text)

    cap.release()

    os.makedirs(OCR_OUTPUT_DIR, exist_ok=True)

    with open(OCR_FILE_PATH, 'w', encoding='utf-8') as text_file:
        for entry in all_results:
            text_file.write(f"{entry['time']} - {entry['texts']}\n")

    logger.info(f"OCR 결과를 {OCR_FILE_PATH}에 저장했습니다.")
