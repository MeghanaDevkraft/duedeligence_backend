import { Router } from "express";
import { submitResponses, getResponsesByProject } from "../controllers/responses";

const router = Router();
router.post("/", submitResponses);
router.get("/:projectId", getResponsesByProject);

export default router;
