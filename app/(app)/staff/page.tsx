import { redirect } from "next/navigation"
import { asc, eq } from "drizzle-orm"
import { PageHeader } from "@/app/components/ui/page-header"
import { db } from "@/app/lib/db/db"
import { roleTable, staffTable } from "@/app/db/schema"
import { requireAdmin } from "@/app/lib/permissions"
import { StaffManager } from "./staff-manager"

const Staff = async () => {
  const admin = await requireAdmin()
  if (!admin) redirect("/dashboard")

  const staff = await db
    .select({
      idPublic: staffTable.idPublic,
      username: staffTable.username,
      roleId: staffTable.roleId,
      role: roleTable.name,
    })
    .from(staffTable)
    .leftJoin(roleTable, eq(staffTable.roleId, roleTable.id))
    .orderBy(asc(staffTable.username))

  const roles = await db
    .select({ id: roleTable.id, name: roleTable.name })
    .from(roleTable)
    .orderBy(asc(roleTable.id))

  return (
    <div className="mx-auto flex max-w-252 flex-col gap-8 px-6 py-10 md:px-10">
      <PageHeader
        title="Staff"
        description="Admin only. Create login accounts for the team and remove ones that have left."
      />
      <StaffManager
        staff={staff}
        roles={roles}
        currentIdPublic={admin.idPublic}
      />
    </div>
  )
}

export default Staff
