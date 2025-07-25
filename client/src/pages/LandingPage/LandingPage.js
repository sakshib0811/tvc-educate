import React, { useEffect, useState } from "react";
import "./LandingPage.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { useContext } from "react";
import { ThemeContexts } from "../../context/ThemeContexts";
// import { AuthorInfo } from "../../components/AuthorInfo/AuthorInfo";
import { baseURL, bodyShortener, formatDate, readingTime } from "../../utils";
// import { Carousel } from "react-responsive-carousel";
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
import { UtilityContext } from "../../App";

const LandingPage = () => {
  const [addTask, setAddTask] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { handleChangeTheme } = useContext(ThemeContexts);
  const [tags, setTags] = useState([]);
  const [hoverClass, setHoverClass] = useState([]);
  const [trendingHover, setTrendingHover] = useState([]);
  const [idx, setIdx] = useState(0);
  console.log(idx);
  const [scroll, setScroll] = useState({
    scrollLeft: false,
    scrollRight: true,
  });
  const [filter, setFilter] = useState("");
  const { isMobile } = React.useContext(UtilityContext);
  console.log(isMobile);

  const MutatedArrow = ({ className = "", onClick, prev = false }) => {
    return prev ? (
      <BsFillArrowLeftCircleFill
        className={className}
        onClick={onClick}
        style={{
          color: "rgb(1, 66, 122)",
          width: "35px",
          position: "absolute",
          height: "35px",
          left: "-50px",
        }}
      />
    ) : (
      <BsFillArrowRightCircleFill
        className={className}
        onClick={onClick}
        style={{
          color: "rgb(1, 66, 122)",
          width: "35px",
          position: "absolute",
          height: "35px",
          right: "-50px",
        }}
      />
    );
  };



  let cardsSectionRef = React.useRef();

  let parentContainerRef = React.useRef();

  // let cardsSectionRefTrendingSection = React.useRef();

  // let parentContainerRefTrendingSection = React.useRef();

  const scrollLeft = () => {
    // const movableContainerWidth = cardsSectionRef.current.clientWidth;
    const parentContainerWidth = parentContainerRef.current.clientWidth;

    if (cardsSectionRef.current) {
      setIdx((prev) => {
        if (prev === 0) {
          setScroll((prev) => ({
            ...prev,
            scrollLeft: false,
          }));

          return prev;
        } else {
          prev--;
          cardsSectionRef.current.style.transform = `translateX(-${parentContainerWidth * prev
            }px)`;
          if (prev === 0) {
            setScroll((prev) => ({
              ...prev,
              scrollLeft: false,
            }));
          }
          return prev;
        }
      });

      setScroll((prev) => ({
        ...prev,
        scrollRight: true,
      }));
    }
  };
  const scrollRight = () => {
    const movableContainerWidth = cardsSectionRef.current.clientWidth;

    const parentContainerWidth = parentContainerRef.current.clientWidth;

    if (cardsSectionRef.current) {
      cardsSectionRef.current.scrollLeft += parentContainerWidth;

      setIdx((prev) => {
        if ((prev + 1) * parentContainerWidth >= movableContainerWidth)
          return prev;

        if (
          movableContainerWidth - (prev + 1) * parentContainerWidth <
          parentContainerWidth
        ) {
          cardsSectionRef.current.style.transform = `translateX(-${movableContainerWidth - parentContainerWidth
            }px)`;

          setScroll((prev) => ({
            ...prev,
            scrollRight: false,
          }));
        } else
          cardsSectionRef.current.style.transform = `translateX(-${(prev + 1) * parentContainerWidth
            }px)`;
        setScroll((prev) => ({
          ...prev,
          scrollLeft: true,
        }));
        return prev + 1;
      });
    }
  };

  async function getPosts() {
    try {
    axios.get(`${baseURL}/posts/`).then((res) => {
      setAddTask(res.data.posts);
      setIsLoading(false);
      var arr = [...res.data.posts];
      for (let i = 0; i < arr.length; i++) {
        var obj = arr[i];
        obj = { ...obj, hover: false };
        arr[i] = obj;
      }
      setHoverClass(arr);
      setTrendingHover(arr);
    });
  } catch(err) {
    console.log(err);
  }
  }
  async function getTags() {
    axios.get(`${baseURL}/tags`).then((res) => {
      setTags(res.data.tags);
    });
  }

  useEffect(() => {
    getPosts();
    getTags();
  }, []);

  const approvedPosts = addTask.filter((post) => post.approved === true);
  const filteredPosts = approvedPosts.filter((post) =>
    post.tags.some((tag) => tag.name === filter)
  );

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
    className: 'carouselContainer',
    responsive: [
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 580,
        settings: {
          slidesToShow: 1,
        }
      },
    ]

  };

  return (
    <>
      {!isLoading ? (
        <>
          <section className="homeContainer">
            <div className="homeSection">
              <Slider {...settings}>
                {approvedPosts.length > 0 ? approvedPosts.slice(0, 8).map((post, idx) => {
                  var date = formatDate(post.date);
                  return (
                    <Link to={`/posts/${post.id}`}>
                      <div key={idx} className="carouselWrapper">
                        <img src={post.image} className="carouselImage" alt="carousel" />
                        <div className="gradientBreak" />
                        <div className="slideDescription">
                          <span className="slideTag">#{post.tags[0].name}</span>
                          <p className="slideTitle">{post.title}</p>

                          <span className="slideAuthor">{`By ${post.author.name}`}</span>
                          <span className="slideDate">
                            <SlCalender /> {date}{" "}
                          </span>
                        </div>
                      </div>
                      </Link>
                    );
                }) : ""}</Slider>
            </div>
          </section>
          <hr className="hr-tag"></hr>

          <section className="trendingSection">
            <div className="trendingPart">
              <p className="headingTitle-trending">TRENDING ON TVC EDUCATE</p>
              <div className="myRowFlex">
                {approvedPosts.length > 0
                  ? approvedPosts.slice(0, 6).map((e, i) => {
                    var date = formatDate(e.date);
                    var readingDuration = readingTime(e.body);

                    return (
                      <div
                        className={"col4gy3row"}
                        key={e._id}
                        onMouseEnter={() => {
                          var arr = [...trendingHover];
                          arr[i].hoverClass = true;
                          setTrendingHover(arr);
                        }}
                        onMouseLeave={() => {
                          var arr = [...trendingHover];
                          arr[i].hoverClass = false;
                          setTrendingHover(arr);
                        }}
                      >
                        <div className="previewAuthorTrending">
                          <div className="author__image">
                            <img
                              src={e.author.avatar}
                              alt={`user img ${e.author.name}`}
                            />
                          </div>
                          <div
                            className={`authorDetailsTrending ${trendingHover[i]?.hoverClass ? "lp" : "no-lp"
                              }`}
                          >
                            <p
                              className={`authorName ${trendingHover[i]?.hoverClass ? "lp" : "no-lp"
                                }`}
                            >
                              {e.author.name}
                            </p>
                            <p
                              className={`authorDate ${trendingHover[i]?.hoverClass ? "lp" : "no-lp"
                                }`}
                            >
                              {date}
                            </p>
                          </div>
                        </div>
                        <img
                          className="trendingImg"
                          src={e.image}
                          alt={`trending news img with title: ${e.title}`}
                        />
                        <div className="trendingCardTitle">
                          <Link
                            onClick={() => handleChangeTheme(5)}
                            style={{ textDecoration: "none" }}
                            to={`/posts/${e.id}`}
                          >
                            <div className="authHeading">
                              <p
                                className={`trendingTitle authorTitle ${trendingHover[i]?.hoverClass
                                  ? "lp"
                                  : "no-lp"
                                  }`}
                              >
                                {e.title}
                              </p>
                            </div>
                            <span
                              className={`${trendingHover[i]?.hoverClass ? "lp" : "no-lp"
                                }`}
                            >
                              {readingDuration}
                            </span>
                          </Link>
                        </div>
                        <div className="trendingCta">
                          <Link to={`/posts/${e.id}`}>
                            <div className="learnMoreTrending">
                              Learn More
                            </div>
                          </Link>
                          <div className="shareTrending">SHARE</div>
                        </div>
                      </div>
                    );
                  })
                  : " "}
              </div>

            </div>
          </section>
          <hr className="hr-tag"></hr>

          <section className="blogSection">
            <div className="allBlogs">
              <div className="leftBlogSection">
                <div className="ctaSection">
                  <p className="headingTitle-all-blogs">EXPLORE!</p>
                  <h6>DISCOVER MORE OF WHAT MATTERS TO YOU</h6>
                  <div className="allBlogTypesFirst" ref={parentContainerRef}>
                    <div ref={cardsSectionRef} className="allspanTag">
                      {isLoading ? (
                        <></>
                      ) : (
                        <>
                          <div
                            className="ctaTags"
                            onClick={() => {
                              setFilter("");
                            }}
                          >
                            all
                          </div>
                          {tags.slice(0, 30).map((e, i) => (
                            <div
                              className="ctaTags"
                              key={e._id + 2}
                              onClick={() => {
                                setFilter(e.name);
                              }}
                            >
                              {e.name}
                            </div>
                          ))}
                        </>
                      )}
                    </div>

                    <button
                      type="button"
                      className={`button prevButton ${!scroll.scrollLeft && `displayNone`
                        }`}
                      onClick={() => scrollLeft()}
                    >
                      <MdNavigateBefore className="buttonIcons" />
                    </button>

                    <button
                      type="button"
                      className={`button nextButton ${!scroll.scrollRight && `displayNone`
                        }`}
                      onClick={() => scrollRight()}
                    >
                      <MdNavigateNext className="buttonIcons" />
                    </button>
                  </div>
                </div>

                {filteredPosts.length > 0
                  ? filteredPosts.map((e, i) => {
                    var date = formatDate(e.date);
                    var readingDuration = readingTime(e.body);
                    var shortenedBody = bodyShortener(e.body);
                    // var hoverVal = hoverClass[i]?.hoverClass ? "lp" : "no-lp";
                    return (
                      <div
                        className="col4gy3row02"
                        key={e._id + 1}
                        onMouseEnter={() => {
                          var arr = [...hoverClass];
                          arr[i].hoverClass = true;
                          setHoverClass(arr);
                        }}
                        onMouseLeave={() => {
                          var arr = [...hoverClass];
                          arr[i].hoverClass = false;
                          setHoverClass(arr);
                        }}
                      >
                        <div className="colis1002">
                          <Link
                            // onClick={() => handleChangeTheme(5)}
                            // style={{ textDecoration: "none" }}
                            to={`/posts/${e.id}`}
                          >
                            <div className="preview__author ml--1">
                              <div className="author__image">
                                <img
                                  src={e.author.avatar}
                                  alt={`user ${e.author.name}`}
                                />
                              </div>
                              <div
                                className={`author__details ${hoverClass[i]?.hoverClass ? "lp" : "no-lp"
                                  }`}
                              >
                                <p
                                  className={`author__name ${hoverClass[i]?.hoverClass ? "lp" : "no-lp"
                                    }`}
                                >
                                  {e.author.name}
                                </p>
                                <p
                                  className={`author__date ${hoverClass[i]?.hoverClass ? "lp" : "no-lp"
                                    }`}
                                >
                                  {date}
                                </p>
                              </div>
                            </div>
                            <div className="authHeading02 ">
                              <p
                                className={`authorTitle02 ${hoverClass[i]?.hoverClass ? "lp" : "no-lp"
                                  }`}
                              >
                                {e.title}
                              </p>
                              <p
                                className={`authSubHed02 ${hoverClass[i]?.hoverClass ? "lp" : "no-lp"
                                  }`}
                              >
                                {shortenedBody}
                              </p>
                            </div>
                          </Link>
                          <div
                            className={`authDaTiSt02 ${hoverClass[i]?.hoverClass ? "lp" : "no-lp"
                              }`}
                          >
                            <span>{e.userBlogDate} ·</span>
                            <span className="">{readingDuration}</span>
                            <span className="mx-1 ">·</span>
                            <span
                              className={`mx-1 ${hoverClass[i]?.hoverClass
                                ? "userTagHover"
                                : "userBlogTag"
                                }`}
                            >
                              {e.tags[0].name}
                            </span>
                            <span className="mx-1 ">&#9733;</span>
                          </div>
                        </div>
                        <div className="colis202">
                          <img src={e.image} alt={i + " " + e.title} />
                        </div>
                      </div>
                    );
                  })
                  : approvedPosts.length > 0
                    ? approvedPosts.map((e, i) => {
                      var date = formatDate(e.date);
                      var readingDuration = readingTime(e.body);
                      var shortenedBody = bodyShortener(e.body);
                      // var hoverVal = hoverClass[i]?.hoverClass ? "lp" : "no-lp";
                      return (
                        <div
                          className="col4gy3row02"
                          key={e._id + 1}
                          onMouseEnter={() => {
                            var arr = [...hoverClass];
                            arr[i].hoverClass = true;
                            setHoverClass(arr);
                          }}
                          onMouseLeave={() => {
                            var arr = [...hoverClass];
                            arr[i].hoverClass = false;
                            setHoverClass(arr);
                          }}
                        >
                          <div className="colis1002">
                            <Link
                              // onClick={() => handleChangeTheme(5)}
                              // style={{ textDecoration: "none" }}
                              to={`/posts/${e.id}`}
                            >
                              <div className="preview__author ml--1">
                                <div className="author__image">
                                  <img
                                    src={e.author.avatar}
                                    alt={`user profile ${e.author.name}`}
                                  />
                                </div>
                                <div
                                  className={`author__details ${hoverClass[i]?.hoverClass ? "lp" : "no-lp"
                                    }`}
                                >
                                  <p
                                    className={`author__name ${hoverClass[i]?.hoverClass ? "lp" : "no-lp"
                                      }`}
                                  >
                                    {e.author.name}
                                  </p>
                                  <p
                                    className={`author__date ${hoverClass[i]?.hoverClass ? "lp" : "no-lp"
                                      }`}
                                  >
                                    {date}
                                  </p>
                                </div>
                              </div>
                              <div className="authHeading02 ">
                                <p
                                  className={`authorTitle02 ${hoverClass[i]?.hoverClass ? "lp" : "no-lp"
                                    }`}
                                >
                                  {e.title}
                                </p>
                                <p
                                  className={`authSubHed02 ${hoverClass[i]?.hoverClass ? "lp" : "no-lp"
                                    }`}
                                >
                                  {shortenedBody}
                                </p>
                              </div>
                            </Link>
                            <div
                              className={`authDaTiSt02 ${hoverClass[i]?.hoverClass ? "lp" : "no-lp"
                                }`}
                            >
                              <span>{e.userBlogDate} ·</span>
                              <span className="">{readingDuration}</span>
                              <span className="mx-1 ">·</span>
                              <span
                                className={`mx-1 ${hoverClass[i]?.hoverClass
                                  ? "userTagHover"
                                  : "userBlogTag"
                                  }`}
                              >
                                {e.tags[0].name}
                              </span>
                              <span className="mx-1 ">&#9733;</span>
                            </div>
                          </div>
                          <div className="colis202">
                            <img src={e.image} alt={i + " " + e.title} />
                          </div>
                        </div>
                      );
                    })
                    : ""}
              </div>
              <div className="rightBlogSection">
                <div className="allBlogTypes">
                  <div className="quizCard">
                    <img
                      className="quizCardImg"
                      alt="quiz profile"
                      src="https://i.postimg.cc/xCVwb1yy/depositphotos-127600950-stock-photo-inscription-on-smartphone-screen.webp"
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
      ) : (
        " "
      )}
    </>
  );
};

export default LandingPage;
