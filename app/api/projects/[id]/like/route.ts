import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import dbConnect from "@/lib/database"
import Project from "@/models/Project"
import Like from "@/models/Like"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect()

    // Get authenticated user
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const projectId = params.id
    const userId = session.user.id

    // Find project
    const project = await Project.findById(projectId)
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    // Check if user already liked this project
    const existingLike = await Like.findOne({ user: userId, project: projectId })
    
    if (existingLike) {
      // User already liked this project, so unlike it
      await Like.deleteOne({ _id: existingLike._id })
      
      // Decrement project likes count
      const currentLikes = project.likes || 0
      project.likes = Math.max(0, currentLikes - 1)
      await project.save()
      
      return NextResponse.json({ 
        message: "Project unliked successfully", 
        likes: project.likes,
        liked: false
      }, { status: 200 })
    } else {
      // User hasn't liked this project yet, so like it
      await Like.create({ user: userId, project: projectId })
      
      // Increment project likes count
      const currentLikes = project.likes || 0
      project.likes = currentLikes + 1
      await project.save()
      
      return NextResponse.json({ 
        message: "Project liked successfully", 
        likes: project.likes,
        liked: true
      }, { status: 200 })  
    }
  } catch (error) {
    console.error("Error liking project:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// We're handling both like and unlike in the POST method
// This DELETE method is kept for API completeness but is not used by the frontend
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect()

    // Get authenticated user
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const projectId = params.id
    const userId = session.user.id

    // Find and delete the like
    const deletedLike = await Like.findOneAndDelete({ user: userId, project: projectId })
    
    if (!deletedLike) {
      return NextResponse.json({ error: "Like not found" }, { status: 404 })
    }
    
    // Update project likes count
    const project = await Project.findById(projectId)
    if (project) {
      const currentLikes = project.likes || 0
      project.likes = Math.max(0, currentLikes - 1)
      await project.save()
    }

    return NextResponse.json({ 
      message: "Project unliked successfully", 
      likes: project?.likes || 0
    }, { status: 200 })
  } catch (error) {
    console.error("Error unliking project:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}