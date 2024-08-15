import React, { useState } from 'react';
import { loginUser } from '../api';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { useDispatch } from 'react-redux';  // redux 스토어에 저장
import { setUser } from '../store/userSlice';
import { jwtDecode } from 'jwt-decode';

const LoginForm = ({ onLogin, toggleForm }) => {
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginMessage, setLoginMessage] = useState('');
    const navigate = useNavigate();

    // LoginForm.js
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const userData = { email, password };
            const result = await loginUser(userData);

            if (result.token) {
                // JWT 토큰을 localStorage에 저장
                localStorage.setItem('token', result.token);

                // 토큰 디코딩하고 이메일 가져오기
                const decodedToken = jwtDecode(result.token);
                const userEmail = decodedToken.sub; // 이메일

                // Redux 스토어에 이메일 저장
                console.log("Decoded email:", userEmail);
                dispatch(setUser(userEmail));

                localStorage.setItem('email', userEmail);

                // 로그인 메시지 설정
                setLoginMessage('Login successful');

                // 로그인 성공 후 처리 로직
                onLogin(email);

                // 홈 페이지로 네비게이션
                navigate('/home');
            } else {
                setLoginMessage('Login failed');
            }
        } catch (error) {
            console.error('Error logging in user:', error);
            setLoginMessage(error.message || 'Login failed');
        }
    };

    const handleAdminLoginClick = () => {
        navigate('/adminlogin');
    };

    return (
        <form className="login__register block" onSubmit={handleLogin}>
            <h1 className="login__title">로그인</h1>
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
                <span className="login__account">아직 회원이 아니신가요?</span>
                <span className="login__signin" onClick={toggleForm}>&nbsp;회원 가입</span>
            </div>
            <div>
                <span className="login__signin" onClick={handleAdminLoginClick}>관리자 로그인</span>
            </div>
            <p>{loginMessage}</p>
        </form>
    );
};

export default LoginForm;
