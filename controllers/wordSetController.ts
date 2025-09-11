import { Request, Response } from "express";
import db from "../models";

const {
  WordSet,
  Word,
  WordSetExercise,
  Exercise,
  ExerciseTranslation,
  Phrase,
  Translation,
  Text,
  Thousand,
  WordTranslation,
} = db;

console.log("Word associations:", Word.associations);
console.log("Exercise associations:", Exercise.associations);
console.log("WordSet associations:", WordSet.associations);
console.log("WordTranslation associations:", WordTranslation.associations);

export const getAllWordSets = async (req: Request, res: Response) => {
  try {
    const languageId = req.query.language_id
      ? Number(req.query.language_id)
      : null;

    const whereThousand = languageId ? { language_id: languageId } : {};

    const sets = await WordSet.findAll({
      include: [
        {
          model: Thousand,
          where: whereThousand,
          attributes: [],
        },
      ],
      attributes: ["id", "word_set"],
    });

    res.json({
      success: true,
      data: sets,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getWordsBySet = async (req: Request, res: Response) => {
  try {
    const setId = req.params.id;
    const interfaceLanguage = (req.query.interface_language as string) || "uk";

    const set = await WordSet.findByPk(setId, {
      include: [
        {
          model: Word,
          attributes: ["id", "word", "created_at"],
          include: [
            {
              model: WordTranslation,
              as: "wordTranslations",
              required: false,
              where: { language_code: interfaceLanguage },
              attributes: ["translated_text"],
            },
          ],
        },
      ],
      attributes: ["id", "word_set"],
    });

    if (!set)
      return res
        .status(404)
        .json({ success: false, error: "Word set not found" });

    const words = (set as any).Words.map((w: any) => ({
      id: w.id,
      word: w.word,
      created_at: w.created_at,
      translation:
        w.wordTranslations && w.wordTranslations.length > 0
          ? w.wordTranslations[0].translated_text
          : null,
    }));

    res.json({
      success: true,
      wordSet: set.word_set,
      words,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getExercisesByWordSet = async (req: Request, res: Response) => {
  try {
    const setId = req.params.id;

    const wordSet = await WordSet.findByPk(setId, {
      include: [{ model: Thousand }],
    });
    if (!wordSet)
      return res
        .status(404)
        .json({ success: false, error: "Word set not found" });

    const languageId = (wordSet as any).Thousand?.language_id;

    const exercises = await WordSetExercise.findAll({
      where: { word_set_id: setId },
      include: [
        {
          model: Exercise,
          where: languageId ? { language_id: languageId } : {},
          attributes: ["id", "exercise_name"],
        },
      ],
    });

    const data = exercises
      .map((e: any) =>
        e.Exercise
          ? {
              id: e.Exercise.id,
              exercise_name: e.Exercise.exercise_name,
            }
          : null
      )
      .filter(Boolean);

    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ОПТИМІЗОВАНО: тепер без вибірки всіх words, напряму по word_set_id + exercise_id
export const getExerciseDetailForWordSet = async (
  req: Request,
  res: Response
) => {
  try {
    const { set_id, exercise_id } = req.params;
    const interfaceLanguage = (req.query.interface_language as string) || "uk";

    if (!set_id || !exercise_id) {
      return res
        .status(400)
        .json({ success: false, error: "Missing set_id or exercise_id" });
    }

    const exercise = await Exercise.findByPk(exercise_id, {
      attributes: ["id", "exercise_name", "theory"],
      include: [
        {
          model: ExerciseTranslation,
          as: "translations",
          required: false,
          where: { language_code: interfaceLanguage, field: "theory" },
          attributes: ["translated_text"],
        },
      ],
    });
    if (!exercise)
      return res
        .status(404)
        .json({ success: false, error: "Exercise not found" });

    const theoryOriginal = exercise.theory;
    const theoryTranslation =
      exercise.translations && exercise.translations.length > 0
        ? exercise.translations[0].translated_text
        : null;

    const phrases = await Phrase.findAll({
      where: {
        word_set_id: set_id, // використання нового поля
        exercise_id: exercise_id,
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

    const data = (phrases as any[]).map((p) => ({
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
        : [],
      writing_exercise: Array.isArray(p.writing_exercise)
        ? p.writing_exercise
        : [],
    }));

    res.json({
      success: true,
      theory: theoryOriginal,
      theory_translation: theoryTranslation,
      data,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getTextsByWordSet = async (req: Request, res: Response) => {
  try {
    const setId = req.params.id;
    const texts = await Text.findAll({
      where: { word_set_id: setId },
      attributes: ["id", "title"],
    });
    res.json({ success: true, data: texts });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
