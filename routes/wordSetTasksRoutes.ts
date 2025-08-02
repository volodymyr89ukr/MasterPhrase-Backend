import { Router } from "express";
import * as wordSetTasksController from "../controllers/wordSetTasksController";

const router = Router();

// Завдання для конкретного word set і вправи
router.get(
  "/:wordSetId/:exerciseId",
  wordSetTasksController.getTasksForWordSetExercise
);

export default router;
