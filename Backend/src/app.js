// src/app.js
import { PORT, FRONTEND_URL } from "./config/env.js";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes.js";
import workspaces from "./routes/workSpace.routes.js";
import project from "./routes/project.routes.js";
import taskRoutes from "./routes/task.routes.js";
import connectToDB from "./database/mongodb.js";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://task-hub-dusky.vercel.app",
  FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("CORS blocked for origin:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
    ],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

app.options("*", cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

const startServer = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await connectToDB();
    console.log("MongoDB connected successfully");

    app.use("/api/auth", authRoutes);
    app.use("/api/workspaces", workspaces);
    app.use("/api/project", project);
    app.use("/api/tasks", taskRoutes);

    app.get("/", (req, res) => {
      res.send("Welcome to the Server API");
    });

    app.use((error, req, res, next) => {
      if (error.message === "Not allowed by CORS") {
        return res.status(403).json({
          success: false,
          message: "CORS policy violation",
        });
      }
      next(error);
    });

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

export default app;
