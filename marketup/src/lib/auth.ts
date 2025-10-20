import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./prisma";
import { compare } from "bcrypt";
import { z } from "zod";
import { randomBytes } from "crypto";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { 
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days default
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days default
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        // Check if remember me is enabled in localStorage (client-side)
        // This is a simplified approach - in production you might want server-side validation
        token.rememberMe = false; // Will be updated by client-side logic
      }
      return token;
    },
    async session({ session, token }) {
      if (token.rememberMe) {
        session.rememberMe = token.rememberMe;
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
        const schema = z.object({ 
          email: z.string().email(), 
          password: z.string().min(6)
        });
        const parsed = schema.safeParse(raw);
        if (!parsed.success) return null;
        const { email, password } = parsed.data;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.passwordHash) return null;
        const ok = await compare(password, user.passwordHash);
        if (!ok) return null;
        return { 
          id: user.id, 
          email: user.email || undefined
        } as any;
      },
    }),
  ],
  pages: { signIn: "/auth" },
  secret: process.env.NEXTAUTH_SECRET,
};
