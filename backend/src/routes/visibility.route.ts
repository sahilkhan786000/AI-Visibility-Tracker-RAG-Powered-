import { Router } from "express";  
import { checkVisibility, searchSimilarResponses } from "../controllers/visibility.controller";  
  
const router = Router();  
  
router.post("/check", checkVisibility);  
router.post("/search", searchSimilarResponses);  
  
export default router;