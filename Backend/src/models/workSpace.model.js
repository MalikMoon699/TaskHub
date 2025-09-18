// src/models/workSpace.model.js
import mongoose from "mongoose";

const workSpacesSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    discription: { type: String },
    workspaceColor: { type: String, required: true },
  },
  { timestamps: true }
);


const WorkSpaces = mongoose.model("WorkSpaces", workSpacesSchema);
export default WorkSpaces;
