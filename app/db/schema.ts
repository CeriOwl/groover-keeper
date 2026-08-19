import { date, integer, text, pgTable, bigint, uuid, timestamp } from "drizzle-orm/pg-core"

export const statusTable = pgTable("status", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text().notNull()
})

export const conditionTable = pgTable("condition", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text().notNull()
})

export const mediaFormatTable = pgTable("media_format", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text().notNull()
})

export const itemTable = pgTable("item", {
  id: bigint({ mode: "bigint" }).primaryKey().generatedAlwaysAsIdentity(),
  idPublic: uuid("id_public").notNull(),
  title: text().notNull(),
  artist: text().notNull(),
  year: integer().notNull(),
  genre: text().notNull(),
  label: text().notNull(),
  ownerId: integer("owner_id").notNull().references(() => ownerTable.id),
  mediaTypeId: integer("media_type_id").notNull().references(() => mediaFormatTable.id)
})

export const ownerTable = pgTable("owner", {
  id: bigint({ mode: "bigint" }).primaryKey().generatedAlwaysAsIdentity(),
  name: text(),
  contact: text(),
  date: date().notNull(),
  location: text().notNull(),
  staffNotes: text("staff_notes"),
  statusId: integer("status_id").notNull().references(() => statusTable.id),
  conditionId: integer("condition_id").notNull().references(() => conditionTable.id),
})

export const roleTable = pgTable("role", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text().notNull()
})

export const actionTable = pgTable("action", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text().notNull()
})

export const staffTable = pgTable("staff", {
  id: bigint({ mode: "bigint" }).primaryKey().generatedAlwaysAsIdentity(),
  idPublic: uuid("id_public").notNull(),
  username: text(),
  password: text(),
  createdAt: timestamp("created_at"),
  roleId: integer("role_id").references(() => roleTable.id)
})

export const itemActivityLogTable = pgTable("item_activity_log", {
  id: bigint({ mode: "bigint" }).primaryKey().generatedAlwaysAsIdentity(),
  note: text(),
  createdAt: timestamp("created_at"),
  actionId: integer("action_id").references(() => actionTable.id),
  staffId: bigint("staff_id", { mode: "bigint" }).references(() => staffTable.id),
  itemId: bigint("item_id", { mode: "bigint" }).references(() => itemTable.id)
})
