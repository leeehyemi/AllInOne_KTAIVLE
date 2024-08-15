//import React from 'react';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Hero from './Hero';
import ProgressSection from './ProgressSection';
import NoticeSection from './NoticeSection';
import Portfolio from './Portfolio';
import Testimonials from './Testimonials';
import Team from './Team';
import Footer from './Footer';
import CourseList from './CourseList';
import { useSelector } from 'react-redux';

import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../css/home.css';



const Home = ({ username, onLogout }) => {

    const email = useSelector(state => state.user.email);

    useEffect(() => {
          console.log('User email from Redux:', email);  // null값인지 아닌지 확인용
      }, [email]);

    return (
        <div className="container-xxl bg-white p-0">
            <div className="container-xxl position-relative p-0">
                <Navbar onLogout={onLogout} />
                <Hero />
                <div className="container">
                    <div className="row">
                        <ProgressSection />
                        <NoticeSection />
                    </div>
                </div>
                <Portfolio />
                <Testimonials />
                <CourseList />
                <Team />
                <Footer />
            </div>
            <a href="#" className="btn btn-lg btn-primary btn-lg-square back-to-top pt-2"><i className="bi bi-arrow-up"></i></a>
        </div>
    );
};

export default Home;