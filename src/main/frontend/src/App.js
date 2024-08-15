import React, { useEffect,useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import RegisterForm from './components/RegisterForm';
import Home from './components/Home';
import Upload from './components/Upload';
import AdminLogin from './components/AdminLogin';
import Video from './components/Video';
import LectureList from './components/LectureList';
import Profile from './components/Profile';
import Report from './components/Report';
import About from './components/About';
import Coworker from './components/Coworker';
import PasswordChange from './components/PasswordChange';
//import { Provider } from 'react-redux';
//import store from './store';
import Quiz from './components/Quiz';
import PrivateRoute from './components/PrivateRoute';
import NoticeList from './components/NoticeList';
import NoticeForm from './components/NoticeForm';
import UserNoticeAll from './components/UserNoticeAll';
import NoticeDetail from './components/NoticeDetail';
import Reviews from './components/Reviews';
import { useDispatch } from 'react-redux';
import { setUser, clearUser } from './store/userSlice';

function App() {
    const [adminLoggedIn, setAdminLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
            const userEmail = localStorage.getItem('email');
            if (userEmail) {
                dispatch(setUser(userEmail));
            }
        }, [dispatch]);

    const handleAdminLogin = () => {
        setAdminLoggedIn(true);
        navigate('/upload');
    };

    const handleLogin = (username) => {
        setUsername(username);
        navigate('/home');
    };

    const handleLogout = () => {
        setUsername('');
        setAdminLoggedIn(false);
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        dispatch(clearUser());
        navigate('/');
    };

    return (

            <div className="App">
                <Routes>
                    <Route path="/" element={<Login onLogin={handleLogin} />} />
                    <Route path="/register" element={<RegisterForm />} />
                    <Route path="/adminlogin" element={<AdminLogin onAdminLogin={handleAdminLogin} />} />
                    <Route path="/reset-password" element={<PasswordChange onLogout={handleLogout} />} />

                    <Route path="/home" element={
                        <PrivateRoute>
                            <Home username={username} onLogout={handleLogout} />
                        </PrivateRoute>
                    } />
                    <Route path="/upload" element={
                        adminLoggedIn ? <Upload /> : <Navigate to="/adminlogin" />
                    } />
                    <Route path="/lectures" element={
                        <PrivateRoute>
                            <LectureList onLogout={handleLogout} />
                        </PrivateRoute>
                    } />
                    <Route path="/video/:fileName" element={
                        <PrivateRoute>
                            <Video />
                        </PrivateRoute>
                    } />
                    <Route path="/profile" element={
                        <PrivateRoute>
                            <Profile onLogout={handleLogout}/>
                        </PrivateRoute>
                    } />
                    <Route path="/report" element={
                        <PrivateRoute>
                            <Report onLogout={handleLogout}/>
                        </PrivateRoute>
                    } />

                    <Route path="/about" element={
                        <PrivateRoute>
                            <About onLogout={handleLogout}/>
                        </PrivateRoute>
                    } />
                    <Route path="/coworker" element={
                        <PrivateRoute>
                            <Coworker onLogout={handleLogout}/>
                        </PrivateRoute>
                    } />

                    <Route path="/quiz" element={
                        <PrivateRoute>
                            <Quiz />
                        </PrivateRoute>
                    } />

                    <Route path="/notices" element={
                        <PrivateRoute>
                            <UserNoticeAll onLogout={handleLogout} />
                        </PrivateRoute>
                    } />
                    <Route path="/notice/:id" element={
                        <PrivateRoute>
                            <NoticeDetail />
                        </PrivateRoute>
                    } />
                    <Route path="/reviews" element={
                        <PrivateRoute>
                            <Reviews />
                        </PrivateRoute>
                    } />

                    <Route path="/admin/notices/list" element={<NoticeList />} />
                    <Route path="/admin/notices/new" element={<NoticeForm />} />
                    <Route path="/admin/notices/edit/:id" element={<NoticeForm />} />
                </Routes>
            </div>

    );
}

export default App;