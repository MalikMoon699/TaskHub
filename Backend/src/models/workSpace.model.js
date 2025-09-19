// src/models/workSpace.model.js
import mongoose from "mongoose";

const workSpacesSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    discription: { type: String },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    projects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
    workspaceColor: { type: String, required: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const WorkSpaces = mongoose.model("WorkSpaces", workSpacesSchema);
export default WorkSpaces;
