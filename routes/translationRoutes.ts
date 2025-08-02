import { Router } from "express";
import * as translationController from "../controllers/translationController";

const router = Router();

router.get("/", translationController.getTranslations);

export default router;
