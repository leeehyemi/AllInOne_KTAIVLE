import React from 'react';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../css/home.css';

function Team() {
    return (
        <div className="container-xxl py-5">
            <div className="container px-lg-5">
                <div className="section-title position-relative text-center mb-5 pb-2">
                    <h2 className="mt-2">강사 소개</h2>
                </div>
                <div className="row g-4">
                    <div className="col-lg-4 col-md-6">
                        <div className="team-item">
                            <div className="d-flex">
                                <div className="flex-shrink-0 d-flex flex-column align-items-center mt-4 pt-5" style={{ width: "75px" }}>
                                    <a className="btn btn-square text-primary bg-white my-1" href=""><i className="fab fa-facebook-f"></i></a>
                                    <a className="btn btn-square text-primary bg-white my-1" href=""><i className="fab fa-twitter"></i></a>
                                    <a className="btn btn-square text-primary bg-white my-1" href=""><i className="fab fa-instagram"></i></a>
                                    <a className="btn btn-square text-primary bg-white my-1" href=""><i className="fab fa-linkedin-in"></i></a>
                                </div>
                                <img className="img-fluid rounded w-100" src="img/team-1.jpg" alt="" />
                            </div>
                            <div className="px-4 py-3">
                                <h5 className="fw-bold m-0">한기영</h5>
                                <small>CEO</small>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                        <div className="team-item">
                            <div className="d-flex">
                                <div className="flex-shrink-0 d-flex flex-column align-items-center mt-4 pt-5" style={{ width: "75px" }}>
                                    <a className="btn btn-square text-primary bg-white my-1" href=""><i className="fab fa-facebook-f"></i></a>
                                    <a className="btn btn-square text-primary bg-white my-1" href=""><i className="fab fa-twitter"></i></a>
                                    <a className="btn btn-square text-primary bg-white my-1" href=""><i className="fab fa-instagram"></i></a>
                                    <a className="btn btn-square text-primary bg-white my-1" href=""><i className="fab fa-linkedin-in"></i></a>
                                </div>
                                <img className="img-fluid rounded w-100" src="img/team-2.jpg" alt="" />
                            </div>
                            <div className="px-4 py-3">
                                <h5 className="fw-bold m-0">정하늘</h5>
                                <small>매니저</small>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                        <div className="team-item">
                            <div className="d-flex">
                                <div className="flex-shrink-0 d-flex flex-column align-items-center mt-4 pt-5" style={{ width: "75px" }}>
                                    <a className="btn btn-square text-primary bg-white my-1" href=""><i className="fab fa-facebook-f"></i></a>
                                    <a className="btn btn-square text-primary bg-white my-1" href=""><i className="fab fa-twitter"></i></a>
                                    <a className="btn btn-square text-primary bg-white my-1" href=""><i className="fab fa-instagram"></i></a>
                                    <a className="btn btn-square text-primary bg-white my-1" href=""><i className="fab fa-linkedin-in"></i></a>
                                </div>
                                <img className="img-fluid rounded w-100" src="img/team-3.jpg" alt="" />
                            </div>
                            <div className="px-4 py-3">
                                <h5 className="fw-bold m-0">이호준</h5>
                                <small>CEO</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Team;

