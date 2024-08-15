import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';
import { useNavigate } from 'react-router-dom';

const AdminLoginForm = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginMessage, setLoginMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const adminData = { email, password };
            const response = await axios.post('https://allinone-spring.com/admin/login', adminData);
            if (response.data === 'Admin login successful') {
                setLoginMessage('Login successful');
                onLogin(email);
                navigate('/upload');
            } else {
                setLoginMessage('로그인 실패');
            }
        } catch (error) {
            console.error('Error logging in admin:', error);
            setLoginMessage('로그인 실패');
        }
    };

    const handleUserLoginClick = () => {
        navigate('/');
    };

    return (
        <form className="login__register block" onSubmit={handleLogin}>
            <h1 className="login__title">관리자 로그인</h1>
            <div className="login__box">
                <i className='bx bx-user login__icon'></i>
                <input
                    type="email"
                    placeholder="이메일"
                    className="login__input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <div className="login__box">
                <i className='bx bx-lock login__icon'></i>
                <input
                    type="password"
                    placeholder="비밀번호"
                    className="login__input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            <button type="submit" className="login__button">로그인</button>
            <div>
                <span className="login__account">관리자가 아니십니까?</span>
                <span className="login__signin" onClick={handleUserLoginClick}>사용자 로그인</span>
            </div>
            <p>{loginMessage}</p>
        </form>
    );
};

export default AdminLoginForm;
