import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        name: { label: "Name", type: "text" }
      },
      async authorize(credentials) {
        
        if (credentials?.name) {
          
          if (!credentials.email || !credentials.password || !credentials.name.trim()) {
             throw new Error("Missing signup credentials (Name, Email, or Password).");
          }

          const existingUser = await prisma.user.findUnique({
            where: { email: credentials.email }
          });

          if (existingUser) {
            throw new Error("User already exists with this email");
          }

          const hashedPassword = await bcrypt.hash(credentials.password, 12);

          // Create user
          const user = await prisma.user.create({
            data: {
              email: credentials.email,
              name: credentials.name,
              password: hashedPassword,
            },
          });

          return {
            id: user.id,
            email: user.email,
            name: user.name,
          };
        }

        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required for login");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user) {
          throw new Error("No user found with this email, try signing up");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    }
  },
  pages: {
    signIn: "/signin",
    error: "/error",
  },
};