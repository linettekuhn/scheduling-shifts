import { beforeEach, describe, expect, it } from "vitest";
import { caregivers, shifts } from "../../db/schema";
import { db } from "../../db/connection";
import {
  createCaregiver,
  deleteCaregiver,
  getAllCaregivers,
} from "../../services/caregiver.service";

// reset table before each test
beforeEach(async () => {
  await db.delete(shifts);
  await db.delete(caregivers);
});

// getAll integration tests
describe("getAllCaregivers()", () => {
  it("returns empty array when no caregivers exist", async () => {
    // ACT
    const result = await getAllCaregivers();

    // ASSERT
    expect(result).toEqual([]);
  });

  it("returns all inserted caregivers", async () => {
    // ARRANGE
    await createCaregiver({ id: 0, name: "John" });
    await createCaregiver({ id: 0, name: "Jane" });

    // ACT
    const result = await getAllCaregivers();

    // ASSERT
    expect(result).toHaveLength(2);
    expect(result.map((c) => c.name)).toContain("John");
    expect(result.map((c) => c.name)).toContain("Jane");
  });
});

// createCaregiver integration tests
describe("createCaregiver()", () => {
  it("inserts caregiver and returns them", async () => {
    // ACT
    const result = await createCaregiver({ id: 0, name: "John" });

    // ASSERT
    expect(result).toBeDefined();
    expect(result.name).toBe("John");
    expect(result.id).toBeDefined;
  });

  it("persists the caregiver to the DB", async () => {
    // ACT
    await createCaregiver({ id: 0, name: "John" });
    const [row] = await db.select().from(caregivers);

    // ASSERT
    expect(row).toBeDefined();
    expect(row.name).toBe("John");
  });

  it("assigns unique id to each caregiver", async () => {
    // ACT
    const first = await createCaregiver({ id: 0, name: "John" });
    const second = await createCaregiver({ id: 0, name: "Jane" });

    // ASSERT
    expect(first.id).not.toBe(second.id);
  });
});

// deeleteCaregiver integration tests
describe("deleteCaregiver()", () => {
  it("deletes caregiver and returns them", async () => {
    // ARRANGE
    const created = await createCaregiver({ id: 0, name: "John" });

    // ACT
    const deleted = await deleteCaregiver(created.id);

    // ASSERT
    expect(deleted).toBeDefined();
    expect(deleted.id).toBe(created.id);
    expect(deleted.name).toBe("John");
  });

  it("removes caregiver from db", async () => {
    // ARRANGE
    const created = await createCaregiver({ id: 0, name: "John" });

    // ACT
    await deleteCaregiver(created.id);
    const rows = await db.select().from(caregivers);

    // ASSERT
    expect(rows).toHaveLength(0);
  });

  it("returns undefined when caregiver does not exist", async () => {
    // ACT
    const deleted = await deleteCaregiver(9999);

    // ASSERT
    expect(deleted).toBeUndefined();
  });
});
