import os, importlib
from logger import logger

def merge_files():
 
    import models.config
    importlib.reload(models.config)
    from models.config import OCR_FILE_PATH, STT_FILE_PATH, MERGED_FILE_PATH, RESULT_OUTPUT_DIR

    if os.path.exists(MERGED_FILE_PATH):
        logger.info(f"Merging STT and OCR results is skipped since {MERGED_FILE_PATH} exists")
        return

    logger.info("==========Merging STT and OCR results==========")
    
    os.makedirs(RESULT_OUTPUT_DIR, exist_ok=True)

    with open(OCR_FILE_PATH, 'r', encoding='utf-8') as ocr_file, \
         open(STT_FILE_PATH, 'r', encoding='utf-8') as stt_file, \
         open(MERGED_FILE_PATH, 'w', encoding='utf-8') as result_file:

        ocr_lines = ocr_file.readlines()
        stt_lines = stt_file.readlines()

        combined_lines = sorted(ocr_lines + stt_lines)

        for line in combined_lines:
            result_file.write(line)

    logger.info(f"결과가 {MERGED_FILE_PATH}에 저장되었습니다.")
