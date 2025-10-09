// src/controllers/workSpace.controller.js
import crypto from "crypto";
import Invite from "../models/invite.model.js";
import { transporter } from "../config/mailer.js";
import WorkSpaces from "../models/workSpace.model.js";
import User from "../models/user.model.js";
import Project from "../models/project.model.js";
import Task from "../models/task.model.js";

export const createWorkSpace = async (req, res) => {
  try {
    const { name, discription, workspaceColor, userId } = req.body;

    if (!name || !workspaceColor || !userId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newWorkspace = new WorkSpaces({
      name,
      discription,
      workspaceColor,
      members: [userId],
      createdBy: userId,
    });

    await newWorkspace.save();

    await User.findByIdAndUpdate(userId, {
      $push: { workSpaces: newWorkspace._id },
    });

    res.status(201).json({
      message: "Workspace created successfully",
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
    const user = await User.findById(userId).populate("workSpaces");

    if (!user) return res.status(404).json({ message: "User not found!" });

    res.status(200).json({
      message: "Workspaces fetched successfully",
      workSpaces: user.workSpaces,
    });
  } catch (error) {
    console.error("Error fetching workspaces:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getWorkspaceById = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const workspace = await WorkSpaces.findById(workspaceId)
      .populate("members", "firstName lastName email")
      .populate("projects");

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    res.status(200).json({
      message: "Workspace fetched successfully",
      workspace,
    });
  } catch (error) {
    console.error("Error fetching workspace:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getWorkspaceMembers = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const workspace = await WorkSpaces.findById(workspaceId).populate(
      "members",
      "name email"
    );

    if (!workspace)
      return res.status(404).json({ message: "Workspace not found" });

    res.status(200).json({
      message: "Members fetched successfully",
      members: workspace.members,
    });
  } catch (error) {
    console.error("Error fetching members:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const addMemberToWorkspace = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { userId } = req.body;

    const workspace = await WorkSpaces.findById(workspaceId);
    if (!workspace)
      return res.status(404).json({ message: "Workspace not found" });

    if (workspace.members.includes(userId)) {
      return res.status(400).json({ message: "User already in workspace" });
    }

    workspace.members.push(userId);
    await workspace.save();

    await User.findByIdAndUpdate(userId, {
      $addToSet: { workSpaces: workspaceId },
    });

    res.json({ message: "Member added successfully", workspace });
  } catch (error) {
    console.error("Error adding member:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const sendWorkspaceInvite = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { email, inviterId } = req.body;

    const workspace = await WorkSpaces.findById(workspaceId);
    if (!workspace)
      return res.status(404).json({ message: "Workspace not found" });

    const invitedUser = await User.findOne({ email });
    if (!invitedUser)
      return res.status(404).json({ message: "User not found" });

    if (workspace.members.includes(invitedUser._id)) {
      return res.status(400).json({ message: "User already in workspace" });
    }

    const token = crypto.randomBytes(32).toString("hex");

    const invite = new Invite({
      workspace: workspaceId,
      invitedUser: invitedUser._id,
      inviter: inviterId,
      token,
    });

    await invite.save();

    const inviteLink = `${process.env.FRONTEND_URL}/invite/${token}`;

    await transporter.sendMail({
      from: `"Workspace Invite" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Invitation to join ${workspace.name}`,
      html: `
        <h2>You’ve been invited to join <b>${workspace.name}</b></h2>
        <p>Click below to accept the invite:</p>
        <p>
          <a href="${inviteLink}" 
             style="background:#4f46e5;color:white;padding:10px 15px;
             text-decoration:none;border-radius:5px;">
            Accept Invite
          </a>
        </p>
      `,
    });

    res.status(201).json({ message: "Invite sent successfully", invite });
  } catch (err) {
    console.error("Error sending invite:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const acceptWorkspaceInvite = async (req, res) => {
  try {
    const { token } = req.params;
    const invite = await Invite.findOne({ token }).populate(
      "workspace invitedUser"
    );

    if (!invite || invite.status !== "pending") {
      return res.status(400).json({ message: "Invalid or expired invite" });
    }

    invite.status = "accepted";
    await invite.save();

    const workspace = await WorkSpaces.findById(invite.workspace._id);
    workspace.members.push(invite.invitedUser._id);
    await workspace.save();

    await User.findByIdAndUpdate(invite.invitedUser._id, {
      $addToSet: { workSpaces: workspace._id },
    });

    res.json({ message: "Invite accepted", workspace });
  } catch (err) {
    console.error("Error accepting invite:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const declineWorkspaceInvite = async (req, res) => {
  try {
    const { token } = req.params;
    const invite = await Invite.findOne({ token });

    if (!invite || invite.status !== "pending") {
      return res.status(400).json({ message: "Invalid or expired invite" });
    }

    invite.status = "declined";
    await invite.save();

    res.json({ message: "Invite declined" });
  } catch (err) {
    console.error("Error declining invite:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const removeMemberFromWorkspace = async (req, res) => {
  try {
    const { workspaceId, memberId } = req.params;

    const workspace = await WorkSpaces.findById(workspaceId);
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    if (workspace.createdBy.toString() === memberId) {
      return res
        .status(400)
        .json({ message: "Owner cannot be removed from workspace" });
    }

    workspace.members = workspace.members.filter(
      (id) => id.toString() !== memberId
    );
    await workspace.save();

    await User.findByIdAndUpdate(memberId, {
      $pull: { workSpaces: workspaceId },
    });

    res.json({ message: "Member removed successfully", workspace });
  } catch (error) {
    console.error("Error removing member:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateWorkspace = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { name, discription, workspaceColor } = req.body;

    const workspace = await WorkSpaces.findById(workspaceId);
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    if (name) workspace.name = name;
    if (discription !== undefined) workspace.discription = discription;
    if (workspaceColor) workspace.workspaceColor = workspaceColor;

    await workspace.save();

    res.json({ message: "Workspace updated successfully", workspace });
  } catch (error) {
    console.error("Error updating workspace:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const transferWorkspaceOwnership = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { newOwnerId } = req.body;

    const workspace = await WorkSpaces.findById(workspaceId);
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    if (!workspace.members.includes(newOwnerId)) {
      return res.status(400).json({ message: "New owner must be a member" });
    }

    workspace.createdBy = newOwnerId;
    await workspace.save();

    res.json({ message: "Workspace ownership transferred", workspace });
  } catch (error) {
    console.error("Error transferring workspace:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteWorkspace = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const workspace = await WorkSpaces.findById(workspaceId);
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }
    const projects = await Project.find({ workSpaces: workspaceId }).select(
      "_id"
    );
    const projectIds = projects.map((p) => p._id);
    if (projectIds.length > 0) {
      await Task.deleteMany({ project: { $in: projectIds } });
    }
    await Project.deleteMany({ workSpaces: workspaceId });
    await WorkSpaces.findByIdAndDelete(workspaceId);
    await User.updateMany(
      { workSpaces: workspaceId },
      { $pull: { workSpaces: workspaceId } }
    );

    console.log(
      `✅ Workspace (${workspaceId}) deleted — removed ${projectIds.length} projects and their tasks`
    );
    return res
      .status(200)
      .json({ message: "Workspace and all related data deleted successfully" });
  } catch (error) {
    console.error("Error deleting workspace:", error);
    return res
      .status(500)
      .json({ message: "Error deleting workspace", error: error.message });
  }
};