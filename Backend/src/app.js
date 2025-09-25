import { PORT, FRONTEND_URL } from "./config/env.js";

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes.js";
import workspaces from "./routes/workSpace.routes.js";
import project from "./routes/project.routes.js";
import taskRoutes from "./routes/task.routes.js";
import { connectWithRetry } from "./utils/databaseRetry.js";

import connectToDB from "./database/mongodb.js";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://task-hub-dusky.vercel.app",
  FRONTEND_URL, // Use environment variable
].filter(Boolean); // Remove any undefined values

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
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
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

// Add error handling middleware
app.use((error, req, res, next) => {
  if (error.message === "Not allowed by CORS") {
    return res.status(403).json({ message: "CORS policy violation" });
  }
  next(error);
});

app.use(morgan("dev"));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/workspaces", workspaces);
app.use("/api/project", project);
app.use("/api/tasks", taskRoutes);


app.get('/api/health', async (req, res) => {
  try {
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    res.json({ 
      status: 'OK', 
      database: dbStatus,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ status: 'Error', error: error.message });
  }
});

app.get("/", (req, res) => {
  res.send("Welcome to the Server API");
});

const startServer = async () => {
  try {
    await connectWithRetry(connectToDB);

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};
startServer();
app.listen(PORT, async () => {
  await connectToDB();
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
