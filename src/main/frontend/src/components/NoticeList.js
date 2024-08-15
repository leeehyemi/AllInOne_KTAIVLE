import React, { useEffect, useState } from 'react';
import NoticeService from './NoticeService';
import { useNavigate } from 'react-router-dom';
import styles from '../css/NoticeList.module.css';

const NoticeList = () => {
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

    const deleteNotice = (id) => {
        NoticeService.deleteNotice(id)
            .then(() => {
                loadNotices(); // 순서 재정렬
            })
            .catch(error => {
                console.error('Error deleting notice:', error);
            });
    };

    const editNotice = (id) => {
        navigate(`/admin/notices/edit/${id}`);
    };

    const addNotice = () => {
        navigate('/admin/notices/new');
    };

    return (
        <div className={styles.noticeListContainer}>
            <h2 className={styles.h22}>공지사항</h2>
            <button className={styles.addButton} onClick={addNotice}>공지 추가</button>
            <table className={styles.noticeTable}>
                <thead>
                    <tr>
                        <th>순서</th>
                        <th>제목</th>
                        <th>등록 날짜</th>
                        <th>액션</th>
                    </tr>
                </thead>
                <tbody>
                    {notices.map((notice, index) => (
                        <tr key={notice.board_id}>
                            <td>{index + 1}</td> {/* 순서 표시 */}
                            <td onClick={() => editNotice(notice.board_id)}>{notice.title}</td>
                            <td>{new Date(notice.regdate).toLocaleString()}</td>
                            <td>
                                <button className={styles.actionButton} onClick={() => deleteNotice(notice.board_id)}>삭제</button>
                                <button className={styles.actionButton} onClick={() => editNotice(notice.board_id)}>수정</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default NoticeList;
