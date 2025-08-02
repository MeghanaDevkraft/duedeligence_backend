import { Router } from "express";
import { addRule } from "../controllers/rules";

const router = Router();
router.post("/:projectId/rules", addRule);
export default router;
