import React from 'react';
import { Link } from 'react-router-dom';

const Welcome = () => {
  return (
    <div className='welcome'>
      <h2 className='welcome__title'>Welcome to TVC Educate</h2>
      <p className='welcome__slogan'>
        <Link to='/'>TVC Educate</Link> is a community of amazing
        students sharing the same platform!
      </p>
    </div>
  );
};

export default Welcome;
