import { Request, Response } from "express";
import { Op } from "sequelize";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import db from "../models"; // або твій точний шлях до індексу моделей

const User = db.User;

// --- Register new user ---
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, username } = req.body as {
      email: string;
      password: string;
      username: string;
    };

    const existing = await User.findOne({ where: { email } });
    if (existing)
      return res.status(400).json({ message: "User already exists" });

    const password_hash = await bcrypt.hash(password, 10);

    const user = await User.create({ email, password_hash, username });

    // Додаємо створення профілю одразу після створення користувача
    if (db.UserProfile) {
      await db.UserProfile.create({
        user_id: user.id,
        // Можна додати інші поля за потреби
      });
    }

    return res.status(201).json({
      message: "User registered",
      user: { id: user.id, email: user.email, username: user.username },
    });
  } catch (err: any) {
    return res
      .status(500)
      .json({ message: "Registration error", error: err.message });
  }
};

// --- Login ---
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as { email: string; password: string };

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || "my_secret",
      { expiresIn: "7d" }
    );
    return res.json({
      token,
      user: { id: user.id, email: user.email, username: user.username },
    });
  } catch (err: any) {
    return res.status(500).json({ message: "Login error", error: err.message });
  }
};

// --- Get current user info (by token) ---
export const me = async (req: Request & { userId?: number }, res: Response) => {
  try {
    const user = await User.findByPk(req.userId, {
      attributes: ["id", "email", "username", "status"],
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (err: any) {
    res.status(500).json({ message: "User info error", error: err.message });
  }
};

// --- Forgot Password: send email with code ---
export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body as { email: string };
  const user = await User.findOne({ where: { email } });
  if (!user) {
    // Безпека: не розкриваємо, чи є email
    return res.json({ message: "Якщо email існує — інструкція надіслана." });
  }

  // Генеруємо код (6 цифр)
  const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = new Date(Date.now() + 1000 * 60 * 15); // 15 хвилин

  await user.update({
    password_reset_token: resetToken,
    password_reset_expires: expires,
  });

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"MasterPhrase" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Відновлення пароля | MasterPhrase",
      text: `Ваш код для скидання пароля: ${resetToken}`,
      html: `<p>Ваш код для скидання пароля: <b>${resetToken}</b></p>
             <p>Введіть цей код у форму на сайті. Термін дії: 15 хвилин.</p>`,
    });
  } catch (err: any) {
    console.error("Помилка надсилання email:", err);
    return res
      .status(500)
      .json({ message: "Не вдалося надіслати листа. Спробуйте ще раз." });
  }

  // Завжди повертаємо це повідомлення (не розкриваємо, чи є email)
  return res.json({ message: "Якщо email існує — інструкція надіслана." });
};

// --- Reset Password: перевірка коду і оновлення пароля ---
export const resetPassword = async (req: Request, res: Response) => {
  const { token, password, email } = req.body as {
    token: string;
    password: string;
    email: string;
  };

  if (!token || !password || !email)
    return res.status(400).json({ message: "Не всі дані вказано" });

  const user = await User.findOne({
    where: {
      email,
      password_reset_token: token,
      password_reset_expires: { [Op.gt]: new Date() },
    },
  });
  if (!user) {
    return res.status(400).json({ message: "Код недійсний або прострочений" });
  }

  const password_hash = await bcrypt.hash(password, 10);
  await user.update({
    password_hash,
    password_reset_token: null,
    password_reset_expires: null,
  });
  return res.json({ message: "Пароль успішно скинуто. Тепер увійдіть!" });
};
