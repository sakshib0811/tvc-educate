import React from "react";
import { Link } from "react-router-dom";

const MiniPostList = (props) => {
  if (props.posts?.length === 0) {
    return <div>No posts found!</div>;
  }

  return (
    <>
      <div className={props.tag}>
        <Link to={`/tags/${props.tag}`}>
          <h4
            style={{
              fontWeight: 500,
              marginTop: 5,
              fontSize: 15,
            }}
          >
            # {props.tag}
          </h4>
        </Link>
      </div>
    </>
  );
};

export default MiniPostList;
