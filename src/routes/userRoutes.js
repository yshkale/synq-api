const express = require("express");
const {
  createUser,
  userLogin,
  getUserData,
  forgotPassword,
  resetPassword,
} = require("../controllers/userController");

const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/signup", createUser);
router.post("/login", userLogin);

router.post("/forgot-password", forgotPassword);
router.patch("/reset-password/:token", resetPassword);

router.get("/get-user-data", protect, getUserData);

module.exports = router;
