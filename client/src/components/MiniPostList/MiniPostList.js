import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useHttpClient from '../../hooks/useHttpClient';

const MiniPostList = (props) => {
  const [post, setPost] = useState([]);
  const { sendReq } = useHttpClient();
  async function fetchTopPost(){
    try{
      const responseData = await sendReq(
        //`${process.env.REACT_APP_BASE_URL}/posts`
        "http://localhost:5000/api/posts"
      )
      
        var arr = responseData.posts.filter((item) => item.id === props.posts[0]);
        console.log(arr);
        setPost(arr);
    } catch (err) {console.log(err);}
  }

  useEffect(()=> {
    fetchTopPost();
  }, []);
  if (props.posts?.length === 0) {
    return <div>No posts found!</div>;
  }

  return (
    <>
      <div className={props.tag}>
        {/* <h4>#{props.tag}</h4> */}
        <ul>
          {props.posts &&
            post.map((e, i) =>{
            var linkURL = props.type === "post" ? "posts/" + e.titleURL + "/" + e.id : "users/" + e.author.id;
             return (
              <div className='post__item' key={e.id}>
                <Link
                  className='title-link'
                  to={`${linkURL}`}
                >
                  <p style={{ fontWeight: "bold" }}>{props.type === "post" ? e.title : e.author.name}</p>
                  {/* <img src={e.image} style={{ width: "80%" }} alt={"trending article rep img"} /> */}
                </Link>
              </div>
            )})}
        </ul>
      </div>
    </>
  );
};

export default MiniPostList;
