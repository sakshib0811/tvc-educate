import React from 'react';
import SkeletonArticle from './SkeletonArticle';
import './SkeletonElement.css';

const SkeletonPostList = ({ type }) => {
  return (
    <>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n, index) => (
        <div key={n * Math.random() * 10 * Math.random() + index}>
          <SkeletonArticle firstEl={index === 0} type={type} />
        </div>
      ))}
    </>
  );
};

export default SkeletonPostList;
