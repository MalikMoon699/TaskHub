import { PORT } from "./config/env.js";

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes.js";
import createWorkSpace from "./routes/workSpace.routes.js";

import connectToDB from "./database/mongodb.js";

const app = express();

app.use(cors());
app.use(morgan("dev"));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/createWorkSpace", createWorkSpace);

app.get("/", (req, res) => {
  res.send("Welcome to the Server API");
});

app.listen(PORT, async () => {
  await connectToDB();
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
