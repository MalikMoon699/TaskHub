// src/routes/auth.routes.js
import express from "express";
import { signUp, login, googleLogin } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);
router.post("/google-login", googleLogin);

export default router;
