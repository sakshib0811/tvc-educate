import React from "react";
import "./Nav.css";
import CardComponent from "../Card/CardComponent";
import { useNavigate } from "react-router-dom";

function Nav() {
  const Navigate = useNavigate();
  const handleClick = () => {
    Navigate("/carousal", { replace: true });
  };
  const Navigate1 = useNavigate();
  const handleOnClick = () => {
    Navigate1("/trending", { replace: true });
  };

  return (
    <div className="main-container">
      <div className="hero">
        <p className="title" style={{ color: "white" }}>
          Welcome to TVC EDUCATE Admin Panel
        </p>
        <p style={{ color: "gray" }}>
          One Stop destination to Handle TVC EDUCATE Web Application
        </p>
      </div>
      <div className="card-conatiner">
        <div onClick={handleClick}>
          <CardComponent
            title="Change Carousal"
            descp="Here you can change the Carousal Image on Landing Page."
            emoji={1}
          />
        </div>
        <div onClick={handleOnClick}>
          <CardComponent
            title="Trending article"
            descp="Here you can change the trending article as per your choice."
            emoji={2}
          />
        </div>
      </div>
      <div className="card-conatiner second-coloum">
        <div>
          <CardComponent
            title="Landing Page Quiz"
            descp="Here you can change the Quiz Questions as per your choice."
            emoji={3}
          />
        </div>
        <div>
          <CardComponent
            title="Validate Article"
            descp="Verify article aligns with guidelines prior to granting publication approval."
            emoji={4}
          />
        </div>
      </div>
    </div>
  );
}

export default Nav;
