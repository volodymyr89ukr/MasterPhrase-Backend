import { Router } from "express";
import * as wordController from "../controllers/wordController";

const router = Router();

router.get("/:id", wordController.getWordById);

export default router;
