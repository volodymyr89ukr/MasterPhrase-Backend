// src/app.ts
import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
// import rateLimit, {
//   RateLimitRequestHandler,
//   KeyGenerator,
// } from "express-rate-limit";
import { ipKeyGenerator } from "express-rate-limit";

import wordSetRoutes from "../routes/wordSetRoutes";
import wordRoutes from "../routes/wordRoutes";
import exerciseRoutes from "../routes/exerciseRoutes";
import phraseRoutes from "../routes/phraseRoutes";
import translationRoutes from "../routes/translationRoutes";
import authRoutes from "../routes/authRoutes";
import userRoutes from "../routes/userRoutes";
import textRoutes from "../routes/textRoutes";
import wordSetExerciseRoutes from "../routes/wordSetExerciseRoutes";
import wordSetTasksRoutes from "../routes/wordSetTasksRoutes";
import thousandRoutes from "../routes/thousandRoutes";
import languageRoutes from "../routes/languageRoutes";
import learningLanguageRoutes from "../routes/learningLanguageRoutes";

const app = express();

dotenv.config();

// Розширений тип Request для користувача з user.id
interface AuthedRequest extends Request {
  user?: {
    id: string | number;
  };
}

//Кастомний keyGenerator з правильним типом
// const customIpKeyGenerator: KeyGenerator = (req, res) => {
//   return ipKeyGenerator(req as Request, res);
// };

// // Лімітер: 5 запитів на секунду
// const limiter: RateLimitRequestHandler = rateLimit({
//   windowMs: 1000,
//   max: 5,
//   message: {
//     error: "Забагато запитів. Спробуйте ще раз через секунду.",
//   },
//   keyGenerator: customIpKeyGenerator,
// });

// // Лімітер: 500 запитів на 10 хвилин, враховує user.id якщо є
// const minuteLimiter: RateLimitRequestHandler = rateLimit({
//   windowMs: 60 * 10 * 1000,
//   max: 500,
//   message: {
//     error:
//       "Ви перевищили ліміт запитів на хвилину. Спробуйте ще раз через кілька хвилин",
//   },
//   keyGenerator: (req, res) => {
//     const authedReq = req as AuthedRequest;
//     return authedReq.user?.id
//       ? `${authedReq.user.id}_${ipKeyGenerator(req as Request, res)}`
//       : ipKeyGenerator(req as Request, res);
//   },
// });

// Middleware
app.use(
  cors({
    origin: ["https://masterphrase.pro"],
    credentials: true,
  })
);
app.use(express.json());
// app.use("/api/", limiter, minuteLimiter);
app.use("/api/languages", languageRoutes);
app.use("/api/learning-languages", learningLanguageRoutes);
app.use("/api/word-sets", wordSetRoutes);
app.use("/api/words", wordRoutes);
app.use("/api/exercises", exerciseRoutes);
app.use("/api/phrases", phraseRoutes);
app.use("/api/translations", translationRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/texts", textRoutes);
app.use("/api/word-set-exercises", wordSetExerciseRoutes);
app.use("/api/word-set-tasks", wordSetTasksRoutes);
app.use("/api/thousands", thousandRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Backend працює!" });
});

export default app;
