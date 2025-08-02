import { Router } from "express";
import * as wordSetExerciseController from "../controllers/wordSetExerciseController";

const router = Router();

// Отримати вправи для конкретного word set
router.get(
  "/:wordSetId/exercises",
  wordSetExerciseController.getExercisesForWordSet
);

export default router;
