import { PORT } from "./config/env.js";

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes.js";
import workspaces from "./routes/workSpace.routes.js";
import project from "./routes/project.routes.js";
import taskRoutes from "./routes/task.routes.js";

import connectToDB from "./database/mongodb.js";

connectToDB();

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://task-hub-dusky.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  next();
});
app.use(morgan("dev"));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/workspaces", workspaces);
app.use("/api/project", project);
app.use("/api/tasks", taskRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the Server API");
});

app.listen(PORT, async () => {
  await connectToDB();
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
