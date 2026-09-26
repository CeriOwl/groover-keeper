"use server"
import { randomUUID } from "crypto"
import { hashSync } from "bcrypt"
import { revalidatePath } from "next/cache"
import { eq } from "drizzle-orm"
import { db } from "../lib/db/db"
import { roleTable, staffTable } from "../db/schema"
import { StaffFormSchema, type StaffFormState } from "../lib/definitions"
import { requireAdmin } from "../lib/permissions"

export async function createStaff(
  _state: StaffFormState,
  formData: FormData,
): Promise<StaffFormState> {
  const admin = await requireAdmin()
  if (!admin) {
    return { message: "Only admins can manage staff accounts." }
  }

  const parsed = StaffFormSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
    roleId: formData.get("roleId"),
  })

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors }
  }

  const [existing] = await db
    .select({ id: staffTable.id })
    .from(staffTable)
    .where(eq(staffTable.username, parsed.data.username))

  if (existing) {
    return { errors: { username: ["That username is already taken."] } }
  }

  const [role] = await db
    .select({ id: roleTable.id })
    .from(roleTable)
    .where(eq(roleTable.id, parsed.data.roleId))

  if (!role) {
    return { errors: { roleId: ["That role does not exist."] } }
  }

  await db.insert(staffTable).values({
    idPublic: randomUUID(),
    username: parsed.data.username,
    password: hashSync(parsed.data.password, 10),
    roleId: parsed.data.roleId,
    createdAt: new Date(),
  })

  revalidatePath("/staff")
  return { message: `Created ${parsed.data.username}.` }
}

export async function deleteStaff(
  idPublic: string,
): Promise<{ ok: boolean; message: string }> {
  const admin = await requireAdmin()
  if (!admin) {
    return { ok: false, message: "Only admins can manage staff accounts." }
  }

  if (idPublic === admin.idPublic) {
    return { ok: false, message: "You cannot delete your own account." }
  }

  const [target] = await db
    .select({ username: staffTable.username })
    .from(staffTable)
    .where(eq(staffTable.idPublic, idPublic))

  if (!target) {
    return { ok: false, message: "That staff account no longer exists." }
  }

  try {
    await db.delete(staffTable).where(eq(staffTable.idPublic, idPublic))
  } catch {
    return {
      ok: false,
      message: `${target.username ?? "That account"} still has activity records and cannot be deleted.`,
    }
  }

  revalidatePath("/staff")
  return { ok: true, message: `Deleted ${target.username ?? "the account"}.` }
}
