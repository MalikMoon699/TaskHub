// src/routes/project.routes.js
import express from "express";
import {
  createProject,
  getprojects,
} from "../controllers/project.controller.js";

const router = express.Router();

router.post("/", createProject);
router.get("/:workspaceId", getprojects);

export default router;
