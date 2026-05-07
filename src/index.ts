import express from "express";
import CaregiverRouter from "./routes/caregiver.routes";
import PatientRouter from "./routes/patient.routes";
import ShiftRouter from "./routes/shift.routes";
import { env } from "./config/env";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

// caregiver router
app.use("/caregiver", CaregiverRouter);

// patient router
app.use("/patient", PatientRouter);

// shift router
app.use("/shift", ShiftRouter);

// middleware to parse json
app.use(express.json());

// error middleware (last)
app.use(errorHandler);

// base route
app.get("/", (req, res) => {
  res.send("Scheduling backend running!");
});

app.listen(env.PORT, () => {
  console.log(`Scheduling backend running on port ${env.PORT}`);
});
