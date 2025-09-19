// src/routes/workSpace.routes.js
import express from "express";
import {
  createWorkSpace,
  getUserWorkSpaces,
  getWorkspaceMembers,
  addMemberToWorkspace,
} from "../controllers/workSpace.controller.js";

const router = express.Router();

router.post("/", createWorkSpace);
router.get("/members/:workspaceId", getWorkspaceMembers);
router.post("/members/:workspaceId", addMemberToWorkspace);
router.get("/:userId", getUserWorkSpaces);

export default router;
