import { Sequelize, DataTypes, Model, Optional } from "sequelize";

interface StrongVerbDeutschAttributes {
  id: number;
  word_id: number;
  ich?: string;
  du?: string;
  er_sie_es?: string;
  wir?: string;
  ihr?: string;
  sie_sie?: string;
  perfekt?: string;
  help_perfekt?: "haben" | "sein";
  praeterium?: string;
  block_number?: number;
}

type StrongVerbDeutschCreationAttributes = Optional<
  StrongVerbDeutschAttributes,
  | "id"
  | "ich"
  | "du"
  | "er_sie_es"
  | "wir"
  | "ihr"
  | "sie_sie"
  | "perfekt"
  | "help_perfekt"
  | "praeterium"
  | "block_number"
>;

export default (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
  const StrongVerbDeutsch = sequelize.define<
    Model<StrongVerbDeutschAttributes, StrongVerbDeutschCreationAttributes>
  >(
    "StrongVerbDeutsch",
    {
      id: {
        type: dataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      word_id: {
        type: dataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: { model: "words", key: "id" },
        onDelete: "CASCADE",
      },
      ich: {
        type: dataTypes.STRING(255),
        allowNull: true,
      },
      du: {
        type: dataTypes.STRING(255),
        allowNull: true,
      },
      er_sie_es: {
        type: dataTypes.STRING(255),
        allowNull: true,
      },
      wir: {
        type: dataTypes.STRING(255),
        allowNull: true,
      },
      ihr: {
        type: dataTypes.STRING(255),
        allowNull: true,
      },
      sie_sie: {
        type: dataTypes.STRING(255),
        allowNull: true,
      },
      perfekt: {
        type: dataTypes.STRING(255),
        allowNull: true,
      },
      help_perfekt: {
        type: dataTypes.ENUM("haben", "sein"),
        allowNull: true,
      },
      praeterium: {
        type: dataTypes.STRING(255),
        allowNull: true,
      },
      block_number: {
        type: dataTypes.INTEGER,
        allowNull: true, // або false, якщо хочеш зробити його обов’язковим
      },
    },
    {
      tableName: "strong_verb_deutsch",
      timestamps: false,
      indexes: [{ fields: ["word_id"] }, { fields: ["block_number"] }],
    }
  );

  (StrongVerbDeutsch as any).associate = (models: any) => {
    StrongVerbDeutsch.belongsTo(models.Word, {
      foreignKey: "word_id",
      onDelete: "CASCADE",
    });
  };

  console.log("StrongVerbDeutsch modelName:", StrongVerbDeutsch.name);

  return StrongVerbDeutsch;
};
