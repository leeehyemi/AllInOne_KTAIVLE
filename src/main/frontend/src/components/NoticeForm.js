import React, { useState, useEffect } from 'react';
import NoticeService from './NoticeService';
import { useNavigate, useParams } from 'react-router-dom';
import styles from '../css/NoticeForm.module.css';

const NoticeForm = () => {
    const [notice, setNotice] = useState({ username: '', title: '', content: '' });
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            NoticeService.getNoticeById(id)
                .then(response => {
                    setNotice(response.data);
                })
                .catch(error => {
                    console.error('Error fetching notice:', error);
                });
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNotice({ ...notice, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (id) {
            NoticeService.updateNotice(id, notice)
                .then(() => {
                    navigate('/admin/notices/list');
                })
                .catch(error => {
                    console.error('Error updating notice:', error);
                    console.error('Error details:', error.response);
                });
        } else {
            NoticeService.createNotice(notice)
                .then(() => {
                    navigate('/admin/notices/list');
                })
                .catch(error => {
                    console.error('Error creating notice:', error);
                    console.error('Error details:', error.response);
                });
        }
    };

    return (
        <div className={styles.noticeFormContainer}>
            <h2>{id ? '공지 수정' : '공지 추가'}</h2>
            <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label className={styles.notice_label}>Username:</label>
                    <input type="text" name="username" value={notice.username} onChange={handleChange} required />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.notice_label}>Title:</label>
                    <input type="text" name="title" value={notice.title} onChange={handleChange} required />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.notice_label}>Content:</label>
                    <textarea name="content" value={notice.content} onChange={handleChange} required></textarea>
                </div>
                <button type="submit">{id ? 'Update' : 'Create'}</button>
            </form>
        </div>
    );
};

export default NoticeForm;
