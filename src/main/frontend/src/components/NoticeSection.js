import React, { useEffect, useState } from 'react';
import NoticeService from './NoticeService';
import { useNavigate } from 'react-router-dom';
import NoticePopup from './NoticePopup';
import '../css/notice.css';

const NoticeSection = () => {
    const [notices, setNotices] = useState([]);
    const [selectedNotice, setSelectedNotice] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        loadNotices();
    }, []);

    const loadNotices = () => {
        NoticeService.getNotices()
            .then(response => {
                setNotices(response.data.slice(0, 5)); // 최근 공지사항 5개만 미리보기로 표시
            })
            .catch(error => {
                console.error('Error fetching notices:', error);
            });
    };

    const seeAllNotices = (e) => {
        e.preventDefault();
        navigate('/notices');
    };

    const showNoticePopup = (notice) => {
        setSelectedNotice(notice);
    };

    const closePopup = () => {
        setSelectedNotice(null);
    };

    return (
        <div className="col-md-6">
            <div className="section-box">
                <div className="section-header">
                    <h6 className="section-title">공지사항</h6>
                    <a href="#" className="see-all" onClick={seeAllNotices}>
                        <img src="img/plus.png" alt="See All" className="see-all-icon"/>
                    </a>
                </div>
                <ul className="notice-list">
                    {notices.map(notice => (
                        <li key={notice.board_id} onClick={() => showNoticePopup(notice)}>
                            <span className="badge">안내</span>
                            <span className="notice-text">{notice.title}</span>
                            <span className="notice-time">{new Date(notice.regdate).toLocaleString()}</span>
                        </li>
                    ))}
                </ul>
                {selectedNotice && <NoticePopup notice={selectedNotice} onClose={closePopup} />}
            </div>
        </div>
    );
};

export default NoticeSection;
