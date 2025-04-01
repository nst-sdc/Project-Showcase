"use client"

import { useState, useEffect, useCallback } from "react"
import { Trash2 } from "lucide-react"
import { useSession } from "next-auth/react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ProjectCard } from "@/components/project-card"
import type { Project } from "@/types/project"
import { useToast } from "@/components/ui/use-toast"
import { getAllProjects, getUserProjects, deleteProject } from "@/lib/api"

interface ProjectListProps {
  searchTerm?: string
  filterByUser?: boolean
  onProjectsChange?: () => void
}

export function ProjectList({ searchTerm = "", filterByUser = false, onProjectsChange }: ProjectListProps) {
  const { data: session } = useSession()
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()
  const userId = session?.user?.id

  // Handle project deletion
  const handleDeleteProject = async (projectId: string) => {
    if (!projectId) return
    
    try {
      setIsDeleting(true)
      
      // Call API to delete project
      await deleteProject(projectId)
      
      // Update local state
      setProjects(prev => prev.filter(project => (project._id || project.id) !== projectId))
      
      toast({
        title: "Project deleted",
        description: "Your project has been successfully deleted.",
      })
      
      // Notify parent component if needed
      if (onProjectsChange) {
        onProjectsChange()
      }
    } catch (error) {
      console.error("Error deleting project:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete project. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setProjectToDelete(null)
    }
  }

  // Fetch projects - using useCallback to prevent recreation on each render
  const fetchProjects = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      let fetchedProjects: Project[] = []

      // Call the appropriate API based on the filter
      try {
        if (filterByUser && userId) {
          // Get only the current user's projects
          fetchedProjects = await getUserProjects()
          console.log("Fetched user projects:", fetchedProjects.length)
        } else {
          // Get all projects
          fetchedProjects = await getAllProjects()
          console.log("Fetched all projects:", fetchedProjects.length)
        }
      } catch (apiError) {
        console.error("API error fetching projects:", apiError)
        throw new Error("Failed to load projects from database")
      }

      setProjects(fetchedProjects)
    } catch (error) {
      console.error("Error fetching projects:", error)
      setError(error instanceof Error ? error.message : "Failed to load projects. Please try again.")
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load projects. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast, filterByUser, userId])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  // Filter projects based on search term
  useEffect(() => {
    let filtered = [...projects]

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (project) =>
          project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (project.githubUsername && 
           project.githubUsername.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // We don't need to filter by user here since that's handled by the API call
    // (filterByUser determines which API endpoint we use)

    setFilteredProjects(filtered)
  }, [projects, searchTerm])

  // Render loading skeleton
  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <div className="aspect-video w-full bg-muted animate-pulse" />
            <CardHeader>
              <div className="h-6 w-2/3 bg-muted animate-pulse rounded" />
              <div className="h-4 w-full bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-4 w-full bg-muted animate-pulse rounded" />
                <div className="h-4 w-full bg-muted animate-pulse rounded" />
                <div className="h-4 w-2/3 bg-muted animate-pulse rounded" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  // Render error state
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-destructive">Error Loading Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </CardContent>
      </Card>
    )
  }

  // Render empty state
  if (filteredProjects.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No projects found</CardTitle>
          <CardDescription>
            {searchTerm
              ? "No projects match your search criteria."
              : filterByUser
                ? "You haven't added any projects yet."
                : "No projects available."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {searchTerm
              ? "Try adjusting your search term."
              : filterByUser
                ? "Click the 'Add Project' tab to create your first project."
                : "Check back later for new projects."}
          </p>
          {searchTerm && (
            <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
              Clear Search
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }

  // Main project list with delete functionality  
  return (
    <div className="space-y-6">
      {/* Delete confirmation dialog */}
      <AlertDialog open={!!projectToDelete} onOpenChange={(open) => !open && setProjectToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this project?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your project and remove the data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => projectToDelete && handleDeleteProject(projectToDelete)}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project) => (
          <div key={project._id || project.id} className="relative group">
            <ProjectCard project={project} />
            
            {/* Only show delete button for the user's own projects */}
            {filterByUser && userId && project.user === userId && (
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => {
                  const projectId = project._id || project.id;
                  if (projectId) {
                    setProjectToDelete(projectId);
                  }
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

