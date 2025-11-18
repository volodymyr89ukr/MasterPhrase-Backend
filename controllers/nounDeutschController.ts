import { Request, Response } from "express";
import db from "../models";

const Word = db.Word;
const NounDeutsch = db.NounDeutsch;
const WordTranslation = db.WordTranslation;
const WordSet = db.WordSet;
const WordSetWord = db.WordSetWord; // ← Проміжна таблиця

export const getNounsByWordSet = async (req: Request, res: Response) => {
  try {
    const { word_set_id } = req.params;
    const interfaceLanguage = (req.query.interface_language as string) || "uk";

    // ✅ КРОК 1: Отримуємо ID слів через проміжну таблицю
    const wordSetWords = await WordSetWord.findAll({
      where: { word_set_id: Number(word_set_id) },
      attributes: ["word_id"],
    });

    const wordIds = wordSetWords.map((wsw: any) => wsw.word_id);

    if (wordIds.length === 0) {
      return res.json({ success: true, data: [] });
    }

    // ✅ КРОК 2: Знаходимо слова-іменники з цими ID
    const words = await Word.findAll({
      where: { id: wordIds },
      attributes: ["id", "word"],
      include: [
        {
          model: NounDeutsch,
          as: "nounDeutsch",
          required: true, // Тільки іменники
          attributes: [
            "id",
            "article",
            "gender",
            "plural",
            "plural_alt",
            "artikel_explanation",
            "plural_explanation",
          ],
        },
        {
          model: WordTranslation,
          as: "wordTranslations",
          where: { language_code: interfaceLanguage },
          required: false,
          attributes: ["translated_text"],
        },
      ],
    });

    const data = words.map((w: any) => ({
      word_id: w.id,
      word: w.word,
      translation:
        w.wordTranslations && w.wordTranslations.length > 0
          ? w.wordTranslations[0].translated_text
          : null,
      noun_id: w.nounDeutsch?.id || null,
      article: w.nounDeutsch?.article || null,
      gender: w.nounDeutsch?.gender || null,
      plural: w.nounDeutsch?.plural || null,
      plural_alt: w.nounDeutsch?.plural_alt || null,
      artikel_explanation: w.nounDeutsch?.artikel_explanation || null,
      plural_explanation: w.nounDeutsch?.plural_explanation || null,
    }));

    res.json({ success: true, data });
  } catch (error: any) {
    console.error("Error in getNounsByWordSet:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
