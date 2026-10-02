import { desc, eq } from "drizzle-orm"
import { db } from "../lib/db/db"
import {
  actionTable,
  conditionTable,
  itemActivityLogTable,
  itemTable,
  mediaFormatTable,
  ownerTable,
  staffTable,
  statusTable,
} from "./schema"
import {
  getOwnership,
  type ActivityEntry,
  type Condition,
  type ItemStatus,
  type ItemView,
  type MediaFormat,
} from "../lib/view"

// The seed stores human-readable status names; the UI works with slugs.
const statusSlugByName: Record<string, ItemStatus> = {
  "In Collection": "in-collection",
  "Currently Playing": "playing",
  "On Loan to Customer": "on-loan",
  "Reclaimed by Owner": "reclaimed",
  "In Repair": "repair",
}

const itemSelection = {
  idPublic: itemTable.idPublic,
  title: itemTable.title,
  artist: itemTable.artist,
  year: itemTable.year,
  genre: itemTable.genre,
  label: itemTable.label,
  formatName: mediaFormatTable.name,
  ownerName: ownerTable.name,
  ownerContact: ownerTable.contact,
  addedAt: ownerTable.date,
  location: ownerTable.location,
  notes: ownerTable.staffNotes,
  conditionName: conditionTable.name,
  statusName: statusTable.name,
}

const toItemView = (row: {
  idPublic: string
  title: string
  artist: string
  year: number
  genre: string
  label: string
  formatName: string | null
  ownerName: string | null
  ownerContact: string | null
  addedAt: string
  location: string
  notes: string | null
  conditionName: string | null
  statusName: string | null
}): ItemView => ({
  id: row.idPublic,
  title: row.title,
  artist: row.artist,
  year: row.year,
  genre: row.genre,
  label: row.label,
  format: (row.formatName ?? 'Vinyl LP (12")') as MediaFormat,
  condition: (row.conditionName ?? "Near Mint") as Condition,
  status: statusSlugByName[row.statusName ?? ""] ?? "in-collection",
  location: row.location,
  ownership: getOwnership(row.ownerName),
  ownerName: row.ownerName ?? "",
  ownerContact: row.ownerContact ?? undefined,
  addedAt: row.addedAt,
  notes: row.notes ?? undefined,
  // Discogs does not return usable cover art without an authenticated token.
  cover: "",
})

const activitySelection = {
  id: itemActivityLogTable.id,
  itemId: itemTable.idPublic,
  itemTitle: itemTable.title,
  action: actionTable.name,
  staff: staffTable.username,
  note: itemActivityLogTable.note,
  createdAt: itemActivityLogTable.createdAt,
}

const toActivityEntry = (row: {
  id: bigint
  itemId: string
  itemTitle: string
  action: string | null
  staff: string | null
  note: string | null
  createdAt: Date | null
}): ActivityEntry => ({
  id: String(row.id),
  itemId: row.itemId,
  itemTitle: row.itemTitle,
  action: row.action ?? "Activity",
  staff: row.staff ?? "unknown",
  note: row.note ?? undefined,
  createdAt: (row.createdAt ?? new Date()).toISOString(),
})

export async function getItems(): Promise<ItemView[]> {
  const rows = await db
    .select(itemSelection)
    .from(itemTable)
    .innerJoin(ownerTable, eq(itemTable.ownerId, ownerTable.id))
    .innerJoin(mediaFormatTable, eq(itemTable.mediaTypeId, mediaFormatTable.id))
    .innerJoin(conditionTable, eq(ownerTable.conditionId, conditionTable.id))
    .innerJoin(statusTable, eq(ownerTable.statusId, statusTable.id))
    .orderBy(desc(ownerTable.date))

  return rows.map(toItemView)
}

export async function getItemById(
  idPublic: string,
): Promise<ItemView | undefined> {
  const [row] = await db
    .select(itemSelection)
    .from(itemTable)
    .innerJoin(ownerTable, eq(itemTable.ownerId, ownerTable.id))
    .innerJoin(mediaFormatTable, eq(itemTable.mediaTypeId, mediaFormatTable.id))
    .innerJoin(conditionTable, eq(ownerTable.conditionId, conditionTable.id))
    .innerJoin(statusTable, eq(ownerTable.statusId, statusTable.id))
    .where(eq(itemTable.idPublic, idPublic))

  return row ? toItemView(row) : undefined
}

export async function getItemActivity(
  idPublic: string,
): Promise<ActivityEntry[]> {
  const rows = await db
    .select(activitySelection)
    .from(itemActivityLogTable)
    .innerJoin(itemTable, eq(itemActivityLogTable.itemId, itemTable.id))
    .leftJoin(actionTable, eq(itemActivityLogTable.actionId, actionTable.id))
    .leftJoin(staffTable, eq(itemActivityLogTable.staffId, staffTable.id))
    .where(eq(itemTable.idPublic, idPublic))
    .orderBy(desc(itemActivityLogTable.createdAt))

  return rows.map(toActivityEntry)
}

export async function getActivity(limit = 6): Promise<ActivityEntry[]> {
  const rows = await db
    .select(activitySelection)
    .from(itemActivityLogTable)
    .innerJoin(itemTable, eq(itemActivityLogTable.itemId, itemTable.id))
    .leftJoin(actionTable, eq(itemActivityLogTable.actionId, actionTable.id))
    .leftJoin(staffTable, eq(itemActivityLogTable.staffId, staffTable.id))
    .orderBy(desc(itemActivityLogTable.createdAt))
    .limit(limit)

  return rows.map(toActivityEntry)
}
