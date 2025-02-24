const { hash } = require("bcryptjs");
const { compare } = require("bcryptjs");
const { genSalt } = require("bcryptjs");
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

// model
const User = mongoose.model("User", userSchema);

module.exports = User;
