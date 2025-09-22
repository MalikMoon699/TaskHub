// src/routes/project.routes.js
import express from "express";
import {
  createProject,
  getProjectsByWorkspace,
} from "../controllers/project.controller.js";

const router = express.Router();

router.post("/", createProject);

router.get("/:workspaceId", getProjectsByWorkspace);

export default router;
