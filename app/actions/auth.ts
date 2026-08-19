"use server"
import { redirect } from "next/navigation";
import { FormState, SignupFormSchema } from "../lib/definitions";
import { createSession, deleteSession } from "../lib/session";
import { db } from "../lib/db/db"
import { staffTable } from "../db/schema";
import { and, eq } from "drizzle-orm";

export async function signup(state: FormState, formData: FormData) {
  const validateFields = SignupFormSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password")
  })

  if (!validateFields.success) {
    return {
      errors: validateFields.error.flatten().fieldErrors,
    }
  }
  // Call the provider or db to create a user...
  const userId = await db.select({ id: staffTable.idPublic }).from(staffTable).where(
    and(
      eq(staffTable.username, `${formData.get("username")}`),
      eq(staffTable.password, `${formData.get("password")}`),
    ))
  await createSession(userId[0].id)
  redirect("/dashboard")
}

export async function logout() {
  await deleteSession()
  redirect('/login')
}
