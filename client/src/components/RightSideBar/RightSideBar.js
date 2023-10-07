import React, { useEffect, useState } from "react";
import MiniPostList from "../MiniPostList/MiniPostTagList";
import SkeletonPostList from "../Skeleton/SkeletonPostList";
import "./RightSideBar.css";
import MiniPostArticleList from "../MiniPostList/MiniPostArticleList";
import useHttpClient from "../../hooks/useHttpClient";

const RightSideBar = ({ tags, isLoading }) => {
  //const newsTag = tags.filter((tag) => tag.name === 'news')[0];
  //const discussTag = tags.filter((tag) => tag.name === 'discuss')[0];
  const webdevTag = tags.filter((tag) => tag.name === "react")[0];
  console.log(webdevTag.posts);

  const [loadedPosts, setLoadedPosts] = useState([]);
  const { sendReq, error, clearError } = useHttpClient();
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const responseData = await sendReq(
          //`${process.env.REACT_APP_BASE_URL}/posts`
          "http://localhost:5000/api/posts"
        );
        setLoadedPosts(responseData.posts.slice(0, 5));
        console.log("Posts from Sidebar>>>>", responseData.posts.slice(0, 5));
      } catch (err) {
        console.log(err);
      }
    };
    fetchPosts();
  }, [sendReq]);

  return (
    <div className="sidebar">
      {!isLoading ? (
        <SkeletonPostList type="mini" />
      ) : (
        <div>
          <div className="sidebar--right">
            <h1
              style={{
                fontSize: 20,
                fontWeight: "600",
                color: "black",
              }}
            >
              Top Rated Tags
            </h1>

            {tags?.slice(0, 5).map((tag, index) => {
              return <MiniPostList tag={tag.name} posts={tag.posts} />;
            })}
          </div>

          <div
            className="sidebar--right"
            style={{
              marginTop: 10,
            }}
          >
            <h1
              style={{
                fontSize: 20,
                fontWeight: "600",
                color: "black",
              }}
            >
              Top Rated Post of the day
            </h1>

            {loadedPosts?.map((post, index) => {
              return <MiniPostArticleList loadedPosts={post} key={index} />;
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default RightSideBar;
