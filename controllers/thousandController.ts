import { Request, Response } from "express";
import db from "../models";

const Thousand = db.Thousand;
const WordSet = db.WordSet;

// GET /api/thousands?language_id=1 — всі тисячі (за мовою, якщо вказано)
export const getAllThousands = async (req: Request, res: Response) => {
  try {
    const languageId = req.query.language_id
      ? Number(req.query.language_id)
      : null;

    const whereClause = languageId ? { language_id: languageId } : {};

    const data = await Thousand.findAll({
      where: whereClause,
      attributes: ["id", "name", "description"],
    });

    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET /api/thousands/:id/word-sets — всі комплекти для тисячі
export const getWordSetsByThousand = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const sets = await WordSet.findAll({
      where: { thousand_id: id },
      attributes: ["id", "word_set"],
    });

    res.json({ success: true, data: sets });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
