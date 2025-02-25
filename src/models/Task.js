const { Schema, model } = require("mongoose");

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    priority: {
      type: String,
      enum: ["high", "medium", "low"],
      trim: true,
      default: "",
    },
    project: {
      type: String,
      trim: true,
      default: "",
    },
    labels: {
      type: [String],
      default: [],
    },
    dueDate: {
      type: Date,
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Task = model("Task", taskSchema);

module.exports = Task;
