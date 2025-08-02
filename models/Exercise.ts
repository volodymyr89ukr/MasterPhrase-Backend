import { Sequelize, DataTypes, Model, Optional } from "sequelize";

interface ExerciseAttributes {
  id: number;
  exercise_name: string;
  exercise_type?: string;
  theory?: string;
  language_id: number; // нове поле — мова вправи
}

type ExerciseCreationAttributes = Optional<
  ExerciseAttributes,
  "id" | "exercise_type" | "theory"
>;

export default (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
  const Exercise = sequelize.define<
    Model<ExerciseAttributes, ExerciseCreationAttributes>
  >(
    "Exercise",
    {
      id: {
        type: dataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      exercise_name: {
        type: dataTypes.STRING(255),
        allowNull: false,
      },
      exercise_type: {
        type: dataTypes.STRING(100),
        allowNull: true,
      },
      theory: {
        type: dataTypes.TEXT,
        allowNull: true,
      },
      language_id: {
        type: dataTypes.INTEGER,
        allowNull: false,
        references: { model: "languages", key: "id" },
      },
    },
    {
      tableName: "exercises",
      timestamps: false,
    }
  );

  (Exercise as any).associate = (models: any) => {
    Exercise.hasMany(models.Phrase, { foreignKey: "exercise_id" });
    Exercise.hasMany(models.WordSetExercise, { foreignKey: "exercise_id" });
    Exercise.belongsTo(models.Language, { foreignKey: "language_id" }); // зв’язок з мовою
    Exercise.hasMany(models.ExerciseTranslation, {
      foreignKey: "exercise_id",
      as: "translations",
    });
  };

  return Exercise;
};
