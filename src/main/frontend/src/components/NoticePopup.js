import React from 'react';
import styles from '../css/NoticePopup.module.css';

const NoticePopup = ({ notice, onClose }) => {
    if (!notice) return null;

    const formatContent = (content) => {
        return content.replace(/\n/g, '<br />');
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.popup}>
                <button className={styles.close} onClick={onClose}>X</button>
                <h2 className={styles.popupTitle}>공지사항</h2>
                <p className={styles.date}>{new Date(notice.regdate).toLocaleString()}</p>
                <h3 className={styles.title}>{notice.title}</h3>
                <div className={styles.content} dangerouslySetInnerHTML={{ __html: formatContent(notice.content) }} />
            </div>
        </div>
    );
};

export default NoticePopup;
