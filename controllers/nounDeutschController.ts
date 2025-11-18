import { Request, Response } from "express";
import db from "../models";

const Word = db.Word;
const NounDeutsch = db.NounDeutsch;
const WordTranslation = db.WordTranslation;

export const getNounsByWordSet = async (req: Request, res: Response) => {
  try {
    const { word_set_id } = req.params;
    const interfaceLanguage = (req.query.interface_language as string) || "uk";

    const wordSetId = Number(word_set_id);

    // ✅ Обчислюємо ID слів: позиції 6-23 у word_set
    // Якщо word_set_id = 1: слова з ID від 6 до 23 (30 * 0 + 6 = 6, 30 * 0 + 23 = 23)
    // Якщо word_set_id = 2: слова з ID від 36 до 53 (30 * 1 + 6 = 36, 30 * 1 + 23 = 53)
    const startId = (wordSetId - 1) * 30 + 6;
    const endId = (wordSetId - 1) * 30 + 23;

    // Генеруємо масив ID від startId до endId включно
    const wordIds = [];
    for (let i = startId; i <= endId; i++) {
      wordIds.push(i);
    }

    // ✅ Знаходимо слова-іменники з цими ID
    const words = await Word.findAll({
      where: {
        id: wordIds,
        word_set_id: wordSetId, // Додаткова перевірка належності до word_set
      },
      attributes: ["id", "word"],
      include: [
        {
          model: NounDeutsch,
          as: "nounDeutsch",
          required: true, // Тільки слова, які є іменниками
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
      order: [["id", "ASC"]], // Сортування по ID для збереження порядку
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
