import React from "react";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

function MiniPostArticleList({ loadedPosts }) {
  return (
    <div
      style={{
        flexDirection: "row",
        display: "flex",
        justifyContent: "flex-start",
        width: "100%",
        paddingTop: 10,
        maxWidth: "300px",
      }}
    >
      <div>
        {loadedPosts?.title.length > 50 ? (
          <Link
            to={`/posts/${loadedPosts?.titleURL}/${loadedPosts?.id}`}
            className="title-link"
          >
            <h1
              style={{
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              {loadedPosts?.title.slice(0, 50)}...{" "}
              <span
                style={{
                  color: "blue",
                }}
              >
                Read more
              </span>
            </h1>
          </Link>
        ) : (
          <h1
            style={{
              fontSize: 13,
              fontWeight: 500,
            }}
          >
            {loadedPosts?.title}
          </h1>
        )}
      </div>
    </div>
  );
}

export default MiniPostArticleList;
