const { sign } = require("jsonwebtoken");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

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

    //generate jwt token
    const token = sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.status(201).json({
      id: user._id,
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

const userLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    //check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "Incorrect email or password!",
      });
    }

    //check credentials
    const isPasswordMatch = await user.matchPasswords(password);
    if (!isPasswordMatch) {
      return res.status(404).json({
        message: "Incorrect email or password!",
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

const getUserData = async (req, res) => {
  const user = req.user;

  try {
    if (!user) {
      res.status(404).json({
        message: "User not found. Please contact support!",
      });
    }

    res.status(200).json({
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const updateUserData = async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, email, oldPassword, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check old password if newPassword is being updated
    if (newPassword) {
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Old password is incorrect!" });
      }

      user.password = newPassword;
    }

    // Update other fields
    if (name) user.name = name;
    if (email) user.email = email;

    await user.save();

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = {
  createUser,
  userLogin,
  getUserData,
  updateUserData,
};
