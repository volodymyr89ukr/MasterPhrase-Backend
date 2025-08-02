import { Router } from "express";
import * as exerciseController from "../controllers/exerciseController";

const router = Router();

router.get("/", exerciseController.getAllExercises);

export default router;
