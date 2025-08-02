import { Sequelize, DataTypes, Model, Optional } from "sequelize";

interface ThousandAttributes {
  id: number;
  name: string;
  description?: string | null;
  language_id: number; // додаємо поле мови
}

type ThousandCreationAttributes = Optional<
  ThousandAttributes,
  "id" | "description"
>;

export default (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
  const Thousand = sequelize.define<
    Model<ThousandAttributes, ThousandCreationAttributes>
  >(
    "Thousand",
    {
      id: {
        type: dataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: dataTypes.STRING(255),
        allowNull: false,
      },
      description: {
        type: dataTypes.TEXT,
        allowNull: true,
      },
      language_id: {
        type: dataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1, // наприклад, 1 = німецька
        references: { model: "languages", key: "id" },
      },
    },
    {
      tableName: "thousands",
      timestamps: false,
    }
  );

  (Thousand as any).associate = (models: any) => {
    Thousand.hasMany(models.WordSet, { foreignKey: "thousand_id" });
    Thousand.belongsTo(models.Language, { foreignKey: "language_id" }); // зв'язок з мовою
  };

  return Thousand;
};
