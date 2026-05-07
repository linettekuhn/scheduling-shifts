import { Router } from "express";
import * as CaregiverController from "../controllers/caregiver.controller";

const router = Router();

router.get("/", CaregiverController.getAll);
router.post("/", CaregiverController.create);
router.delete("/:id", CaregiverController.remove);

export default router;
