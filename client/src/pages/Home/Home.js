import React, { useState, useEffect, useContext } from "react";
import Posts from "../../components/Post/Posts";
import RightSideBar from "../../components/RightSideBar/RightSideBar";
import LeftSideBar from "../../components/LeftSideBar/LeftSideBar";
import useHttpClient from "../../hooks/useHttpClient";
import { AuthContext } from '../../context/auth';
// import useAuth from '../../hooks/useAuth';

const Home = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const { sendReq } = useHttpClient();
  // const { user } = useAuth();
  const { login } = useContext(AuthContext);

  useEffect(() => {
    const handleTwitterAuth = async () => {
      const responseData = await sendReq(
        `${process.env.REACT_APP_BASE_URL}/users/auth/twitter/success`,
        'GET',
        null,
        {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Credentials': true,
        },
        'include'
      );
      login(responseData.user);
    };
    handleTwitterAuth();
  }, [sendReq, login]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const responseData = await sendReq(`http://localhost:5000/api/tags`);
        setTags(responseData?.tags);
        setLoading(true);
        
        console.log(responseData?.tags);
        // var currentUserData = localStorage?.userData;
        // console.log(currentUserData ? JSON.parse(localStorage?.userData): "no one is here");
      } catch (err) {
        console.log(err);
      }
    };
    fetchPosts();
  }, [sendReq]);

  return (
    <div className="container-layout">
      <div className="container-sidebar">
        <LeftSideBar />
      </div>
      <Posts cover={true} />
      {loading ? <RightSideBar tags={tags} isLoading={loading} /> : ""}
    </div>
  );
};

export default Home;
