import React, { useEffect } from 'react';
import Navbar from './Navbar';
import ProfileForm from './ProfileForm'; // ProfileForm import 추가
import Hero2 from './Hero2';
import Footer from './Footer';

const Profile = ({ onLogout }) => {
    useEffect(() => {
        console.log("Profile component mounted");
    }, []);

    return (
        <div className="container-xxl bg-white p-0">
            <div className="container-xxl position-relative p-0">
                <Navbar onLogout={onLogout} />
                <Hero2 />
                <ProfileForm />
                <Footer />
            </div>
            <a href="#" className="btn btn-lg btn-primary btn-lg-square back-to-top pt-2"><i className="bi bi-arrow-up"></i></a>
        </div>
    );
};

export default Profile;
