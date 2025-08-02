import { Sequelize, DataTypes, Model, Optional } from "sequelize";

interface ExerciseTranslationAttributes {
  id: number;
  exercise_id: number;
  language_code: string;
  field: string;
  translated_text: string;
}

type ExerciseTranslationCreationAttributes = Optional<
  ExerciseTranslationAttributes,
  "id"
>;

export default (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
  const ExerciseTranslation = sequelize.define<
    Model<ExerciseTranslationAttributes, ExerciseTranslationCreationAttributes>
  >(
    "ExerciseTranslation",
    {
      id: {
        type: dataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      exercise_id: {
        type: dataTypes.INTEGER,
        allowNull: false,
        references: { model: "exercises", key: "id" },
        onDelete: "CASCADE",
      },
      language_code: {
        type: dataTypes.STRING(10),
        allowNull: false,
      },
      field: {
        type: dataTypes.STRING(50),
        allowNull: false,
      },
      translated_text: {
        type: dataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      tableName: "exercise_translations",
      timestamps: false,
      indexes: [
        {
          unique: true,
          fields: ["exercise_id", "language_code", "field"],
        },
      ],
    }
  );

  (ExerciseTranslation as any).associate = (models: any) => {
    ExerciseTranslation.belongsTo(models.Exercise, {
      foreignKey: "exercise_id",
      onDelete: "CASCADE",
    });
  };

  return ExerciseTranslation;
};
