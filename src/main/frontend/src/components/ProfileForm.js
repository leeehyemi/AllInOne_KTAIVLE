import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PasswordResetRequest = () => {
    const [user, setUser] = useState({ name: '', email: '' });
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    useEffect(() => {
            fetchUserData();
        }, []);

    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('https://allinone-spring.com/api/user-info', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(response.data);
        } catch (error) {
            console.error('Error fetching user data:', error);
            setMessage('사용자 정보를 가져오는데 실패했습니다.');
            setIsError(true);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsError(false);

        try {
            await axios.post('https://allinone-spring.com/api/reset-password', { email });
            setMessage('비밀번호 재설정 링크가 이메일로 전송되었습니다.');
        } catch (error) {
            setMessage('오류가 발생했습니다. 다시 시도해주세요.');
            setIsError(true);
        }
    };

    return (
        <div className="container mt-5" style = {{marginBottom : "130px"}}>
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card mb-4">
                        <div className="card-body">
                            <h2 className="card-title text-center mb-4">사용자 정보</h2>
                            <div className="mb-3">
                                <label className="form-label" style={{ marginLeft: '-10px' }}>이름</label>
                                <input type="text" className="form-control" value={user.name} readOnly />
                            </div>
                            <div className="mb-3">
                                <label className="form-label" style={{ marginLeft: '-10px' }}>이메일</label>
                                <input type="email" className="form-control" value={user.email} readOnly />
                            </div>
                        </div>
                    </div>
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title text-center mb-4">비밀번호 재설정</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label" style={{ marginLeft: '-10px' }}>이메일 주소</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary w-100">
                                    비밀번호 재설정 링크 받기
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

export default PasswordResetRequest;