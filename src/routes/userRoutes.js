const express = require("express");
const {
  createUser,
  userLogin,
  getUserData,
  updateUserData,
} = require("../controllers/userController");

const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/signup", createUser);
router.post("/login", userLogin);

router.get("/get-user-data", protect, getUserData);
router.put("/update-user-data/:id", protect, updateUserData);

module.exports = router;
