const { sign } = require("jsonwebtoken");
const User = require("../models/User");
const sendEmail = require("../utils/email");
const crypto = require("crypto");

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

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    res.status(404).json({
      message: "User does not exists!",
    });
  }
  try {
    const resetToken = await user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/users/reset-password/${resetToken}}`;

    const message = `Forgot your password? Reset using this URL ${resetURL}`;

    await sendEmail({
      email: user.email,
      subject: "Your Password Reset Token (valid for 10 min)",
      message,
    });

    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordTokenExpires = undefined;
    await user.save(validateBeforeSave(false));

    res.status(500).json({
      message: err.message,
    });
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await findOne({
      passwordResetToken: hashedToken,
      passwordTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      res.status(400).json({
        message: "Token is invalid or has expired.",
      });
      next();
    }

    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordTokenExpires = undefined;
    user.passwordChangedAt = Date.new();

    await user.save();

    const token = sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    return res.status(200).json({
      success: true,
      token,
    });
  } catch (err) {
    res.status(404).json({
      message: "Unable to validate token!",
    });
  }
};

module.exports = {
  createUser,
  userLogin,
  getUserData,
  forgotPassword,
  resetPassword,
};
