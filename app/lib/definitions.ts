import * as z from "zod"

export const SignupFormSchema = z.object({
  username: z.string().trim().min(3, { message: "Username must be at least 3 characters." }),
  password: z.string().min(8, { error: "Be at least 8 characters long" })
    .regex(/[a-zA-Z]/, { error: 'Contain at least one letter.' })
    .regex(/[0-9]/, { error: 'Contain at least one number.' })
    .regex(/[^a-zA-Z0-9]/, {
      error: 'Contain at least one special character.',
    }).trim()
})

export type FormState = | {
  errors?: {
    username?: string[]
    password?: string[]
  }
  message?: string
} | undefined

export const StaffFormSchema = z.object({
  username: z.string().trim().min(3, { message: "Username must be at least 3 characters." }),
  password: z.string().min(8, { message: "Be at least 8 characters long." })
    .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
    .regex(/[0-9]/, { message: "Contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, { message: "Contain at least one special character." })
    .trim(),
  roleId: z.coerce.number().int().positive({ message: "Pick a role." }),
})

export type StaffFormState = {
  errors?: {
    username?: string[]
    password?: string[]
    roleId?: string[]
  }
  message?: string
} | undefined

export const AddItemSchema = z
  .object({
    title: z.string().trim().min(1, { message: "A title is required." }),
    artist: z.string().trim().min(1, { message: "An artist is required." }),
    year: z.coerce.number().int().min(1900).max(2100),
    genre: z.string().trim().min(1, { message: "A genre is required." }),
    label: z.string().trim().min(1, { message: "A label is required." }),
    format: z.string().trim().min(1, { message: "A media format is required." }),
    ownership: z.enum(["house", "loan", "donation"]),
    ownerName: z.string().trim(),
    ownerContact: z.string().trim(),
    condition: z.string().trim().min(1, { message: "A condition is required." }),
    location: z.string().trim().min(1, { message: "A storage location is required." }),
    notes: z.string().trim(),
  })
  .refine((data) => data.ownership === "house" || data.ownerName.length > 0, {
    message: "A customer name is required for loans and donations.",
    path: ["ownerName"],
  })

export type AddItemInput = z.input<typeof AddItemSchema>

export type AddItemResult =
  | { ok: true; id: string }
  | {
      ok: false
      message: string
      errors?: Record<string, string[] | undefined>
    }

