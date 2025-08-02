import { Router } from "express";
import * as wordSetController from "../controllers/wordSetController";

const router = Router();

router.get("/", wordSetController.getAllWordSets);
router.get("/:id/texts", wordSetController.getTextsByWordSet);
router.get("/:id/words", wordSetController.getWordsBySet);

// Новий/оновлений роут:
router.get("/:id/exercises", wordSetController.getExercisesByWordSet);
router.get(
  "/:set_id/exercises/:exercise_id",
  wordSetController.getExerciseDetailForWordSet
);

export default router;
