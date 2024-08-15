import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
import '../css/ReportContent.css'

const ReportContent = () => {
    const email = useSelector(state => state.user.email);
    const [quizData, setQuizData] = useState([]);
    const [concentrationData, setConcentrationData] = useState([]);
    const [transformedConcentrationData, setTransformedConcentrationData] = useState([]);
    const [topFocusLecture, setTopFocusLecture] = useState('');
    const [lowestScoreLecture, setLowestScoreLecture] = useState('');
    const [highFocusLecture, setHighFocusLecture] = useState('');
    const [highestScoreLecture, setHighestScoreLecture] = useState('');
    const [averageFocus, setAverageFocus] = useState(0);
    const [averageQuizScore, setAverageQuizScore] = useState(0);

    useEffect(() => {
        fetch(`https://allinone-spring.com/api/quiz/reports?email=${email}`)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    const formattedData = data.map(item => ({
                        lectureName: item.lectureName,
                        quiz_score: item.quiz_score
                    }));
                    setQuizData(formattedData);

                    const minScoreLecture = formattedData.reduce((prev, current) => {
                        return (prev.quiz_score < current.quiz_score) ? prev : current;
                    });
                    setLowestScoreLecture(minScoreLecture.lectureName);

                    const maxScoreLecture = formattedData.reduce((prev, current) => {
                        return (prev.quiz_score > current.quiz_score) ? prev : current;
                    });
                    setHighestScoreLecture(maxScoreLecture.lectureName);

                    const totalQuizScore = formattedData.reduce((sum, item) => sum + item.quiz_score, 0);
                    setAverageQuizScore(totalQuizScore / formattedData.length);
                } else {
                    setQuizData([]);
                    setLowestScoreLecture('N/A');
                    setHighestScoreLecture('N/A');
                    setAverageQuizScore(0);
                }
            })
            .catch(error => {
                console.error("Error fetching quiz data: ", error);
                setQuizData([]);
                setLowestScoreLecture('N/A');
                setHighestScoreLecture('N/A');
                setAverageQuizScore(0);
            });
    }, [email]);

    useEffect(() => {
        fetch(`https://allinone-spring.com/api/lecture-focus/focus?email=${email}`)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    const formattedData = data.map(item => ({
                        lectureName: item.lecture.lectureName,
                        userFocus: item.userFocus
                    }));
                    setConcentrationData(formattedData);

                    const transformedData = formattedData.map(item => ({
                        lectureName: item.lectureName,
                        userFocus: item.userFocus
                    }));
                    setTransformedConcentrationData(transformedData);

                    const maxFocusLecture = formattedData.reduce((prev, current) => {
                        return (prev.userFocus > current.userFocus) ? prev : current;
                    });
                    setTopFocusLecture(maxFocusLecture.lectureName);

                    const highFocusLecture = formattedData.reduce((prev, current) => {
                        return (prev.userFocus < current.userFocus) ? prev : current;
                    });
                    setHighFocusLecture(highFocusLecture.lectureName);

                    const totalTransformedFocus = transformedData.reduce((sum, item) => sum + item.userFocus, 0);
                    setAverageFocus(totalTransformedFocus / transformedData.length);
                } else {
                    setConcentrationData([]);
                    setTransformedConcentrationData([]);
                    setTopFocusLecture('N/A');
                    setHighFocusLecture('N/A');
                    setAverageFocus(0);
                }
            })
            .catch(error => {
                console.error("Error fetching focus data: ", error);
                setConcentrationData([]);
                setTransformedConcentrationData([]);
                setTopFocusLecture('N/A');
                setHighFocusLecture('N/A');
                setAverageFocus(0);
            });
    }, [email]);

    return (
        <div className="container-xxl py-5">
            <div className="container px-lg-5">
                <div className="row g-5">
                    <div className="col-12 text-center">
                        <h1 className="animated zoomIn custom-margin">학습 관리</h1>
                    </div>
                </div>

                {/* Concentration Section */}
                <div className="row g-5 mt-4">
                    <div className="col-lg-6 wow fadeInUp" data-wow-delay="0.1s">
                        <div className="section-title position-relative mb-4 pb-2">
                            <h2 className="mt-2">강의 집중도</h2>
                        </div>
                        <p className="mb-4">강의 중 웹캠으로 안구 움직임을 모니터링하며, <br></br>일정 시간 이상 눈을 감으면 집중도가 낮아진 것으로 판별합니다.</p>
                        <div className="row g-3">
                            <div className="col-sm-6">
                                <h6 className="mb-3"><i className="fa fa-check text-primary me-2"></i>실시간 집중도 모니터링</h6>
                                <h6 className="mb-0"><i className="fa fa-check text-primary me-2"></i>학습 참여도 향상</h6>
                            </div>
                            <div className="col-sm-6">
                                <h6 className="mb-3"><i className="fa fa-check text-primary me-2"></i>효율적인 학습 관리</h6>
                                <h6 className="mb-0"><i className="fa fa-check text-primary me-2"></i>즉각적 경고 및 조치</h6>
                            </div>
                        </div>

                        <div className="mt-4 p-4 bg-light rounded">
                            <h6 className="text-danger"><i className="fa fa-exclamation-circle me-2"></i>{topFocusLecture} 강의에 더 많은 집중이 필요합니다.</h6>
                            <h6 className="text-success"><i className="fa fa-check-circle me-2"></i>{highFocusLecture} 강의에서 가장 높은 집중력을 보였습니다!</h6>
                            <h6>강의 집중도 평균: {averageFocus.toFixed(2)}</h6>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart data={transformedConcentrationData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                                <XAxis dataKey="lectureName" tick={{ fill: '#000' }} />
                                <YAxis tick={{ fill: '#000' }} domain={[0, 110]} ticks={[0, 20, 40, 60, 80, 100]} />
                                <Tooltip contentStyle={{ backgroundColor: '#fff', border: 'none', borderRadius: '10px' }} formatter={(value, name) => [`강의 집중도: ${value}`]} />
                                <Legend align="center" layout="horizontal" formatter={() => <span style={{ color: '#ff2e16' }}>강의 집중도</span>} />
                                <Bar dataKey="userFocus" fill="url(#colorUv)">
                                    <LabelList dataKey="userFocus" position="top" style={{ fill: '#ff2e16' }} />
                                </Bar>
                                <defs>
                                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ff2e16" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#ff2e16" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Quiz Section */}
                <div className="row g-5 mt-5">
                    <div className="col-lg-6 wow fadeInUp" data-wow-delay="0.1s">
                        <div className="section-title position-relative mb-4 pb-2">
                            <h2 className="mt-2">학습 평가</h2>
                        </div>
                        <p className="mb-4">강의 학습 후 학습 평가를 위해 퀴즈를 제공합니다. <br></br>학습이 부족한 경우 틀린 부분에 대한 학습 영상을 제공합니다.</p>
                        <div className="row g-3">
                            <div className="col-sm-6">
                                <h6 className="mb-3"><i className="fa fa-check text-primary me-2"></i>퀴즈 제공</h6>
                                <h6 className="mb-0"><i className="fa fa-check text-primary me-2"></i>통과/재시험</h6>
                            </div>
                            <div className="col-sm-6">
                                <h6 className="mb-3"><i className="fa fa-check text-primary me-2"></i>학습 타임라인</h6>
                                <h6 className="mb-0"><i className="fa fa-check text-primary me-2"></i>부족한 부분 재학습</h6>
                            </div>
                        </div>
                        <div className="mt-4 p-4 bg-light rounded">
                            <h6 className="text-danger" style={{ color: '#ff2e16' }}><i className="fa fa-exclamation-circle me-2"></i>{lowestScoreLecture} 강의를 다시 복습하여 이해도를 높이세요.</h6>
                            <h6 className="text-success" style={{ color: '#82ca9d' }}><i className="fa fa-check-circle me-2"></i>{highestScoreLecture} 강의 점수가 가장 높습니다!</h6>
                            <h6>퀴즈 점수 평균: {averageQuizScore.toFixed(2)}</h6>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <ResponsiveContainer width="100%" height={400}>
                            <LineChart data={quizData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                                <XAxis dataKey="lectureName" tick={{ fill: '#000' }} />
                                <YAxis tick={{ fill: '#000' }} domain={[0, 110]} ticks={[0, 20, 40, 60, 80, 100]} />
                                <Tooltip contentStyle={{ backgroundColor: '#fff', border: 'none', borderRadius: '10px' }} formatter={(value, name) => [`퀴즈 점수: ${value}`]} />
                                <Legend align="center" layout="horizontal" formatter={() => "퀴즈 점수"} />
                                <Line type="monotone" dataKey="quiz_score" stroke="#82ca9d" strokeWidth={2} dot={{ r: 5 }}>
                                    <LabelList dataKey="quiz_score" position="top" style={{ fill: '#82ca9d' }} />
                                </Line>
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportContent;
