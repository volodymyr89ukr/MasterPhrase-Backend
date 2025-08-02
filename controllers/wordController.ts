import { Request, Response } from "express";
import db from "../models";

const Word = db.Word;

export const getWordById = async (req: Request, res: Response) => {
  try {
    const word = await Word.findByPk(req.params.id, {
      attributes: ["id", "word", "word_set_id", "created_at"],
    });
    if (!word)
      return res.status(404).json({ success: false, error: "Word not found" });
    res.json({ success: true, data: word });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
