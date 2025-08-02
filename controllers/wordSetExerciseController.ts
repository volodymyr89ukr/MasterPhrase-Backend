import { Request, Response } from "express";
import db from "../models";

const { WordSetExercise, Exercise, WordSet, Thousand } = db;

export const getExercisesForWordSet = async (req: Request, res: Response) => {
  try {
    const wordSetId = Number(req.params.wordSetId);
    if (!wordSetId) {
      return res
        .status(400)
        .json({ success: false, error: "wordSetId is required" });
    }

    // Знайти wordSet, щоб отримати thousand_id
    const wordSet = await WordSet.findByPk(wordSetId);
    if (!wordSet) {
      return res
        .status(404)
        .json({ success: false, error: "WordSet not found" });
    }

    // Знайти thousand, щоб дізнатись language_id
    const thousand = await Thousand.findByPk(wordSet.thousand_id);
    if (!thousand) {
      return res
        .status(404)
        .json({ success: false, error: "Thousand not found" });
    }

    const languageId = thousand.language_id;

    // Знайти всі WordSetExercise для wordSetId
    const wordSetExercises = await WordSetExercise.findAll({
      where: { word_set_id: wordSetId },
      include: [
        {
          model: Exercise,
          where: { language_id: languageId }, // Фільтруємо за мовою вправи
          attributes: ["id", "exercise_name", "exercise_type"],
        },
      ],
    });

    // Відфільтрувати null-значення (якщо якісь асоціації не знайшли)
    const exercises = wordSetExercises
      .map((wse: any) => wse.Exercise)
      .filter((ex: any) => ex != null);

    res.json({ success: true, data: exercises });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
