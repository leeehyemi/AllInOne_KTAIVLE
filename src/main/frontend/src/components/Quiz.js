import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../css/Quiz.module.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Quiz = () => {
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const navigate = useNavigate();
  const email = useSelector(state => state.user.email);
  const location = useLocation();
  const lectureName = new URLSearchParams(location.search).get('lectureName');

  useEffect(() => {
      console.log('User email from Redux:', email);  // null값인지 아닌지 확인용
  }, [email]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get('https://allinone-spring.com/api/questions', {
            params: {
                lectureName: lectureName
            }
        });
        setQuestions(response.data);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };
    if(lectureName) {
        fetchQuestions();
    }

  }, [lectureName]);

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleNextQuestion = async () => {
      const currentQuestion = questions[currentQuestionIndex];
      const isCorrect = selectedOption === currentQuestion.answer;
      const newScore = isCorrect ? score + 10 : score;

      const updatedAnswer = [...answers];
      updatedAnswer[currentQuestionIndex] = {selectedOption, isCorrect};
      setAnswers(updatedAnswer)

      if (isCorrect) {
          setScore(newScore);
      }

      const payload = {
          email: email,
          question_id: currentQuestion.questionId,
          lecture_id: currentQuestion.lecture.lecture_id,
          user_answer: selectedOption,
          correct: isCorrect,
          quiz_score: newScore
      };

      console.log('Payload to be sent:', payload);  // 전달되는 내용 확인용

      // 퀴즈 결과 저장
      try {
          await axios.post('https://allinone-spring.com/api/quiz/results', payload);
      } catch (error) {
          console.error('Failed to save quiz result:', error);
      }

      setSelectedOption('');
      if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
          setShowResult(true);
      }
  };

  const handlePrevQuestion = () => {
    const previousQuestion = questions[currentQuestionIndex - 1];
    const previousAnswer = answers[currentQuestionIndex - 1];

    if(previousAnswer && previousAnswer.isCorrect) {
        setScore(score - 10);
    }

    setSelectedOption(previousAnswer ? previousAnswer.selectedOption : '');
    setCurrentQuestionIndex(currentQuestionIndex - 1);
  };

  const handleRestart = () => {
    setQuizStarted(false);
    setCurrentQuestionIndex(0);
    setSelectedOption('');
    setScore(0);
    setAnswers([]);
    setShowResult(false);
  };

  const handleLectureNavigation = () => {
    navigate('/lectures');
  };

  return (
    <div className={styles.quizContainer}>
      {!quizStarted ? (
        <button className={styles.startButton} onClick={() => setQuizStarted(true)}>
          Start Quiz
        </button>
      ) : showResult ? (
        <div className={styles.resultCard}>
          <img className={styles.scoreimg} src="../img/score2.png"></img>
          <p className={styles.scoreText}>{score} / {questions.length * 10}</p>
          <button className={styles.lectureButton} onClick={handleLectureNavigation}>강의실</button>
        </div>
      ) : (
        <div className={styles.quizBox}>
          <div className={styles.questionHeader}>
            <span className={styles.questionIndex}>{currentQuestionIndex + 1} / {questions.length}</span>
            <button className={styles.closeButton} onClick={handleRestart}></button>
          </div>
          <h3 className={styles.questionText}>{questions[currentQuestionIndex].question}</h3>
          <div className={styles.optionsContainer}>
            {questions[currentQuestionIndex].options.split(', ').map((option, index) => (
              <div key={index} className={styles.option}>
                <input
                  type="radio"
                  id={`option-${index}`}
                  name="option"
                  value={option}
                  checked={selectedOption === option}
                  onChange={handleOptionChange}
                />
                <label className={styles.quiz_option} htmlFor={`option-${index}`}>{option}</label>
              </div>
            ))}
          </div>
          <div className={styles.navigationButtons}>
            {currentQuestionIndex > 0 ? (
              <button
                className={styles.prevButton}
                onClick={handlePrevQuestion}
              >
                Previous
              </button>
            ) : (
                <div style={{ width: '135px' }}></div>
            )}
            <button
              className={styles.nextButton}
              onClick={handleNextQuestion}
              disabled={!selectedOption}
            >
              {currentQuestionIndex < questions.length - 1 ? 'Next' : 'Finish'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quiz;
