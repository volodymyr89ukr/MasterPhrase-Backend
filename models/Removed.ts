import { Sequelize, DataTypes, Model, Optional } from "sequelize";

interface RemovedAttributes {
  id: number;
  user_id: number;
  set_id: number;
  removed_word_ids?: object;
}

type RemovedCreationAttributes = Optional<
  RemovedAttributes,
  "id" | "removed_word_ids"
>;

export default (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
  const Removed = sequelize.define<
    Model<RemovedAttributes, RemovedCreationAttributes>
  >(
    "Removed",
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
      set_id: {
        type: dataTypes.INTEGER,
        allowNull: false,
        references: { model: "word_sets", key: "id" },
      },
      removed_word_ids: {
        type: dataTypes.JSONB,
        allowNull: true,
      },
    },
    {
      tableName: "removed",
      timestamps: false,
      indexes: [{ unique: true, fields: ["user_id", "set_id"] }],
    }
  );

  (Removed as any).associate = (models: any) => {
    Removed.belongsTo(models.User, { foreignKey: "user_id" });
    Removed.belongsTo(models.WordSet, { foreignKey: "set_id" });
  };

  return Removed;
};
