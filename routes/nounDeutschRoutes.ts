import { Router } from "express";
import * as nounDeutschController from "../controllers/nounDeutschController";

const router = Router();

// GET /api/nouns/word-set/:word_set_id?interface_language=uk
router.get("/word-set/:word_set_id", nounDeutschController.getNounsByWordSet);

export default router;
