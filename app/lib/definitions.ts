import * as z from "zod"

export const SignupFormSchema = z.object({
  username: z.string().trim(),
  // password: z.string().min(8, { error: "Be at least 8 characters long" })
  //   .regex(/[a-zA-Z]/, { error: 'Contain at least one letter.' })
  //   .regex(/[0-9]/, { error: 'Contain at least one number.' })
  //   .regex(/[^a-zA-Z0-9]/, {
  //     error: 'Contain at least one special character.',
  //   }).trim()
  password: z.string().trim(),
})

export type FormState = | {
  errors?: {
    email?: string[]
    password?: string[]
  }
  message?: string
} | undefined
