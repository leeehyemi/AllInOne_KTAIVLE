import React from 'react';
import './Login.css';
import AdminLoginForm from './AdminLoginForm';
import { useNavigate } from 'react-router-dom';
import loginPageImage from '../img/LoginPage.png';

const AdminLogin = ({ onAdminLogin }) => {
    const navigate = useNavigate();

    const handleLogin = (email) => {
        onAdminLogin();
        navigate('/upload');
    };

    return (
        <div className="login">
            <div className="login__content">
                <div className="login__img">
                    <img src={loginPageImage} alt="admin login" />
                </div>
                <div className="login__forms">
                    <AdminLoginForm onLogin={handleLogin} />
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
