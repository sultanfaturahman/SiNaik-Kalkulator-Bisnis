import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      type: string
      emailVerified: Date | null
    } & DefaultSession["user"]
  }
}