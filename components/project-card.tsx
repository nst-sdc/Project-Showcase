import Image from "next/image"
import { ExternalLink, Github, Trash2, Edit2, Heart } from "lucide-react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import type { Project } from "@/types/project"
import { deleteProject, updateProject } from "@/lib/api"

interface ProjectCardProps {
  project: Project
  onProjectsChange?: () => void
}

export function ProjectCard({ project, onProjectsChange }: ProjectCardProps) {
  const { title, screenshot, hostedLink, githubLink, description, githubUsername, createdAt, id, _id, likes = 0 } = project
  // Use _id if available, otherwise fall back to id
  const projectId = _id || id
  const router = useRouter()
  const { data: session } = useSession()
  const [isDeleting, setIsDeleting] = useState(false)
  const [isLiking, setIsLiking] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const { toast } = useToast()

  // Format date
  const formattedDate = new Date(createdAt || Date.now()).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const handleDelete = async () => {
    if (!id) return

    try {
      setIsDeleting(true)
      await deleteProject(id)
      toast({
        title: "Success",
        description: "Project deleted successfully",
      })
      if (onProjectsChange) {
        onProjectsChange()
      }
    } catch (error) {
      console.error("Error deleting project:", error)
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleLike = async () => {
    if (!id || !session?.user?.id) return

    try {
      setIsLiking(true)
      
      // Toggle like status
      const newLikes = isLiked ? likes - 1 : likes + 1
      
      // Update project in database
      await updateProject(id, new FormData())
      
      // Update local state
      setIsLiked(!isLiked)
      
      toast({
        title: isLiked ? "Liked" : "Unliked",
        description: `Project ${isLiked ? "liked" : "unliked"} successfully`,
      })
      
      if (onProjectsChange) {
        onProjectsChange()
      }
    } catch (error) {
      console.error("Error toggling like:", error)
      toast({
        title: "Error",
        description: "Failed to toggle like",
        variant: "destructive",
      })
    } finally {
      setIsLiking(false)
    }
  }

  return (
    <Card className="overflow-hidden flex flex-col h-full">
      <div className="aspect-video relative">
        <Image src={screenshot || "/placeholder.svg"} alt={title} fill className="object-cover" />
      </div>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          By {githubUsername} • {formattedDate}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-4">{description}</p>
      </CardContent>
      <CardFooter className="flex gap-2">
        {/* GitHub Button */}
        <Button asChild variant="outline" size="sm" className="w-full">
          <a href={githubLink} target="_blank" rel="noopener noreferrer">
            <Github className="mr-2 h-4 w-4" />
            GitHub
          </a>
        </Button>

        {/* Live Demo Button */}
        <Button asChild size="sm" className="w-full">
          <a href={hostedLink} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-2 h-4 w-4" />
            Live Demo
          </a>
        </Button>

        {/* Like Button */}
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={handleLike}
          disabled={isLiking}
        >
          <Heart className="mr-2 h-4 w-4" fill={isLiked ? "currentColor" : "none"} />
          {isLiked ? "Liked" : "Like"}
        </Button>

        {/* Actions for project owner */}
        {session?.user?.id === project.user && (
          <>
            {/* Edit Button */}
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => router.push(`/projects/${id}/edit`)}
            >
              <Edit2 className="mr-2 h-4 w-4" />
              Edit
            </Button>

            {/* Delete Button */}
            <Button
              variant="destructive"
              size="sm"
              className="w-full"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  )
}
