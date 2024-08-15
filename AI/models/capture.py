import cv2, shutil, os, importlib
from tqdm import tqdm
from logger import logger

def clear_directory(directory_path):
    # 디렉토리가 존재하면 삭제
    if os.path.exists(directory_path):
        shutil.rmtree(directory_path)
    # 디렉토리 생성
    os.makedirs(directory_path)

def capture_frames():
    import models.config
    importlib.reload(models.config)
    from models.config import VIDEO_FILE_PATH, CAPTURED_IMAGES_DIR, VIDEO_FILE_NAME, CAPTURED_IMAGES_PATH
    
    if os.path.exists(CAPTURED_IMAGES_PATH):
        logger.info(f"Capturing frames is skipped since {CAPTURED_IMAGES_PATH} exists")
    
    logger.info("==========Capturing frames==========")

    # clear_directory(CAPTURED_IMAGES_DIR)
    
    # 디렉토리가 존재하지 않으면 생성
    if not os.path.exists(CAPTURED_IMAGES_PATH):
        os.makedirs(CAPTURED_IMAGES_PATH)

    # 비디오 캡처 객체 생성
    cap = cv2.VideoCapture(VIDEO_FILE_PATH)

    if not cap.isOpened():
        logger.error("Error: Could not open video.")
        return []

    # 이전 프레임을 저장할 변수 초기화
    previous_frame = None

    # 캡처된 이미지 파일 저장 경로 초기화
    captured_images = []

    # 프레임 간 차이를 계산하기 위한 임계값 설정
    frame_difference_threshold = 5.0

    # 프레임 캡처 간격 설정
    frame_interval = 150
    frame_count = 0

    # 비디오 프레임 읽기
    num_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    logger.info(f"Total frames: {num_frames}")


    for _ in tqdm(range(num_frames)):
        ret, frame = cap.read()
        if not ret:
            break

        frame_count += 1

        # 설정된 프레임 간격마다 한 번씩만 처리
        if frame_count % frame_interval != 0:
            continue

        # 현재 프레임을 그레이스케일로 변환
        current_frame_gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        if previous_frame is not None:
            # 이전 프레임과 현재 프레임 간의 절대 차이 계산
            frame_diff = cv2.absdiff(previous_frame, current_frame_gray)

            # 차이의 평균 값 계산
            diff_mean = frame_diff.mean()

            # 차이의 평균 값이 임계값을 넘으면 화면 전환이 발생한 것으로 간주하고 프레임 캡처
            if diff_mean > frame_difference_threshold:
                # 파일 이름 생성
                img_name = f"capture_{len(captured_images)+1:04d}.png"
                img_path = os.path.join(CAPTURED_IMAGES_PATH,img_name)

                # 이미지 저장
                cv2.imwrite(img_path, frame)
                captured_images.append(img_path)

        # 현재 프레임을 이전 프레임으로 업데이트
        previous_frame = current_frame_gray

    # 비디오 캡처 객체 해제
    cap.release()

    # 캡처된 이미지 파일 경로 리스트 반환
    return captured_images

if __name__ == "__main__":
    # capture_frames() 함수 실행
    captured_images = capture_frames()
    print(f"Captured {len(captured_images)} frames.")
