import app from "./app";
import db from "../models";
import { getJwtSecret } from "../config/jwt";

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Без JWT_SECRET сервер не запускається
    getJwtSecret();

    // Синхронізація моделей з базою даних без видалення даних (force: false)
    await db.sequelize.sync();
    console.log("Таблиці синхронізовані з БД");

    app.listen(PORT, () => {
      console.log(`Сервер запущено на порту ${PORT}`);
    });
  } catch (error) {
    console.error("Помилка при запуску сервера:", error);
    process.exit(1);
  }
}

startServer();
