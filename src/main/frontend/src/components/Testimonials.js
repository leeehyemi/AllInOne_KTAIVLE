import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../css/home.css';
import '../css/Testimonials.css';
import axios from 'axios';
import { useSelector } from 'react-redux';
import styles from '../css/Testimonials.module.css';

const Testimonials = () => {
    const [reviews, setReviews] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const email = useSelector(state => state.user.email);
    const [username, setUsername] = useState('');
    const [lectureName, setLectureName] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [lectures, setLectures] = useState([]);

    useEffect(() => {
        axios.get('https://allinone-spring.com/api/reviews/views')
            .then(response => {
                setReviews(response.data);
                initializeOwlCarousel();
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };

        axios.get('https://allinone-spring.com/lectures', config)
            .then(response => {
                setLectures(response.data);
            })
            .catch(error => {
                console.error('Error fetching lectures:', error);
            });
    }, []);

    const initializeOwlCarousel = () => {
        const interval = setInterval(() => {
            if (window.$ && window.$('.testimonial-carousel').length > 0) {
                window.$('.testimonial-carousel').owlCarousel({
                    autoplay: true,
                    smartSpeed: 1000,
                    margin: 25,
                    dots: true,
                    loop: true,
                    items: 1,
                    nav: false,
                    responsive: {
                        0: {
                            items: 1,
                        },
                        576: {
                            items: 1,
                        },
                        768: {
                            items: 2,
                        },
                        992: {
                            items: 3,
                        },
                    },
                });
                clearInterval(interval);
            }
        }, 100);
    };

    const togglePopup = () => {
        setShowPopup(!showPopup);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const token = localStorage.getItem('token');
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };

        const review = { email, username, lectureName, title, content };

        axios.post('https://allinone-spring.com/api/reviews/register', review, config)
            .then(response => {
                console.log('Success:', response.data);
                togglePopup();
                window.location.reload();
            })
            .catch(error => {
                console.error('Error submitting review:', error);
            });
    };

    const imgSources = [
        "img/testimonial-5.jpg",
        "img/testimonial-2.jpg",
        "img/testimonial-3.jpg",
        "img/testimonial-4.jpg",
        "img/testimonial-1.jpg",
    ];

    return (
        <>
            <div className="container-xxl testimonial py-5 mb-0 pb-0 wow fadeInUp" data-wow-delay="0.1s">
                <div className="container py-5 px-lg-5">
                    <h2 className="text-center mb-5">강의 평가</h2>
                    <div className="owl-carousel testimonial-carousel">
                        {reviews.map((review, index) => (
                            <div key={review.lectureReviewId}
                                 className="testimonial-item bg-white border rounded shadow-sm p-4">
                                <i className="fa fa-quote-left fa-2x mb-3 text-primary"></i>
                                <p>{review.content}</p>
                                <div className="d-flex align-items-center mt-3">
                                    <img className="img-fluid flex-shrink-0 rounded-circle"
                                         src={imgSources[index % imgSources.length]}
                                         style={{width: '50px', height: '50px'}} alt={review.username}/>
                                    <div className="ps-3">
                                        <h6 className="mb-1">{review.username}</h6>
                                        <small className="text-muted">{review.lectureName}</small>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="buttonclass text-center mt-4">
                    <button className="custom-button" onClick={togglePopup}>강의평 작성</button>
                    {showPopup && (
                        <>
                            <div className={styles.overlay} onClick={togglePopup}></div>
                            <div className={styles.popup}>
                                <span className="close" onClick={togglePopup}>&times;</span>
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className={styles.label_name}>이메일</label>
                                        <input type="email" className="form-control" value={email} readOnly/>
                                    </div>
                                    <div className="mb-3">
                                        <label className={styles.label_name}>이름</label>
                                        <input type="text" className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className={styles.label_name}>강의</label>
                                            <select className="form-control" value={lectureName} onChange={(e) => setLectureName(e.target.value)} required>
                                                 <option value="">강의를 선택해주세요</option>
                                                    {lectures.map((lecture) => (
                                                        <option key={lecture.lecture_id} value={lecture.lectureName}>{lecture.lectureName}</option>
                                                    ))}
                                             </select>
                                    </div>

                                    <div className="mb-3">
                                        <label className={styles.label_name}>제목</label>
                                        <input type="text" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} required />
                                    </div>

                                    <div className="mb-3">
                                        <label className={styles.label_name}>내용</label>
                                        <textarea className="form-control" value={content} onChange={(e) => setContent(e.target.value)} required rows="3"></textarea>
                                    </div>
                                    <button type="submit" className={styles.register_button}>제출</button>
                                </form>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

const TestimonialItem = ({content, name, position, imgSrc}) => {
    return (
        <div className="testimonial-item bg-white border rounded shadow-sm p-4">
            <i className="fa fa-quote-left fa-2x mb-3 text-primary"></i>
            <p>{content}</p>
            <div className="d-flex align-items-center mt-3">
                <img className="img-fluid flex-shrink-0 rounded-circle" src={imgSrc}
                     style={{width: '50px', height: '50px'}} alt={name}/>
                <div className="ps-3">
                    <h6 className="mb-1">{name}</h6>
                    <small className="text-muted">{position}</small>
                </div>
            </div>
        </div>
    );
};

export default Testimonials;
