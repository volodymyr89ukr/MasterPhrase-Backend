import express from "express";
import { getLearningLanguages } from "../controllers/learningLanguageController";

const router = express.Router();

router.get("/", getLearningLanguages);

export default router;
