import { Request, Response } from "express";
import db from "../models";

const Language = db.Language;

export const getLearningLanguages = async (req: Request, res: Response) => {
  try {
    // Повертаємо лише мови з кодами 'de' та 'en'
    const learningLanguages = await Language.findAll({
      where: {
        code: ["de", "en"],
      },
      attributes: ["id", "code", "name"],
    });

    res.json({ success: true, data: learningLanguages });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
