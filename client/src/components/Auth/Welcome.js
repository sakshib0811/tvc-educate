import React from "react";
import { Link } from "react-router-dom";

const Welcome = () => {
  return (
    <div className="welcome">
      <h2 className="welcome__title">TVC Educate</h2>
      <p className="welcome__slogan">
        <Link to="/">TVC Educate</Link> is a platform for you to learn and grow.
      </p>
    </div>
  );
};

export default Welcome;
