import { Sequelize, DataTypes, Model, Optional } from "sequelize";

interface MistakeAttributes {
  id: number;
  user_id: number;
  word_id: number;
  quantity?: number;
  updated_at?: Date;
}

type MistakeCreationAttributes = Optional<
  MistakeAttributes,
  "id" | "quantity" | "updated_at"
>;

export default (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
  const Mistake = sequelize.define<
    Model<MistakeAttributes, MistakeCreationAttributes>
  >(
    "Mistake",
    {
      id: {
        type: dataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: dataTypes.INTEGER,
        allowNull: false,
        references: { model: "users", key: "id" },
      },
      word_id: {
        type: dataTypes.INTEGER,
        allowNull: false,
        references: { model: "words", key: "id" },
      },
      quantity: {
        type: dataTypes.INTEGER,
        defaultValue: 1,
        allowNull: true,
      },
      updated_at: {
        type: dataTypes.DATE,
        defaultValue: dataTypes.NOW,
        allowNull: true,
      },
    },
    {
      tableName: "mistakes",
      timestamps: false,
      indexes: [
        { unique: true, fields: ["user_id", "word_id"] },
        { fields: ["user_id"] },
        { fields: ["word_id"] },
      ],
    }
  );

  (Mistake as any).associate = (models: any) => {
    Mistake.belongsTo(models.User, { foreignKey: "user_id" });
    Mistake.belongsTo(models.Word, { foreignKey: "word_id" });
  };

  return Mistake;
};
