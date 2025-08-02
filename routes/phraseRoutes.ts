import { Router } from "express";
import * as phraseController from "../controllers/phraseController";

const router = Router();

router.get("/", phraseController.getPhrases);

export default router;
