import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import dbConnect from "@/lib/database"
import Like from "@/models/Like"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect()

    // Get authenticated user
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const projectId = params.id
    const userId = session.user.id

    // Check if user has liked this project
    const existingLike = await Like.findOne({ user: userId, project: projectId })
    
    return NextResponse.json({ 
      liked: !!existingLike
    }, { status: 200 })
  } catch (error) {
    console.error("Error checking like status:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}