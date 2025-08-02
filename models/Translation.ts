import { Sequelize, DataTypes, Model, Optional } from "sequelize";

interface TranslationAttributes {
  id: number;
  phrase_id: number;
  field: string;
  language_code: string;
  translated_text: string;
}

type TranslationCreationAttributes = Optional<TranslationAttributes, "id">;

export default (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
  const Translation = sequelize.define<
    Model<TranslationAttributes, TranslationCreationAttributes>
  >(
    "Translation",
    {
      id: {
        type: dataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      phrase_id: {
        type: dataTypes.INTEGER,
        allowNull: false,
        references: { model: "phrases", key: "id" },
      },
      field: {
        type: dataTypes.STRING(30),
        allowNull: false,
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
      tableName: "translations",
      timestamps: false,
      indexes: [
        { unique: true, fields: ["phrase_id", "field", "language_code"] },
      ],
    }
  );

  (Translation as any).associate = (models: any) => {
    Translation.belongsTo(models.Phrase, {
      foreignKey: "phrase_id",
      as: "Phrase",
    });
  };

  return Translation;
};
