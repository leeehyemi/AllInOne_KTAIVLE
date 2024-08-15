import React from 'react';
import { useSelector } from 'react-redux';
import '../css/CoworkerContent.css';

const CoworkerContent = () => {
  const email = useSelector(state => state.user.email);

  return (
    <div className="about-container">
      <div className="row">
        {/* Main Content */}
        <div className="col-lg-12">
          <div className="about-content">
            <div className="row g-5">
              <div className="col-12 text-center">
                <h1 className="animated zoomIn custom-margin">팀원 소개</h1>
                <h4 className="animated zoomIn">수도권 AI 1반 4조</h4>
              </div>
            </div>
            {/* First Row (2 items) */}
            <div className="row g-4" style={{ marginTop: "80px" }}>
              <div className="col-lg-4 col-md-6" style={{ marginLeft: "15%" }}>
                <div className="team-item">
                  <div className="d-flex">
                    <div className="flex-shrink-0 d-flex flex-column align-items-center mt-4 pt-5" style={{ width: "75px" }}>
                      <a className="btn btn-square text-primary bg-white my-1" href=""><i className="fab fa-facebook-f"></i></a>
                      <a className="btn btn-square text-primary bg-white my-1" href=""><i className="fab fa-twitter"></i></a>
                      <a className="btn btn-square text-primary bg-white my-1" href=""><i className="fab fa-instagram"></i></a>
                      <a className="btn btn-square text-primary bg-white my-1" href=""><i className="fab fa-linkedin-in"></i></a>
                    </div>
                    <div className="position-relative">
                      <img className="img-fluid rounded w-100" src="img/testimonial-5.jpg" alt="" />
                      <img className="img-fluid rounded w-100 hover-image" src="img/back1.png" alt="" />
                    </div>
                  </div>
                  <div className="px-4 py-3">
                    <h5 className="fw-bold m-0">이승원</h5>
                    <small>조장</small>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6" style={{ marginLeft: "80px" }}>
                <div className="team-item">
                  <div className="d-flex">
                    <div className="flex-shrink-0 d-flex flex-column align-items-center mt-4 pt-5" style={{ width: "75px" }}>
                      <a className="btn btn-square text-primary bg-white my-1" href=""><i className="fab fa-facebook-f"></i></a>
                      <a className="btn btn-square text-primary bg-white my-1" href=""><i className="fab fa-twitter"></i></a>
                      <a className="btn btn-square text-primary bg-white my-1" href=""><i className="fab fa-instagram"></i></a>
                      <a className="btn btn-square text-primary bg-white my-1" href=""><i className="fab fa-linkedin-in"></i></a>
                    </div>
                    <div className="position-relative">
                      <img className="img-fluid rounded w-100" src="img/testimonial-6.jpg" alt="" />
                      <img className="img-fluid rounded w-100 hover-image" src="img/back2.png" alt="" />
                    </div>
                  </div>
                  <div className="px-4 py-3">
                    <h5 className="fw-bold m-0">권도훈</h5>
                    <small>Backend</small>
                  </div>
                </div>
              </div>
            </div>
            {/* Second Row (3 items) */}
            <div className="row g-4" style={{ marginTop: "80px" }}>
              <div className="col-lg-4 col-md-6">
                <div className="team-item">
                  <div className="d-flex">
                    <div className="flex-shrink-0 d-flex flex-column align-items-center mt-4 pt-5" style={{ width: "75px" }}>
                      <a className="btn btn-square text-primary bg-white my-1" href=""><i className="fab fa-facebook-f"></i></a>
                      <a className="btn btn-square text-primary bg-white my-1" href=""><i className="fab fa-twitter"></i></a>
                      <a className="btn btn-square text-primary bg-white my-1" href=""><i className="fab fa-instagram"></i></a>
                      <a className="btn btn-square text-primary bg-white my-1" href=""><i className="fab fa-linkedin-in"></i></a>
                    </div>
                    <div className="position-relative">
                      <img className="img-fluid rounded w-100" src="img/testimonial-2.jpg" alt="" />
                      <img className="img-fluid rounded w-100 hover-image" src="img/back2.png" alt="" />
                    </div>
                  </div>
                  <div className="px-4 py-3">
                    <h5 className="fw-bold m-0">송효원</h5>
                    <small>Backend</small>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="team-item">
                  <div className="d-flex">
                    <div className="flex-shrink-0 d-flex flex-column align-items-center mt-4 pt-5" style={{ width: "75px" }}>
                      <a className="btn btn-square text-primary bg-white my-1" href=""><i className="fab fa-facebook-f"></i></a>
                      <a className="btn btn-square text-primary bg-white my-1" href=""><i className="fab fa-twitter"></i></a>
                      <a className="btn btn-square text-primary bg-white my-1" href=""><i className="fab fa-instagram"></i></a>
                      <a className="btn btn-square text-primary bg-white my-1" href=""><i className="fab fa-linkedin-in"></i></a>
                    </div>
                    <div className="position-relative">
                      <img className="img-fluid rounded w-100" src="img/testimonial-3.jpg" alt="" />
                      <img className="img-fluid rounded w-100 hover-image" src="img/back3.png" alt="" />
                    </div>
                  </div>
                  <div className="px-4 py-3">
                    <h5 className="fw-bold m-0">양호준</h5>
                    <small>AI</small>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="team-item">
                  <div className="d-flex">
                    <div className="flex-shrink-0 d-flex flex-column align-items-center mt-4 pt-5" style={{ width: "75px" }}>
                      <a className="btn btn-square text-primary bg-white my-1" href=""><i className="fab fa-facebook-f"></i></a>
                      <a className="btn btn-square text-primary bg-white my-1" href=""><i className="fab fa-twitter"></i></a>
                      <a className="btn btn-square text-primary bg-white my-1" href=""><i className="fab fa-instagram"></i></a>
                      <a className="btn btn-square text-primary bg-white my-1" href=""><i className="fab fa-linkedin-in"></i></a>
                    </div>
                    <div className="position-relative">
                      <img className="img-fluid rounded w-100" src="img/testimonial-1.jpg" alt="" />
                      <img className="img-fluid rounded w-100 hover-image" src="img/back2.png" alt="" />
                    </div>
                  </div>
                  <div className="px-4 py-3">
                    <h5 className="fw-bold m-0">이혜미</h5>
                    <small>Backend</small>
                  </div>
                </div>
              </div>
            </div>
            {/* Third Row (2 items) */}
            <div className="row g-4" style={{ marginTop: "80px" }}>
              <div className="col-lg-4 col-md-6" style={{ marginLeft: "15%" }}>
                <div className="team-item">
                  <div className="d-flex">
                    <div className="flex-shrink-0 d-flex flex-column align-items-center mt-4 pt-5" style={{ width: "75px" }}>
                      <a className="btn btn-square text-primary bg-white my-1" href=""><i className="fab fa-facebook-f"></i></a>
                      <a className="btn btn-square text-primary bg-white my-1" href=""><i className="fab fa-twitter"></i></a>
                      <a className="btn btn-square text-primary bg-white my-1" href=""><i className="fab fa-instagram"></i></a>
                      <a className="btn btn-square text-primary bg-white my-1" href=""><i className="fab fa-linkedin-in"></i></a>
                    </div>
                    <div className="position-relative">
                      <img className="img-fluid rounded w-100" src="img/testimonial-4.jpg" alt="" />
                      <img className="img-fluid rounded w-100 hover-image" src="img/back3.png" alt="" />
                    </div>
                  </div>
                  <div className="px-4 py-3">
                    <h5 className="fw-bold m-0">조민기</h5>
                    <small>AI</small>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6" style={{ marginLeft: "80px" }}>
                <div className="team-item">
                  <div className="d-flex">
                    <div className="flex-shrink-0 d-flex flex-column align-items-center mt-4 pt-5" style={{ width: "75px" }}>
                      <a className="btn btn-square text-primary bg-white my-1" href=""><i className="fab fa-facebook-f"></i></a>
                      <a className="btn btn-square text-primary bg-white my-1" href=""><i className="fab fa-twitter"></i></a>
                      <a className="btn btn-square text-primary bg-white my-1" href=""><i className="fab fa-instagram"></i></a>
                      <a className="btn btn-square text-primary bg-white my-1" href=""><i className="fab fa-linkedin-in"></i></a>
                    </div>
                    <div className="position-relative">
                      <img className="img-fluid rounded w-100" src="img/testimonial-7.jpg" alt="" />
                      <img className="img-fluid rounded w-100 hover-image" src="img/back4.png" alt="" />
                    </div>
                  </div>
                  <div className="px-4 py-3">
                    <h5 className="fw-bold m-0">전병찬</h5>
                    <small>데이터</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CoworkerContent;
