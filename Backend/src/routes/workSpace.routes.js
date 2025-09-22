// src/routes/workSpace.routes.js
import express from "express";
import {
  createWorkSpace,
  getUserWorkSpaces,
  getWorkspaceMembers,
  addMemberToWorkspace,
  sendWorkspaceInvite,
  acceptWorkspaceInvite,
  declineWorkspaceInvite,
  getWorkspaceById,
  removeMemberFromWorkspace,
} from "../controllers/workSpace.controller.js";

const router = express.Router();

router.post("/", createWorkSpace);
router.get("/:userId", getUserWorkSpaces);

router.get("/workspace/:workspaceId", getWorkspaceById);
router.get("/members/:workspaceId", getWorkspaceMembers);
router.post("/members/:workspaceId", addMemberToWorkspace);
router.delete("/members/:workspaceId/:memberId", removeMemberFromWorkspace);

router.post("/invite/:workspaceId", sendWorkspaceInvite);
router.get("/invite/accept/:token", acceptWorkspaceInvite);
router.get("/invite/decline/:token", declineWorkspaceInvite);

export default router;
