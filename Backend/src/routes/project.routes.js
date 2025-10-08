// src/routes/project.routes.js
import express from "express";
import {
  createProject,
  getProjectsByWorkspace,
  getProjectMembers,
  UpdateProjectStatus,
  UpdateProjectDetails,
  DeleteProjectDetails,
} from "../controllers/project.controller.js";

const router = express.Router();

router.post("/", createProject);

router.get("/:workspaceId", getProjectsByWorkspace);

router.get("/members/:projectId", getProjectMembers);

router.put("/:projectId/status", UpdateProjectStatus);

router.put("/:projectId/details", UpdateProjectDetails);

router.delete("/:projectId/delete", DeleteProjectDetails);

export default router;
