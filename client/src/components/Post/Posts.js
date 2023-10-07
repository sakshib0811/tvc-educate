import React, { useState, useEffect } from "react";
import ErrorModal from "../../components/Modal/ErrorModal";
import useHttpClient from "../../hooks/useHttpClient";
import PostList from "../PostList/PostList";
import { baseURL } from "../../utils/index";
const Posts = ({ cover }) => {
  const [loadedPosts, setLoadedPosts] = useState([]);
  const { isLoading, sendReq, error, clearError } = useHttpClient();
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const responseData = await sendReq(`${baseURL}/posts`);
        setLoadedPosts(responseData.posts);
      } catch (err) {
        console.log(err);
      }
    };
    fetchPosts();
  }, [sendReq]);

  return (
    <>
      <ErrorModal error={error} onClose={clearError} />
      {loadedPosts && (
        <PostList isLoading={isLoading} items={loadedPosts} cover={cover} />
      )}
    </>
  );
};

export default Posts;
