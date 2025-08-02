import fs from "fs";
import path from "path";
import { Sequelize, DataTypes, Dialect } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const basename = path.basename(__filename);

// Підключення до БД (дані беруться з .env)
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

// Тип для db (універсальний, щоб уникнути помилок)
interface DB {
  [key: string]: any;
  sequelize: Sequelize;
  Sequelize: typeof Sequelize;
}

// Імпорт усіх моделей із цієї папки
const db: DB = {} as DB;

fs.readdirSync(__dirname)
  .filter(
    (file) =>
      file.indexOf(".") !== 0 &&
      file !== basename &&
      (file.slice(-3) === ".js" || file.slice(-3) === ".ts")
  )
  .forEach((file) => {
    // Динамічно імпортуємо і ініціалізуємо модель
    // @ts-ignore
    const modelModule = require(path.join(__dirname, file));
    const model =
      typeof modelModule === "function"
        ? modelModule(sequelize, DataTypes)
        : modelModule.default
        ? modelModule.default(sequelize, DataTypes)
        : modelModule;
    db[model.name] = model;
  });

// Встановлення асоціацій, якщо вони прописані у моделях
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
