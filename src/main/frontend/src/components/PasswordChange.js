import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styles from  '../css/PasswordChange.module.css';

// axios 인스턴스 생성
const api = axios.create({
    baseURL: 'https://allinone-spring.com',
});

const PasswordChange = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [token, setToken] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    const location = useLocation();
    const userEmail = useSelector((state) => state.user.email);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const tokenFromUrl = searchParams.get('token');
        setToken(tokenFromUrl);
    }, [location.search]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsError(false);

        if (password !== confirmPassword) {
            setMessage('비밀번호가 일치하지 않습니다.');
            setIsError(true);
            return;
        }

        if(password.length < 8 || !/[!@#$%^&*()]/.test(password)) {
            setMessage('비밀번호는 8자리 이상, 특수문자를 포함해야 합니다.');
            setIsError(true);
            return;
        }

        try {
            const response = await api.post('/api/change-password', { token, password });
            setMessage(response.data);
        } catch (error) {
            setMessage(error.response?.data || '오류가 발생했습니다. 다시 시도해주세요.');
            setIsError(true);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title text-center mb-4">비밀번호 변경</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3 d-none">
                                    <input
                                        type="hidden"
                                        value={token}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className={styles.form_password}>새로운 비밀번호</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="confirmPassword" className={styles.form_password}>비밀번호 확인</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="confirmPassword"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary w-100">
                                    비밀번호 변경
                                </button>
                            </form>
                            {message && (
                                <div className={`alert ${isError ? 'alert-danger' : 'alert-success'} mt-3`} role="alert">
                                    {message}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PasswordChange;