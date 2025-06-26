import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
};

const registerUser = async (req, res) => {
  let { fullname, email, password, profileImageUrl } = req.body;
  // check if all fields are filled
  if (!fullname || !email || !password || !profileImageUrl) {
    return res.status(400).json({ message: 'Please fill all fields' });
  }
  // Check if user already exists
  try {
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    // Create user
    const user = await User.create({
      fullname,
      email,
      password,
      profileImageUrl,
    });
    // Generate token
    res.status(201).json({
      id: user._id,
      user,
      token: generateToken(user._id),
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'error while registering user', error: error.message });
  }
};
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  // Check if all fields are filled
  if (!email || !password) {
    return res.status(400).json({ message: 'Please fill all fields' });
  }
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res
        .status(401)
        .json({ message: 'Invalid email or password , try again' });
    }

    res.status(200).json({
      id: user._id,
      user,
      token: generateToken(user._id),
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error while logging in user', error: error.message });
  }
};
const getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error while getting user info', error: error.message });
  }
};

export { registerUser, loginUser, getUserInfo };
