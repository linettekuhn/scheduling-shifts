import { NextFunction, Request, Response } from "express";
import * as ShiftService from "../services/shift.service";

export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await ShiftService.getAllShifts();
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
    const { start_time, end_time, patient_id, caregiver_id } = req.body;
    if (!start_time || !end_time || !patient_id || !caregiver_id) {
      res.send(400).json({ error: "Missing shift data" });
    }

    const created = await ShiftService.createShift({
      id: 0,
      start_time: new Date(start_time),
      end_time: new Date(end_time),
      patient_id: Number(patient_id),
      caregiver_id: Number(caregiver_id),
    });
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

    const deleted = await ShiftService.deleteShift(id);
    res.json(deleted);
  } catch (error) {
    next(error);
  }
};
