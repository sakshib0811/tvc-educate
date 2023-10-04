import "./Quiz.css";
import React from "react";
import { useLocation, useHistory } from "react-router-dom";
import { useEffect } from "react";
const QuizResults = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const selectedCategory = queryParams.get("category");
  const history = useHistory();
  const { questions, userAnswers, score } = location.state;
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="back">
      <div className="card">
        <h2 className="result-title">Quiz Results</h2>
        <p className="result-subtext">
          Congratulations! You&apos;ve completed the {selectedCategory} quiz.
        </p>
        <p className="final-score">
          Your final score is: {score} out of {questions.length}
        </p>
        <div className="feedback-card">
          <h3>Feedback:</h3>
          {questions.map((question, index) => (
            <div key={index} className="question-card">
              <p className="q-num">Question {index + 1}:</p>
              <p>{question.text}</p>
              <p className="correct">
                Correct Answer: {question.correctAnswer}
              </p>
              <p className="answer">Your Answer: {userAnswers[index]}</p>
            </div>
          ))}
        </div>
        <div className="result-button">
          <button onClick={() => history.push("/quiz")}>
            Return to Homepage
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizResults;
