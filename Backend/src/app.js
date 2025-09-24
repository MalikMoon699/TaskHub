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

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://task-hub-dusky.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(cors());
app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/workspaces", workspaces);
app.use("/api/project", project);
app.use("/api/tasks", taskRoutes);

console.log(
  "GOOGLE_CLIENT_ID in production from backend--->",
  process.env.GOOGLE_CLIENT_ID
);

app.get("/", (req, res) => {
  // res.send("Welcome to the Server API");
app.get("/", (req, res) => {
  res.send(
    `GOOGLE_CLIENT_ID in production from backend ---> ${process.env.GOOGLE_CLIENT_ID}`
  );
});

});

app.listen(PORT, async () => {
  await connectToDB();
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
