import { Sequelize, DataTypes, Model, Optional } from "sequelize";

interface NounDeutschAttributes {
  id: number;
  word_id: number;
  article: "der" | "die" | "das" | "der/die";
  gender: "m" | "n" | "f" | "pl";
  plural?: string;
  plural_alt?: string;
  artikel_explanation?: string;
  plural_explanation?: string;
}

type NounDeutschCreationAttributes = Optional<
  NounDeutschAttributes,
  "id" | "plural" | "plural_alt" | "artikel_explanation" | "plural_explanation"
>;

export default (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
  const NounDeutsch = sequelize.define<
    Model<NounDeutschAttributes, NounDeutschCreationAttributes>
  >(
    "NounDeutsch",
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
      article: {
        type: dataTypes.ENUM("der", "die", "das", "der/die"),
        allowNull: false,
      },
      gender: {
        type: dataTypes.ENUM("m", "n", "f", "pl"),
        allowNull: false,
      },
      plural: {
        type: dataTypes.STRING(255),
        allowNull: true,
      },
      plural_alt: {
        type: dataTypes.STRING(255),
        allowNull: true,
      },
      artikel_explanation: {
        type: dataTypes.STRING(255),
        allowNull: true,
      },
      plural_explanation: {
        type: dataTypes.STRING(255),
        allowNull: true,
      },
    },
    {
      tableName: "noun_deutsch",
      timestamps: false,
      indexes: [{ fields: ["word_id"] }],
    }
  );

  (NounDeutsch as any).associate = (models: any) => {
    NounDeutsch.belongsTo(models.Word, {
      foreignKey: "word_id",
      onDelete: "CASCADE",
    });
  };

  console.log("NounDeutsch modelName:", NounDeutsch.name);

  return NounDeutsch;
};
