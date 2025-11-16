import { Router } from "express";
import * as strongVerbDeutschController from "../controllers/strongVerbDeutschController";

const router = Router();

// GET /api/verbs/block/:block_number?interface_language=uk
router.get(
  "/block/:block_number",
  strongVerbDeutschController.getVerbsByBlockNumber
);

export default router;
