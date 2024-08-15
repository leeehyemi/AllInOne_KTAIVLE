import React, { useEffect, useState } from 'react';
import { useNavigate ,useParams } from 'react-router-dom';
import NoticeService from './NoticeService';
import styles from '../css/NoticeDetail.module.css';

const NoticeDetail = () => {
    const { id } = useParams();
    const [notice, setNotice] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        NoticeService.getNoticeById(id)
            .then(response => {
                setNotice(response.data);
            })
            .catch(error => {
                console.error('Error fetching notice:', error);
            });
    }, [id]);

    if (!notice) return <p>Loading...</p>;

    return (
        <div className={styles.noticeDetail}>
        <button className={styles.backButton} onClick={() => navigate('/notices')}>목록</button>
            <p>{new Date(notice.regdate).toLocaleString()}</p>
            <h2 className={styles.nid3}>{notice.title}</h2>
            <div className = {styles.content_body} dangerouslySetInnerHTML={{ __html: notice.content.replace(/\n/g, '<br />') }} />
        </div>
    );
};

export default NoticeDetail;
