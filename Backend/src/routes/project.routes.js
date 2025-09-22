// src/routes/project.routes.js
import express from "express";
import {
  createProject,
  getProjectsByWorkspace,
  getProjectMembers,
  UpdateProjectStatus,
} from "../controllers/project.controller.js";

const router = express.Router();

router.post("/", createProject);

router.get("/:workspaceId", getProjectsByWorkspace);

router.get("/members/:projectId", getProjectMembers);

router.put("/:projectId/status", UpdateProjectStatus);

export default router;
