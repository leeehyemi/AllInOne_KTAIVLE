import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../css/home.css';

const Hero = () => (
    <div className="container-xxl py-5 hero-header mb-5">
        <div className="container my-5 py-5 px-lg-5">
            <div className="row g-5 py-5 align-items-center justify-content-center">
                <div className="col-lg-6 text-center">
                    <h3 className="text-white mb-4 animated zoomIn">All-In-One 서비스에 오신 것을 환영합니다</h3>
                    <p className="text-white pb-3 animated zoomIn"><strong>AI 강의 솔루션</strong><br />영상만 올리면 모든 학습 지원 기능을 한 번에</p>
                    <div className="d-flex flex-column flex-sm-row justify-content-center">
                        <Link
                            to="/about"
                            className="btn btn-light py-sm-3 px-sm-5 rounded-pill me-0 me-sm-3 mb-2 mb-sm-0 animated slideInLeft custom-hover"
                            style={{ borderColor: 'black', borderWidth: '3px' }}
                        >
                            기능 설명
                        </Link>
                        <Link
                            to="/coworker"
                            id="team-introduce"
                            className="btn btn-outline-light py-sm-3 px-sm-5 rounded-pill animated slideInRight custom-hover"
                            style={{ borderColor: 'black', borderWidth: '3px' }}
                        >
                            팀원 소개
                        </Link>
                    </div>
                </div>
                <div className="col-lg-6 text-center">
                    <img className="img-fluid" src="img/test.png" alt="" style={{ marginTop: '-60px' }} />
                </div>
            </div>
        </div>
    </div>
);

export default Hero;
