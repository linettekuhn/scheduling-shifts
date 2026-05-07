import { Router } from "express";
import * as ShiftController from "../controllers/shift.controller";

const router = Router();

router.get("/", ShiftController.getAll);
router.post("/", ShiftController.create);
router.delete("/:id", ShiftController.remove);

export default router;
