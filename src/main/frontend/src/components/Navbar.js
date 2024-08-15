import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../css/home.css';

const Navigation = ({ onLogout }) => {
  return (
    <div className="container-xxl position-relative p-0">
      <nav className="navbar navbar-expand-lg navbar-light px-4 px-lg-5 py-1 py-lg-0">
        <Link to="/Home" className="navbar-brand p-0">
          <img src="../img/logo_img.png" alt="All-In-One Logo" className="logo-img" style={{ marginTop: "10px", width: "100%" }} />
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
          <span className="fa fa-bars"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarCollapse">
          <div className="navbar-nav ms-auto py-0">
            <Link to="/Home" className="nav-item nav-link">메인화면</Link>
            <Link to="/lectures" className="nav-item nav-link">강의목록</Link>
            <Link to="/report" className="nav-item nav-link">통계실</Link>
            <Link to="/profile" className="nav-item nav-link">마이페이지</Link>
            {/*<Link to="/upload" className="nav-item nav-link">업로드</Link>*/}  {/* 업로드 버튼 추가 */}
          </div>
          <button onClick={onLogout} className="btn btn-secondary text-light rounded-pill py-2 px-4 ms-3" style={{borderColor: 'black', borderWidth:'2px'}}>로그아웃</button>
        </div>
      </nav>
    </div>
  );
};

export default Navigation;
