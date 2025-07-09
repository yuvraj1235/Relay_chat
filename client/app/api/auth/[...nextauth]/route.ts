import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/user"; // your mongoose user model
import { connectDB } from "@/lib/auth"; // your DB connection
import bcrypt from "bcryptjs";
import { use } from "react";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
     credentials: {
    email: { label: "Email", type: "text" },
    password: { label: "Password", type: "password" }
  },
      async authorize(credentials) {
        const { email, password } = credentials;
        try {
          await connectDB();
          const user = await User.findOne({ email});
          if (!user) {
            throw new Error("User not found");
          }
          const isPasswordCorrect = await bcrypt.compare(
           password,
            user.password
          );
          if (!isPasswordCorrect) {
            throw new Error("Invalid password");
          }
          return user

        } catch (error) {
          console.log(error);

        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET, // ✅ correct env key
  pages: {
    signIn: "/login", // ✅ make sure /login page exists
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
