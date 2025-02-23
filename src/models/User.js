const { hash } = require("bcryptjs");
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

// hash the password using bcrypt js
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await genSalt(10);
  this.password = await hash(this.password, salt);

  next();
});

// model
const User = mongoose.model("User", userSchema);

module.exports = User;
