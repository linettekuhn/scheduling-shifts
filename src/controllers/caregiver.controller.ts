import { NextFunction, Request, Response } from "express";
import * as CaregiverService from "../services/caregiver.service";

export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await CaregiverService.getAllCaregivers();
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name } = req.body;
    if (!name) {
      res.send(400).json({ error: "Missing name" });
    }

    const created = await CaregiverService.createCaregiver({ id: 0, name });
    res.status(201).json(created);
  } catch (error) {
    next(error);
  }
};

export const remove = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = Number(req.params.id);
    if (!id) {
      res.send(400).json({ error: "Missing id" });
    }

    const deleted = await CaregiverService.deleteCaregiver(id);
    res.json(deleted);
  } catch (error) {
    next(error);
  }
};
