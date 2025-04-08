import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import type { JWT } from "next-auth/jwt";
import type { Session, User as NextAuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcryptjs';
import dbConnect from "@/lib/database";
import User from "@/models/User";

// Extend the built-in session types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
      token?: string;
      githubUsername?: string;
    }
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    role?: string;
    image?: string;
    githubUsername?: string;
  }
}

// Define AuthUser type to avoid recursive reference
interface AuthUser {
  id: string;
  name: string;
  email: string;
  role?: string;
  image?: string;
  githubUsername?: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<AuthUser | null> {
        try {
          if (!credentials?.email || !credentials?.password) {
            console.log('Error: Missing credentials');
            return null;
          }

          try {
            await dbConnect();
            console.log("Database connected successfully");
          } catch (dbError) {
            console.error("MongoDB Connection Error:", dbError);
            // Don't throw, return null to show generic error
            return null;
          }

          console.log('Searching for user with email:', credentials.email);
          
          // Find user by email
          const user = await User.findOne({ email: credentials.email.toLowerCase() }).select("+password");
          console.log("User search complete", user ? "User found" : "No user found");
          
          if (!user) {
            console.log('Error: No user found with this email');
            return null;
          }

          console.log('Comparing passwords');
          // Compare passwords
          let isPasswordValid = false;
          try {
            isPasswordValid = await bcrypt.compare(credentials.password, user.password);
          } catch (bcryptError) {
            console.error("Password comparison error:", bcryptError);
            return null;
          }
          
          console.log("Password validation:", isPasswordValid ? "Valid" : "Invalid");
          
          if (!isPasswordValid) {
            console.log('Error: Invalid password');
            return null;
          }

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role || "user",
            image: user.profilePicture,
            githubUsername: user.githubUsername
          };
        } catch (error) {
          console.error("Auth error:", error);
          // Return null instead of throwing to avoid 500 errors
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Using the AuthUser type defined above
        token.id = user.id;
        token.role = (user as AuthUser).role || 'user';
        token.githubUsername = (user as AuthUser).githubUsername;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.githubUsername = token.githubUsername as string || null;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
    error: "/login",
    newUser: "/signup",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST, handler as PUT, handler as DELETE };
