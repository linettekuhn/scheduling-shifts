import { eq } from "drizzle-orm";
import { db } from "../db/connection";
import { caregivers } from "../db/schema";
import { Caregiver } from "../types/types";

export const getAllCaregivers = async () => {
  return db.select().from(caregivers);
};

export const createCaregiver = async ({ name }: Caregiver) => {
  const [created] = await db.insert(caregivers).values({ name }).returning();
  return created;
};

export const deleteCaregiver = async ({ id }: Caregiver) => {
  const [deleted] = await db
    .delete(caregivers)
    .where(eq(caregivers.id, id))
    .returning();

  return deleted;
};
