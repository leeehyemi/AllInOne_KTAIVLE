import os, librosa, torch, sys, importlib
from moviepy.editor import VideoFileClip
from tqdm import tqdm
from transformers import AutoProcessor, AutoModelForSpeechSeq2Seq, pipeline
from logger import logger

def extract_audio_from_video(video_path, audio_path, codec='libmp3lame'):
    try:
        logger.info(f"비디오에서 오디오 추출 중: {video_path}")
        video_clip = VideoFileClip(video_path)
        video_clip.audio.write_audiofile(audio_path, codec=codec)
        logger.info(f"오디오 추출 완료! 오디오 파일 저장 위치: {audio_path}")
    except Exception as e:
        logger.error(f"오디오 추출 중 오류 발생: {e}")

def load_audio(file_path, sr=16000):
    try:
        logger.info(f"오디오 파일 로드 중: {file_path}")
        audio, _ = librosa.load(file_path, sr=sr)
        return audio
    except Exception as e:
        logger.error(f"오디오 파일 로드 중 오류 발생: {e}")

def chunk_audio(audio, chunk_length=30, sr=16000):
    logger.info(f"오디오를 {chunk_length}초 길이로 분할 중")
    chunk_size = chunk_length * sr
    num_chunks = len(audio) // chunk_size + (1 if len(audio) % chunk_size != 0 else 0)
    return [audio[i * chunk_size:(i + 1) * chunk_size] for i in range(num_chunks)], num_chunks

def inference_model():
    import models.config
    importlib.reload(models.config)
    from models.config import VIDEO_FILE_PATH, AUDIO_FILE_PATH, STT_FILE_PATH, STT_OUTPUT_DIR

    if os.path.exists(STT_FILE_PATH):
        logger.info(f"Inferencing STT model is skipped since {STT_FILE_PATH} exists")
        return
    
    logger.info("==========Inferencing STT model==========")
    extract_audio_from_video(VIDEO_FILE_PATH, AUDIO_FILE_PATH)

    device = "cuda" if torch.cuda.is_available() else "cpu"
    torch_dtype = torch.float16 if torch.cuda.is_available() else torch.float32
    logger.info(f"사용 중인 디바이스: {device}")

    model_id = "openai/whisper-large-v3"
    model = AutoModelForSpeechSeq2Seq.from_pretrained(
        model_id, torch_dtype=torch_dtype, use_safetensors=True
    )
    model.to(device)
    processor = AutoProcessor.from_pretrained(model_id)

    audio = load_audio(AUDIO_FILE_PATH)
    audio_chunks, num_chunks = chunk_audio(audio)

    pipe = pipeline(
        "automatic-speech-recognition",
        model=model,
        tokenizer=processor.tokenizer,
        feature_extractor=processor.feature_extractor,
        max_new_tokens=128,
        chunk_length_s=25,
        batch_size=16,
        torch_dtype=torch_dtype,
        device=device,
    )

    logger.info("음성 인식 시작")

    os.makedirs(STT_OUTPUT_DIR, exist_ok=True)

    with open(STT_FILE_PATH, "w", encoding="utf-8") as file:
        for i, chunk in enumerate(tqdm(audio_chunks, file=sys.stdout)):
            try:
                start_time = i * 30
                transcription_result = pipe(chunk, return_timestamps=True)['chunks']
                for segment in transcription_result:
                    start = start_time + segment['timestamp'][0]
                    end = start_time + segment['timestamp'][1]
                    text = segment['text']
                    # result = f"{int(start // 60)}:{int(start % 60):02d} ~ {int(end // 60)}:{int(end % 60):02d} -{text}\n"
                    result = f"{int(start // 60):02}:{int(start % 60):02d} ~ {int(end // 60):02}:{int(end % 60):02d} - {text}\n"
                    logger.info(result)
                    file.write(result)
            except Exception as e:
                logger.error(f"음성 인식 중 오류 발생: {e}")

    logger.info(f"음성 인식 결과 저장 위치: {STT_FILE_PATH}")