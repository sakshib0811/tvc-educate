import React from "react";
import MiniPostList from "../MiniPostList/MiniPostTagList";
import SkeletonPostList from "../Skeleton/SkeletonPostList";
import "./RightSideBar.css";
import MiniPostArticleList from "../MiniPostList/MiniPostArticleList";
import { useData } from "../../context/data/DataContext";

const RightSideBar = ({ tags, isLoading }) => {
  const { getApprovedPosts } = useData();
  const approvedPosts = getApprovedPosts();
  const topPosts = approvedPosts.slice(0, 5);

  return (
    <div className="sidebar">
      {isLoading ? (
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
              return <MiniPostList key={index} tag={tag.name} posts={tag.posts || []} />;
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

            {topPosts?.map((post, index) => {
              return <MiniPostArticleList loadedPosts={post} key={index} />;
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default RightSideBar;
