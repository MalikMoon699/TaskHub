// src/routes/workSpace.routes.js
import express from "express";
import { createWorkSpace } from "../controllers/workSpace.controller.js";

const router = express.Router();

router.post("/", createWorkSpace);

export default router;
