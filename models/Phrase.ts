import { Sequelize, DataTypes, Model, Optional } from "sequelize";

interface PhraseAttributes {
  id: number;
  word_set_id: number;
  word_id: number | null; // ✅ Може бути NULL
  exercise_id: number | null; // ✅ Може бути NULL
  phrase: string;
  options: string[];
  answer?: string;
  explanation?: string;
  matching_exercise?: number[];
  writing_exercise?: number[];
  difficulty_rank?: number; // ✅ ДОДАНО для сортування
}

type PhraseCreationAttributes = Optional<
  PhraseAttributes,
  | "id"
  | "word_id"
  | "exercise_id"
  | "answer"
  | "explanation"
  | "matching_exercise"
  | "writing_exercise"
  | "difficulty_rank"
>;

export default (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
  const Phrase = sequelize.define<
    Model<PhraseAttributes, PhraseCreationAttributes>
  >(
    "Phrase",
    {
      id: {
        type: dataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      word_set_id: {
        type: dataTypes.INTEGER,
        allowNull: false,
        references: { model: "word_sets", key: "id" },
      },
      word_id: {
        type: dataTypes.INTEGER,
        allowNull: true, // ✅ ЗМІНЕНО: може бути NULL
        references: { model: "words", key: "id" },
      },
      exercise_id: {
        type: dataTypes.INTEGER,
        allowNull: true, // ✅ ЗМІНЕНО: може бути NULL
        references: { model: "exercises", key: "id" },
      },
      phrase: {
        type: dataTypes.TEXT,
        allowNull: false,
      },
      options: {
        type: dataTypes.JSONB,
        allowNull: false,
      },
      answer: {
        type: dataTypes.STRING(255),
        allowNull: true,
      },
      explanation: {
        type: dataTypes.TEXT,
        allowNull: true,
      },
      matching_exercise: {
        type: dataTypes.ARRAY(dataTypes.INTEGER),
        allowNull: true,
      },
      writing_exercise: {
        type: dataTypes.ARRAY(dataTypes.INTEGER),
        allowNull: true,
      },
      difficulty_rank: {
        type: dataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
    },
    {
      tableName: "phrases",
      timestamps: false,
      indexes: [
        { fields: ["word_set_id"] },
        { fields: ["word_id"] },
        { fields: ["exercise_id"] },
        { fields: ["word_set_id", "word_id"] },
        { fields: ["word_set_id", "exercise_id"] },
      ],
      validate: {
        // ✅ Валідація: або word_id, або exercise_id (не обидва)
        eitherWordOrExercise() {
          const self = this as any;
          if (self.word_id && self.exercise_id) {
            throw new Error(
              "Phrase must be linked to either word_id OR exercise_id, not both"
            );
          }
          if (!self.word_id && !self.exercise_id) {
            throw new Error(
              "Phrase must be linked to either word_id OR exercise_id"
            );
          }
        },
      },
    }
  );

  (Phrase as any).associate = (models: any) => {
    Phrase.belongsTo(models.Word, { foreignKey: "word_id" });
    Phrase.belongsTo(models.WordSet, { foreignKey: "word_set_id" });
    Phrase.belongsTo(models.Exercise, { foreignKey: "exercise_id" });

    Phrase.hasMany(models.Translation, {
      foreignKey: "phrase_id",
      as: "PhraseTranslation",
    });
    Phrase.hasMany(models.Translation, {
      foreignKey: "phrase_id",
      as: "ExplanationTranslation",
    });
    Phrase.hasMany(models.Translation, {
      foreignKey: "phrase_id",
      as: "Translations",
    });
  };

  return Phrase;
};
