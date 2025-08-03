const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const HttpError = require('../models/http-error');
const User = require('../models/user');
const { createJWTtoken } = require('../utils');
const DEFAULT_AVATAR = 'https://res.cloudinary.com/drkvr9wta/image/upload/v1647701003/undraw_profile_pic_ic5t_ncxyyo.png';

const {
  followNotification,
  removeFollowNotification,
} = require('../controllers/notifications');
const { uploadToCloudinary } = require('../utils');

const getUserById = async (req, res, next) => {
  let { userId } = req.params;
  let user;
  try {
    user = await User.findById(userId, '-password')
      .populate({
        path: 'posts',
        populate: {
          path: 'tags',
        },
      })
      .populate('followedTags');
    //exclude password, i.e. return only name and email
  } catch (err) {
    return next(new HttpError('Getting user failed, please try again!', 500));
  }
  res.status(200).json({
    user: user.toObject({ getters: true }),
  });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid inputs passed, please check your data', 422));
  }

  const { name, email, password } = req.body;
  console.log(email);

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new HttpError('User already exists, please login instead', 422));
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const avatar = req.file ? await uploadToCloudinary(req.file) : DEFAULT_AVATAR;

    const newUser = new User({ name, email, password: hashedPassword, avatar });

    await newUser.save();

    const token = createJWTtoken(newUser.id, newUser.email);

    res.status(201).json({
      user: {
        name: newUser.name,
        userId: newUser.id,
        email: newUser.email,
        bio: newUser.bio,
        avatar: newUser.avatar,
        token,
      },
    });
  } catch (err) {
    return next(new HttpError('Signup failed, please try again.', 500));
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(new HttpError('Invalid credentials, login failed!', 403));
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return next(new HttpError('Invalid credentials, login failed!', 401));
    }

    const token = createJWTtoken(user.id, user.email);

    res.status(200).json({
      user: {
        name: user.name,
        userId: user.id,
        email: user.email,
        token,
        bio: user.bio,
        avatar: user.avatar,
        tags: user.followedTags,
      },
    });
  } catch (err) {
    return next(new HttpError('Login failed, please try again.', 500));
  }
};

const changePassword = async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) return next(new HttpError('User not found', 404));

    const isValid = await bcrypt.compare(oldPassword, user.password);
    if (!isValid) return next(new HttpError('Old password is incorrect', 401));

    const hashedNewPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (err) {
    return next(new HttpError('Could not change password, try again', 500));
  }
};

const updateUser = async (req, res, next) => {
  const { userId } = req.params;
  let updateData = { ...req.body };

  try {
    if (req.file) {
      const imageUrl = await uploadToCloudinary(req.file);
      updateData.avatar = imageUrl;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select('name _id bio email avatar');

    if (!updatedUser) {
      return next(new HttpError('Could not find user to update', 404));
    }

    const { name, _id: userDocId, bio, email, avatar } = updatedUser;
    res.status(200).json({ user: { name, userId: userDocId, bio, email, avatar } });
  } catch (err) {
    console.log(err);
    return next(new HttpError('Could not update user', 500));
  }
};

const followUser = async (req, res, next) => {
  const { userId, followId } = req.body;

  if (userId === followId) {
    return next(new HttpError("You can't follow yourself", 400));
  }

  try {
    const [user, userToFollow] = await Promise.all([
      User.findByIdAndUpdate(
        userId,
        { $addToSet: { following: followId } },
        { new: true }
      ),
      User.findByIdAndUpdate(
        followId,
        { $addToSet: { followers: userId } },
        { new: true }
      ),
    ]);

    if (!user || !userToFollow) {
      return next(new HttpError('User not found', 404));
    }

    await followNotification(userId, followId);

    res.status(200).json(user);
  } catch (err) {
    return next(new HttpError('Follow failed, please try again', 400));
  }
};

const unfollowUser = async (req, res, next) => {
  const { userId, followId } = req.body;

  if (userId === followId) {
    return next(new HttpError("You can't unfollow yourself", 400));
  }

  try {
    const [user, userToUnfollow] = await Promise.all([
      User.findByIdAndUpdate(
        userId,
        { $pull: { following: followId } },
        { new: true }
      ),
      User.findByIdAndUpdate(
        followId,
        { $pull: { followers: userId } },
        { new: true }
      ),
    ]);

    if (!user || !userToUnfollow) {
      return next(new HttpError('User not found', 404));
    }

    await removeFollowNotification(userId, followId);

    res.status(200).json(user);
  } catch (err) {
    return next(new HttpError('Unfollow failed, please try again', 400));
  }
};


exports.getUserById = getUserById;
exports.signup = signup;
exports.login = login;
exports.updateUser = updateUser;
exports.followUser = followUser;
exports.unfollowUser = unfollowUser;
exports.changePassword = changePassword;