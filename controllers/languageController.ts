import { Request, Response } from "express";
import db from "../models";

const Language = db.Language;

export const getAllLanguages = async (req: Request, res: Response) => {
  try {
    const languages = await Language.findAll({
      attributes: ["id", "code", "name"],
    });
    res.json({ success: true, data: languages });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
