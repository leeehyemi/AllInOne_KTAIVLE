# ALL IN ONE 강의 솔루션 📖
- KT AIVLE 5기 Bigproject로 진행한 ALL-IN-ONE 강의 솔루션 프로젝트입니다.</br>
- 맡은 역할 : Backend(Spring boot), Frontend(React), AWS-GCP 서버 배포</br></br>
![AI 4조 썸네일](https://github.com/user-attachments/assets/be57e621-2b66-4ff8-bea0-c90b946f96fa)
  
#### ● 시연영상

https://youtu.be/6og5oqoE7yg </br></br>
[![Video Label](http://img.youtube.com/vi/6og5oqoE7yg/0.jpg)](https://youtu.be/6og5oqoE7yg)
</br>

#### ✔️ 타서비스와 차별점 </br>
![image](https://github.com/user-attachments/assets/2556a634-0a1f-4012-b5a1-37246144dfcb)

#### ✔️ 서비스 플로우 </br>
![image](https://github.com/user-attachments/assets/4e42d945-03d0-4fb7-82ba-531c2aea178b)

#### ✔️ backend - frontend, 서버 배포 </br>
![image](https://github.com/user-attachments/assets/c2717c8a-ec24-4bba-9e1d-69d39666ba21) </br>
![image](https://github.com/user-attachments/assets/b6f289ca-c678-490d-b4b9-8ec8d7fb31f6) </br>

- Database : AWS RDS DB 인스턴스 구축 
- Spring boot :
  - 관리자-일반 사용자 페이지와 DB 연결
  - AWS Route 53 도메인( https://allinone-spring.com )으로 호스팅 영역에 EC2 탄력적 ip 연결
  - SSL 인증서 발급
  - Nginx로 Spring boot 서버 배포
- React :
  - 관리자-일반 사용자 frontend 페이지
  - AWS Route 53 도메인 ( https://allinnone.net )으로 호스팅 영역에 EC2 탄력적 ip 연결
  - SSL 인증서 발급
  - Nginx로 React 서버 배포
- Flask :
  - STT-OCR을 이용한 강의에 필요한 자료 생성 기능, AWS S3 버킷과 연결
  - 챗봇 DB(Chroma) 생성 기능
  - GCP Cloud DNS ( https://allinone-flask.com ) 으로 DNS 레코드에 생성한 VM 인스턴스 외부 ip 연결
  - Nginx로 Flask 서버 배포 

## ⭐ 관리자 주요 기능</br></br>
#### 강의 영상을 AWS S3 버킷에 업로드하고 Flask 서버를 통해 강의 관련 자료 생성 </br>
![image](https://github.com/user-attachments/assets/899d5189-5788-4499-8dce-bf74e181be45)
</br></br>
#### 1. 강의 자료 PDF </br>
   ![image](https://github.com/user-attachments/assets/e2ddb7b7-86bc-437b-93f5-a07b88f3bbd6)
  - STT + OCR 결과 텍스트,영상에서 프레임 단위로 이미지를 추출하고 이전 프레임과 유사도 비교를 통해 강의 자료 PDF 생성
  - 강의 제목, 강의 목차, 강의 내용 및 영상 시간, 화면 캡쳐 이미지 </br>
  - 생성된 PDF는 S3 버킷 pdf 폴더에 저장</br>
#### 2. 강의 썸네일 </br>
  ![image](https://github.com/user-attachments/assets/c53a0464-dc16-44f6-ad96-156fccdc6b62)
  - 프롬포트 엔지니어링을 통해서 강의 썸네일 이미지 생성
  - 프롬포트 예시 : prompt = f"이 텍스트는 '강의 제목' 입니다.: {lecture_title} . 이 텍스트를 기반으로 강의영상 썸네일을 만들어주세요. 이미지의 배경은 흰색으로 해주고 이 강의를 나타내는 피규어를 가운데에 놓아주세요 " </br>
  - 생성된 썸네일 이미지는 S3 버킷 images 폴더에 저장</br>
#### 3. 강의 퀴즈 </br>
  ![image](https://github.com/user-attachments/assets/5bb50a0d-1d0f-47bf-8fed-a342837a6fcf)
  - 프롬포트 엔지니어링을 통해서 퀴즈 문제 일관성 유지
  - 프롬포트 예시 : prompt = f"다음 텍스트에서 {n_questions}개의 퀴즈를 생성해 주세요. 정답은 1개만 나오도록 해주고 영상시간으로 퀴즈를 만들지 말아주세요. 또한 각 퀴즈는 다음 형식이어야 합니다.시간은 꼭 나오고 질문은 텍스트와 ','로 이루어져야합니다:\n\n퀴즈번호: [번호]\n퀴즈 질문: [질문]\n사지선다: [선택지1, 선택지2, 선택지3, 선택지4]\n정답: [정답]\n퀴즈에 주제: [주제]\n그 주제가 영상에 시작되는 시간: [시간]\n\n텍스트:\n{text}\n"
  - JSON 파일 형태의 퀴즈 결과를 Spring boot 서버에서 받고 DB에 저장</br>
#### 4.강의 타임라인 </br>
  - 강의에 맞는 제목 생성
  - 한줄 강의 요약 생성
  - 대주제 생성
  - 소주제와 내용 생성
  - 키워드 추출
  - 결과를 JSON으로 반환</br>
#### 5.강의 관련 챗봇 DB 생성 </br>
  - RAG를 통해 강의 내용 기반 답변 생성
  - 강의 시청 중 실시간 질문 가능

## ⭐ 일반 학습자 주요 기능 </br>
#### ✔️ 메인페이지 </br>
![image](https://github.com/user-attachments/assets/24f370ab-3fda-486f-ba57-e1a8b5d21898)
</br>
#### ✔️ 강의실 </br>
#### 1. 강의 교안보기 </br>
   ![image](https://github.com/user-attachments/assets/37657833-18a8-4ebd-b88d-c1290f471799)
   </br>
-> AWS S3 버킷 pdf 폴더에서 강의 이름과 일치하는 pdf 교안 다운로드 </br>

#### 2. 강의 화면, 학습 피드백 </br>
![image](https://github.com/user-attachments/assets/80c0c934-b2b3-411e-a6b6-1eb544b05f12)
</br>
● 챗봇 </br></br>
![image](https://github.com/user-attachments/assets/02a9a1e0-4b72-4675-9f69-0bbcdff92655)
</br></br>
● 타임라인</br></br>
<img src="https://github.com/user-attachments/assets/66bfd463-071b-4df2-ade5-07d30ded4d96" width="400" height="500"/>
</br>
-> 강의 주제에 따라 영상 시작 시간 제공 </br>
-> 해당 위치로 이동 가능 
</br></br>
● 북마크 </br></br>
<img src="https://github.com/user-attachments/assets/df4cab8f-98ba-4f10-a81d-3c1aa86aaf36" width="400" height="500"/>
</br>
-> 사용자가 학습에 필요한 강의 위치를 지정하고 원하는 내용을 작성하여 저장 </br></br>
● 강의집중도 </br></br>
<img src="https://github.com/user-attachments/assets/91ddeeb4-754a-4d68-bbbc-d144a632e1d6" width="800" height="500"/>
</br>
-> 얼굴의 위치를 식별한 후 눈의 감긴 정도를 측정하여 강의 집중도 판단 </br>
-> 측정된 강의 집중도를 토대로 피드백 </br></br>

● 학습 종료 지점 저장 </br></br>
-> 학습 종료 버튼을 누르면 마지막으로 시청한 위치가 저장 </br>
  
#### ✔️ 퀴즈 기능, 학습피드백 </br>
<img src="https://github.com/user-attachments/assets/82b96d32-685e-48e6-9475-ca0fb29bef0d" width="1000" height="500"/>
</br>
<img src="https://github.com/user-attachments/assets/611ba556-5e82-4de4-aede-8ce5bcccd3dd" width="1000" height="500"/>
</br>
-> 강의별 퀴즈 점수 차트 </br>
-> 전체 퀴즈 점수 평균, 추가 학습이 필요한 강의에 대한 피드백
