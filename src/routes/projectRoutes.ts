import { Router } from "express";
import { createProject, getProjects, attachModules } from "../controllers/projects";
const router = Router();
router.get("/", getProjects);
router.post("/", createProject);
router.post("/:projectId/modules", attachModules);
export default router;
