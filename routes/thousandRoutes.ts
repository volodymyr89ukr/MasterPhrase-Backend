import { Router } from "express";
import * as thousandController from "../controllers/thousandController";

const router = Router();

router.get("/", thousandController.getAllThousands); // /api/thousands
router.get("/:id/word-sets", thousandController.getWordSetsByThousand); // /api/thousands/:id/word-sets

export default router;
