const { sign } = require("jsonwebtoken");
const User = require("../models/User");

const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    //check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        message: "User already exists!",
      });
    }

    const user = await User.create({ name, email, password });
    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const userLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    //check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "Incorrect email or password",
      });
    }

    //check credentials
    const isPasswordMatch = await user.matchPasswords(password);
    if (!isPasswordMatch) {
      return res.status(404).json({
        message: "Incorrect email or password",
      });
    }

    //generate jwt token
    const token = sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    return res.status(200).json({
      name: user.name,
      email: user.email,
      token,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = { createUser, userLogin };
