import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Chart from 'chart.js/auto';
import '../css/ProgressSection.css';

const ProgressSection = () => {
    const [progressData, setProgressData] = useState([]);
    const email = useSelector(state => state.user.email);

    useEffect(() => {
        const fetchProgressData = async () => {
            try {
                const response = await axios.get('https://allinone-spring.com/api/lecture-progress', {
                    params: { email: email }
                });
                setProgressData(response.data);
            } catch (error) {
                console.error('Failed to fetch progress data:', error.message);
            }
        };

        if (email) {
            fetchProgressData();
        }
    }, [email]);

    useEffect(() => {
        progressData.forEach((item, index) => {
            const chartId = `chart${index + 1}`;
            const ctx = document.getElementById(chartId);

            if (ctx) {
                const existingChart = Chart.getChart(ctx);
                if (existingChart) {
                    existingChart.destroy();
                }

                new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        datasets: [{
                            data: [item.userProgress, 100 - item.userProgress],
                            backgroundColor: [
                                getProgressColor(item.userProgress),
                                '#e9ecef'
                            ],
                            borderWidth: 0
                        }]
                    },
                    options: {
                        cutout: '70%',
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                display: false
                            },
                            tooltip: {
                                enabled: false
                            }
                        }
                    },
                    plugins: [{
                        beforeDraw: function(chart) {
                            const width = chart.width,
                                height = chart.height,
                                ctx = chart.ctx;
                            ctx.restore();
                            const fontSize = (height / 114).toFixed(2);
                            ctx.font = fontSize + "em sans-serif";
                            ctx.textBaseline = "middle";
                            const text = `${item.userProgress}%`,
                                textX = Math.round((width - ctx.measureText(text).width) / 2),
                                textY = height / 2;
                            ctx.fillText(text, textX, textY);
                            ctx.save();
                        }
                    }]
                });
            }
        });
    }, [progressData]);

    const getProgressColor = (progress) => {
        if (progress <= 33) {
            return '#87ceeb';
        } else if (progress <= 66) {
            return '#007bff';
        } else {
            return '#2a52be';
        }
    };

    return (
        <div className="col-md-6">
            <div className="section-box">
                <div className="section-header">
                    <h6 className="section-title">학습진도</h6>
                </div>
                <div className="progress-list">
                    {progressData.length > 0 ? (
                        progressData.map((item, index) => (
                            <ProgressItem
                                key={item.lectureId}
                                title={item.lectureName}
                                percentage={item.userProgress}
                                chartId={`chart${index + 1}`}
                            />
                        ))
                    ) : (
                        <p style={{color:"black"}}>학습을 시작 해주세요!</p>
                    )}
                </div>
            </div>
        </div>
    );
};

const ProgressItem = ({ title, percentage, chartId }) => (
    <div className="progress-item">
        <div className="progress-chart">
            <canvas id={chartId}></canvas>
        </div>
        <div className="progress-info">
            <span className="course-title">{title}</span>
            <span className="progress-percentage">
                {percentage < 100 ? `학습중` : '학습완료'}
            </span>
        </div>
    </div>
);

export default ProgressSection;
