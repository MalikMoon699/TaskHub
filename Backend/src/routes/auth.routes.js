// routes/auth.routes.js
import express from "express";
import {
  signUp,
  login,
  googleLogin,
  getUserData,
  updateUser,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { checkDBConnection } from "../middlewares/db.middleware.js";

const router = express.Router();

router.use(checkDBConnection);

router.post("/signup", signUp);
router.post("/login", login);
router.post("/google-login", googleLogin);
router.get("/user", verifyToken, getUserData);
router.put("/:userId", updateUser);

export default router;
