import { text, integer, timestamp, serial, pgTable } from "drizzle-orm/pg-core";

export const caregivers = pgTable("caregivers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
});

export const patients = pgTable("patients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
});

export const shifts = pgTable("shifts", {
  id: serial("id").primaryKey(),
  start_time: timestamp("start_time").notNull(),
  end_time: timestamp("end_time").notNull(),
  patient_id: integer("patient_id")
    .references(() => patients.id, { onDelete: "cascade" })
    .notNull(),
  caregiver_id: integer("caregiver_id")
    .references(() => caregivers.id, { onDelete: "cascade" })
    .notNull(),
});
