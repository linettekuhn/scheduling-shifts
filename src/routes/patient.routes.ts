import { Router } from "express";
import * as PatientController from "../controllers/patient.controller";

const router = Router();

router.get("/", PatientController.getAll);
router.post("/", PatientController.create);
router.delete("/:id", PatientController.remove);

export default router;
