import React from 'react';
import Navbar from './Navbar';
import Hero3 from './Hero3';
import CoworkerContent from './CoworkerContent';
import Footer from './Footer';

const Coworker = ({ onLogout }) => {
    return (
        <div className="container-xxl bg-white p-0">
            <div className="container-xxl position-relative p-0">
                <Navbar onLogout={onLogout} />
                {/* <Hero3 /> */}
                <CoworkerContent />
                <Footer />
            </div>
            <a href="#" className="btn btn-lg btn-primary btn-lg-square back-to-top pt-2"><i className="bi bi-arrow-up"></i></a>
        </div>
    );
};

export default Coworker;
