import { Request, Response } from "express";
import db from "../models";

const WordSet = db.WordSet;
const Word = db.Word;
const WordTranslation = db.WordTranslation;
const NounDeutsch = db.NounDeutsch;
const StrongVerbDeutsch = db.StrongVerbDeutsch;
const Phrase = db.Phrase;
const Translation = db.Translation;
const Exercise = db.Exercise;
const ExerciseTranslation = db.ExerciseTranslation;
const WordSetExercise = db.WordSetExercise;
const Thousand = db.Thousand;

// =============================================
// ТИПИ ВІДПОВІДІ
// =============================================

interface WordCard {
  card_id: number;
  card_type: "word";
  word_type: "noun" | "verb" | "adjective";
  target_word_id: number;
  word: string;
  translation: string | null;
  difficulty_rank: number;
  // Noun-specific
  article?: string | null;
  gender?: string | null;
  plural?: string | null;
  plural_alt?: string | null;
  artikel_explanation?: string | null;
  plural_explanation?: string | null;
  // Verb-specific
  conjugation?: {
    ich?: string;
    du?: string;
    er_sie_es?: string;
    wir?: string;
    ihr?: string;
    sie_sie?: string;
    perfekt?: string;
    help_perfekt?: string;
    praeterium?: string;
  } | null;
}

interface PhraseCard {
  card_id: number;
  card_type: "phrase";
  target_word_id: number | null;
  target_exercise_id: number | null;
  phrase: string;
  translation: string | null;
  options: string[];
  answer: string | null;
  explanation: string | null;
  explanation_translation: string | null;
  difficulty_rank: number;
}

interface ExerciseInfo {
  exercise_id: number;
  exercise_name: string;
  exercise_type: string | null;
  theory: string | null;
  theory_translation: string | null;
}

interface SetContentResponse {
  success: boolean;
  data: {
    set_id: number;
    set_name: string;
    thousand_id: number;
    version: string;
    // Граматичні теми (exercises), що входять в цей сет
    exercises: ExerciseInfo[];
    // Слова сету (іменники, дієслова, прикметники)
    words: WordCard[];
    // Фрази (прив'язані до слів АБО до тем)
    phrases: PhraseCard[];
  };
}

// =============================================
// ГОЛОВНИЙ ЕНДПОІНТ
// =============================================

export const getSetContent = async (req: Request, res: Response) => {
  try {
    const { set_id } = req.params;
    const interfaceLanguage = (req.query.lang as string) || "uk";
    const setId = Number(set_id);

    // 1. Отримуємо інформацію про сет
    const wordSet = await WordSet.findByPk(setId, {
      include: [{ model: Thousand, attributes: ["id", "language_id"] }],
    });

    if (!wordSet) {
      return res.status(404).json({ success: false, error: "Set not found" });
    }

    // 2. Отримуємо граматичні теми (exercises) для цього сету
    const wordSetExercises = await WordSetExercise.findAll({
      where: { word_set_id: setId },
      include: [
        {
          model: Exercise,
          attributes: ["id", "exercise_name", "exercise_type", "theory"],
          include: [
            {
              model: ExerciseTranslation,
              as: "translations",
              where: { language_code: interfaceLanguage, field: "theory" },
              required: false,
              attributes: ["translated_text"],
            },
          ],
        },
      ],
    });

    const exercises: ExerciseInfo[] = wordSetExercises
      .filter((wse: any) => wse.Exercise)
      .map((wse: any) => ({
        exercise_id: wse.Exercise.id,
        exercise_name: wse.Exercise.exercise_name,
        exercise_type: wse.Exercise.exercise_type,
        theory: wse.Exercise.theory,
        theory_translation:
          wse.Exercise.translations && wse.Exercise.translations.length > 0
            ? wse.Exercise.translations[0].translated_text
            : null,
      }));

    // 3. Отримуємо всі слова сету
    const words = await Word.findAll({
      where: { word_set_id: setId },
      attributes: ["id", "word"],
      include: [
        {
          model: WordTranslation,
          as: "wordTranslations",
          where: { language_code: interfaceLanguage },
          required: false,
          attributes: ["translated_text"],
        },
        {
          model: NounDeutsch,
          as: "nounDeutsch",
          required: false,
          attributes: [
            "article",
            "gender",
            "plural",
            "plural_alt",
            "artikel_explanation",
            "plural_explanation",
          ],
        },
        {
          model: StrongVerbDeutsch,
          as: "strongVerbDeutsch",
          required: false,
          attributes: [
            "ich",
            "du",
            "er_sie_es",
            "wir",
            "ihr",
            "sie_sie",
            "perfekt",
            "help_perfekt",
            "praeterium",
          ],
        },
      ],
      order: [["id", "ASC"]],
    });

    // 4. Визначаємо тип слова та формуємо WordCard
    const wordCards: WordCard[] = words.map((w: any, index: number) => {
      const hasNoun = w.nounDeutsch !== null;
      const hasVerb = w.strongVerbDeutsch !== null;

      // Визначаємо тип слова
      let wordType: "noun" | "verb" | "adjective" = "adjective";
      if (hasNoun) wordType = "noun";
      else if (hasVerb) wordType = "verb";

      const card: WordCard = {
        card_id: w.id,
        card_type: "word",
        word_type: wordType,
        target_word_id: w.id,
        word: w.word,
        translation:
          w.wordTranslations && w.wordTranslations.length > 0
            ? w.wordTranslations[0].translated_text
            : null,
        difficulty_rank: index + 1,
      };

      // Додаємо noun-specific поля
      if (hasNoun) {
        card.article = w.nounDeutsch.article;
        card.gender = w.nounDeutsch.gender;
        card.plural = w.nounDeutsch.plural;
        card.plural_alt = w.nounDeutsch.plural_alt;
        card.artikel_explanation = w.nounDeutsch.artikel_explanation;
        card.plural_explanation = w.nounDeutsch.plural_explanation;
      }

      // Додаємо verb-specific поля
      if (hasVerb) {
        card.conjugation = {
          ich: w.strongVerbDeutsch.ich,
          du: w.strongVerbDeutsch.du,
          er_sie_es: w.strongVerbDeutsch.er_sie_es,
          wir: w.strongVerbDeutsch.wir,
          ihr: w.strongVerbDeutsch.ihr,
          sie_sie: w.strongVerbDeutsch.sie_sie,
          perfekt: w.strongVerbDeutsch.perfekt,
          help_perfekt: w.strongVerbDeutsch.help_perfekt,
          praeterium: w.strongVerbDeutsch.praeterium,
        };
      }

      return card;
    });

    // 5. Отримуємо всі фрази для цього сету
    const phrases = await Phrase.findAll({
      where: { word_set_id: setId },
      attributes: [
        "id",
        "word_id",
        "exercise_id",
        "phrase",
        "options",
        "answer",
        "explanation",
        "difficulty_rank",
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
      order: [
        ["difficulty_rank", "ASC"],
        ["id", "ASC"],
      ],
    });

    // 6. Формуємо PhraseCard
    const phraseCards: PhraseCard[] = phrases.map((p: any, index: number) => ({
      card_id: p.id + 100000, // Offset для уникнення конфлікту з word IDs
      card_type: "phrase" as const,
      target_word_id: p.word_id,
      target_exercise_id: p.exercise_id,
      phrase: p.phrase,
      translation:
        p.PhraseTranslation && p.PhraseTranslation.length > 0
          ? p.PhraseTranslation[0].translated_text
          : null,
      options: p.options || [],
      answer: p.answer,
      explanation: p.explanation,
      explanation_translation:
        p.ExplanationTranslation && p.ExplanationTranslation.length > 0
          ? p.ExplanationTranslation[0].translated_text
          : null,
      difficulty_rank: p.difficulty_rank || wordCards.length + index + 1,
    }));

    // 7. Фінальна відповідь
    const response: SetContentResponse = {
      success: true,
      data: {
        set_id: setId,
        set_name: (wordSet as any).word_set,
        thousand_id: (wordSet as any).thousand_id,
        version: (wordSet as any).updated_at
          ? (wordSet as any).updated_at.toISOString()
          : new Date().toISOString(),
        exercises,
        words: wordCards,
        phrases: phraseCards,
      },
    };

    res.json(response);
  } catch (error: any) {
    console.error("Error in getSetContent:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
