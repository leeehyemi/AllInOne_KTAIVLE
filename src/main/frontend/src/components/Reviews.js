import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styles from '../css/reviews.module.css';
import Navbar from './Navbar';

const Reviews = ({ onLogout }) => {
    const [quizResults, setQuizResults] = useState([]);
    const [latestQuizScore, setLatestQuizScore] = useState(0);
    const location = useLocation();
    const navigate = useNavigate();
    const email = useSelector(state => state.user.email);
    const lectureId = new URLSearchParams(location.search).get('lectureId');
    const token = useSelector(state => state.user.token);

    useEffect(() => {
        const fetchQuizResults = async () => {
            try {
                const response = await axios.get(`https://allinone-spring.com/api/quiz/reviews`, {
                    params: { email, lectureId },
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log("Quiz Results:", response.data);
                setQuizResults(response.data);
            } catch (error) {
                console.error('Failed to fetch quiz results', error.message);
            }
        };
        fetchQuizResults();
    }, [email, lectureId, token]);

    const renderOptions = (options, userAnswer, correctAnswer) => {
        return options.split(',').map((option, index) => (
            <li key={index} className={`${styles.option} ${option.trim() === correctAnswer.trim() ? styles.correct : ''} ${option.trim() === userAnswer.trim() ? styles.userAnswer : ''}`}>
                {option.trim()}
            </li>
        ));
    };

    const handlePlayLecture = (lectureName, time) => {
        navigate(`/video/${lectureName}.mp4`, { state: { lectureName, time, lectureId } });
    };

    return (
        <>
            <div className={styles.navbarContainer}>
                <Navbar onLogout={onLogout} />
                <div className={styles.containerXxl}>
                    <div className={`${styles.containerXxl} py-5 ${styles.heroHeader} mb-0`}></div>
                </div>
            </div>
            <div className={styles.content}>
                <div className={styles.result}>
                    <div className={styles.title}>테스트 결과</div>
                </div>
                {quizResults.length > 0 ? (
                    quizResults.map((result, index) => (
                        <div key={index} className={styles.question}>
                            <div className={styles.questionTitleContainer}>
                                <div>{index + 1}. {result.subject}</div>
                                <div>배점 10.0</div>
                            </div>
                            <div className={styles.questionText}>{result.questionText}</div>
                            <ul className={styles.choices}>
                                {renderOptions(result.optionText, result.user_answer, result.answer)}
                            </ul>
                            <div className={styles.answer}>정답: {result.answer}</div>
                            <div className={styles.answer}>강의시간: {result.time}</div>
                            <button className={styles.playButton} onClick={() => handlePlayLecture(result.lectureName, result.time)}>강의 보기</button>
                        </div>
                    ))
                ) : (
                    <p>데이터가 없습니다.</p>
                )}
            </div>
        </>
    );
};

export default Reviews;
