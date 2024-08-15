import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../css/home.css';

const Hero2 = () => {
    return (
        <div className="container-xxl py-5 hero-header mb-0">
            <div className="col-12 text-center">
                <h1 className="text-white animated zoomIn custom-margin2" style={{ marginTop: '100px' }}>마이페이지</h1>

                <hr className="bg-white mx-auto mt-0" style={{ width: '90px' }} />
            </div>
        </div>
    );
};

export default Hero2;