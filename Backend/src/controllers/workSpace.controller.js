// src/controllers/workSpace.controller.js
import WorkSpaces from "../models/workSpace.model.js";
import User from "../models/user.model.js";

export const createWorkSpace = async (req, res) => {
  try {
    const { name, discription, workspaceColor, userId } = req.body;

    if (!name)
      return res.status(400).json({ message: "Workspace name is required!" });
    if (!workspaceColor)
      return res.status(400).json({ message: "Workspace color is required!" });
    if (!userId)
      return res.status(400).json({ message: "User ID is required!" });

    const newWorkspace = new WorkSpaces({ name, discription, workspaceColor });
    await newWorkspace.save();

    await User.findByIdAndUpdate(
      userId,
      { $push: { workSpaces: newWorkspace._id } },
      { new: true }
    );

    res.status(201).json({
      message: "Workspace created and added to user successfully",
      workspace: newWorkspace,
    });
  } catch (error) {
    console.error("Error creating workspace:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
