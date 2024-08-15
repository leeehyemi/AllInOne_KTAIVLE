import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/Upload.css';

const Upload = () => {
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setFileName(selectedFile.name.split('.').slice(0, -1).join('.'));  // 확장자 제외한 파일 이름 저장
            setMessage(`파일이 선택되었습니다: ${selectedFile.name}`);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage('Please select a file first.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        setUploading(true);
        try {
            const response = await axios.post('https://allinone-spring.com/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            await axios.post('https://allinone-flask.com/create/create_pdf',{ file_name: fileName}, { withCredentials: true});

            await axios.post('https://allinone-flask.com/create/create_quiz', { file_name : fileName}, {withCredentials: true});

            setMessage('File uploaded and processed succesfully.');
        }
        catch(error) {
            setMessage('Failed to upload and process file:' + error.message);
        }

        finally {
            setUploading(false);
        }
    };

    const goToNotices = () => {
        navigate('/admin/notices/list');
    };

    const goToHome = () => {
        navigate('/home');
    };

    return (
        <div className="upload-container">
            <h1 className="upload-title">파일 업로드</h1>
            <div className={`upload-box ${file ? 'file-selected' : ''}`}>
                <div className="file-icon">
                    <span className="arrow-icon">➜</span>
                </div>
                <p className="drag-text">
                    {file ? `선택된 파일: ${fileName}` : '파일을 올리고 "파일 업로드" 버튼을 눌러주세요'}
                </p>
                <p className="alternative-text">
                    <label htmlFor="fileInput" className="click-here"> 여기를 눌러 파일을 선택하세요</label>
                </p>
                <input
                    id="fileInput"
                    type="file"
                    onChange={handleFileChange}
                    className="hidden-input"
                />
            </div>
            <div className="button-container">
                <div className="nav-buttons">
                    <button onClick={goToHome} className="home-button">홈으로 이동</button>
                    <button onClick={goToNotices} className="notice-button">공지사항 관리</button>
                </div>
                <button onClick={handleUpload} disabled={uploading} className="upload-button">
                    {uploading ? 'Uploading...' : '파일 업로드'}
                </button>
            </div>
            {message && <p className="message">{message}</p>}
        </div>
    );
};

export default Upload;