import { Router } from "express";
import * as setContentController from "../controllers/setContentController";

const router = Router();

// GET /api/sets/:set_id/content?lang=uk
router.get("/:set_id/content", setContentController.getSetContent);

export default router;
