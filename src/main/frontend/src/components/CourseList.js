import React, { useState } from 'react';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../css/home.css';

function CourseList() {
    const [selectedImage, setSelectedImage] = useState(null);

    const courses = [
        { id: 1, title: "STT+OCR", description: "정확도 향상을 위해 영상, 음성 텍스트를 추출하여 결과값을 사용합니다.", imageUrl: "../img/merged_image.png", icon: "fa fa-microphone" },
        { id: 2, title: "자료 생성", description: "추출된 텍스트를 기반으로 강의의 제목, 주제, 내용, 시간을 제공합니다.", imageUrl: "../img/pdf.png", icon: "fa fa-file-alt" },
        { id: 3, title: "퀴즈", description: "강의 기반 퀴즈를 생성합니다.", imageUrl: "../img/quiz_image.png", icon: "fa fa-question-circle" },
        { id: 4, title: "강의 집중도", description: "웹캠을 통해 안구의 감긴 정도를 파악합니다.", imageUrl: "../img/face.png", icon: "fa fa-eye" },
        { id: 5, title: "RAG 챗봇", description: "강의 내용 기반 RAG 챗봇을 통해 실시간 질문을 하고 답변을 제공합니다.", imageUrl: "../img/chatbot.png", icon: "fa fa-comments" },
        { id: 6, title: "썸네일 생성", description: "강의 주제에 맞는 썸네일 이미지를 생성합니다.", imageUrl: "../img/create_image.png", icon: "fa fa-image" },
    ];

    const handleCourseClick = (imageUrl) => {
        setSelectedImage(imageUrl);
    };

    const closeModal = () => {
        setSelectedImage(null);
    };

    return (
        <div className="container-xxl py-5">
            <div className="container px-lg-5">
                <div className="section-title position-relative text-center mb-5 pb-2">
                    <h2 className="mt-2">기능</h2>
                </div>
                <div className="row g-4">
                    {courses.map((course, index) => (
                        <div key={course.id} className="col-lg-4 col-md-6 wow zoomIn" data-wow-delay={`${index * 0.1}s`}>
                            <div className="service-item d-flex flex-column justify-content-center text-center rounded">
                                <div className="service-icon flex-shrink-0">
                                    <i className={course.icon + " fa-2x"}></i>
                                </div>
                                <h5 className="mb-3">{course.title}</h5>
                                <p style={{color:"black"}}>{course.description}</p>
                                <button className="btn px-3 mt-auto mx-auto" onClick={() => handleCourseClick(course.imageUrl)}>예시</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {selectedImage && (
                <div className="modal show" style={{ display: 'block' }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" style={{fontWeight: "bold"}}>예시</h5>
                                <button type="button" className="btn btn-secondary" onClick={closeModal}
                                        style={{border: "black"}}>닫기
                                </button>
                            </div>
                            <div className="modal-body">
                                <img src={selectedImage} className="img-fluid" alt="Selected" style={{ maxHeight: '200vh', width: '150%' }} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CourseList;
