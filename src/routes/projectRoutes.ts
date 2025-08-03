import { Router } from "express";
import { createProject, getProjects, getProject, updateProject, deleteProject, attachModules } from "../controllers/projects";
const router = Router();

router.get("/", getProjects);
router.get("/:projectId", getProject);
router.post("/", createProject);
router.put("/:projectId", updateProject);
router.delete("/:projectId", deleteProject);
router.post("/:projectId/modules", attachModules);

export default router;
