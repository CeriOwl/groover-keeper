"use server"
import { redirect } from "next/navigation";
import { FormState, SignupFormSchema } from "../lib/definitions";
import { createSession, deleteSession } from "../lib/session";
import { db } from "../lib/db/db"
import { staffTable } from "../db/schema";
import { and, eq } from "drizzle-orm";
import { compareSync } from "bcrypt";

export async function signup(state: FormState, formData: FormData) {
  const password = formData.get("password") as string
  const validateFields = SignupFormSchema.safeParse({
    username: formData.get("username"),
    password: password
  })

  if (!validateFields.success) {
    return {
      errors: validateFields.error.flatten().fieldErrors,
    }
  }

  // Call the provider or db to create a user...
  const userId = await db.select({ id: staffTable.idPublic, password: staffTable.password }).from(staffTable).where(
    and(
      eq(staffTable.username, `${formData.get("username")}`),
    ))

  const user = userId[0]

  if (!user?.password || !compareSync(password, user.password)) {
    return { message: "Username and password do not match a staff account." }
  }

  await createSession(user.id)
  redirect("/dashboard")
}

export async function logout() {
  await deleteSession()
  redirect('/')
}
