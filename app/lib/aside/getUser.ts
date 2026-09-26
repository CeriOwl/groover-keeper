import { cookies } from "next/headers"
import { decrypt } from "../session"
import { db } from "../db/db"
import { roleTable, staffTable } from "@/app/db/schema"
import { eq } from "drizzle-orm"

export async function getUser() {
  // get the id
  const cookieStore = await cookies()
  const session = await cookieStore.get("session")
  const jwt = await decrypt(session?.value)
  const userId = String(jwt?.sub)

  const [user] = await db.select({
    idPublic: staffTable.idPublic,
    username: staffTable.username,
    role: roleTable.name,
    roleId: staffTable.roleId,
  })
    .from(staffTable)
    .where(eq(staffTable.idPublic, userId))
    .leftJoin(roleTable, eq(staffTable.roleId, roleTable.id))

  return user
}
