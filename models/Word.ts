import { Sequelize, DataTypes, Model, Optional } from "sequelize";

interface WordAttributes {
  id: number;
  word_set_id: number;
  word: string;
  part_of_speech?: "noun" | "verb" | "adjective" | "other";
  created_at?: Date;
}

type WordCreationAttributes = Optional<
  WordAttributes,
  "id" | "part_of_speech" | "created_at"
>;

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
      part_of_speech: {
        type: dataTypes.ENUM("noun", "verb", "adjective", "other"),
        allowNull: true,
        defaultValue: "other",
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
      indexes: [{ fields: ["word_set_id"] }, { fields: ["part_of_speech"] }],
    }
  );

  (Word as any).associate = (models: any) => {
    Word.belongsTo(models.WordSet, { foreignKey: "word_set_id" });
    Word.hasMany(models.WordTranslation, {
      foreignKey: "word_id",
      as: "wordTranslations",
    });
    Word.hasMany(models.Phrase, { foreignKey: "word_id" });
    Word.hasMany(models.Mistake, { foreignKey: "word_id" });
    Word.hasOne(models.NounDeutsch, {
      foreignKey: "word_id",
      as: "nounDeutsch",
    });
    Word.hasOne(models.StrongVerbDeutsch, {
      foreignKey: "word_id",
      as: "strongVerbDeutsch",
    });
  };

  console.log("Word modelName:", Word.name);

  return Word;
};
