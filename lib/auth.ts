import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import GoogleProvider from "next-auth/providers/google"
import { prisma } from "@/lib/db"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account"
        }
      }
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        const dbUser = await prisma.user.findUnique({
          where: { email: session.user.email! },
          select: {
            id: true,
            type: true,
            emailVerified: true,
            email: true // Ensure email is included
          }
        });
        
        // Ensure we're using the correct email from the database
        session.user.email = dbUser?.email || session.user.email;
        session.user.id = dbUser?.id || '';
        session.user.type = dbUser?.type || 'umkm';
        session.user.emailVerified = dbUser?.emailVerified || null;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      // Ensure the user exists and has the correct email
      if (user?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email }
        });
        
        if (!dbUser) {
          // Create new user if doesn't exist
          await prisma.user.create({
            data: {
              email: user.email,
              name: user.name || '',
              emailVerified: new Date(),
            }
          });
        }
      }
      return true;
    }
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  debug: process.env.NODE_ENV === 'development',
}