import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';
import ReactPlayer from 'react-player';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { ProgressBar } from 'react-bootstrap';
import '../css/video.css';
import bot from '../img/bot.png';
import bookmark from '../img/bookmark.png';
import timelineIcon from '../img/timeline.png';
import endStudyIcon from '../img/endStudyIcon.png';
import { useSelector } from 'react-redux';

const Video = () => {
    const { fileName } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { lectureId, lastWatchedTime, lectureName, time } = location.state || {};

    const [videoUrl, setVideoUrl] = useState('');
    const [bookmarks, setBookmarks] = useState([]);
    const [timeline, setTimeline] = useState([]);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [played, setPlayed] = useState(0); // 재생 진행 상태를 위한 새로운 상태
    const videoRef = useRef(null);
    const webcamRef = useRef(null);
    const chatContainerRef = useRef(null);
    const [slideStates, setSlideStates] = useState({
        isBookmarkOpen: false,
        isTimelineOpen: false,
        isChatOpen: false
    });
    const [drowsinessCount, setDrowsinessCount] = useState(0);
    const [earBelowThresholdCount, setEarBelowThresholdCount] = useState(0);
    const EAR_THRESHOLD = 0.3;
    const EAR_CONSEC_FRAMES = 30;
    const email = useSelector(state => state.user.email);
    const hasAlertedRef = useRef(false); // 알림 상태를 저장하기 위한 useRef
    const isInitializedRef = useRef(false); // 초기 설정 완료 여부를 저장하기 위한 useRef

    useEffect(() => {
        fetchVideoUrl();
        fetchTimeline();

        const loadModels = async () => {
            await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
            await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
        };

        loadModels();
    }, [fileName]);

    useEffect(() => {
        if (!hasAlertedRef.current) {
            alert('학습 정보를 저장하려면 학습 종료 버튼을 눌러주세요.');
            hasAlertedRef.current = true; // 알림을 표시했음을 기록
        }
    }, []);

    const fetchVideoUrl = () => {
        axios.get(`https://allinone-spring.com/api/video-url?fileName=${fileName}`)
            .then(response => {
                const fetchedUrl = response.data;
                console.log("Fetched Video URL:", fetchedUrl);
                setVideoUrl(fetchedUrl);
            })
            .catch(error => {
                console.error("Error fetching video URL:", error);
            });
    };

    const fetchTimeline = () => {
        axios.get('https://allinone-flask.com/video/timeline', {
            params: { fileName }
        })
            .then(response => {
                const fetchedTimeline = response.data;
                console.log("Fetched Timeline:", fetchedTimeline);

                if (fetchedTimeline && fetchedTimeline['강의 내용']) {
                    setTimeline(fetchedTimeline['강의 내용']);
                } else {
                    console.error("Invalid timeline data:", fetchedTimeline);
                }
            })
            .catch(error => {
                console.error("Error fetching timeline:", error);
            });
    };

    useEffect(() => {
        const interval = setInterval(async () => {
            if (webcamRef.current && webcamRef.current.video.readyState === 4) {
                const video = webcamRef.current.video;
                const detections = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks();

                if (detections && detections.detection.box) {
                    const { box } = detections.detection;

                    if (box.x !== null && box.y !== null && box.width !== null && box.height !== null) {
                        const leftEye = detections.landmarks.getLeftEye();
                        const rightEye = detections.landmarks.getRightEye();
                        const leftEAR = calculateEAR(leftEye);
                        const rightEAR = calculateEAR(rightEye);

                        const ear = (leftEAR + rightEAR) / 2;

                        if (ear < EAR_THRESHOLD) {
                            setEarBelowThresholdCount(prevCount => prevCount + 1);
                        } else {
                            setEarBelowThresholdCount(0);
                        }

                        if (earBelowThresholdCount >= EAR_CONSEC_FRAMES) {
                            setDrowsinessCount(prevCount => prevCount + 1);
                            setEarBelowThresholdCount(0);
                        }
                    } else {
                        console.warn('Invalid box values:', box);
                    }
                }
            }
        }, 100);
        return () => clearInterval(interval);
    }, [earBelowThresholdCount]);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const parseTime = (timeString) => {
        const parts = timeString.split(':');
        let hours = 0, minutes = 0, seconds = 0;

        if (parts.length === 2) {
            [minutes, seconds] = parts.map(Number);
        } else if (parts.length === 3) {
            [hours, minutes, seconds] = parts.map(Number);
        }

        return (hours * 3600) + (minutes * 60) + seconds;
    };

    const handlePlay = async () => {
        if (!isInitializedRef.current) {
            if (lastWatchedTime) {
                const timeInSeconds = parseTime(lastWatchedTime);
                if (!isNaN(timeInSeconds)) {
                    videoRef.current.seekTo(timeInSeconds);
                    setCurrentTime(timeInSeconds); // 현재 시간을 설정
                    setPlayed(timeInSeconds / duration); // 슬라이더의 값을 설정
                }
            }

            if (time) {
                const timeInSeconds = parseTime(time);
                if (!isNaN(timeInSeconds)) {
                    videoRef.current.seekTo(timeInSeconds);
                    setCurrentTime(timeInSeconds); // 현재 시간을 설정
                    setPlayed(timeInSeconds / duration); // 슬라이더의 값을 설정
                }
            }

            isInitializedRef.current = true;
        }

        setIsPlaying(true);
    };

    const handlePause = () => {
        setIsPlaying(false);
    };

    const handlePlayFromReviews = async () => {
        if (time) {
            const timeInSeconds = parseTime(time);
            if (!isNaN(timeInSeconds)) {
                console.log(`Setting video currentTime to ${timeInSeconds} seconds`);
                videoRef.current.seekTo(timeInSeconds);
                setIsPlaying(true);
            } else {
                console.error('Invalid time value:', time);
            }
        } else {
            console.error('No time value provided');
        }
    };

    const calculateEAR = (eye) => {
        const A = Math.sqrt(Math.pow((eye[1].x - eye[5].x), 2) + Math.pow((eye[1].y - eye[5].y), 2));
        const B = Math.sqrt(Math.pow((eye[2].x - eye[4].x), 2) + Math.pow((eye[2].y - eye[4].y), 2));
        const C = Math.sqrt(Math.pow((eye[0].x - eye[3].x), 2) + Math.pow((eye[0].y - eye[3].y), 2));
        return (A + B) / (2.0 * C);
    };

    const handleAddBookmark = () => {
        const currentTime = videoRef.current.getCurrentTime();
        const description = prompt('북마크 내용을 입력하세요:');
        if (description) {
            setBookmarks([...bookmarks, { time: currentTime, description }]);
        }
    };

    const handlePlayBookmark = (time) => {
        videoRef.current.seekTo(time);
        setIsPlaying(true);
    };

    const toggleBookmark = () => {
        setSlideStates({
            isBookmarkOpen: !slideStates.isBookmarkOpen,
            isTimelineOpen: false,
            isChatOpen: false
        });
    };

    const toggleTimeline = () => {
        setSlideStates({
            isBookmarkOpen: false,
            isTimelineOpen: !slideStates.isTimelineOpen,
            isChatOpen: false
        });
    };

    const toggleChat = () => {
        setSlideStates({
            isBookmarkOpen: false,
            isTimelineOpen: false,
            isChatOpen: !slideStates.isChatOpen
        });
    };

    const sendMessage = async () => {
        if (inputMessage.trim() !== '') {
            const newMessages = [...messages, { sender: 'User', text: inputMessage }];
            setMessages(newMessages);
            setInputMessage('');

            try {
                const response = await axios.post('https://allinone-flask.com/video/chat', {
                    question: inputMessage,
                    file_name: fileName
                });
                const botResponse = response.data.result;
                setMessages([...newMessages, { sender: 'Bot', text: botResponse }]);
            } catch (error) {
                console.error('Error sending message to chat bot:', error);
            }
        }
    };

    const handleEndStudy = async () => {
        const currentTime = videoRef.current.getCurrentTime();
        const duration = videoRef.current.getDuration();
        const userProgress = Math.round((currentTime / duration) * 100);
        const lectureTime = new Date(currentTime * 1000).toISOString().substr(11, 8);
        const lectureName = fileName.replace('.mp4', '');

        const focusPayload = {
            email: email,
            lectureName: lectureName,
            userFocus: 100 - drowsinessCount
        };

        const progressPayload = {
            email: email,
            lectureId: lectureId,
            lectureName: lectureName,
            lectureTime: lectureTime,
            userProgress: userProgress
        };

        try {
            const token = localStorage.getItem('token');

            console.log('Focus payload to be sent:', focusPayload);
            console.log('Progress payload to be sent:', progressPayload);

            await axios.post('https://allinone-spring.com/api/lecture-focus/save-or-update', focusPayload, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            await axios.post('https://allinone-spring.com/api/lecture-progress', progressPayload, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            navigate('/lectures');
        } catch (error) {
            console.error('Failed to save lecture focus or progress:', error);
        }
    };

    const handlePlayTimeline = (time) => {
        if (videoRef.current && !isNaN(time)) {
            videoRef.current.seekTo(time);
            setIsPlaying(true);
        } else {
            console.error('Invalid time value:', time);
        }
    };

    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="video-page">
            <div className="header-bar">
                <div className="concentration-level">
                    강의집중도
                    <ProgressBar
                        now={100 - drowsinessCount}
                        label={`${100 - drowsinessCount}%`}
                        style={{ width: '100px'}}
                    />
                </div>
            </div>

            <div className={`video-container ${slideStates.isBookmarkOpen || slideStates.isTimelineOpen || slideStates.isChatOpen ? 'shrink' : ''}`}>
                <ReactPlayer
                    ref={videoRef}
                    url={videoUrl}
                    className="lecture-video"
                    playing={isPlaying}
                    onPause={handlePause}
                    onPlay={handlePlay}
                    onProgress={({ playedSeconds }) => {
                        setCurrentTime(playedSeconds);
                        setPlayed(playedSeconds / duration); // 재생 진행 상태 업데이트
                    }}
                    onDuration={(duration) => {
                        setDuration(duration);
                        if (!isInitializedRef.current) {
                            if (lastWatchedTime) {
                                const timeInSeconds = parseTime(lastWatchedTime);
                                if (!isNaN(timeInSeconds)) {
                                    setPlayed(timeInSeconds / duration); // 초기 슬라이더 값 설정
                                }
                            }
                            if (time) {
                                const timeInSeconds = parseTime(time);
                                if (!isNaN(timeInSeconds)) {
                                    setPlayed(timeInSeconds / duration); // 초기 슬라이더 값 설정
                                }
                            }
                        }
                    }}
                    controls
                    width="100%"
                    height="100%"
                    backgroundColor="black"
                />
                <div className="video-controls">
                    <span style={{ color: '#fff', marginLeft: '10px' }}>{formatTime(currentTime)} / {formatTime(duration)}</span>
                </div>
                <div className="video-slider">
                    <input
                        type='range'
                        min='0'
                        max='0.999999'
                        step='any'
                        value={played}
                        style={{ '--progress': `${played * 100}%` }}
                        onChange={(e) => {
                            const seekTo = parseFloat(e.target.value);
                            setPlayed(seekTo); // 재생 진행 상태 업데이트
                            videoRef.current.seekTo(seekTo * duration); // 비디오를 새로운 위치로 이동
                        }}
                    />
                </div>
                <div className="webcam-container">
                    <Webcam ref={webcamRef} audio={false} className="webcam-video" />
                </div>
            </div>

            <div className="sidebar">
                <div className="sidebar-inner">
                    <button className="button-open-chat" onClick={toggleChat}>
                        <img src={bot} alt="Chat Bot Icon" />
                        <span className="button-text">챗봇</span>
                    </button>
                    <button className="button-open-slidebar" onClick={toggleBookmark}>
                        <img src={bookmark} alt="Bookmark Icon" />
                        <span className="button-text">북마크</span>
                    </button>
                    <button className="button-open-timeline" onClick={toggleTimeline}>
                        <img src={timelineIcon} alt="Timeline Icon" />
                        <span className="button-text">타임라인</span>
                    </button>
                </div>
                <div className="sidebar-inner">
                    <button className="button-end-study" onClick={handleEndStudy}>
                        <img src={endStudyIcon} alt="End Study Icon" />
                        <span className="button-text">학습종료</span>
                    </button>
                </div>
            </div>

            <div className={`chat-container ${slideStates.isChatOpen ? 'open' : ''}`}>
                <div className="chat-header">
                    <span>챗봇</span>
                    <button className="button-close-chat" onClick={toggleChat}>&times;</button>
                </div>
                <div className="chat-messages" ref={chatContainerRef}>
                    {messages.map((message, index) => (
                        <div key={index} className={message.sender.toLowerCase()}>
                            <span>{message.text}</span>
                        </div>
                    ))}
                </div>
                <div className="chat-input">
                    <input
                        type="text"
                        id="chat-input"
                        placeholder="메시지를 입력하세요."
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {  // Ensures the Enter key alone triggers the send, not with Shift.
                                e.preventDefault();  // Prevents the default action of the Enter key (new line).
                                sendMessage();  // Calls the sendMessage function to send the message.
                            }
                        }}
                    />
                    <button onClick={sendMessage}>전송</button>
                </div>
            </div>
            <div className={`slidebar-container ${slideStates.isBookmarkOpen ? 'open' : ''}`}>
                <div className="slidebar-header">
                    <span>북마크</span>
                    <button className="button-close-slidebar" onClick={toggleBookmark}>&times;</button>
                </div>
                <div className="slidebar-content">
                    <div className="bookmark-content">
                        <button onClick={handleAddBookmark} style={{
                            marginBottom: '10px',
                            marginTop: '-10px',
                            padding: '7px 14px',
                            backgroundColor: '#d3d3d3',
                            color: '#333',
                            border: 'none',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '14px'
                        }}
                        >북마크 추가</button>
                        {bookmarks.map((bookmark, index) => (
                            <div key={index} className="bookmark-item" onClick={() => handlePlayBookmark(bookmark.time)}>
                                <div className="bookmark-time">
                                    <span className="emoji">📌</span>
                                    <span>{formatTime(bookmark.time)}</span>
                                </div>
                                <div className="bookmark-text">
                                    <span>{bookmark.description}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className={`slidebar-container ${slideStates.isTimelineOpen ? 'open' : ''}`}>
                <div className="slidebar-header">
                    <span>타임라인</span>
                    <button className="button-close-slidebar" onClick={toggleTimeline}>&times;</button>
                </div>
                <div className="slidebar-content timeline-content">
                    {timeline.map((topic, index) => (
                        <div key={index} className="timeline-topic">
                            <h4>{topic.Big_title}</h4>
                            {topic.sub_topics.map((subTopic, subIndex) => (
                                <div key={subIndex} className="timeline-item" onClick={() => handlePlayTimeline(subTopic.time)}>
                                    <div className="timeline-time">
                                        <span className="emoji">🕑</span> {/* 이모티콘 추가 */}
                                        <span>{formatTime(subTopic.time)}</span>
                                    </div>
                                    <div className="timeline-text">
                                        <span>{subTopic.Title_Name}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Video;
