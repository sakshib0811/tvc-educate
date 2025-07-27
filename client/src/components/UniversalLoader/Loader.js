import React from 'react';
import './Loader.css';

const Loader = () => {
  return (
    <div className="loader-overlay">
      <div className="loader-spinner">
        <div className="spinner"></div> 
      </div>
    </div>
  );
};

export default Loader;