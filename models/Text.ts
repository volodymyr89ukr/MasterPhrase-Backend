import { Sequelize, DataTypes, Model, Optional } from "sequelize";

interface TextAttributes {
  id: number;
  word_set_id: number;
  title: string;
  text: string;
}

type TextCreationAttributes = Optional<TextAttributes, "id">;

export default (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
  const Text = sequelize.define<Model<TextAttributes, TextCreationAttributes>>(
    "Text",
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
      title: {
        type: dataTypes.STRING(255),
        allowNull: false,
      },
      text: {
        type: dataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      tableName: "texts",
      timestamps: false,
    }
  );

  (Text as any).associate = (models: any) => {
    Text.belongsTo(models.WordSet, { foreignKey: "word_set_id" });
    Text.hasMany(models.TextTranslation, { foreignKey: "text_id" });
  };

  return Text;
};
