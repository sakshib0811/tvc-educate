import React from "react";
import PostPreview from "../PostPreview/PostPreview";
import SkeletonPostList from "../Skeleton/SkeletonPostList";

const PostList = React.memo(({ isLoading, items, cover }) => {
  if (isLoading) {
    return <SkeletonPostList />;
  }

  if (!items || items.length === 0) {
    return (
      <div className="center" style={{ padding: "2rem" }}>
        <p>No posts found.</p>
      </div>
    );
  }

  return (
    <div className="container-posts">
      {items.map((post) => (
        <PostPreview key={post.id} post={post} cover={cover} />
      ))}
    </div>
  );
});

PostList.displayName = 'PostList';

export default PostList; 