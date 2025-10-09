// src/controllers/project.controller.js
import Project from "../models/project.model.js";
import WorkSpaces from "../models/workSpace.model.js";
import Task from "../models/task.model.js";

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

export const UpdateProjectDetails = async (req, res) => {
  try {
    const { projectId } = req.params;
    const {
      title,
      discription,
      status,
      startDate,
      dueDate,
      workspaceId,
      members,
      progress,
    } = req.body;

    // Fetch the project
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Update fields (only those provided)
    if (title !== undefined) project.title = title;
    if (discription !== undefined) project.discription = discription;
    if (status !== undefined) project.status = status;
    if (startDate !== undefined) project.startDate = startDate;
    if (dueDate !== undefined) project.dueDate = dueDate;
    if (progress !== undefined) project.progress = progress;
    if (members !== undefined) project.members = members;

    // Handle workspace reassignment (optional)
    if (workspaceId && !project.workSpaces.includes(workspaceId)) {
      // Remove project from old workspaces
      await WorkSpaces.updateMany(
        { projects: projectId },
        { $pull: { projects: projectId } }
      );

      // Add to new workspace
      await WorkSpaces.findByIdAndUpdate(workspaceId, {
        $push: { projects: projectId },
      });

      project.workSpaces = [workspaceId];
    }

    await project.save();

    res.status(200).json({
      message: "Project details updated successfully",
      project,
    });
  } catch (error) {
    console.error("Error updating project details:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const DeleteProjectDetails = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    await Task.deleteMany({ project: projectId });

    await WorkSpaces.updateMany(
      { projects: projectId },
      { $pull: { projects: projectId } }
    );
    await Project.findByIdAndDelete(projectId);

    res.status(200).json({
      message: "Project and its related tasks deleted successfully",
      projectId,
    });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ message: "Server error", error: error.message });
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