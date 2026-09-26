import "server-only"
import { getUser } from "./aside/getUser"

export const ADMIN_ROLE_ID = 1

export async function requireAdmin() {
  const user = await getUser()
  if (!user || user.roleId !== ADMIN_ROLE_ID) return null
  return user
}
