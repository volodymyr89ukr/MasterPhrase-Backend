import { Sequelize, DataTypes, Model, Optional } from "sequelize";

interface TextTranslationAttributes {
  id: number;
  text_id: number;
  language_code: string;
  translated_text: string;
}

type TextTranslationCreationAttributes = Optional<
  TextTranslationAttributes,
  "id"
>;

export default (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
  const TextTranslation = sequelize.define<
    Model<TextTranslationAttributes, TextTranslationCreationAttributes>
  >(
    "TextTranslation",
    {
      id: {
        type: dataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      text_id: {
        type: dataTypes.INTEGER,
        allowNull: false,
        references: { model: "texts", key: "id" },
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
      tableName: "text_translations",
      timestamps: false,
    }
  );

  (TextTranslation as any).associate = (models: any) => {
    TextTranslation.belongsTo(models.Text, { foreignKey: "text_id" });
  };

  return TextTranslation;
};
