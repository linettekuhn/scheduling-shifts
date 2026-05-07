import { eq } from "drizzle-orm";
import { db } from "../db/connection";
import { shifts } from "../db/schema";
import { Shift } from "../types/types";

export const getAllShifts = async () => {
  return db.select().from(shifts);
};

export const createShift = async (input: Omit<Shift, "id">) => {
  const [created] = await db.insert(shifts).values(input).returning();
  return created;
};

export const deleteShift = async (id: number) => {
  const [deleted] = await db
    .delete(shifts)
    .where(eq(shifts.id, id))
    .returning();

  return deleted;
};
