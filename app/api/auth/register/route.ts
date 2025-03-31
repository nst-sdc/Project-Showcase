import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import dbConnect from "@/lib/database";
import User from "@/models/User";

export async function POST(request: Request) {
  try {
    console.log('Registration request received');
    
    try {
      await dbConnect();
      console.log('Database connected for registration');
    } catch (dbError) {
      console.error('Registration database connection error:', dbError);
      return NextResponse.json(
        { error: "Database connection failed. Please try again later." },
        { status: 500 }
      );
    }
    
    const body = await request.json();
    console.log('Registration request body:', JSON.stringify(body).substring(0, 200) + '...');
    
    const { name, email, password, githubUsername, githubUrl } = body;
    
    // Extract GitHub username from URL if provided and githubUsername is not explicitly set
    let finalGithubUsername = githubUsername;
    if (!finalGithubUsername && githubUrl) {
      try {
        // Extract username from GitHub URL (e.g., https://github.com/username)
        const urlObj = new URL(githubUrl);
        if (urlObj.hostname === 'github.com') {
          // The pathname will be like '/username'
          finalGithubUsername = urlObj.pathname.split('/').filter(Boolean)[0];
          console.log('Extracted GitHub username from URL:', finalGithubUsername);
        }
      } catch (urlError) {
        console.warn('Failed to parse GitHub URL:', urlError);
      }
    }
    
    // Check if required fields are present
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }
    
    // Create new user (password will be hashed by the User model pre-save hook)
    const user = await User.create({
      name,
      email,
      password,
      githubUsername: finalGithubUsername,
    });
    
    console.log('User registered successfully:', user._id.toString());
    
    // Remove password from response
    const userWithoutPassword = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      githubUsername: user.githubUsername,
    };
    
    return NextResponse.json(
      { message: "User registered successfully", user: userWithoutPassword },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
