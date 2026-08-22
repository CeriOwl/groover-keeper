import * as z from "zod"

export const SignupFormSchema = z.object({
  username: z.string().trim().min(5, { message: "Admin must be at least 5 characters." }),
  password: z.string().min(8, { error: "Be at least 8 characters long" })
    .regex(/[a-zA-Z]/, { error: 'Contain at least one letter.' })
    .regex(/[0-9]/, { error: 'Contain at least one number.' })
    .regex(/[^a-zA-Z0-9]/, {
      error: 'Contain at least one special character.',
    }).trim()
})

export type FormState = | {
  errors?: {
    email?: string[]
    password?: string[]
  }
  message?: string
} | undefined
