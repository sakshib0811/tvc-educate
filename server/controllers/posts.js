// const { v4: uuid } = require('uuid');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const HttpError = require('../models/http-error');
const Post = require('../models/post');
const User = require('../models/user');
const Tag = require('../models/tag');
const { uploadToCloudinary } = require('../utils');
const { createTags, updateTags } = require('./tags');
const {
  likeNotification,
  removeLikeNotification,
} = require('../controllers/notifications');

const getAllPosts = async (req, res, next) => {
  let posts;
  try {
    posts = await Post.find()
      .sort({ date: 'desc' })
      .populate('author')
      .populate('tags');
  } catch (err) {
    return next(new HttpError('Could not fetch posts, please try again', 500));
  }
  res.json({ posts: posts.map((post) => post.toObject({ getters: true })) });
};

const getPostById = async (req, res, next) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId)
      .populate('author', 'name email avatar') // Only fetch necessary fields
      .populate({
        path: 'comments',
        populate: { path: 'author', select: 'name avatar' }, // Populate nested authors of comments
      })
      .populate('tags', 'name'); // Only fetch tag name

    if (!post) {
      return next(new HttpError('Could not find post for the provided ID', 404));
    }

    res.status(200).json({ post: post.toObject({ getters: true }) });

  } catch (err) {
    console.error('[ERROR: getPostById]', err);
    return next(new HttpError('Something went wrong while retrieving the post', 500));
  }
};


const getPostsByUserId = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const posts = await Post.find({ author: userId }).populate('author');

    if (!posts || posts.length === 0) {
      return next(new HttpError('No posts found for the provided user ID.', 404));
    }

    res.json({
      posts: posts.map(post => post.toObject({ getters: true }))
    });

  } catch (err) {
    console.error('[ERROR: Fetching user posts]', err);
    return next(new HttpError('Fetching posts failed. Please try again.', 500));
  }
};


const createPost = async (req, res, next) => {
  // Validate incoming request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid inputs passed, please try again!', 422));
  }

  try {
    const imageUrl = await uploadToCloudinary(req.file);

    const { title, body, tags, titleURL, author } = req.body;

    // Validate author existence early
    const user = await User.findById(author);
    if (!user) {
      return next(new HttpError('Could not find user for provided ID', 404));
    }

    const createdPost = new Post({
      title,
      image: imageUrl,
      body,
      titleURL,
      author,
    });

    // Create tags and attach to post
    await createTags(JSON.parse(tags), createdPost);

    // Use transaction to ensure post and user update are atomic
    const session = await mongoose.startSession();
    session.startTransaction();

    await createdPost.save({ session });
    user.posts.push(createdPost._id);
    await user.save({ session });

    await session.commitTransaction();
    session.endSession();

    const populatedPost = await createdPost.populate('author');

    res.status(201).json({
      post: populatedPost.toObject({ getters: true }),
    });

  } catch (err) {
    console.error('[ERROR: createPost]', err);
    return next(new HttpError('Creating post failed, please try again', 500));
  }
};


const approvePost = async (req, res, next) => {
  const { postId } = req.params;

  let post;
  try {
    post = await Post.findById(postId);
  } catch (err) {
    return next(new HttpError('Could not find the post to approve', 500));
  }

  if (!post) {
    return next(new HttpError('Post not found', 404));
  }

  // Check if the post is already approved
  if (post.approved) {
    return next(new HttpError('Post is already approved', 422));
  }

  // Update the 'approved' field to true
  post.approved = true;

  try {
    await post.save();
  } catch (err) {
    return next(new HttpError('Could not approve the post, please try again', 500));
  }

  res.status(200).json({ message: 'Post approved successfully' });
};



const removePost = async (req, res, next) => {
  const { titleURL, postId } = req.params;

  try {
    const post = await Post.findOne({ _id: postId, titleURL }).populate('author');

    if (!post) {
      return next(new HttpError('Post not found', 404));
    }

    // Start session to ensure atomicity
    const session = await mongoose.startSession();
    session.startTransaction();

    await Post.deleteOne({ _id: postId }, { session });

    // Remove post reference from the user (if populated)
    if (post.author) {
      post.author.posts.pull(postId);
      await post.author.save({ session });
    }

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (err) {
    console.error('[ERROR: removePost]', err);
    return next(new HttpError('Could not delete the post, please try again', 500));
  }
};


const updatePost = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid inputs passed, please try again!', 422));
  }

  const { postId } = req.params;
  const updateData = { ...req.body };

  // Upload image if present
  if (req.file) {
    try {
      updateData.image = await uploadToCloudinary(req.file);
    } catch (err) {
      return next(new HttpError('Image upload failed', 500));
    }
  }

  let post;
  try {
    post = await Post.findById(postId).populate('tags');
    if (!post) {
      return next(new HttpError('Post not found', 404));
    }
  } catch (err) {
    console.error('[ERROR: findById]', err);
    return next(new HttpError('Could not fetch post for updating', 500));
  }

  // Authorization check
  if (post.author.toString() !== updateData.author) {
    return next(new HttpError('You are not allowed to update this post', 401));
  }

  // Apply updates except 'tags' (handled separately)
  const skipFields = ['tags'];
  for (const [key, value] of Object.entries(updateData)) {
    if (!skipFields.includes(key)) {
      post[key] = value;
    }
  }

  try {
    await updateTags(JSON.parse(updateData.tags), post);
    await post.save();
    res.status(200).json({
      post: post.toObject({ getters: true }),
    });
  } catch (err) {
    console.error('[ERROR: updateTags or save]', err);
    return next(new HttpError('Failed to update post', 500));
  }
};


const deletePost = async (req, res, next) => {
  const { postId } = req.params;
  const requestingUserId = req.body.author;

  let post;
  try {
    // Populate author to modify their posts array later
    post = await Post.findById(postId).populate('author');
    if (!post) {
      return next(new HttpError('Post not found for the provided ID.', 404));
    }
  } catch (err) {
    console.error('[ERROR: Post Fetch]', err);
    return next(new HttpError('Could not fetch post for deletion.', 500));
  }

  // Authorization check
  if (post.author.id.toString() !== requestingUserId) {
    return next(new HttpError('You are not allowed to delete this post.', 401));
  }

  // Wrap DB operations in a transaction
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();

    // Remove post
    await post.remove({ session: sess });

    // Remove post ref from author's posts array
    post.author.posts.pull(post._id);
    await post.author.save({ session: sess });

    await sess.commitTransaction();
  } catch (err) {
    console.error('[ERROR: Transaction]', err);
    return next(new HttpError('Deleting post failed, please try again.', 500));
  }

  res.status(200).json({ message: 'Post deleted successfully.' });
};


const likePost = async (req, res, next) => {
  const { postId, userId } = req.body;
  let post;
  try {
    post = await Post.findByIdAndUpdate(
      postId,
      { $addToSet: { likes: userId } },
      { new: true }
    );
    const authorId = post.author.toString();
    if (authorId !== userId) {
      await likeNotification(userId, postId, authorId, next);
    }
  } catch (err) {
    return next(new HttpError('Like failed!', 500));
  }
  res.status(200).json({
    post: post.toObject({ getters: true }),
  });
};

const unlikePost = async (req, res, next) => {
  const { postId, userId } = req.body;
  let post;
  try {
    post = await Post.findByIdAndUpdate(
      postId,
      { $pull: { likes: userId } },
      { new: true }
    );
    const authorId = post.author.toString();

    if (authorId !== userId) {
      await removeLikeNotification(userId, postId, authorId, next);
    }
  } catch (err) {
    return next(new HttpError('Unlike failed!', 500));
  }
  res.status(200).json({
    post: post.toObject({ getters: true }),
  });
};

const bookmarkPost = async (req, res, next) => {
  const { postId, userId } = req.body;
  let post;
  try {
    post = await Post.findByIdAndUpdate(
      postId,
      {
        $addToSet: { bookmarks: userId },
      },
      { new: true }
    );
    res.status(200).json({
      post: post.toObject({ getters: true }),
    });
  } catch (err) {
    return next(new HttpError('Could not bookmark post', 500));
  }
};

const unbookmarkPost = async (req, res, next) => {
  const { postId, userId } = req.body;
  let post;
  try {
    post = await Post.findByIdAndUpdate(
      postId,
      {
        $pull: { bookmarks: userId },
      },
      { new: true }
    );
  } catch (err) {
    return next(new HttpError('Could not unbookmark post', 500));
  }
  res.status(200).json({
    post: post.toObject({ getters: true }),
  });
};

const getSearchResults = async (req, res, next) => {
  const query = {};
  if (req.query.search) {
    const options = '$options';
    query.title = { $regex: req.query.search, [options]: 'i' };
    let posts;
    try {
      posts = await Post.find(query).populate('author').populate('tags');
    } catch (err) {
      return next(new HttpError('Search failed, please try again', 400));
    }
    res
      .status(201)
      .json({ posts: posts.map((post) => post.toObject({ getters: true })) });
  }
};

const getBookmarks = async (req, res, next) => {
  const { userId } = req.params;
  let posts;
  try {
    posts = await Post.find({ bookmarks: userId })
      .populate('tags')
      .populate('author');
  } catch (err) {
    return next(
      new HttpError('Fetching posts failed. Please try again later', 500)
    );
  }
  res.json({ posts: posts.map((post) => post.toObject({ getters: true })) });
};

exports.getAllPosts = getAllPosts;
exports.getPostById = getPostById;
exports.getPostsByUserId = getPostsByUserId;
exports.createPost = createPost;
exports.updatePost = updatePost;
exports.deletePost = deletePost;
exports.likePost = likePost;
exports.unlikePost = unlikePost;
exports.bookmarkPost = bookmarkPost;
exports.unbookmarkPost = unbookmarkPost;
exports.getBookmarks = getBookmarks;
exports.getSearchResults = getSearchResults;
exports.approvePost = approvePost;
exports.removePost= removePost;
