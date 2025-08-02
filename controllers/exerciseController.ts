import { Request, Response } from "express";
import db from "../models";

const { Exercise, ExerciseTranslation } = db;

export const getAllExercises = async (req: Request, res: Response) => {
  try {
    const languageId = req.query.language_id
      ? Number(req.query.language_id)
      : null;
    const interfaceLanguage = (req.query.interface_language as string) || "uk";

    // Фільтрація вправ за мовою вивчення
    const exercises = await Exercise.findAll({
      where: languageId ? { language_id: languageId } : {},
      attributes: ["id", "exercise_name", "exercise_type", "theory"],
      include: [
        {
          model: ExerciseTranslation,
          as: "translations", // <- обов’язково вказуємо псевдонім
          required: false,
          where: { language_code: interfaceLanguage, field: "theory" },
          attributes: ["translated_text"],
        },
      ],
    });

    // Формуємо відповідь з перекладом теорії (якщо є)
    const data = exercises.map((exercise: any) => ({
      id: exercise.id,
      exercise_name: exercise.exercise_name,
      exercise_type: exercise.exercise_type,
      theory: exercise.theory,
      theory_translation:
        exercise.translations && exercise.translations.length > 0
          ? exercise.translations[0].translated_text
          : null,
    }));

    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
