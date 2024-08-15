import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NoticeService from './NoticeService';
import styles from '../css/UserNoticeAll.module.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../css/home.css';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Hero4 from './Hero4';
import Footer from './Footer';

const UserNoticeAll = ({ onLogout }) => {
    const [notices, setNotices] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        loadNotices();
    }, []);

    const loadNotices = () => {
        NoticeService.getNotices()
            .then(response => {
                setNotices(response.data);
            })
            .catch(error => {
                console.error('Error fetching notices:', error);
            });
    };

    const viewNotice = (id) => {
        navigate(`/notice/${id}`);
    };

    return (
        <div className="container-xxl bg-white p-0">
            <div className="container-xxl position-relative p-0">
                <Navbar onLogout={onLogout} />
                <Hero4 />
                <section className={styles.noticeSection}>

                    <div className={styles.boardList}>
                        <table className={styles.boardTable}>
                            <tbody>
                                {notices.map((notice, index) => (
                                    <tr key={notice.board_id} onClick={() => viewNotice(notice.board_id)} className={styles.noticeRow}>
                                        <td className={styles.noticeNum}>{index + 1}</td>
                                        <td className={styles.noticeTitle}>{notice.title}</td>
                                        <td className={styles.noticeDate}>{new Date(notice.regdate).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
                <Footer />
            </div>
            <a href="#" className="btn btn-lg btn-primary btn-lg-square back-to-top pt-2">
                <i className="bi bi-arrow-up"></i>
            </a>
        </div>
    );
};

export default UserNoticeAll;
