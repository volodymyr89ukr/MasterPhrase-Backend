import { Request, Response } from "express";
import db from "../models";

const { Word, Phrase, Translation } = db;

export const getTasksForWordSetExercise = async (
  req: Request,
  res: Response
) => {
  try {
    const { wordSetId, exerciseId } = req.params;
    const interfaceLanguage = (req.query.interface_language as string) || "uk";

    // 1. Знаходимо всі слова для wordSet
    const words = await Word.findAll({
      where: { word_set_id: wordSetId },
      attributes: ["id"],
    });
    const wordIds = (words as any[]).map((w) => w.id);

    if (wordIds.length === 0) {
      return res.json({ success: true, data: [] });
    }

    // 2. Знаходимо всі фрази (фільтруємо по word_id та exercise_id)
    const phrases = await Phrase.findAll({
      where: {
        word_id: wordIds,
        exercise_id: exerciseId,
      },
      attributes: [
        "id",
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

    // 3. Формуємо масив обʼєктів з перекладами
    const result = (phrases as any[]).map((phrase) => ({
      phrase: phrase.phrase,
      translation:
        phrase.PhraseTranslation &&
        Array.isArray(phrase.PhraseTranslation) &&
        phrase.PhraseTranslation[0]
          ? phrase.PhraseTranslation[0].translated_text
          : "",
      options: phrase.options,
      answer: phrase.answer,
      explanation: phrase.explanation,
      explanation_translation:
        phrase.ExplanationTranslation &&
        Array.isArray(phrase.ExplanationTranslation) &&
        phrase.ExplanationTranslation[0]
          ? phrase.ExplanationTranslation[0].translated_text
          : "",
      matching_exercise: phrase.matching_exercise,
      writing_exercise: phrase.writing_exercise,
    }));

    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
