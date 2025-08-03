import React, { useState, useContext, useRef } from "react";
import "./LandingPage.css";
import { Link } from "react-router-dom";
import { ThemeContexts } from "../../context/ThemeContexts";
import { bodyShortener, formatDate, readingTime } from "../../utils";
import { useData } from "../../context/data/DataContext";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  BsFillArrowLeftCircleFill,
  BsFillArrowRightCircleFill,
} from "react-icons/bs";
import { SlCalender } from "react-icons/sl";

const LandingPage = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
 // const [hoverClass, setHoverClass] = useState([]);
  const [trendingHover, setTrendingHover] = useState([]);
  const [idx, setIdx] = useState(0);
  const [scroll, setScroll] = useState({
    scrollLeft: false,
    scrollRight: true,
  });
  const [filter, setFilter] = useState("");

  const { handleChangeTheme } = useContext(ThemeContexts);
  const { tags, isLoading, error, getApprovedPosts, getPostsByTag } = useData();
  
  const cardsSectionRef = useRef();
  const parentContainerRef = useRef();

  // Custom arrow component for carousel
  const MutatedArrow = ({ className = "", onClick, prev = false }) => {
    return prev ? (
      <BsFillArrowLeftCircleFill
        className={className}
        onClick={onClick}
        style={{
          color: "var(--color-primary)",
          width: "35px",
          position: "absolute",
          height: "35px",
          left: "-50px",
        }}
        aria-label="Previous slide"
      />
    ) : (
      <BsFillArrowRightCircleFill
        className={className}
        onClick={onClick}
        style={{
          color: "var(--color-primary)",
          width: "35px",
          position: "absolute",
          height: "35px",
          right: "-50px",
        }}
        aria-label="Next slide"
      />
    );
  };

  // Scroll functions for tag navigation
  const scrollLeft = () => {
    const parentContainerWidth = parentContainerRef.current?.clientWidth;

    if (cardsSectionRef.current && parentContainerWidth) {
      setIdx((prev) => {
        if (prev === 0) {
          setScroll((prev) => ({ ...prev, scrollLeft: false }));
          return prev;
        } else {
          const newIndex = prev - 1;
          cardsSectionRef.current.style.transform = `translateX(-${parentContainerWidth * newIndex}px)`;
          if (newIndex === 0) {
            setScroll((prev) => ({ ...prev, scrollLeft: false }));
          }
          return newIndex;
        }
      });

      setScroll((prev) => ({ ...prev, scrollRight: true }));
    }
  };

  const scrollRight = () => {
    const movableContainerWidth = cardsSectionRef.current?.clientWidth;
    const parentContainerWidth = parentContainerRef.current?.clientWidth;

    if (cardsSectionRef.current && parentContainerWidth) {
      setIdx((prev) => {
        const nextIdx = prev + 1;

        if (nextIdx * parentContainerWidth >= movableContainerWidth) return prev;

        if (movableContainerWidth - nextIdx * parentContainerWidth < parentContainerWidth) {
          cardsSectionRef.current.style.transform = `translateX(-${movableContainerWidth - parentContainerWidth}px)`;
          setScroll((prev) => ({ ...prev, scrollRight: false }));
        } else {
          cardsSectionRef.current.style.transform = `translateX(-${nextIdx * parentContainerWidth}px)`;
        }

        setScroll((prev) => ({ ...prev, scrollLeft: true }));
        return nextIdx;
      });
    }
  };

  // Filter approved posts
  const approvedPosts = getApprovedPosts();
  const filteredPosts = filter ? getPostsByTag(filter) : approvedPosts;

  // Carousel settings
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    swipeToSlide: true,
    nextArrow: <MutatedArrow />,
    prevArrow: <MutatedArrow prev="true" />,
    className: "carouselContainer",
    responsive: [
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 580,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const postsToRender = filteredPosts.length > 0 ? filteredPosts : approvedPosts;

  // Handle trending card hover
  const handleTrendingHover = (index, isHovering) => {
    setTrendingHover(prev => {
      const newArray = [...prev];
      if (newArray[index]) {
        newArray[index].hoverClass = isHovering;
      }
      return newArray;
    });
  };

  // Error state
  if (error) {
    return (
      <div className="center" style={{ minHeight: "50vh", flexDirection: "column" }}>
        <h2>Something went wrong!</h2>
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="btn btn--primary"
          style={{ marginTop: "1rem" }}
        >
          Try Again
        </button>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="center" style={{ minHeight: "50vh" }}>
        <div className="loading"></div>
      </div>
    );
  }

  return (
    <>
      <section className="homeContainer">
        <div className="homeSection">
          <Slider {...settings}>
            {approvedPosts.length > 0 ? 
              approvedPosts.slice(0, 8).map((post, index) => {
                const date = formatDate(post.date);
                return (
                  <Link key={(post.id + idx) || index} to={`/posts/${post.id}`}>
                    <div className="carouselWrapper">
                      <img 
                        src={post.image} 
                        className="carouselImage" 
                        alt={`${post.title} - Featured post`}
                        loading="lazy"
                      />
                      <div className="gradientBreak" />
                      <div className="slideDescription">
                        <span className="slideTag">
                          #{post.tags?.[0]?.name || 'general'}
                        </span>
                        <p className="slideTitle">{post.title}</p>
                        <span className="slideAuthor">
                          By {post.author?.name || 'Anonymous'}
                        </span>
                        <span className="slideDate">
                          <SlCalender /> {date}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              }) : (
                <div className="center" style={{ padding: "2rem" }}>
                  <p>No featured posts available</p>
                </div>
              )
            }
          </Slider>
        </div>
      </section>
      
      <hr className="hr-tag" />

      <section className="trendingSection">
        <div className="trendingPart">
          <p className="headingTitle-trending">TRENDING ON TVC EDUCATE</p>
          <div className="myRowFlex">
            {approvedPosts.length > 0
              ? approvedPosts.slice(0, 6).map((post, i) => {
                  const date = formatDate(post.date);
                  const readingDuration = readingTime(post.body);

                  return (
                    <div
                      className="col4gy3row"
                      key={post._id + i}
                      onMouseEnter={() => handleTrendingHover(i, true)}
                      onMouseLeave={() => handleTrendingHover(i, false)}
                    >
                      <div className="previewAuthorTrending">
                        <div className="author__image">
                          <img
                            src={post.author?.avatar || '/default-avatar.png'}
                            alt={`${post.author?.name || 'Author'} avatar`}
                            loading="lazy"
                          />
                        </div>
                        <div
                          className={`authorDetailsTrending ${
                            trendingHover[i]?.hoverClass ? "lp" : "no-lp"
                          }`}
                        >
                          <p
                            className={`authorName ${
                              trendingHover[i]?.hoverClass ? "lp" : "no-lp"
                            }`}
                          >
                            {post.author?.name || 'Anonymous'}
                          </p>
                          <p
                            className={`authorDate ${
                              trendingHover[i]?.hoverClass ? "lp" : "no-lp"
                            }`}
                          >
                            {date}
                          </p>
                        </div>
                      </div>
                      <img
                        className="trendingImg"
                        src={post.image}
                        alt={`${post.title} - Trending post`}
                        loading="lazy"
                      />
                      <div className="trendingCardTitle">
                        <Link
                          onClick={() => handleChangeTheme(5)}
                          style={{ textDecoration: "none" }}
                          to={`/posts/${post.id}`}
                        >
                          <div className="authHeading">
                            <p
                              className={`trendingTitle authorTitle ${
                                trendingHover[i]?.hoverClass ? "lp" : "no-lp"
                              }`}
                            >
                              {post.title}
                            </p>
                          </div>
                          <span
                            className={`${
                              trendingHover[i]?.hoverClass ? "lp" : "no-lp"
                            }`}
                          >
                            {readingDuration}
                          </span>
                        </Link>
                      </div>
                      <div className="trendingCta">
                        <Link to={`/posts/${post.id}`}>
                          <div className="learnMoreTrending">
                            Learn More
                          </div>
                        </Link>
                        <div className="shareTrending">SHARE</div>
                      </div>
                    </div>
                  );
                })
              : (
                <div className="center" style={{ padding: "2rem" }}>
                  <p>No trending posts available</p>
                </div>
              )
            }
          </div>
        </div>
      </section>
      
      <hr className="hr-tag" />

      <section className="blogSection">
        <div className="allBlogs">
          <div className="leftBlogSection">
            <div className="ctaSection">
              <p className="headingTitle-all-blogs">EXPLORE!</p>
              <h6>DISCOVER MORE OF WHAT MATTERS TO YOU</h6>
              <div className="allBlogTypesFirst" ref={parentContainerRef}>
                <div ref={cardsSectionRef} className="allspanTag">
                  <div
                    className="ctaTags"
                    onClick={() => setFilter("")}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        setFilter("");
                      }
                    }}
                  >
                    all
                  </div>
                  {tags.slice(0, 30).map((tag) => (
                    <div
                      className="ctaTags"
                      key={tag._id}
                      onClick={() => setFilter(tag.name)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          setFilter(tag.name);
                        }
                      }}
                    >
                      {tag.name}
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  className={`button prevButton ${!scroll.scrollLeft && 'displayNone'}`}
                  onClick={scrollLeft}
                  aria-label="Scroll tags left"
                >
                  <MdNavigateBefore className="buttonIcons" />
                </button>

                <button
                  type="button"
                  className={`button nextButton ${!scroll.scrollRight && 'displayNone'}`}
                  onClick={scrollRight}
                  aria-label="Scroll tags right"
                >
                  <MdNavigateNext className="buttonIcons" />
                </button>
              </div>
            </div>

            {postsToRender.length > 0 ? (
              postsToRender.map((post, idx) => {
                const date = formatDate(post.date);
                const readingDuration = readingTime(post.body);
                const shortenedBody = bodyShortener(post.body);
                const isHovered = hoveredIndex === idx;

                return (
                  <div
                    key={post._id + idx}
                    className={`col4gy3row02 ${isHovered ? "hovered" : ""}`}
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <div className="colis1002">
                      <Link to={`/posts/${post.id}`}>
                        <div className="preview__author ml--1">
                          <div className="author__image">
                            <img 
                              src={post.author?.avatar || '/default-avatar.png'} 
                              alt={`${post.author?.name || 'Author'} avatar`}
                              loading="lazy"
                            />
                          </div>
                          <div className="author__details">
                            <p className="author__name">
                              {post.author?.name || 'Anonymous'}
                            </p>
                            <p className="author__date">{date}</p>
                          </div>
                        </div>

                        <div className="authHeading02">
                          <p className="authorTitle02">{post.title}</p>
                          <p className="authSubHed02">{shortenedBody}</p>
                        </div>
                      </Link>

                      <div className="authDaTiSt02">
                        <span>{post.userBlogDate} ·</span>
                        <span>{readingDuration}</span>
                        <span className="mx-1">·</span>
                        <span className={`mx-1 ${isHovered ? "userTagHover" : "userBlogTag"}`}>
                          {post.tags?.[0]?.name || 'general'}
                        </span>
                      </div>
                    </div>

                    <div className="colis202">
                      <img 
                        src={post.image} 
                        alt={`${post.title} - Blog post`}
                        loading="lazy"
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="center" style={{ padding: "2rem" }}>
                <p>No posts available for the selected filter</p>
              </div>
            )}
          </div>
          
          <div className="rightBlogSection">
            <div className="allBlogTypes">
              <div className="quizCard">
                <img
                  className="quizCardImg"
                  alt="Take our online quiz"
                  src="https://i.postimg.cc/xCVwb1yy/depositphotos-127600950-stock-photo-inscription-on-smartphone-screen.webp"
                  loading="lazy"
                />
                <div className="gradientBreak"></div>
                <div className="quizCta">
                  <h2>Take the Online Quiz Now!</h2>
                  <div className="quizButton">
                    <Link to="/quiz">
                      <p className="quiz-btn-text">Click here</p>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default LandingPage;
