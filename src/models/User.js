const { hash } = require("bcryptjs");
const { compare } = require("bcryptjs");
const { genSalt } = require("bcryptjs");

const crypto = require("crypto");
const mongoose = require("mongoose");

// schema (structure)
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordTokenExpires: Date,
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  // hash the password using bcrypt js
  if (!this.isModified("password")) return next();

  const salt = await genSalt(10);
  this.password = await hash(this.password, salt);

  next();
});

//add method to match passwords
userSchema.methods.matchPasswords = async function (userPassword) {
  return await compare(userPassword, this.password);
};

//add method to create a password reset token
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordTokenExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

// model
const User = mongoose.model("User", userSchema);

module.exports = User;
