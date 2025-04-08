import { NextResponse } from "next/server";
import dbConnect, { getCollection } from "@/lib/mongodb";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
  try {
    // Connect to MongoDB first
    await dbConnect();
    
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    // Get users collection
    const usersCollection = await getCollection("users");
    
    // Find user by email in database
    const user = await usersCollection.findOne({ email });
    
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }
    
    // Compare password with hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id.toString(),
        email: user.email
      },
      process.env.NEXTAUTH_SECRET as string,
      { expiresIn: '1d' }
    );
    
    // Return user information without sensitive data
    const { password: _, ...userWithoutPassword } = user;
    
    return NextResponse.json({ 
      token, 
      user: userWithoutPassword 
    }, { status: 200 });
  } catch (error) {
    console.error("Error in login:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
