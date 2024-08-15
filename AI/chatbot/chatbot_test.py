import requests
import json

# 서버 URL
url = 'http://localhost:5000/chat'

# 전송할 텍스트 데이터
question_data = {
    'question': 'gradle 설명은 어디서부터야 ?'
}

# JSON 형식으로 데이터 전송
response = requests.post(url, json=question_data)

try:
    # 서버의 응답을 JSON 형식으로 변환
    response_data = response.json()
    # 서버의 응답 출력
    print(response_data)

    # 응답 데이터를 JSON 파일로 저장
    output_file = 'response.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(response_data, f, ensure_ascii=False, indent=4)

    print(f"응답 데이터가 '{output_file}' 파일에 저장되었습니다.")
except requests.exceptions.JSONDecodeError:
    print("응답이 JSON 형식이 아닙니다:", response.text)