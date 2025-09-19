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
      members: members || [], // ✅ add members array
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


export const getprojects = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    if (!workspaceId) {
      return res.status(400).json({ message: "Workspace ID is required!" });
    }

  const workspace = await WorkSpaces.findById(workspaceId).populate({
    path: "projects",
    populate: { path: "members", select: "name email" },
  });

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found!" });
    }

    res.status(200).json({
      message: "Projects fetched successfully",
      projects: workspace.projects,
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
