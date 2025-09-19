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

    const newWorkspace = new WorkSpaces({
      name,
      discription,
      workspaceColor,
      members: [userId],
    });

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

export const getUserWorkSpaces = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required!" });
    }

    const user = await User.findById(userId).populate("workSpaces");

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.status(200).json({
      message: "Workspaces fetched successfully",
      workSpaces: user.workSpaces,
    });
  } catch (error) {
    console.error("Error fetching workspaces:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getWorkspaceMembers = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    if (!workspaceId) {
      return res.status(400).json({ message: "Workspace ID is required!" });
    }

    const workspace = await WorkSpaces.findById(workspaceId).populate(
      "members",
      "name email" 
    );

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    res.status(200).json({
      message: "Members fetched successfully",
      members: workspace.members,
    });
  } catch (error) {
    console.error("Error fetching workspace members:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const addMemberToWorkspace = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { userId } = req.body;

    if (!workspaceId || !userId) {
      return res
        .status(400)
        .json({ message: "Workspace ID and User ID are required" });
    }

    const workspace = await WorkSpaces.findById(workspaceId);
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    if (workspace.members.includes(userId)) {
      return res
        .status(400)
        .json({ message: "User is already a member of this workspace" });
    }

    workspace.members.push(userId);
    await workspace.save();

    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { workSpaces: workspaceId } }, 
      { new: true }
    );

    res.status(200).json({ message: "Member added successfully", workspace });
  } catch (error) {
    console.error("Error adding member:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};