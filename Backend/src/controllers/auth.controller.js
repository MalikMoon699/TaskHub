// controllers/auth.controller.js
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { signUpSchema, loginSchema } from "../schemas/auth.schema.js";
import mongoose from "mongoose";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export const signUp = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        message: "Database connection not ready. Please try again.",
      });
    }

    const parsed = signUpSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ errors: parsed.error.errors });
    }

    const { name, email, password } = parsed.data;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const user = new User({ name, email, password });
    await user.save();

    res.status(201).json({
      message: "User created successfully",
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("signUp error:", error);

    if (
      error.name === "MongoNetworkError" ||
      error.name === "MongoTimeoutError"
    ) {
      return res
        .status(503)
        .json({ message: "Database connection issue. Please try again." });
    }

    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        message: "Database connection not ready. Please try again.",
      });
    }

    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ errors: parsed.error.errors });
    }

    const { email, password } = parsed.data;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        workSpaces: user.workSpaces || [],
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    if (
      error.name === "MongoNetworkError" ||
      error.name === "MongoTimeoutError"
    ) {
      return res
        .status(503)
        .json({ message: "Database connection issue. Please try again." });
    }

    res.status(500).json({ message: error.message });
  }
};
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token)
      return res.status(400).json({ message: "Google token required" });

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        name: name || "Google User",
        email,
        password: Math.random().toString(36).slice(-8),
      });

      if (picture) {
        user.profileImg = picture;
      }

      await user.save();
    }

    const jwtToken = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: "30d",
    });

    res.status(200).json({
      message: "Google login successful",
      token: jwtToken,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Google login error:", error);
    res.status(500).json({ message: "Failed to login with Google" });
  }
};

export const getUserData = async (req, res) => {
  try {
    const { id } = req.user;
    if (!id) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      message: "User data retrieved successfully",
      user,
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Failed to fetch user data" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Name cannot be empty" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name;
    await user.save();

    res.status(200).json({
      message: "User updated successfully",
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Failed to update user" });
  }
};
