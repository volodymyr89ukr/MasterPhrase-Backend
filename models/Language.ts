import { Sequelize, DataTypes, Model, Optional } from "sequelize";

interface LanguageAttributes {
  id: number;
  code: string; // наприклад: 'de', 'en'
  name: string; // наприклад: 'Німецька', 'Англійська'
}

type LanguageCreationAttributes = Optional<LanguageAttributes, "id">;

export default (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
  const Language = sequelize.define<
    Model<LanguageAttributes, LanguageCreationAttributes>
  >(
    "Language",
    {
      id: {
        type: dataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      code: {
        type: dataTypes.STRING(10),
        allowNull: false,
        unique: true,
      },
      name: {
        type: dataTypes.STRING(100),
        allowNull: false,
      },
    },
    {
      tableName: "languages",
      timestamps: false,
    }
  );

  (Language as any).associate = (models: any) => {
    Language.hasMany(models.Thousand, { foreignKey: "language_id" });
  };

  return Language;
};
