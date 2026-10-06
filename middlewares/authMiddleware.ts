import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { getJwtSecret } from "../config/jwt";

interface JwtPayload {
  userId: number;
  // можеш додати ще поля, якщо треба
}

// Розширюємо Express.Request для userId
declare module "express-serve-static-core" {
  interface Request {
    userId?: number;
  }
}

export default function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token" });
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, getJwtSecret()) as JwtPayload;
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
