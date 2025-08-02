import { Request, Response } from "express";
import db from "../models";

const Translation = db.Translation;

export const getTranslations = async (req: Request, res: Response) => {
  try {
    // Парсимо параметри з query, приводимо phrase_id до числа, якщо потрібно
    const phrase_id_raw = req.query.phrase_id;
    const lang = req.query.lang as string | undefined;

    const where: Record<string, any> = {};

    if (phrase_id_raw !== undefined) {
      const phrase_id = Number(phrase_id_raw);
      if (!isNaN(phrase_id)) {
        where.phrase_id = phrase_id;
      } else {
        return res
          .status(400)
          .json({ success: false, error: "Invalid phrase_id" });
      }
    }

    if (lang) where.language_code = lang;

    const translations = await Translation.findAll({
      where,
      attributes: [
        "id",
        "phrase_id",
        "field",
        "language_code",
        "translated_text",
      ],
    });

    res.json({ success: true, data: translations });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
