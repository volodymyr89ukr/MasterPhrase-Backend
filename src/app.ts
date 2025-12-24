// src/app.ts
import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { rateLimit } from "express-rate-limit";

import wordSetRoutes from "../routes/wordSetRoutes";
import wordRoutes from "../routes/wordRoutes";
import exerciseRoutes from "../routes/exerciseRoutes";
import nounDeutschRoutes from "../routes/nounDeutschRoutes";
import strongVerbDeutschRoutes from "../routes/strongVerbDeutschRoutes";
import phraseRoutes from "../routes/phraseRoutes";
import translationRoutes from "../routes/translationRoutes";
import authRoutes from "../routes/authRoutes";
import userRoutes from "../routes/userRoutes";
import textRoutes from "../routes/textRoutes";
import wordSetExerciseRoutes from "../routes/wordSetExerciseRoutes";
import setContentRoutes from "../routes/setContentRoutes";
import thousandRoutes from "../routes/thousandRoutes";
import languageRoutes from "../routes/languageRoutes";
import learningLanguageRoutes from "../routes/learningLanguageRoutes";

dotenv.config();

const app = express();

// Ти за Nginx → вмикаємо довіру до проксі, щоб req.ip був реальним
app.set("trust proxy", 1);

// Якщо ти додаєш req.user у своєму auth-мідлварі:
interface AuthedRequest extends Request {
  user?: { id: string | number };
}

// Надійно дістаємо IP (з урахуванням проксі)
function getClientIp(req: Request): string {
  const xff = req.headers["x-forwarded-for"];
  if (typeof xff === "string" && xff.length > 0) {
    // перша адреса в ланцюжку
    return xff.split(",")[0].trim();
  }
  const ip = req.ip || req.socket?.remoteAddress || "unknown";
  // нормалізація IPv6-формату ::ffff:127.0.0.1 → 127.0.0.1
  return ip.startsWith("::ffff:") ? ip.slice(7) : ip;
}

// Ключ для ліміту: userId (якщо є) + IP
function customKey(req: Request, _res: Response): string {
  const r = req as AuthedRequest;
  const base = r.user?.id ? String(r.user.id) : "anon";
  return `${base}:${getClientIp(req)}`;
}

// Ліміт: 5 запитів/секунда
const perSecondLimiter = rateLimit({
  windowMs: 1000,
  limit: 8, // v8: 'limit' (не 'max')
  message: { error: "Забагато запитів. Спробуйте ще раз через секунду." },
  keyGenerator: customKey,
});

// Ліміт: 500 запитів/10 хвилин
const tenMinutesLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 500,
  message: {
    error:
      "Ви перевищили ліміт запитів на хвилину. Спробуйте ще раз через кілька хвилин",
  },
  keyGenerator: customKey,
});

// Middleware
app.use(
  cors({
    origin: ["https://master-phrase.vercel.app"],
    credentials: true,
  })
);
app.use(express.json());

// Вішаємо лімітери на всі API-роути
app.use("/api/", perSecondLimiter, tenMinutesLimiter);

// Роути
app.use("/api/languages", languageRoutes);
app.use("/api/learning-languages", learningLanguageRoutes);
app.use("/api/word-sets", wordSetRoutes);
app.use("/api/words", wordRoutes);
app.use("/api/exercises", exerciseRoutes);
app.use("/api/nouns", nounDeutschRoutes);
app.use("/api/verbs", strongVerbDeutschRoutes);
app.use("/api/phrases", phraseRoutes);
app.use("/api/translations", translationRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/texts", textRoutes);
app.use("/api/word-set-exercises", wordSetExerciseRoutes);
app.use("/api/sets", setContentRoutes);
app.use("/api/thousands", thousandRoutes);

app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "Backend працює!" });
});

export default app;
