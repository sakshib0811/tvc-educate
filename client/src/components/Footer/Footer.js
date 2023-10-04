import React from "react";
import "./Footer.css";
import { CiFacebook, CiLinkedin } from 'react-icons/ci'
import { BsInstagram, BsTwitter } from 'react-icons/bs'
const Footer = () => {
  return (
    <footer>
      {/* <div className='gradientBreak'></div> */}
      <div className="foot-card">
        <div className="footer-hero">
          <p>TVC Educate<br />
            <span>By the Youth and For the Youth.</span></p>
        </div>
        <div className="footer-grid">
          <div className="feed-links">
            <a href="/">Home</a>
            <a href="/tags">Tags</a>
            <a href="/faq">FAQ</a>
            <a href="/about">About</a>
            <a href='/contact'>Contact</a>
          </div>
          <div className="feed-extra">
            <a href="/">Help</a>
            <a href="/">Blog</a>
            <a href='/'>Careers</a>
            <a href='/'>Privacy</a>
            <a href='/'>Terms</a>
          </div>
          <div className="footer-socials">
            <p className="socials">Our Socials</p>
            <div className="links">
              <a href="/"><CiFacebook className="fb" /></a>
              <a href="/"><BsInstagram className="ig" /></a>
              <a href="/"><CiLinkedin className="in" /></a>
              <a href="/"><BsTwitter className="tw" /></a>
            </div>

          </div>
        </div>
      </div>

      <div className="foot-label">
        {/* <hr className="foot-break" /> */}
        <p>Copyright © 2023-Present. All rights reserved </p>
      </div>
    </footer>
  );
};

export default Footer;

{/* <div className='allspanTag2'>
                    <span>Help </span>
                    <span> Status </span>
                    <span> Writers </span>
                    <span> Blog </span>
                    <span> Careers </span>
                    <span> Privacy </span>
                    <span> Terms</span>
                    <span> About</span>
                  </div> */}
{/* <p>
        DEV.from is a clone of{' '}
        <a href='https://dev.to/' className='hvr-underline'>
          DEV.to
        </a>{' '}
        (A constructive and inclusive social network for software developers)
      </p>
      <p>
        Made with love and{' '}
        <a href='https://github.com/facebook/react' className='hvr-underline'>
          React
        </a>
        .
      </p> */}