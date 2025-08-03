const express = require('express');
const { check } = require('express-validator');
const checkAuth = require('../middleware/check-auth');
const { fileUpload } = require('../middleware/file-upload');
const postsControllers = require('../controllers/posts');
const router = express.Router();
const {
  getAllPosts,
  getPostsByUserId,
  getPostById,
  getSearchResults,
  createPost,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
  unbookmarkPost,
  bookmarkPost,
  approvePost,
  removePost
} = postsControllers;

router.get('/', getAllPosts);

router.use(checkAuth);

router.get('/user/:userId', getPostsByUserId);

router.get('/:postId', getPostById);

router.get('/search?', getSearchResults);

router.patch('/:titleURL/:postId/approve', approvePost);

router.delete('/:titleURL/:postId/delete', removePost);

router.post(
  '/',
  fileUpload.single('image'),
  [
    check('title').not().isEmpty(),
    check('body').not().isEmpty(),
    check('tags').not().isEmpty(),
    check('titleURL').not().isEmpty(),
    check('author').not().isEmpty(),
  ],
  createPost
);

router.patch(
  '/:titleURL/:postId',
  fileUpload.single('image'),
  [
    check('title').not().isEmpty(),
    check('body').not().isEmpty(),
    check('tags').not().isEmpty(),
    check('titleURL').not().isEmpty(),
  ],
  updatePost
);

router.delete('/:titleURL/:postId', deletePost);

router.put('/:postId/like', likePost);

router.put('/:postId/unlike', unlikePost);

router.put('/:postId/bookmark', bookmarkPost);

router.put('/:postId/unbookmark', unbookmarkPost);

module.exports = router;
