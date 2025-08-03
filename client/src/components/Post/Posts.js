import React from "react";
import ErrorModal from "../../components/Modal/ErrorModal";
import PostList from "../PostList/PostList";
import { useData } from "../../context/data/DataContext";

const Posts = ({ cover }) => {
  const { posts, isLoading, error } = useData();
  
  return (
    <>
      <ErrorModal error={error} onClose={() => {}} />
      <PostList isLoading={isLoading} items={posts} cover={cover} />
    </>
  );
};

export default Posts;
