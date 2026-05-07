import { beforeEach, describe, expect, it } from "vitest";
import { shifts, patients, caregivers } from "../../db/schema";
import { db } from "../../db/connection";
import {
  createShift,
  deleteShift,
  getAllShifts,
} from "../../services/shift.service";
import { createCaregiver } from "../../services/caregiver.service";
import { createPatient } from "../../services/patient.service";

let patientAId: number;
let patientBId: number;
let caregiverAId: number;
let caregiverBId: number;

// reset tables and seed required foreign key rows before each test
beforeEach(async () => {
  await db.delete(shifts);
  await db.delete(patients);
  await db.delete(caregivers);

  const patientA = await createPatient({ id: 0, name: "Patient A" });
  const patientB = await createPatient({ id: 0, name: "Patient B" });
  const caregiverA = await createCaregiver({ id: 0, name: "John" });
  const caregiverB = await createCaregiver({ id: 0, name: "Jane" });

  patientAId = patientA.id;
  patientBId = patientB.id;
  caregiverAId = caregiverA.id;
  caregiverBId = caregiverB.id;
});

// getAllShifts integration tests
describe("getAllShifts()", () => {
  it("returns empty array when no shifts exist", async () => {
    // ACT
    const result = await getAllShifts();

    // ASSERT
    expect(result).toEqual([]);
  });

  it("returns all inserted shifts", async () => {
    // ARRANGE
    await createShift({
      start_time: new Date("2024-01-15T08:00:00Z"),
      end_time: new Date("2024-01-15T16:00:00Z"),
      patient_id: patientAId,
      caregiver_id: caregiverAId,
    });
    await createShift({
      start_time: new Date("2024-01-15T16:00:00Z"),
      end_time: new Date("2024-01-16T00:00:00Z"),
      patient_id: patientBId,
      caregiver_id: caregiverBId,
    });

    // ACT
    const result = await getAllShifts();

    // ASSERT
    expect(result).toHaveLength(2);
    expect(result.map((s) => s.caregiver_id)).toContain(caregiverAId);
    expect(result.map((s) => s.caregiver_id)).toContain(caregiverBId);
  });
});

// createShift integration tests
describe("createShift()", () => {
  it("inserts shift and returns it", async () => {
    // ACT
    const result = await createShift({
      start_time: new Date("2024-01-15T08:00:00Z"),
      end_time: new Date("2024-01-15T16:00:00Z"),
      patient_id: patientAId,
      caregiver_id: caregiverAId,
    });

    // ASSERT
    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(result.caregiver_id).toBe(caregiverAId);
    expect(result.patient_id).toBe(patientAId);
    expect(result.start_time).toEqual(new Date("2024-01-15T08:00:00Z"));
    expect(result.end_time).toEqual(new Date("2024-01-15T16:00:00Z"));
  });

  it("persists the shift to the DB", async () => {
    // ACT
    await createShift({
      start_time: new Date("2024-01-15T08:00:00Z"),
      end_time: new Date("2024-01-15T16:00:00Z"),
      patient_id: patientAId,
      caregiver_id: caregiverAId,
    });
    const [row] = await db.select().from(shifts);

    // ASSERT
    expect(row).toBeDefined();
    expect(row.patient_id).toBe(patientAId);
    expect(row.caregiver_id).toBe(caregiverAId);
  });

  it("assigns unique id to each shift", async () => {
    // ACT
    const first = await createShift({
      start_time: new Date("2024-01-15T08:00:00Z"),
      end_time: new Date("2024-01-15T16:00:00Z"),
      patient_id: patientAId,
      caregiver_id: caregiverAId,
    });
    const second = await createShift({
      start_time: new Date("2024-01-15T16:00:00Z"),
      end_time: new Date("2024-01-16T00:00:00Z"),
      patient_id: patientBId,
      caregiver_id: caregiverBId,
    });

    // ASSERT
    expect(first.id).not.toBe(second.id);
  });
});

// deleteShift integration tests
describe("deleteShift()", () => {
  it("deletes shift and returns it", async () => {
    // ARRANGE
    const created = await createShift({
      start_time: new Date("2024-01-15T08:00:00Z"),
      end_time: new Date("2024-01-15T16:00:00Z"),
      patient_id: patientAId,
      caregiver_id: caregiverAId,
    });

    // ACT
    const deleted = await deleteShift(created.id);

    // ASSERT
    expect(deleted).toBeDefined();
    expect(deleted.id).toBe(created.id);
    expect(deleted.caregiver_id).toBe(caregiverAId);
  });

  it("removes shift from db", async () => {
    // ARRANGE
    const created = await createShift({
      start_time: new Date("2024-01-15T08:00:00Z"),
      end_time: new Date("2024-01-15T16:00:00Z"),
      patient_id: patientAId,
      caregiver_id: caregiverAId,
    });

    // ACT
    await deleteShift(created.id);
    const rows = await db.select().from(shifts);

    // ASSERT
    expect(rows).toHaveLength(0);
  });

  it("returns undefined when shift does not exist", async () => {
    // ACT
    const deleted = await deleteShift(9999);

    // ASSERT
    expect(deleted).toBeUndefined();
  });
});
