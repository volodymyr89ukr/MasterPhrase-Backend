import { Router } from "express";
import * as userController from "../controllers/userController";
import authMiddleware from "../middlewares/authMiddleware";

const router = Router();

// Профіль
router.get("/:id/profile", authMiddleware, userController.getProfile);
router.put("/:id/profile", authMiddleware, userController.updateProfile);

// Removed
router.get(
  "/:id/removed/:set_id",
  authMiddleware,
  userController.getRemovedWords
);
router.post(
  "/:id/removed/:set_id",
  authMiddleware,
  userController.addRemovedWords
);
router.delete(
  "/:id/removed/:set_id/:word_id",
  authMiddleware,
  userController.removeRemovedWord
);

// Mistakes
router.get("/:id/mistakes", authMiddleware, userController.getMistakes);
router.post("/:id/mistakes", authMiddleware, userController.addMistake);
router.delete(
  "/:id/mistakes/:word_id",
  authMiddleware,
  userController.removeMistake
);

// Language
router.get(
  "/:id/languages-settings",
  authMiddleware,
  userController.getLanguagesSettings
);
router.put(
  "/:id/languages-settings",
  authMiddleware,
  userController.updateLanguagesSettings
);

// Subscription
router.get("/:id/subscription", authMiddleware, userController.getSubscription);
router.post(
  "/:id/subscription",
  authMiddleware,
  userController.updateSubscription
);

export default router;
