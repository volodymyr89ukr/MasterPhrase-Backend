import { Sequelize, DataTypes, Model, Optional } from "sequelize";

interface WordAttributes {
  id: number;
  word_set_id: number;
  word: string;
  created_at?: Date;
}

type WordCreationAttributes = Optional<WordAttributes, "id" | "created_at">;

export default (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
  const Word = sequelize.define<Model<WordAttributes, WordCreationAttributes>>(
    "Word",
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
      word: {
        type: dataTypes.STRING(255),
        allowNull: false,
      },
      created_at: {
        type: dataTypes.DATE,
        defaultValue: dataTypes.NOW,
        allowNull: true,
      },
    },
    {
      tableName: "words",
      timestamps: false,
    }
  );

  (Word as any).associate = (models: any) => {
    Word.belongsTo(models.WordSet, { foreignKey: "word_set_id" });
    Word.hasMany(models.Phrase, { foreignKey: "word_id" });
    Word.hasMany(models.Mistake, { foreignKey: "word_id" });
  };

  return Word;
};
