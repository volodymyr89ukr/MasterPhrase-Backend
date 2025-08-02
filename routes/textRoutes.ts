import { Router, Request, Response } from "express";
import * as textController from "../controllers/textController";

const router = Router();

// Всі назви текстів для word set
router.get("/by-word-set/:wordSetId", textController.getTextsByWordSet);

// Отримати повний текст і переклад
router.get("/:id", textController.getTextWithTranslation);

// Додатково - для підтримки GET /api/texts?word_set_id=1
router.get("/", async (req: Request, res: Response) => {
  const { word_set_id } = req.query;
  if (!word_set_id)
    return res
      .status(400)
      .json({ success: false, error: "word_set_id required" });
  return textController.getTextsByWordSetQuery(req, res);
});

export default router;
