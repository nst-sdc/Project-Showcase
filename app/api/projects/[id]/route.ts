import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { v2 as cloudinary } from 'cloudinary';
import dbConnect from "@/lib/database"
import Project from "@/models/Project"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect()
    
    const projectId = params.id
    
    const project = await Project.findById(projectId).populate('user', 'name profilePicture')
    
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }
    
    // Increment view count
    project.views = (project.views || 0) + 1
    await project.save()
    
    return NextResponse.json(project, { status: 200 })
  } catch (error) {
    console.error("Error fetching project:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect()

    // Get authenticated user
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const projectId = params.id

    // Find project and check ownership
    const project = await Project.findById(projectId)
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    // Verify user owns the project
    if (project.user.toString() !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized to update this project" }, { status: 403 })
    }

    // Parse form data
    const formData = await request.formData()
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const hostedLink = formData.get('hostedLink') as string
    const githubLink = formData.get('githubLink') as string
    const githubUsername = formData.get('githubUsername') as string
    const tags = (formData.get('tags') as string)?.split(',') || []
    const techStack = (formData.get('techStack') as string)?.split(',') || []
    const imageFile = formData.get('screenshot') as File

    // Prepare update data
    const updateData: any = {}
    
    if (title) updateData.title = title
    if (description) updateData.description = description
    if (hostedLink) updateData.hostedLink = hostedLink
    if (githubLink) updateData.githubLink = githubLink
    if (githubUsername) updateData.githubUsername = githubUsername
    if (tags.length > 0) updateData.tags = tags.map(tag => tag.trim()).filter(Boolean)
    if (techStack.length > 0) updateData.techStack = techStack.map(tech => tech.trim()).filter(Boolean)

    // Upload image to Cloudinary if provided
    if (imageFile) {
      const bytes = await imageFile.arrayBuffer()
      const buffer = Buffer.from(bytes)
      
      const base64Image = buffer.toString('base64')
      const dataURI = `data:${imageFile.type};base64,${base64Image}`
      
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload(dataURI, {
          folder: 'project-showcase',
          resource_type: 'image',
        }, (error, result) => {
          if (error) reject(error)
          else resolve(result)
        })
      })
      
      updateData.screenshot = (uploadResult as any).secure_url
    }

    // Update project
    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      { $set: updateData },
      { new: true }
    )

    return NextResponse.json({ 
      message: "Project updated successfully", 
      project: updatedProject 
    }, { status: 200 })
  } catch (error) {
    console.error("Error updating project:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect()

    // Get authenticated user
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const projectId = params.id

    // Find project and check ownership
    const project = await Project.findById(projectId)
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    // Verify user owns the project
    if (project.user.toString() !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized to delete this project" }, { status: 403 })
    }

    // Delete project
    await Project.findByIdAndDelete(projectId)

    return NextResponse.json({ message: "Project deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error deleting project:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
