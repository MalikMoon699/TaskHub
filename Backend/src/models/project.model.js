// src/models/project.model.js
import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    discription: { type: String },
    status: { type: String, required: true, trim: true },
    startDate: { type: String, required: true, trim: true },
    dueDate: { type: String, required: true, trim: true },
    workSpaces: [{ type: mongoose.Schema.Types.ObjectId, ref: "WorkSpaces" }],
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);
export default Project;

