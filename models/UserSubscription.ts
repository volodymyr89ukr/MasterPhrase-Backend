import { Sequelize, DataTypes, Model, Optional } from "sequelize";

interface UserSubscriptionAttributes {
  id: number;
  user_id: number;
  plan: string;
  status: string;
  start_date: Date;
  end_date?: Date | null;
  payment_provider?: string;
  external_id?: string;
}

type UserSubscriptionCreationAttributes = Optional<
  UserSubscriptionAttributes,
  "id" | "end_date" | "payment_provider" | "external_id"
>;

export default (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
  const UserSubscription = sequelize.define<
    Model<UserSubscriptionAttributes, UserSubscriptionCreationAttributes>
  >(
    "UserSubscription",
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
      plan: {
        type: dataTypes.STRING(50),
        allowNull: false,
      },
      status: {
        type: dataTypes.STRING(50),
        allowNull: false,
      },
      start_date: {
        type: dataTypes.DATE,
        allowNull: false,
      },
      end_date: {
        type: dataTypes.DATE,
        allowNull: true,
      },
      payment_provider: {
        type: dataTypes.STRING(50),
        allowNull: true,
      },
      external_id: {
        type: dataTypes.STRING(255),
        allowNull: true,
      },
    },
    {
      tableName: "user_subscriptions",
      timestamps: false,
    }
  );

  (UserSubscription as any).associate = (models: any) => {
    UserSubscription.belongsTo(models.User, { foreignKey: "user_id" });
  };

  return UserSubscription;
};
