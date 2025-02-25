const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const {
  createTask,
  getAllTasks,
  getTask,
  deleteTask,
  updateTask,
} = require("../controllers/taskController");

const router = express.Router();

router.post("/create-task", protect, createTask);

router.get("/get-all-tasks", protect, getAllTasks);
router.get("/get-task/:id", protect, getTask);

router.get("/delete-task/:id", protect, deleteTask);
router.patch("/update-task/:id", protect, updateTask);

module.exports = router;
