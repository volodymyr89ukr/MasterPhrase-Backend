import { Sequelize, DataTypes, Model, Optional } from "sequelize";

interface PhraseAttributes {
  id: number;
  word_id: number;
  exercise_id: number;
  phrase: string;
  options: object;
  answer?: string;
  explanation?: string;
  matching_exercise?: number[]; // Змінено з number на масив чисел
  writing_exercise?: number[]; // Змінено з number на масив чисел
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
        type: dataTypes.ARRAY(dataTypes.INTEGER), // Змінено тип
        allowNull: true,
      },
      writing_exercise: {
        type: dataTypes.ARRAY(dataTypes.INTEGER), // Змінено тип
        allowNull: true,
      },
    },
    {
      tableName: "phrases",
      timestamps: false,
    }
  );

  (Phrase as any).associate = (models: any) => {
    Phrase.belongsTo(models.Word, { foreignKey: "word_id" });
    Phrase.belongsTo(models.Exercise, { foreignKey: "exercise_id" });

    // Для перекладу фрази (field = "phrase")
    Phrase.hasMany(models.Translation, {
      foreignKey: "phrase_id",
      as: "PhraseTranslation",
    });

    // Для перекладу explanation (field = "explanation")
    Phrase.hasMany(models.Translation, {
      foreignKey: "phrase_id",
      as: "ExplanationTranslation",
    });

    // Стара асоціація для сумісності
    Phrase.hasMany(models.Translation, {
      foreignKey: "phrase_id",
      as: "Translations",
    });
  };

  return Phrase;
};
