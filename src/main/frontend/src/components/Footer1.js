import React from 'react';
import styles from '../css/footer.module.css'; // CSS 모듈 임포트

const Footer1 = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.footerContent}>
                    <div className={styles.footerLogo}>
                        <img src="../img/aivle.png" alt="Dreamy Logo" />
                        <p>A Learning Management System (LMS) </p>
                    </div>
                    <div className={styles.footerLinks}>
                        <a href="#">ABOUT</a>
                        <a href="#">PRODUCTS</a>
                        <a href="#">CONTACTS</a>
                    </div>
                </div>
                <div className={styles.footerBottom}>
                    <p>&copy; 2024 KT AIVLE AI TEAM4. All rights reserved</p>
                    <div className={styles.footerPaymentIcons}>
                        <img className={styles.img1} src="../img/spring.png" alt="Spring" />
                        <img className={styles.img2} src="../img/python.png" alt="python" />
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer1;
