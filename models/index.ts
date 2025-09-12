import fs from "fs";
import path from "path";
import { Sequelize, DataTypes, Dialect } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const basename = path.basename(__filename);

const sequelize = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USER as string,
  process.env.DB_PASSWORD as string,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
    dialect: "postgres" as Dialect,
    logging: false,
  }
);

interface DB {
  [key: string]: any;
  sequelize: Sequelize;
  Sequelize: typeof Sequelize;
}

const db: DB = {} as DB;

// ✅ підхоплюємо або .ts у dev, або .js у dist
const runningTs = basename.endsWith(".ts");

fs.readdirSync(__dirname)
  .filter((file) => {
    const isModelFile = runningTs ? file.endsWith(".ts") : file.endsWith(".js");
    return file.indexOf(".") !== 0 && file !== basename && isModelFile;
  })
  .forEach((file) => {
    const modelModule = require(path.join(__dirname, file));
    const factory =
      typeof modelModule === "function"
        ? modelModule
        : modelModule.default
        ? modelModule.default
        : null;
    if (!factory) return;
    const model = factory(sequelize, DataTypes);
    db[model.name] = model;
  });

// ❌ видалили ручні асоціації тут

// ✅ Встановлюємо асоціації лише через .associate з кожної моделі
Object.keys(db).forEach((modelName) => {
  if (typeof db[modelName].associate === "function") {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
