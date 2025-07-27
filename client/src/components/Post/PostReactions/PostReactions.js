import React from 'react';
import { LikePost } from './LikePost';
import { BookmarkPost } from './BookmarkPost';
import usePostReaction from './hooks/usePostReaction';
import './PostReactions.css';

const PostReactions = ({ post, setShowModal, handleInteraction }) => {
  const { likes, bookmarks, id, author } = post;
  const { state, handleReaction } = usePostReaction(
    likes,
    bookmarks,
    id,
    author
  );
  const { isLiked, isBookmarked } = state;
  return (
    <div className='post__reactions'>
      <LikePost
        likes={likes}
        isLiked={isLiked}
        setShowModal={setShowModal}
        handleReaction={handleReaction}
      />
      <BookmarkPost
        bookmarks={bookmarks}
        isBookmarked={isBookmarked}
        setShowModal={setShowModal}
        handleReaction={handleReaction}
      />
    </div>
  );
};

export default PostReactions;
