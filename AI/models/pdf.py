from reportlab.platypus import BaseDocTemplate, Paragraph, Spacer, PageTemplate, Frame, Image, PageBreak
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase import pdfmetrics
from reportlab.lib.utils import ImageReader
import json, os, shutil, importlib
from logger import logger


def register_fonts():
    # 폰트 등록
    font_regular = '../fonts/NanumGothic.ttf'
    font_bold = '../fonts/NanumGothicBold.ttf'
    pdfmetrics.registerFont(TTFont('NanumGothic', font_regular))
    pdfmetrics.registerFont(TTFont('NanumGothicBold', font_bold))


def highlight_keywords(text, keywords):
    # 각 키워드를 빨간색으로 강조
    for keyword in keywords:
        text = text.replace(keyword, f'<font color="red">{keyword}</font>')
    return text


def create_pdf_from_json():
    import models.config
    importlib.reload(models.config)
    from models.config import JSON_FILE_PATH, PDF_FILE_PATH, CAPTURED_IMAGES_DIR, PDF_OUTPUT_DIR, CAPTURED_IMAGES_PATH

    if os.path.exists(PDF_FILE_PATH):
        logger.info(f"Creating pdf from json is skipped since {PDF_FILE_PATH} exists")
        return

    logger.info("==========Creating pdf from json==========")

    # 폰트 등록
    register_fonts()

    # JSON 데이터 로드
    try:
        with open(JSON_FILE_PATH, 'r', encoding='utf-8') as json_file:
            data = json.load(json_file)
    except FileNotFoundError:
        logger.error(f"Error: JSON 파일을 찾을 수 없습니다: {JSON_FILE_PATH}")
        return
    except json.JSONDecodeError:
        logger.error("Error: JSON 파일을 파싱하는 중에 오류가 발생했습니다.")
        return

    # 스타일 정의
    title_style = ParagraphStyle(name='Title', fontName='NanumGothicBold', fontSize=34, leading=40,
                                 alignment=1)  # 강의제목, alignment=1은 가운데 정렬을 의미
    toc_text_style = ParagraphStyle(name='TOC_text', fontName='NanumGothicBold', fontSize=34, leading=40, alignment=1,
                                    leftIndent=30, rightIndent=30)  # <강의 목차>
    toc_style = ParagraphStyle(name='TOC', fontName='NanumGothicBold', fontSize=22, leading=25, leftIndent=30,
                               rightIndent=30)  # 강의차에서 대주제들
    toc_sub_style = ParagraphStyle(name='TOC_Sub', fontName='NanumGothic', fontSize=20, leading=24, leftIndent=60,
                                   rightIndent=30)  # 강의목차에서 소주제들
    big_title_style = ParagraphStyle(name='Big_Title', fontName='NanumGothicBold', fontSize=25, leading=30,
                                     alignment=1)  # 대주제
    content_style = ParagraphStyle(name='Content', fontName='NanumGothic', fontSize=18, leading=25, leftIndent=30,
                                   rightIndent=30)  # 내용
    heading_style = ParagraphStyle(name='Heading', fontName='NanumGothicBold', fontSize=20, leading=24, leftIndent=30,
                                   rightIndent=30)  # 소주제
    time_style = ParagraphStyle(name='Time', fontName='NanumGothic', fontSize=18, leading=22, textColor='grey',
                                leftIndent=30)  # 시간

    # PDF 요소 리스트 생성
    elements = []

    # 이미지 크기 읽기
    try:
        img_path = os.path.join(CAPTURED_IMAGES_PATH, "capture_0001.png")
        img_reader = ImageReader(img_path)
        img_width, img_height = img_reader.getSize()
    except FileNotFoundError:
        logger.error("Error: 이미지 파일을 찾을 수 없습니다.")
        return

    # 여유 공간 설정 (각 방향으로 12포인트씩 추가)
    margin_pt = 6  # 포인트 단위 여백
    custom_page_size = (img_width + 2 * margin_pt, img_height + 2 * margin_pt)

    # PDF 생성
    doc = BaseDocTemplate(PDF_FILE_PATH, pagesize=custom_page_size)

    # 프레임 설정 (페이지 크기와 동일하게 설정)
    frame = Frame(0, 0, custom_page_size[0], custom_page_size[1], id='custom_frame')
    doc.addPageTemplates([PageTemplate(id='main_template', frames=[frame])])

    # 페이지 중간 계산
    page_height = custom_page_size[1]
    title_height = title_style.fontSize + title_style.leading
    space_above = (page_height - title_height) / 2

    # 컨텐츠 추가
    elements.append(Spacer(1, space_above))
    title = data.get('강의 제목', '')
    elements.append(Paragraph(title, title_style))
    # 강의 제목 나온후 목차는 다음페이지로
    elements.append(PageBreak())

    toc_text = "<강의 목차>\n\n"
    elements.append(Paragraph(toc_text, toc_text_style))
    elements.append(Spacer(1, 50))

    for item in data.get('강의 목차', []):
        lines = item.split('\n')
        for line in lines:
            if line.startswith('    '):
                elements.append(Paragraph(line.strip(), toc_sub_style))
            else:
                elements.append(Paragraph(line, toc_style))
            elements.append(Spacer(1, 30))

    # 강의 목차 나온 후 본문은 다음페이지로
    elements.append(PageBreak())

    lecture_contents = data.get('강의 내용', [])
    idx = 0
    while idx < len(lecture_contents):
        content = lecture_contents[idx]
        big_title = content.get('Big_title', '')
        elements.append(Spacer(1, 50))
        elements.append(Paragraph(big_title, big_title_style))
        elements.append(Spacer(1, 80))

        sub_topics = content.get('sub_topics', [])
        for sub_topic in sub_topics:
            title = sub_topic.get('Title_Name', '')
            time = sub_topic.get('time', '')
            text = sub_topic.get('text', '')
            keywords = sub_topic.get('keywords', [])
            text = text.replace("<", "").replace(">", "")

            # 주제 추가
            elements.append(Paragraph(title, heading_style))
            elements.append(Paragraph(f"시작 시간: {time}", time_style))
            elements.append(Spacer(1, 30))

            # 키워드 강조
            highlighted_text = highlight_keywords(text, keywords)
            elements.append(Paragraph(highlighted_text, content_style))
            elements.append(Spacer(1, 80))

        idx += 1

    # 캡처된 이미지 추가 (페이지 전체에 맞춤)
    captured_images = sorted(
        [os.path.join(CAPTURED_IMAGES_PATH, img) for img in os.listdir(CAPTURED_IMAGES_PATH) if img.endswith('.png')])
    for img_path in captured_images:
        img_reader = ImageReader(img_path)
        img_width, img_height = img_reader.getSize()

        # 이미지 삽입 (이미지 크기를 약간 줄여서 삽입)
        img = Image(img_path, width=img_width, height=img_height)
        img.hAlign = 'CENTER'
        elements.append(img)
        elements.append(PageBreak())

    # PDF 생성
    doc.build(elements)

    # 완료 메시지 출력
    logger.info(f"PDF 파일이 {PDF_FILE_PATH}에 저장되었습니다.")


# main.py에서 호출
if __name__ == "__main__":
    create_pdf_from_json()