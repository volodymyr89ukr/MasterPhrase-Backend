import express from "express";
import { getAllLanguages } from "../controllers/languageController";

const router = express.Router();

router.get("/", getAllLanguages);

export default router;
