import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { v2 as cloudinary } from 'cloudinary';
import type { Session } from "next-auth";

// We no longer need the extended session since we've defined it in [...nextauth]/route.ts
type ProjectSession = Session
import dbConnect from "@/lib/database";
import Project from "@/models/Project";
import { authOptions } from "../auth/[...nextauth]/route";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(request: Request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const tag = searchParams.get('tag');
    const search = searchParams.get('search');
    
    let query: any = {};
    
    if (userId) {
      query.user = userId;
    }
    
    if (tag) {
      query.tags = tag;
    }
    
    if (search) {
      query.$text = { $search: search };
    }
    
    const projects = await Project.find(query)
      .sort({ createdAt: -1 })
      .populate('user', 'name profilePicture');
    
    return NextResponse.json(projects, { status: 200 });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    
    // Verify authenticated user
    const session = await getServerSession(authOptions) as Session | null;
    
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Parse form data
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const hostedLink = formData.get('hostedLink') as string;
    const githubLink = formData.get('githubLink') as string;
    const githubUsername = formData.get('githubUsername') as string;
    const tags = (formData.get('tags') as string)?.split(',') || [];
    const techStack = (formData.get('techStack') as string)?.split(',') || [];
    const imageFile = formData.get('screenshot') as File;
    
    if (!title || !description) {
      return NextResponse.json({ error: "Title and description are required" }, { status: 400 });
    }
    
    let screenshotUrl = "/placeholder.svg?height=300&width=500";
    
    // Upload image to Cloudinary if provided
    if (imageFile) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const base64Image = buffer.toString('base64');
      const dataURI = `data:${imageFile.type};base64,${base64Image}`;
      
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload(dataURI, {
          folder: 'project-showcase',
          resource_type: 'image',
        }, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        });
      });
      
      screenshotUrl = (uploadResult as any).secure_url;
    }
    
    // Create project in database
    const newProject = await Project.create({
      title,
      description,
      screenshot: screenshotUrl,
      hostedLink,
      githubLink,
      githubUsername,
      tags: tags.map(tag => tag.trim()).filter(Boolean),
      techStack: techStack.map(tech => tech.trim()).filter(Boolean),
      user: session.user.id,
    });
    
    return NextResponse.json({ 
      message: "Project added successfully", 
      project: newProject 
    }, { status: 201 });
  } catch (error) {
    console.error("Error adding project:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

