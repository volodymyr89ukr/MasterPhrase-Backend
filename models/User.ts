import { Sequelize, DataTypes, Model, Optional } from "sequelize";

interface UserAttributes {
  id: number;
  email: string;
  password_hash: string;
  password_reset_token?: string | null;
  password_reset_expires?: Date | null;
  username?: string;
  created_at?: Date;
  updated_at?: Date;
  status?: string;
}

type UserCreationAttributes = Optional<
  UserAttributes,
  | "id"
  | "password_reset_token"
  | "password_reset_expires"
  | "username"
  | "created_at"
  | "updated_at"
  | "status"
>;

export default (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
  const User = sequelize.define<Model<UserAttributes, UserCreationAttributes>>(
    "User",
    {
      id: {
        type: dataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      email: {
        type: dataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },
      password_hash: {
        type: dataTypes.STRING(255),
        allowNull: false,
      },
      password_reset_token: {
        type: dataTypes.STRING(255),
        allowNull: true,
      },
      password_reset_expires: {
        type: dataTypes.DATE,
        allowNull: true,
      },
      username: {
        type: dataTypes.STRING(100),
        allowNull: true,
      },
      created_at: {
        type: dataTypes.DATE,
        defaultValue: dataTypes.NOW,
        allowNull: true,
      },
      updated_at: {
        type: dataTypes.DATE,
        defaultValue: dataTypes.NOW,
        allowNull: true,
      },
      status: {
        type: dataTypes.STRING(50),
        defaultValue: "active",
        allowNull: true,
      },
    },
    {
      tableName: "users",
      timestamps: false,
      indexes: [{ unique: true, fields: ["email"] }, { fields: ["status"] }],
    }
  );

  (User as any).associate = (models: any) => {
    User.hasOne(models.UserProfile, { foreignKey: "user_id" });
    User.hasMany(models.UserSubscription, { foreignKey: "user_id" });
    User.hasMany(models.Removed, { foreignKey: "user_id" });
    User.hasMany(models.Mistake, { foreignKey: "user_id" });
  };

  return User;
};
