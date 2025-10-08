// src/routes/task.routes.js
import express from "express";
import {
  createTask,
  getTasksByProject,
  getProjectMembers,
  updateTaskStatus,
  getTaskById,
  updateTaskDetails,
  DeleteTask,
} from "../controllers/task.controller.js";

const router = express.Router();

router.post("/", createTask);

router.get("/:projectId", getTasksByProject);

router.get("/members/:projectId", getProjectMembers);

router.get("/taskById/:taskId", getTaskById);

router.put("/:taskId/status", updateTaskStatus);

router.put("/edit/:taskId/details", updateTaskDetails);

router.delete("/:taskId/delete", DeleteTask);


export default router;
