import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import '../css/AboutContent.css';

const AboutContent = () => {
  const email = useSelector(state => state.user.email);
  const [selectedTitle, setSelectedTitle] = useState('example1');

  const handleTitleClick = (title) => {
    setSelectedTitle(title);
  };

  const descriptions = {
    example1: '챗봇을 통해 실시간으로 학습에 대한 질문을 하고 답변을 받을 수 있습니다.',
    example2: '타임라인을 통해 학습 진행 상황을 확인하고 중요한 이벤트를 추적할 수 있습니다.',
    example3: '북마크 기능을 사용하여 중요한 학습 자료를 쉽게 찾아볼 수 있습니다.',
    example4: 'Open AI Whisper를 사용하여 영상의 음성에서 대본을 추출합니다.',
    example5: 'CLOVA OCR을 사용하여 영상을 프레임 단위로 캡쳐하여 텍스트를 검출합니다.',
    example6: '얼굴, 눈 위치를 탐지하여 눈을 일정시간 감고 있을 경우 강의 집중도가 낮은 것으로 판단합니다.'
  };

  const images = {
    example1: "../img/chatbot_example.png",
    example2: "../img/timeline_example.png",
    example3: "../img/bookmark_example.png",
    example4: "../img/chatbot_example.png",
    example5: "../img/timeline_example.png",
    example6: "../img/bookmark_example.png"
  };

  return (
    <div className="about-container">
      <div className="row">

        {/* Main Content */}
        <div className="col-lg-12">
          <div className="about-content">
            <div className="row g-5">
              <div className="col-12 text-center">
                <h1 className="animated zoomIn custom-margin">
                  <span className="blue-letter">A</span>ll-
                  <span className="blue-letter">I</span>n-
                  <span className="blue-letter">One</span>
                </h1>
                <h4 className="animated zoomIn">AI One 모든 학습 지원 기능을 단 한 번에 !</h4>
                <h6 className="animated zoomIn"></h6>
              </div>
            </div>

            {/* About Section */}
            <div className="row g-5 mt-4" id="about">
              <div className="col-12 wow fadeInUp" data-wow-delay="0.1s">
                <div className="section-title position-relative mb-4 pb-2">
                  <h2 className="mt-2">주요 기능 소개</h2>
                </div>
                <p className="mb-4">단 한 번의 영상 업로드로 학습 지원 기능을 한 번에 !</p>

                {/* Add Image Here */}
                <div className="text-center mt-4">
                  <img
                    src="../img/primary.png"
                    alt="Key Features"
                    className="img-fluid"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <div className="row g-5 mt-4" id="contact">
              <div className="col-12 wow fadeInUp" data-wow-delay="0.1s">
                <div className="section-title position-relative mb-4 pb-2">
                  <h2 className="mt-1">강의 화면 기능</h2>
                </div>

                <div className="row">
                  {/* Left Side Titles */}
                  <div className="col-lg-4" id = "lecture-function">
                    <ul id='function-list'>
                      <li
                        onClick={() => handleTitleClick('example1')}
                        className={selectedTitle === 'example1' ? 'selected' : ''}
                      >
                        <h3>챗봇</h3>
                        <div className="description">{descriptions['example1']}</div>
                      </li>
                      <li
                        onClick={() => handleTitleClick('example2')}
                        className={selectedTitle === 'example2' ? 'selected' : ''}
                      >
                        <h3>타임라인</h3>
                        <div className="description">{descriptions['example2']}</div>
                      </li>
                      <li
                        onClick={() => handleTitleClick('example3')}
                        className={selectedTitle === 'example3' ? 'selected' : ''}
                      >
                        <h3>북마크</h3>
                        <div className="description">{descriptions['example3']}</div>
                      </li>
                    </ul>
                  </div>

                  {/* Right Side Image */}
                  <div className="right-img">
                    <div className="image-container">
                      <TransitionGroup>
                        <CSSTransition
                          key={selectedTitle}
                          timeout={500}
                          classNames="fade"
                        >
                          <img
                            src={images[selectedTitle]}
                            alt="Selected Feature"
                            className="img-fluid"
                            style={{ width: '90%' }}
                            id="function-img-fluid"
                          />
                        </CSSTransition>
                      </TransitionGroup>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Features Section */}
            <div className="row g-5 mt-4" id="features">
              <div className="col-12 wow fadeInUp" data-wow-delay="0.1s">
                <div className="section-title position-relative mb-4 pb-2">
                  <h2 className="mt-4">기대 효과</h2>
                </div>
                <div className="text-center mt-4">
                  <img
                    src="../img/expected_effect.png"
                    alt="Key Features"
                    className="img-fluid"
                    style={{ width: '95%'}}
                  />
                </div>
              </div>
            </div>
            {/* AI Model Section */}
             <div className="row g-5 mt-4" id="ai-model">
               <div className="col-12 wow fadeInUp" data-wow-delay="0.1s">
                 <div className="section-title position-relative mb-4 pb-2">
                   <h2 className="mt-1">AI 모델</h2>
                 </div>

                 <div className="row">
                   {/* Titles */}
                   <div className="col-12 text-center">
                     <ul id='function-list'>
                       <li
                         onClick={() => handleTitleClick('example4')}
                         className={selectedTitle === 'example4' ? 'selected' : ''}
                         style={{ display: 'inline-block', margin: '0 20px' }}
                       >
                         <h3>STT</h3>
                         <div className="description">{descriptions['example4']}</div>
                       </li>
                       <li
                         onClick={() => handleTitleClick('example5')}
                         className={selectedTitle === 'example5' ? 'selected' : ''}
                         style={{ display: 'inline-block', margin: '0 20px' }}
                       >
                         <h3>OCR</h3>
                         <div className="description">{descriptions['example5']}</div>
                       </li>
                       <li
                         onClick={() => handleTitleClick('example6')}
                         className={selectedTitle === 'example6' ? 'selected' : ''}
                         style={{ display: 'inline-block', margin: '0 20px' }}
                       >
                         <h3>강의 집중도</h3>
                         <div className="description">{descriptions['example6']}</div>
                       </li>
                     </ul>
                   </div>

                   {/* Image */}
                   <div className="col-12 text-center">
                     <div className="image-container">
                       <TransitionGroup>
                         <CSSTransition
                           key={selectedTitle}
                           timeout={500}
                           classNames="fade"
                         >
                           <img
                             src={images[selectedTitle]}
                             alt="Selected Feature"
                             className="img-fluid"
                             style={{ width: '90%' }}
                           />
                         </CSSTransition>
                       </TransitionGroup>
                     </div>
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

export default AboutContent;
