import { Sequelize, DataTypes, Model, Optional } from "sequelize";

interface UserProfileAttributes {
  id: number;
  user_id: number;
  first_name?: string;
  last_name?: string;
  country?: string;
  learning_language?: string; // мова, яку вивчає користувач
  interface_language?: string; // мова інтерфейсу користувача
}

type UserProfileCreationAttributes = Optional<
  UserProfileAttributes,
  | "id"
  | "first_name"
  | "last_name"
  | "country"
  | "learning_language"
  | "interface_language"
>;

export default (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
  const UserProfile = sequelize.define<
    Model<UserProfileAttributes, UserProfileCreationAttributes>
  >(
    "UserProfile",
    {
      id: {
        type: dataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: dataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: { model: "users", key: "id" },
      },
      first_name: {
        type: dataTypes.STRING(100),
        allowNull: true,
      },
      last_name: {
        type: dataTypes.STRING(100),
        allowNull: true,
      },
      country: {
        type: dataTypes.STRING(100),
        allowNull: true,
      },
      learning_language: {
        type: dataTypes.STRING(10),
        allowNull: true,
      },
      interface_language: {
        type: dataTypes.STRING(10),
        allowNull: true,
      },
    },
    {
      tableName: "user_profiles",
      timestamps: false,
      indexes: [{ unique: true, fields: ["user_id"] }],
    }
  );

  (UserProfile as any).associate = (models: any) => {
    UserProfile.belongsTo(models.User, { foreignKey: "user_id" });
  };

  return UserProfile;
};
