import { Router } from "express";
import { 
  submitResponses, 
  submitSingleResponse,
  getResponsesByProject, 
  getResponsesByModule,
  deleteResponsesByProject 
} from "../controllers/responses";

const router = Router();

router.post("/", submitResponses);
router.post("/single", submitSingleResponse);
router.get("/:projectId", getResponsesByProject);
router.get("/:projectId/:moduleId", getResponsesByModule);
router.delete("/:projectId", deleteResponsesByProject);

export default router;
