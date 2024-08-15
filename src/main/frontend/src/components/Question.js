import React from 'react';

const Question = ({ question, options, handleAnswer }) => {
    return (
        <div className="question">
            <h2>{question}</h2>
            <div className="options">
                {options.map(option, index) => (
                    <label key={index}>
                        <input
                            type="radio"
                            name="option"
                            value={option}
                            onChange={() => handleAnswer(option)} />
                        {option}
                    </label>
                ))}
            </div>
        </div>
        );
    };
export default Question;
