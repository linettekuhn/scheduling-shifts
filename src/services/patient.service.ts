import { eq } from "drizzle-orm";
import { db } from "../db/connection";
import { patients } from "../db/schema";
import { Patient } from "../types/types";

export const getAllPatients = async () => {
  return db.select().from(patients);
};

export const createPatient = async ({ name }: Patient) => {
  const [created] = await db.insert(patients).values({ name }).returning();
  return created;
};

export const deletePatient = async ({ id }: Patient) => {
  const [deleted] = await db
    .delete(patients)
    .where(eq(patients.id, id))
    .returning();

  return deleted;
};
