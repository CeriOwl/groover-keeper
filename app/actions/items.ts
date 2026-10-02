"use server"
import { randomUUID } from "crypto"
import { revalidatePath } from "next/cache"
import { eq } from "drizzle-orm"
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
} from "../db/schema"
import { AddItemSchema, type AddItemInput, type AddItemResult } from "../lib/definitions"
import { getUser } from "../lib/aside/getUser"
import { HOUSE_OWNER } from "../lib/view"

const DEFAULT_STATUS = "In Collection"
const DEFAULT_ACTION = "Checked In"

export async function addItem(input: AddItemInput): Promise<AddItemResult> {
  const user = await getUser()
  if (!user) {
    return { ok: false, message: "You need to be signed in to check in a record." }
  }

  const parsed = AddItemSchema.safeParse(input)
  if (!parsed.success) {
    return {
      ok: false,
      message: "Some details are missing or invalid.",
      errors: parsed.error.flatten().fieldErrors,
    }
  }

  const data = parsed.data

  const [format] = await db
    .select({ id: mediaFormatTable.id })
    .from(mediaFormatTable)
    .where(eq(mediaFormatTable.name, data.format))

  const [condition] = await db
    .select({ id: conditionTable.id })
    .from(conditionTable)
    .where(eq(conditionTable.name, data.condition))

  const [status] = await db
    .select({ id: statusTable.id })
    .from(statusTable)
    .where(eq(statusTable.name, DEFAULT_STATUS))

  const [action] = await db
    .select({ id: actionTable.id })
    .from(actionTable)
    .where(eq(actionTable.name, DEFAULT_ACTION))

  const [staff] = await db
    .select({ id: staffTable.id })
    .from(staffTable)
    .where(eq(staffTable.idPublic, user.idPublic))

  const missing = [
    !format && `media format "${data.format}"`,
    !condition && `condition "${data.condition}"`,
    !status && `status "${DEFAULT_STATUS}"`,
    !action && `action "${DEFAULT_ACTION}"`,
    !staff && "your staff account",
  ].filter(Boolean)

  if (!format || !condition || !status || !action || !staff) {
    return {
      ok: false,
      message: `Setup incomplete — missing ${missing.join(", ")}. Try re-seeding the database.`,
    }
  }

  const idPublic = randomUUID()

  await db.transaction(async (tx) => {
    const [owner] = await tx
      .insert(ownerTable)
      .values({
        name: data.ownership === "house" ? HOUSE_OWNER : data.ownerName,
        contact: data.ownerContact || null,
        date: new Date().toISOString().slice(0, 10),
        location: data.location,
        staffNotes: data.notes || null,
        statusId: status.id,
        conditionId: condition.id,
      })
      .returning({ id: ownerTable.id })

    const [item] = await tx
      .insert(itemTable)
      .values({
        idPublic,
        title: data.title,
        artist: data.artist,
        year: data.year,
        genre: data.genre,
        label: data.label,
        ownerId: Number(owner.id),
        mediaTypeId: format.id,
      })
      .returning({ id: itemTable.id })

    await tx.insert(itemActivityLogTable).values({
      note: "Checked in from the Discogs catalogue.",
      createdAt: new Date(),
      actionId: action.id,
      staffId: staff.id,
      itemId: item.id,
    })
  })

  revalidatePath("/inventory")
  revalidatePath("/dashboard")

  return { ok: true, id: idPublic }
}
