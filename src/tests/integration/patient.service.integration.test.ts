import { beforeEach, describe, expect, it } from "vitest";
import { patients, shifts } from "../../db/schema";
import { db } from "../../db/connection";
import {
  createPatient,
  deletePatient,
  getAllPatients,
} from "../../services/patient.service";

// reset table before each test
beforeEach(async () => {
  await db.delete(shifts);
  await db.delete(patients);
});

// getAll integration tests
describe("getAllPatients()", () => {
  it("returns empty array when no patients exist", async () => {
    // ACT
    const result = await getAllPatients();

    // ASSERT
    expect(result).toEqual([]);
  });

  it("returns all inserted patients", async () => {
    // ARRANGE
    await createPatient({ id: 0, name: "John" });
    await createPatient({ id: 0, name: "Jane" });

    // ACT
    const result = await getAllPatients();

    // ASSERT
    expect(result).toHaveLength(2);
    expect(result.map((p) => p.name)).toContain("John");
    expect(result.map((p) => p.name)).toContain("Jane");
  });
});

// createPatient integration tests
describe("createPatient()", () => {
  it("inserts patient and returns them", async () => {
    // ACT
    const result = await createPatient({ id: 0, name: "John" });

    // ASSERT
    expect(result).toBeDefined();
    expect(result.name).toBe("John");
    expect(result.id).toBeDefined;
  });

  it("persists the patient to the DB", async () => {
    // ACT
    await createPatient({ id: 0, name: "John" });
    const [row] = await db.select().from(patients);

    // ASSERT
    expect(row).toBeDefined();
    expect(row.name).toBe("John");
  });

  it("assigns unique id to each patient", async () => {
    // ACT
    const first = await createPatient({ id: 0, name: "John" });
    const second = await createPatient({ id: 0, name: "Jane" });

    // ASSERT
    expect(first.id).not.toBe(second.id);
  });
});

// deeletePatient integration tests
describe("deletePatient()", () => {
  it("deletes patient and returns them", async () => {
    // ARRANGE
    const created = await createPatient({ id: 0, name: "John" });

    // ACT
    const deleted = await deletePatient(created.id);

    // ASSERT
    expect(deleted).toBeDefined();
    expect(deleted.id).toBe(created.id);
    expect(deleted.name).toBe("John");
  });

  it("removes patient from db", async () => {
    // ARRANGE
    const created = await createPatient({ id: 0, name: "John" });

    // ACT
    await deletePatient(created.id);
    const rows = await db.select().from(patients);

    // ASSERT
    expect(rows).toHaveLength(0);
  });

  it("returns undefined when patient does not exist", async () => {
    // ACT
    const deleted = await deletePatient(9999);

    // ASSERT
    expect(deleted).toBeUndefined();
  });
});
