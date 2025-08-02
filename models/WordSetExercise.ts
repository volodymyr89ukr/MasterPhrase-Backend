import { Sequelize, DataTypes, Model, Optional } from "sequelize";

interface WordSetExerciseAttributes {
  id: number;
  word_set_id: number;
  exercise_id: number;
}

type WordSetExerciseCreationAttributes = Optional<
  WordSetExerciseAttributes,
  "id"
>;

export default (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
  const WordSetExercise = sequelize.define<
    Model<WordSetExerciseAttributes, WordSetExerciseCreationAttributes>
  >(
    "WordSetExercise",
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
      exercise_id: {
        type: dataTypes.INTEGER,
        allowNull: false,
        references: { model: "exercises", key: "id" },
      },
    },
    {
      tableName: "word_set_exercises",
      timestamps: false,
      indexes: [{ unique: true, fields: ["word_set_id", "exercise_id"] }],
    }
  );

  (WordSetExercise as any).associate = (models: any) => {
    WordSetExercise.belongsTo(models.WordSet, { foreignKey: "word_set_id" });
    WordSetExercise.belongsTo(models.Exercise, { foreignKey: "exercise_id" });
  };

  return WordSetExercise;
};
