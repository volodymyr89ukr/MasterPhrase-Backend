import { Request, Response } from "express";
import db from "../models";

const { Phrase, Translation } = db;

export const getPhrases = async (req: Request, res: Response) => {
  try {
    const { word_id, exercise_id } = req.query as {
      word_id?: string | number;
      exercise_id?: string | number;
    };
    const interfaceLanguage = (req.query.interface_language as string) || "uk";

    // Формуємо умову пошуку
    const where: Record<string, any> = {};
    if (word_id) where.word_id = word_id;
    if (exercise_id) where.exercise_id = exercise_id;

    const phrases = await Phrase.findAll({
      where,
      attributes: [
        "id",
        "word_id",
        "exercise_id",
        "phrase",
        "options",
        "answer",
        "explanation",
        "matching_exercise",
        "writing_exercise",
      ],
      include: [
        {
          model: Translation,
          as: "PhraseTranslation",
          required: false,
          where: { field: "phrase", language_code: interfaceLanguage },
          attributes: ["translated_text"],
        },
        {
          model: Translation,
          as: "ExplanationTranslation",
          required: false,
          where: { field: "explanation", language_code: interfaceLanguage },
          attributes: ["translated_text"],
        },
      ],
    });

    const data = (phrases as any[]).map((p) => ({
      id: p.id,
      word_id: p.word_id,
      exercise_id: p.exercise_id,
      phrase: p.phrase,
      translation:
        p.PhraseTranslation &&
        Array.isArray(p.PhraseTranslation) &&
        p.PhraseTranslation[0]
          ? p.PhraseTranslation[0].translated_text
          : null,
      options: p.options,
      answer: p.answer,
      explanation: p.explanation,
      explanation_translation:
        p.ExplanationTranslation &&
        Array.isArray(p.ExplanationTranslation) &&
        p.ExplanationTranslation[0]
          ? p.ExplanationTranslation[0].translated_text
          : null,
      matching_exercise: Array.isArray(p.matching_exercise)
        ? p.matching_exercise
        : [], // Зміна: гарантуємо масив
      writing_exercise: Array.isArray(p.writing_exercise)
        ? p.writing_exercise
        : [], // Зміна: гарантуємо масив
    }));

    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
