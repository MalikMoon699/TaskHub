// src/middlewares/auth.middleware.js
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("JWT error:", err);
      return res.status(403).json({ message: "Failed to authenticate token" });
    }

    req.user = decoded;
    next();
  });
};