import { Request, Response } from "express";
import db from "../models";

const { Text, TextTranslation } = db;

// Всі назви текстів для комплекту (по :wordSetId) з перекладами заголовків
export const getTextsByWordSet = async (req: Request, res: Response) => {
  try {
    const wordSetId = req.params.wordSetId;
    const interfaceLanguage = (req.query.lang as string) || "uk";

    const texts = await Text.findAll({
      where: { word_set_id: wordSetId },
      attributes: ["id", "title"],
      include: [
        {
          model: TextTranslation,
          where: { language_code: interfaceLanguage },
          required: false,
          attributes: ["translated_text"],
        },
      ],
    });

    // Формуємо відповідь з перекладом заголовку
    const data = texts.map((text: any) => ({
      id: text.id,
      title: text.title,
      title_translation:
        text.TextTranslations && text.TextTranslations.length > 0
          ? text.TextTranslations[0].translated_text
          : null,
    }));

    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Повний текст + переклад (по :id, переклад - за параметром ?lang=)
export const getTextWithTranslation = async (req: Request, res: Response) => {
  try {
    const textId = req.params.id;
    const lang = (req.query.lang as string) || "uk";

    const text = await Text.findByPk(textId);
    if (!text)
      return res.status(404).json({ success: false, error: "Not found" });

    const translation = await TextTranslation.findOne({
      where: { text_id: textId, language_code: lang },
    });

    res.json({
      success: true,
      data: {
        text: text.text,
        translation: translation ? translation.translated_text : null,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Всі назви текстів для комплекту (по ?word_set_id=) з перекладами заголовків
export const getTextsByWordSetQuery = async (req: Request, res: Response) => {
  try {
    const wordSetId = req.query.word_set_id as string | undefined;
    const interfaceLanguage = (req.query.lang as string) || "uk";

    const texts = await Text.findAll({
      where: { word_set_id: wordSetId },
      attributes: ["id", "title"],
      include: [
        {
          model: TextTranslation,
          where: { language_code: interfaceLanguage },
          required: false,
          attributes: ["translated_text"],
        },
      ],
    });

    const data = texts.map((text: any) => ({
      id: text.id,
      title: text.title,
      title_translation:
        text.TextTranslations && text.TextTranslations.length > 0
          ? text.TextTranslations[0].translated_text
          : null,
    }));

    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
