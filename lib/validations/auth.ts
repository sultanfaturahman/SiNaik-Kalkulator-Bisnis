import { z } from 'zod'

export const registerSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(6),
  businessName: z.string().min(2),
  businessAddress: z.string().min(5),
  selectedType: z.enum(['umkm', 'instansi'])
})

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
