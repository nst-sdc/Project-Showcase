import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs';
import mongoose from "mongoose";
import dbConnect from "@/lib/database";
import User from "@/models/User";

// This endpoint creates a test user for development purposes
export async function GET() {
  try {
    // Display connection info for debugging
    console.log("MongoDB URI:", process.env.MONGODB_URI ? "Set" : "Not set");
    console.log("Node ENV:", process.env.NODE_ENV || "Not set");
    
    try {
      await dbConnect();
      console.log("MongoDB connected successfully");
      console.log("Connection state:", mongoose.connection.readyState);
    } catch (dbError) {
      console.error("Database connection failed:", dbError);
      return NextResponse.json(
        { error: "Database connection failed", details: String(dbError) },
        { status: 500 }
      );
    }

    // Check if test user already exists
    const existingUser = await User.findOne({ email: "test@example.com" });
    if (existingUser) {
      return NextResponse.json(
        { message: "Test user already exists", user: { email: existingUser.email } },
        { status: 200 }
      );
    }

    // Hash password directly here to ensure it works
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password123", salt);

    // Create test user
    const user = await User.create({
      name: "Test User",
      email: "test@example.com",
      password: hashedPassword,
      githubUsername: "testuser",
      role: "user",
    });

    return NextResponse.json(
      { 
        message: "Test user created successfully", 
        user: { 
          email: user.email,
          name: user.name
        } 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating test user:", error);
    return NextResponse.json(
      { 
        error: "Error creating test user", 
        details: String(error),
        stack: error instanceof Error ? error.stack : undefined,
        mongoState: mongoose.connection.readyState 
      },
      { status: 500 }
    );
  }
}
