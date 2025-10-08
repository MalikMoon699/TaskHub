// src/controllers/project.controller.js
import Task from "../models/task.model.js";
import Project from "../models/project.model.js";

export const createTask = async (req, res) => {
  try {
    const {
      title,
      discription,
      status = "todo",
      dueDate,
      projectId,
      assignedTo = [],
    } = req.body;

    if (!title)
      return res.status(400).json({ message: "Task title is required!" });
    if (!dueDate)
      return res.status(400).json({ message: "Task dueDate is required!" });
    if (!projectId)
      return res.status(400).json({ message: "Project ID is required!" });

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const newTask = new Task({
      title,
      discription,
      status,
      dueDate: new Date(dueDate),
      project: projectId,
      assignedTo,
    });

    await newTask.save();

    await Project.findByIdAndUpdate(
      projectId,
      { $push: { tasks: newTask._id } },
      { new: true, useFindAndModify: false }
    );

    res.status(201).json({
      message: "Task created and added to Project successfully",
      task: newTask,
    });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getTasksByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { userId, workspaceOwner } = req.query;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const query = { project: projectId };
    if (userId && workspaceOwner && userId !== workspaceOwner) {
      query.assignedTo = userId;
    }

    const tasks = await Task.find(query)
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ tasks });
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getProjectMembers = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId).populate(
      "members",
      "name email"
    );

    if (!project) return res.status(404).json({ message: "Project not found" });

    res.status(200).json({
      message: "Members fetched successfully",
      members: project.members || [],
    });
  } catch (error) {
    console.error("Error fetching members:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;

    if (!status) return res.status(400).json({ message: "Status is required" });

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.status = status;

    await task.save();

    res.status(200).json({ message: "Task updated", task });
  } catch (err) {
    console.error("Error updating task status:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const { taskId } = req.params;

    if (!taskId) {
      return res.status(400).json({ message: "Task ID is required" });
    }

    const task = await Task.findById(taskId)
      .populate("assignedTo", "name email")
      .populate("project", "title description");

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({
      message: "Task fetched successfully",
      task,
    });
  } catch (error) {
    console.error("Error fetching task by ID:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateTaskDetails = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title, discription, status, dueDate, assignedTo = [] } = req.body;

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (title !== undefined) task.title = title;
    if (discription !== undefined) task.discription = discription;
    if (status !== undefined) task.status = status;
    if (dueDate !== undefined) task.dueDate = new Date(dueDate);
    if (assignedTo.length) task.assignedTo = assignedTo;

    await task.save();

    const updatedTask = await Task.findById(taskId)
      .populate("assignedTo", "name email")
      .populate("project", "title");

    res.status(200).json({
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const DeleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    await Project.findByIdAndUpdate(task.project, {
      $pull: { tasks: taskId },
    });

    // Delete task
    await Task.findByIdAndDelete(taskId);

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
