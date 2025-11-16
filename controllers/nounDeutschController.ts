import { Request, Response } from "express";
import db from "../models";

const Word = db.Word;
const NounDeutsch = db.NounDeutsch;
const WordTranslation = db.WordTranslation;

export const getNounsByWordSet = async (req: Request, res: Response) => {
  try {
    const { word_set_id } = req.params;
    const interfaceLanguage = (req.query.interface_language as string) || "uk";

    // Знаходимо всі слова для word_set_id
    const words = await Word.findAll({
      where: { word_set_id: Number(word_set_id) },
      attributes: ["id", "word"],
      include: [
        {
          model: NounDeutsch,
          as: "nounDeutsch",
          required: true, // тільки слова, які є іменниками
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
