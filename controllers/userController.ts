import { Request, Response } from "express";
import db from "../models";

const { UserProfile, Removed, Mistake, UserSubscription } = db;

// Додаємо тип для кастомного userId (middleware додає userId до req)
interface UserRequest extends Request {
  userId?: number;
}

// GET /users/:id/profile
export const getProfile = async (req: UserRequest, res: Response) => {
  try {
    if (Number(req.params.id) !== req.userId)
      return res.status(403).json({ message: "Access denied" });
    const profile = await UserProfile.findOne({
      where: { user_id: req.userId },
    });
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.json({ success: true, data: profile });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// PUT /users/:id/profile
export const updateProfile = async (req: UserRequest, res: Response) => {
  try {
    if (Number(req.params.id) !== req.userId)
      return res.status(403).json({ message: "Access denied" });
    const { first_name, last_name, country, language } = req.body;
    const profile = await UserProfile.findOne({
      where: { user_id: req.userId },
    });
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    await profile.update({ first_name, last_name, country, language });
    res.json({ success: true, data: profile });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET /users/:id/removed/:set_id
export const getRemovedWords = async (req: UserRequest, res: Response) => {
  try {
    if (Number(req.params.id) !== req.userId)
      return res.status(403).json({ message: "Access denied" });
    const removed = await Removed.findOne({
      where: { user_id: req.userId, set_id: req.params.set_id },
    });
    res.json({ success: true, data: removed ? removed.removed_word_ids : [] });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// POST /users/:id/removed/:set_id
export const addRemovedWords = async (req: UserRequest, res: Response) => {
  try {
    if (Number(req.params.id) !== req.userId)
      return res.status(403).json({ message: "Access denied" });
    const { removed_word_ids } = req.body;
    let removed = await Removed.findOne({
      where: { user_id: req.userId, set_id: req.params.set_id },
    });
    if (removed) {
      await removed.update({ removed_word_ids });
    } else {
      removed = await Removed.create({
        user_id: req.userId,
        set_id: req.params.set_id,
        removed_word_ids,
      });
    }
    res.json({ success: true, data: removed.removed_word_ids });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// DELETE /users/:id/removed/:set_id/:word_id
export const removeRemovedWord = async (req: UserRequest, res: Response) => {
  try {
    if (Number(req.params.id) !== req.userId)
      return res.status(403).json({ message: "Access denied" });
    const { set_id, word_id } = req.params;
    const removed = await Removed.findOne({
      where: { user_id: req.userId, set_id },
    });
    if (!removed) return res.status(404).json({ message: "Nothing to remove" });
    const ids = (removed.removed_word_ids || []).filter(
      (id: number) => Number(id) !== Number(word_id)
    );
    await removed.update({ removed_word_ids: ids });
    res.json({ success: true, data: ids });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET /users/:id/mistakes
export const getMistakes = async (req: UserRequest, res: Response) => {
  try {
    if (Number(req.params.id) !== req.userId)
      return res.status(403).json({ message: "Access denied" });
    const mistakes = await Mistake.findAll({ where: { user_id: req.userId } });
    res.json({ success: true, data: mistakes });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// POST /users/:id/mistakes
export const addMistake = async (req: UserRequest, res: Response) => {
  try {
    if (Number(req.params.id) !== req.userId)
      return res.status(403).json({ message: "Access denied" });
    const { word_id, delta } = req.body;
    let mistake = await Mistake.findOne({
      where: { user_id: req.userId, word_id },
    });
    if (mistake) {
      await mistake.update({
        quantity: mistake.quantity + (delta || 1),
        updated_at: new Date(),
      });
    } else {
      mistake = await Mistake.create({
        user_id: req.userId,
        word_id,
        quantity: delta || 1,
        updated_at: new Date(),
      });
    }
    res.json({ success: true, data: mistake });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// DELETE /users/:id/mistakes/:word_id
export const removeMistake = async (req: UserRequest, res: Response) => {
  try {
    if (Number(req.params.id) !== req.userId)
      return res.status(403).json({ message: "Access denied" });
    await Mistake.destroy({
      where: { user_id: req.userId, word_id: req.params.word_id },
    });
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET /users/:id/subscription
export const getSubscription = async (req: UserRequest, res: Response) => {
  try {
    if (Number(req.params.id) !== req.userId)
      return res.status(403).json({ message: "Access denied" });
    const subs = await UserSubscription.findAll({
      where: { user_id: req.userId },
    });
    res.json({ success: true, data: subs });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// POST /users/:id/subscription
export const updateSubscription = async (req: UserRequest, res: Response) => {
  try {
    if (Number(req.params.id) !== req.userId)
      return res.status(403).json({ message: "Access denied" });
    const {
      plan,
      status,
      start_date,
      end_date,
      payment_provider,
      external_id,
    } = req.body;
    let subs = await UserSubscription.findOne({
      where: { user_id: req.userId, status: "active" },
    });
    if (subs) {
      await subs.update({
        plan,
        status,
        start_date,
        end_date,
        payment_provider,
        external_id,
      });
    } else {
      subs = await UserSubscription.create({
        user_id: req.userId,
        plan,
        status,
        start_date,
        end_date,
        payment_provider,
        external_id,
      });
    }
    res.json({ success: true, data: subs });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET /users/:id/languages-settings
export const getLanguagesSettings = async (req: UserRequest, res: Response) => {
  try {
    if (Number(req.params.id) !== req.userId)
      return res.status(403).json({ message: "Access denied" });

    const profile = await UserProfile.findOne({
      where: { user_id: req.userId },
      attributes: ["learning_language", "interface_language"],
    });

    if (!profile) return res.status(404).json({ message: "Profile not found" });

    res.json({ success: true, data: profile });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// PUT /users/:id/languages-settings
export const updateLanguagesSettings = async (
  req: UserRequest,
  res: Response
) => {
  try {
    if (Number(req.params.id) !== req.userId)
      return res.status(403).json({ message: "Access denied" });

    const { learning_language, interface_language } = req.body;

    const profile = await UserProfile.findOne({
      where: { user_id: req.userId },
    });

    if (!profile) return res.status(404).json({ message: "Profile not found" });

    await profile.update({ learning_language, interface_language });

    res.json({ success: true, data: profile });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
