const express = require("express");
const {
  createUser,
  userLogin,
  getUserData,
} = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/signup", createUser);
router.post("/login", userLogin);

router.get("/get-user-data", protect, getUserData);

module.exports = router;
