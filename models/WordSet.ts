import { Sequelize, DataTypes, Model, Optional } from "sequelize";

interface WordSetAttributes {
  id: number;
  word_set: string;
  thousand_id: number;
  created_at?: Date;
  updated_at?: Date;
}

type WordSetCreationAttributes = Optional<
  WordSetAttributes,
  "id" | "created_at" | "updated_at"
>;

export default (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
  const WordSet = sequelize.define<
    Model<WordSetAttributes, WordSetCreationAttributes>
  >(
    "WordSet",
    {
      id: {
        type: dataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      word_set: {
        type: dataTypes.STRING(255),
        allowNull: false,
      },
      thousand_id: {
        type: dataTypes.INTEGER,
        allowNull: false,
        references: { model: "thousands", key: "id" },
      },
      created_at: {
        type: dataTypes.DATE,
        allowNull: true,
      },
      updated_at: {
        type: dataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "word_sets",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  (WordSet as any).associate = (models: any) => {
    WordSet.hasMany(models.Word, { foreignKey: "word_set_id" });
    WordSet.hasMany(models.WordSetExercise, { foreignKey: "word_set_id" });
    WordSet.hasMany(models.Removed, { foreignKey: "set_id" });
    WordSet.belongsTo(models.Thousand, { foreignKey: "thousand_id" });
  };

  return WordSet;
};
