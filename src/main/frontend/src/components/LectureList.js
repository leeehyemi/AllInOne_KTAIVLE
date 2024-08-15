import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../css/home.css';
import '../css/lecturelist.css';
import { useSelector } from 'react-redux';
import primaryImg from '../img/lecturelist.png';  // Import the image

const LectureList = ({ onLogout }) => {
    const [lectures, setLectures] = useState([]);
    const [userName, setUserName] = useState('');
    const navigate = useNavigate();
    const email = useSelector(state => state.user.email);

    useEffect(() => {
        const fetchLectures = async () => {
            try {
                const response = await axios.get('https://allinone-spring.com/lectures');
                setLectures(response.data);
            } catch (error) {
                console.error('Failed to fetch lectures:', error.message);
            }
        };

        const fetchUserName = async () => {
            try {
                const response = await axios.get(`https://allinone-spring.com/api/username?email=${email}`);
                setUserName(response.data);
            } catch (error) {
                console.error('Failed to fetch user name:', error.message);
            }
        };

        fetchLectures();
        fetchUserName();

        const dateElement = document.querySelector('.lecture-date');
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        dateElement.textContent = `${year}년 ${month}월 ${day}일`;
    }, [email]);

    const handleEnterClick = async (lecture) => {
        try {
            const response = await axios.get(`https://allinone-spring.com/api/lecture-progress/last-watched`, {
                params: {
                    email: email,
                    lectureId: lecture.lecture_id
                }
            });
            const lastWatchedTime = response.data.lectureTime;
            console.log(`Navigating to video with lastWatchedTime: ${lastWatchedTime}`);

            if (lastWatchedTime) {
                if (window.confirm(`마지막에 시청한 영상 위치는 ${lastWatchedTime}입니다. 시청하시겠습니까?`)) {
                    navigate(`/video/${lecture.lectureName}.mp4`, { state: { lectureId: lecture.lecture_id, lastWatchedTime } });
                } else {
                    navigate(`/video/${lecture.lectureName}.mp4`, { state: { lectureId: lecture.lecture_id } });
                }
            } else {
                navigate(`/video/${lecture.lectureName}.mp4`, { state: { lectureId: lecture.lecture_id } });
            }
        } catch (error) {
            console.error('Failed to fetch last watched time:', error.message);
            navigate(`/video/${lecture.lectureName}.mp4`, { state: { lectureId: lecture.lecture_id } });
        }
    };

    const handlePdfClick = (fileName) => {
        const pdfFileName = `${fileName}.pdf`;
        const bucketName = process.env.REACT_APP_AWS_S3_BUCKET;
        const region = process.env.REACT_APP_AWS_REGION;
        const pdfUrl = `https://${bucketName}.s3.${region}.amazonaws.com/pdf/${pdfFileName}`;
        window.location.href = pdfUrl;
    };

    const handleReviewClick = (lecture) => {
        navigate(`/reviews?lectureId=${lecture.lecture_id}`);
    };

    const imgSrc = "img/team-1.jpg";

    return (
        <div className="container-xxl p-0">
            <div className="container-xxl position-relative p-0">
                <Navbar onLogout={onLogout}/>
                <div className="container-xxl py-5 header-banner mb-5">
                    <div className="container my-5 py-5 px-lg-5">
                        <div className="col-12 text-center">
                            <h1 className="animated zoomIn" id = "lecture-menu">강의 목록</h1>
                            <img src={primaryImg} alt="Primary" className="header-image"/>
                        </div>
                    </div>
                </div>
                <div className="container lecture-list-container">
                    <div className="lecture-header">
                        <div className="lecture-date"></div>
                        <div className="d-flex align-items-center">
                            <img className="img-fluid flex-shrink-0 rounded-circle"
                                 src={imgSrc}
                                 style={{width: '50px', height: '50px'}}/>
                            <div>
                                <p className="text-white">{userName}</p>
                            </div>
                        </div>
                    </div>
                    {lectures.length > 0 ? (
                        lectures.map((lecture) => (
                            <div key={lecture.lecture_id} className="lecture-item">
                                <div>
                                    <h3>💻{lecture.lectureName}</h3>
                                    {/*<div className="time">09:30 - 17:30</div>*/}
                                </div>
                                <div className="lecture-actions">
                                    <button onClick={() => handlePdfClick(lecture.lectureName)}>
                                        <span className="emoji">📙</span>교안보기
                                    </button>
                                    <button onClick={() => handleEnterClick(lecture)}>
                                        <span className="emoji">🎬</span>강의실
                                    </button>
                                    <Link to={`/quiz?lectureName=${lecture.lectureName}`}
                                          rel="noopener noreferrer"><span className="emoji">📝</span>퀴즈</Link>
                                    <button onClick={() => handleReviewClick(lecture)}>
                                        <span className="emoji">🏆</span>퀴즈결과
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>Loading lectures...</p>
                    )}
                </div>
                <Footer/>
            </div>
            <a href="#" className="btn btn-lg btn-primary btn-lg-square back-to-top pt-2"><i
                className="bi bi-arrow-up"></i></a>
        </div>
    );
};

export default LectureList;
