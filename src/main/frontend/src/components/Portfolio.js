import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../css/home.css';
import { useNavigate } from 'react-router-dom';

const Portfolio = () => {
    const [projects, setProjects] = useState([]);
    const [allLectures, setAllLectures] = useState([]);
    const [filter, setFilter] = useState('all');
    const email = useSelector(state => state.user.email);  // Redux 상태에서 이메일 가져오기
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios.get('https://allinone-spring.com/api/lecture-progress', {
                    params: { email: email }  // 이메일을 쿼리 파라미터로 전달
                });
                setProjects(response.data);
                console.log(response.data);  // 데이터를 제대로 가져오는지 확인
            } catch (error) {
                console.error('Failed to fetch progress data:', error.message);
            }
        };

        if (email && filter !== 'all') {
            fetchProjects();
        }
    }, [email, filter]);

    useEffect(() => {
        const fetchAllLectures = async () => {
            try {
                const response = await axios.get('https://allinone-spring.com/lectures');
                setAllLectures(response.data);
                console.log(response.data);  // 데이터를 제대로 가져오는지 확인
            } catch (error) {
                console.error('Failed to fetch lectures:', error.message);
            }
        };

        if (filter === 'all') {
            fetchAllLectures();
        }
    }, [filter]);

    const generateImageUrl = (lectureName) => {
        const bucketName = process.env.REACT_APP_AWS_S3_BUCKET;
        const region = process.env.REACT_APP_AWS_REGION;
        return `https://${bucketName}.s3.${region}.amazonaws.com/images/${lectureName}.png`;
    };

    const handleCourseClick = async (lectureId, lectureName) => {
        try {
            const response = await axios.get(`https://allinone-spring.com/api/lecture-progress`, {
                params: { email, lectureId }
            });
            const lectureProgress = response.data;
            navigate(`/video/${lectureName}.mp4`, { state: { ...lectureProgress, lectureId } });
        } catch (error) {
            console.error('Failed to fetch lecture progress:', error.message);
        }
    };

    const getFilteredProjects = () => {
        if (filter === 'learning') {
            const learningProjects = projects.filter(project => project.userProgress > 0 && project.userProgress < 100);
            if (learningProjects.length === 0) {
                return <p>학습을 진행해주세요.</p>;
            }
            return learningProjects;
        } else if (filter === 'completed') {
            const completedProjects = projects.filter(project => project.userProgress === 100);
            if (completedProjects.length === 0) {
                return <p>학습을 완료해주세요.</p>;
            }
            return completedProjects;
        } else {
            return allLectures; // 'all'일 경우 모든 강의 반환
        }
    };

    return (
        <div className="container-xxl py-5">
            <div className="container px-lg-5">
                <div className="section-title position-relative text-center mb-5 pb-2 wow fadeInUp" data-wow-delay="0.1s">
                    <h2 className="mt-2">강의 진척도</h2>
                </div>
                <div className="row mt-n2 wow fadeInUp" data-wow-delay="0.1s">
                    <div className="col-12 text-center">
                        <ul className="list-inline mb-5" id="portfolio-filters">
                            <li className={`btn px-3 pe-4 ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>전&nbsp;&nbsp;체</li>
                            <li className={`btn px-3 pe-4 ${filter === 'learning' ? 'active' : ''}`} onClick={() => setFilter('learning')}>학습&nbsp;중</li>
                            <li className={`btn px-3 pe-4 ${filter === 'completed' ? 'active' : ''}`} onClick={() => setFilter('completed')}>학습완료</li>
                        </ul>
                    </div>
                </div>
                <div className="row g-4 portfolio-container">
                    {getFilteredProjects().length > 0 ? (
                        getFilteredProjects().map((project, index) => (
                            <PortfolioItem
                                key={project.lectureId}
                                title={project.lectureName}
                                imgSrc={generateImageUrl(project.lectureName)}
                                onClick={() => handleCourseClick(project.lectureId, project.lectureName)}
                            />
                        ))
                    ) : (
                        <p>{filter === 'learning' ? '학습을 진행해주세요.' : filter === 'completed' ? '학습을 완료해주세요.' : ''}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

const PortfolioItem = ({ title, imgSrc, onClick }) => (
    <div className="col-lg-4 col-md-6 portfolio-item first wow zoomIn" data-wow-delay="0.1s">
        <div className="position-relative rounded overflow-hidden">
            <img className="img-fluid w-100" src={imgSrc} alt={title} onClick={onClick} style={{ cursor: 'pointer' }} />
            <div className="bg-white text-center p-2">
                <span className="h5 d-block text-dark mt-1 mb-0">{title}</span>
            </div>
            <div className="portfolio-overlay">
                <a className="btn btn-light" onClick={onClick}><i className="fa fa-plus fa-2x text-primary"></i></a>
            </div>
        </div>
    </div>
);

export default Portfolio;
