import { Sequelize, DataTypes, Model, Optional } from "sequelize";

interface WordTranslationAttributes {
  id: number;
  word_id: number;
  language_code: string;
  translated_text: string;
}

type WordTranslationCreationAttributes = Optional<
  WordTranslationAttributes,
  "id"
>;

export default (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
  const WordTranslation = sequelize.define<
    Model<WordTranslationAttributes, WordTranslationCreationAttributes>
  >(
    "WordTranslation",
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
        onDelete: "CASCADE",
      },
      language_code: {
        type: dataTypes.STRING(10),
        allowNull: false,
      },
      translated_text: {
        type: dataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      tableName: "word_translations",
      timestamps: false,
    }
  );

  (WordTranslation as any).associate = (models: any) => {
    WordTranslation.belongsTo(models.Word, {
      foreignKey: "word_id",
      onDelete: "CASCADE",
    });
  };

  console.log("WordTranslation modelName:", WordTranslation.name);

  return WordTranslation;
};
