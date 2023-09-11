import React from "react";
import "./Trending.css";
import { useNavigate } from "react-router-dom";
function Trending() {
  const Navigate = useNavigate();
  const handleOnClick = () => {
    Navigate("/", { replace: true });
  };
  return (
    <div className="main-container">
      <div className="hero-element">
        <p
          className="title-intro"
          style={{ color: "white", textAlign: "center" }}
          onClick={handleOnClick}
        >
          Welcome to TVC EDUCATE Admin Panel
        </p>
        <p style={{ color: "gray", textAlign: "center" }}>
          One Stop destination to Handle TVC EDUCATE Web Application
        </p>
      </div>
    </div>
  );
}

export default Trending;
