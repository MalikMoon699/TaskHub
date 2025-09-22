// src/routes/task.routes.js
import express from "express";
import {
  createTask,
  getTasksByProject,
  getProjectMembers,
  updateTaskStatus,
} from "../controllers/task.controller.js";

const router = express.Router();

router.post("/", createTask);

router.get("/:projectId", getTasksByProject);

router.get("/members/:projectId", getProjectMembers);

router.put("/:taskId/status", updateTaskStatus);

export default router;
