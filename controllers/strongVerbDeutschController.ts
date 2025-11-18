import { Request, Response } from "express";
import db from "../models";

const Word = db.Word;
const StrongVerbDeutsch = db.StrongVerbDeutsch;
const WordTranslation = db.WordTranslation;

export const getVerbsByBlockNumber = async (req: Request, res: Response) => {
  try {
    const { block_number } = req.params;
    const interfaceLanguage = (req.query.interface_language as string) || "uk";

    // ✅ Знаходимо дієслова за block_number
    const verbs = await StrongVerbDeutsch.findAll({
      where: { block_number: Number(block_number) },
      attributes: [
        "id",
        "word_id",
        "ich",
        "du",
        "er_sie_es",
        "wir",
        "ihr",
        "sie_sie",
        "perfekt",
        "help_perfekt",
        "praeterium",
        "block_number",
      ],
      include: [
        {
          model: Word,
          attributes: ["id", "word"],
          where: { part_of_speech: "verb" }, // ← додатковий фільтр
          required: true,
          include: [
            {
              model: WordTranslation,
              as: "wordTranslations",
              where: { language_code: interfaceLanguage },
              required: false,
              attributes: ["translated_text"],
            },
          ],
        },
      ],
    });

    const data = verbs.map((v: any) => ({
      verb_id: v.id,
      word_id: v.word_id,
      word: v.Word?.word || null,
      translation:
        v.Word?.wordTranslations && v.Word.wordTranslations.length > 0
          ? v.Word.wordTranslations[0].translated_text
          : null,
      ich: v.ich,
      du: v.du,
      er_sie_es: v.er_sie_es,
      wir: v.wir,
      ihr: v.ihr,
      sie_sie: v.sie_sie,
      perfekt: v.perfekt,
      help_perfekt: v.help_perfekt,
      praeterium: v.praeterium,
      block_number: v.block_number,
    }));

    res.json({ success: true, data });
  } catch (error: any) {
    console.error("Error in getVerbsByBlockNumber:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
