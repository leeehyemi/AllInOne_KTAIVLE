import React, { useState } from 'react';
import './Login.css';
import RegisterForm from './RegisterForm';
import LoginForm from './LoginForm';
import { Route } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import loginPageImage from '../img/LoginPage.png';

const Login = ({onLogin }) => {
    const [isSignUp, setIsSignUp] = useState(false);
     const navigate = useNavigate();

    const toggleForm = () => {
        setIsSignUp(!isSignUp);
    };

    const handleLogin = (username) => {
        // 로그인 성공 시 처리 로직 추가
        onLogin(username);
        navigate('/Home');
    };

    return (
        <div className="login">
            <div className="login__content">
                <div className="login__img">
                    <img src={loginPageImage} alt="user login" />
                </div>
                <div className="login__forms">
                    {!isSignUp ? (
                        <LoginForm onLogin={handleLogin} toggleForm={toggleForm} />
                    ) : (
                        <RegisterForm toggleForm={toggleForm} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;
