import React from "react";
import Posts from "../../components/Post/Posts";
import RightSideBar from "../../components/RightSideBar/RightSideBar";
import { useData } from "../../context/data/DataContext";

const Home = () => {
  const { tags, isLoading } = useData();

  return (
    <div className="container-layout">
      <Posts cover={true} />
      <RightSideBar tags={tags} isLoading={isLoading} />
    </div>
  );
};

export default Home;
