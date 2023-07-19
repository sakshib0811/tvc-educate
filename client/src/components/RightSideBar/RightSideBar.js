import React from 'react';
import MiniPostList from '../MiniPostList/MiniPostList';
import SkeletonPostList from '../Skeleton/SkeletonPostList';
import './RightSideBar.css';

const RightSideBar = ({ tags, isLoading }) => {
  //const newsTag = tags.filter((tag) => tag.name === 'news')[0];
  //const discussTag = tags.filter((tag) => tag.name === 'discuss')[0];
  const webdevTag = tags.filter((tag) => tag.name === 'react')[0];
  console.log(webdevTag.posts);
  return (
    <div className='sidebar sidebar--right'>
      {!isLoading ? (
        <SkeletonPostList type='mini' />
      ) : (
        <>
        <p>Top Rated Post of the day:</p>
          {/* {newsTag && <MiniPostList tag='news' posts={newsTag.posts} />}
          {discussTag && (
            <MiniPostList tag='discuss' posts={discussTag.posts} />
          )} */}
          <MiniPostList tag={tags[0].name} posts={tags[0].posts} />
        </>
      )}
    </div>
  );
};

export default RightSideBar;
