// src/routes/auth.routes.js
import express from "express";
import {
  signUp,
  login,
  googleLogin,
  getUserData,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);
router.post("/google-login", googleLogin);
router.get("/user", verifyToken, getUserData);

export default router;
