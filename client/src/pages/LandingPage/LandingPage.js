import React, { useEffect, useState } from "react";
import "./LandingPage.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { useContext } from "react";
import { ThemeContexts } from "../../context/ThemeContexts";
import { AuthorInfo } from "../../components/AuthorInfo/AuthorInfo";
import { bodyShortener, formatDate, readingTime } from "../../utils";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const LandingPage = () => {
  const [addTask, setAddTask] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { handleChangeTheme } = useContext(ThemeContexts);
  const [tags, setTags] = useState([]);
  const [hoverClass, setHoverClass] = useState([]);
  const [trendingHover, setTrendingHover] = useState([]);

  async function getPosts() {
    axios.get(`http://localhost:5000/api/posts`).then((res) => {
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
  }

  async function getTags() {
    axios.get(`http://localhost:5000/api/tags`).then((res) => {
      setTags(res.data.tags);
    });
  }

  useEffect(() => {
    getPosts();
    getTags();
  }, []);

  return (
    <>
      {!isLoading ? (
        <>
          <section className="homeContainer">
            <div className="homeSection">
              <Carousel
                className="carousel-container"
                autoPlay
                infiniteLoop={true}
                style={{ borderRadius: "20px" }}
                showThumbs={false}
                showArrows={true}
              >
                {addTask.length > 0
                  ? addTask.map((e, i) => {
                      return (
                        <div className="carousel-data-container">
                          <img
                            src={e.image}
                            alt={i}
                            style={{ width: "100%", opacity: "0.5" }}
                          />
                          <div
                            className="img-cover"
                            style={{
                              width: "100%",
                              height: "550px",
                              backgroundColor: "rgba(0,0,0,0.5)",
                              marginTop: "-550px",
                            }}
                          >
                            <p className="legend-carousel">
                              {e.title}
                              <br />
                              <span>{`By ${e.author.name}`}</span>
                            </p>
                          </div>
                        </div>
                      );
                    })
                  : ""}
              </Carousel>
            </div>
          </section>
          <hr className="hr-tag"></hr>

          <section className="trendingSection">
            <div className="trendingPart">
              <p className="headingTitle-trending">TRENDING ON TVC EDYOUCATE</p>
              <div className="myRowFlex">
                {addTask.length > 0
                  ? addTask.map((e, i) => {
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
                          <div className="colis10">
                            <Link
                              onClick={() => handleChangeTheme(5)}
                              style={{ textDecoration: "none" }}
                              to={`/posts/${e.titleURL}/${e.id}`}
                            >
                              <div className="preview__author ml--1">
                                <div className="author__image">
                                  <img
                                    src={e.author.avatar}
                                    alt={`user photo ${e.author.name}`}
                                  />
                                </div>
                                <div
                                  className={`author__details ${
                                    trendingHover[i]?.hoverClass
                                      ? "lp"
                                      : "no-lp"
                                  }`}
                                >
                                  <p
                                    className={`author__name ${
                                      trendingHover[i]?.hoverClass
                                        ? "lp"
                                        : "no-lp"
                                    }`}
                                  >
                                    {e.author.name}
                                  </p>
                                  <p
                                    className={`author__date ${
                                      trendingHover[i]?.hoverClass
                                        ? "lp"
                                        : "no-lp"
                                    }`}
                                  >
                                    {date}
                                  </p>
                                </div>
                              </div>
                              <div className="authHeading">
                                <p
                                  className={`authorTitle ${
                                    trendingHover[i]?.hoverClass
                                      ? "lp"
                                      : "no-lp"
                                  }`}
                                >
                                  {e.title}
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
                          <img
                            className="trending-news-rep-img"
                            src={e.image}
                            alt={`trending news image with title: ${e.title}`}
                          />
                        </div>
                      );
                    })
                  : " "}
              </div>
            </div>
          </section>
          <hr className="hr-tag"></hr>

          <section className="blogSection">
            <p className="headingTitle-all-blogs">EXPLORE!</p>
            <div className="allBlogs">
              <div className="leftBlogSection">
                {addTask.length > 0
                  ? addTask.map((e, i) => {
                      var date = formatDate(e.date);
                      var readingDuration = readingTime(e.body);
                      var shortenedBody = bodyShortener(e.body);
                      var hoverVal = hoverClass[i]?.hoverClass ? "lp" : "no-lp";
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
                              to={`/posts/${e.titleURL}/${e.id}`}
                            >
                              <div className="preview__author ml--1">
                                <div className="author__image">
                                  <img
                                    src={e.author.avatar}
                                    alt={`user photo ${e.author.name}`}
                                  />
                                </div>
                                <div
                                  className={`author__details ${
                                    hoverClass[i]?.hoverClass ? "lp" : "no-lp"
                                  }`}
                                >
                                  <p
                                    className={`author__name ${
                                      hoverClass[i]?.hoverClass ? "lp" : "no-lp"
                                    }`}
                                  >
                                    {e.author.name}
                                  </p>
                                  <p
                                    className={`author__date ${
                                      hoverClass[i]?.hoverClass ? "lp" : "no-lp"
                                    }`}
                                  >
                                    {date}
                                  </p>
                                </div>
                              </div>
                              <div className="authHeading02 ">
                                <p
                                  className={`authorTitle02 ${
                                    hoverClass[i]?.hoverClass ? "lp" : "no-lp"
                                  }`}
                                >
                                  {e.title}
                                </p>
                                <p
                                  className={`authSubHed02 ${
                                    hoverClass[i]?.hoverClass ? "lp" : "no-lp"
                                  }`}
                                >
                                  {shortenedBody}
                                </p>
                              </div>
                            </Link>
                            <div
                              className={`authDaTiSt02 ${
                                hoverClass[i]?.hoverClass ? "lp" : "no-lp"
                              }`}
                            >
                              <span>{e.userBlogDate} ·</span>
                              <span className="">{readingDuration}</span>
                              <span className="mx-1 ">·</span>
                              <span
                                className={`mx-1 ${
                                  hoverClass[i]?.hoverClass
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
                  : " "}
              </div>
              <div className="rightBlogSection">
                <div className="allBlogTypes">
                  <div className="allBlogTypesFirst">
                    <h6>DISCOVER MORE OF WHAT MATTERS TO YOU</h6>
                    <div className="allspanTag">
                      {isLoading ? (
                        <></>
                      ) : (
                        tags.slice(0, 9).map((e, i) => {
                          return (
                            <a
                              style={{ textDecoration: "none" }}
                              href={`http://localhost:3000/tags/${e.name}`}
                              key={e._id + 2}
                            >
                              {e.name}
                            </a>
                          );
                        })
                      )}
                    </div>
                    <a className="allTopics" href="http://localhost:3000/tags">
                      See all tags
                    </a>
                  </div>
                  <div className="allspanTag2">
                    <span>Help </span>
                    <span> Status </span>
                    <span> Writers </span>
                    <span> Blog </span>
                    <span> Careers </span>
                    <span> Privacy </span>
                    <span> Terms</span>
                    <span> About</span>
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
