import { Router } from "express";
import { createModule, getModules, getModuleById, updateModule } from "../controllers/modules";

const router = Router();
router.post("/", createModule);
router.get("/", getModules);
router.get("/:id", getModuleById);
router.put("/:id", updateModule);
export default router;
