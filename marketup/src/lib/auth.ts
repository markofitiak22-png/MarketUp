// import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
// import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./prisma";
import { compare } from "bcrypt";
import { z } from "zod";
// import { randomBytes } from "crypto";

export const authOptions: any = {
  session: { 
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days default
    updateAge: 24 * 60 * 60, // 24 hours - how often to update session
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days default
  },
  pages: { signIn: "/auth" },
  secret: process.env.NEXTAUTH_SECRET,
  debug: false, // Disable debug to reduce logs
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        // Check if remember me is enabled in localStorage (client-side)
        // This is a simplified approach - in production you might want server-side validation
        token.rememberMe = false; // Will be updated by client-side logic
        token.sub = user.id;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (token.rememberMe) {
        session.rememberMe = Boolean(token.rememberMe);
      }
      if (token.sub) {
        (session as any).user.id = token.sub;
      }
      return session;
    },
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(raw) {
        try {
          console.log('Auth attempt started');
          
          const schema = z.object({ 
            email: z.string().email(), 
            password: z.string().min(6)
          });
          const parsed = schema.safeParse(raw);
          if (!parsed.success) {
            console.log('Auth validation failed:', parsed.error);
            return null;
          }
          
          const { email, password } = parsed.data;
          console.log('Auth validated data:', { email });
          
          console.log('Looking up user in database...');
          const user = await prisma.user.findUnique({ where: { email } });
          console.log('User found:', !!user, 'Has password hash:', !!user?.passwordHash);
          
          if (!user || !user.passwordHash) {
            console.log('User not found or no password hash');
            return null;
          }
          
          console.log('Comparing password...');
          const ok = await compare(password, user.passwordHash);
          console.log('Password comparison result:', ok);
          
          if (!ok) {
            console.log('Password mismatch');
            return null;
          }
          
          console.log('Auth successful for user:', user.id);
          return { 
            id: user.id, 
            email: user.email || undefined
          } as { id: string; email?: string };
        } catch (error) {
          console.error('Auth error:', error);
          console.error('Auth error stack:', error instanceof Error ? error.stack : 'No stack trace');
          return null;
        }
      },
    }),
  ],
};
