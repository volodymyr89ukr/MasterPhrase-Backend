import { Sequelize, DataTypes, Model, Optional } from "sequelize";

interface PhraseAttributes {
  id: number;
  word_id: number;
  word_set_id: number; // ДОДАНО
  exercise_id: number;
  phrase: string;
  options: string[]; // масив варіантів
  answer?: string;
  explanation?: string;
  matching_exercise?: number[];
  writing_exercise?: number[];
}

type PhraseCreationAttributes = Optional<
  PhraseAttributes,
  "id" | "answer" | "explanation" | "matching_exercise" | "writing_exercise"
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
      word_id: {
        type: dataTypes.INTEGER,
        allowNull: false,
        references: { model: "words", key: "id" },
      },
      word_set_id: {
        type: dataTypes.INTEGER,
        allowNull: false,
        references: { model: "word_sets", key: "id" }, // ДОДАНО
      },
      exercise_id: {
        type: dataTypes.INTEGER,
        allowNull: false,
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
    },
    {
      tableName: "phrases",
      timestamps: false,
      indexes: [
        { fields: ["word_set_id"] },
        { fields: ["exercise_id"] },
        { fields: ["word_set_id", "exercise_id"] }, // для швидкого пошуку
      ],
    }
  );

  (Phrase as any).associate = (models: any) => {
    Phrase.belongsTo(models.Word, { foreignKey: "word_id" });
    Phrase.belongsTo(models.WordSet, { foreignKey: "word_set_id" }); // ДОДАНО
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
