const Task = require("../models/Task");

const createTask = async function (req, res) {
  try {
    const { title, description, priority, project, labels, dueDate } = req.body;
    const userId = req.user.id;

    if (!title) {
      return res.status(400).json({
        message: "Title is missing!",
      });
    }

    //create a task instance from model
    const newTask = await Task({
      title,
      description,
      priority,
      project,
      labels,
      dueDate,
      user: userId,
    });

    //save to mongodb
    await newTask.save();

    //respond
    res.status(201).json({
      message: "Task created successfully!",
      data: newTask,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error!",
    });
  }
};

const getAllTasks = async function (req, res) {
  try {
    const userId = req.user.id;
    const { priority, project, labels } = req.query;

    let filter = {};
    if (priority) filter.priority = priority;
    if (project) filter.project = project;
    if (labels) filter.labels = { $in: labels.split(",") };

    const tasks = await Task.find({
      user: userId,
      ...filter,
    });

    return res.status(200).json({
      success: true,
      data: {
        user: req.user,
        tasks,
      },
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error!",
    });
  }
};

const getTask = async function (req, res) {
  try {
    const taskId = req.params.id;

    const task = await Task.findById(taskId);

    if (task) {
      return res.status(200).json({
        success: true,
        data: task,
      });
    }
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error!",
    });
  }
};

const deleteTask = async function (req, res) {
  try {
    const taskId = req.params.id;

    const task = await Task.findByIdAndDelete(taskId);

    if (!task) {
      return res.status(404).json({
        message: "Task not found!",
      });
    }

    return res.status(200).json({
      message: "Task Deleted Successfully!",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error!",
    });
  }
};

const updateTask = async function (req, res) {
  try {
    const taskId = req.params.id;
    const updates = req.body;

    const task = await Task.findByIdAndUpdate(taskId, updates, {
      new: true,
      runValidators: true,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not Found!",
      });
    }

    return res.status(200).json({
      success: true,
      data: task,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error!",
    });
  }
};

module.exports = { createTask, getAllTasks, getTask, deleteTask, updateTask };
