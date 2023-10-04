import "./Quiz.css";
import React from "react";
import { useHistory } from "react-router-dom";
import { useEffect } from "react";
import categories from "./questions";
const QuizHome = () => {
  const history = useHistory();
  const handleCategorySelect = (slug) => {
    history.push(`/quiz/${slug}`);
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="back">
      <div className="card">
        <h1 className="home-title">Welcome to the Quiz Page</h1>
        <p className="home-subtext">Select a category to start the quiz:</p>
        <div className="categories">
          {categories[0].categories.map((category) => (
            <div
              key={category.name}
              className="home-list"
              onClick={() => handleCategorySelect(category.name)}
            >
              <h2 className="home-names">{category.name}</h2>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizHome;
