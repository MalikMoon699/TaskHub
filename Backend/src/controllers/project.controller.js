// src/controllers/project.controller.js
import Project from "../models/project.model.js";
import WorkSpaces from "../models/workSpace.model.js";

export const createProject = async (req, res) => {
  try {
    const {
      title,
      discription,
      status,
      startDate,
      dueDate,
      workspaceId,
      members,
    } = req.body;

    if (!title)
      return res.status(400).json({ message: "Project title is required!" });
    if (!startDate)
      return res
        .status(400)
        .json({ message: "Project startDate is required!" });
    if (!dueDate)
      return res.status(400).json({ message: "Project dueDate is required!" });
    if (!workspaceId)
      return res.status(400).json({ message: "Workspace ID is required!" });

    const newProject = new Project({
      title,
      discription,
      status,
      startDate,
      dueDate,
      workSpaces: [workspaceId],
      members: members || [],
    });

    await newProject.save();

    await WorkSpaces.findByIdAndUpdate(
      workspaceId,
      { $push: { projects: newProject._id } },
      { new: true }
    );

    res.status(201).json({
      message: "Project created and added to workspace successfully",
      project: newProject,
    });
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getProjectsByWorkspace = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { userId } = req.query;

    const workspace = await WorkSpaces.findById(workspaceId);
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    let projects = [];
    if (workspace.createdBy.toString() === userId) {
      projects = await Project.find({ workSpaces: workspaceId });
    } else {
      projects = await Project.find({
        workSpaces: workspaceId,
        members: userId,
      });
    }

    res.status(200).json({ projects });
  } catch (err) {
    console.error("Error fetching projects:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const UpdateProjectStatus = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { status, progress } = req.body;

    console.log("Received progress:", progress);

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    project.status = status;
    if (progress !== undefined) {
      project.progress = progress;
    }
    await project.save();

    res.status(200).json({ message: "Project status updated", project });
  } catch (err) {
    console.error("Error updating project status:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getProjectMembers = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId).populate(
      "members",
      "name email"
    );

    if (!project) return res.status(404).json({ message: "Project not found" });

    res.status(200).json({
      message: "Members fetched successfully",
      members: project.members,
    });
  } catch (error) {
    console.error("Error fetching members:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};