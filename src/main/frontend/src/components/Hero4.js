import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../css/home.css';

const Hero4 = () => {
    return (
        <div className="container-xxl py-5 hero-header mb-0">
            <div className="container my-5 py-5 px-lg-5">
                <div className="row g-5 py-5">
                    <div className="col-12 text-center">
                        <h1 className="text-white animated zoomIn">공지사항</h1>
                        <hr className="bg-white mx-auto mt-0" style={{ width: '90px' }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero4;