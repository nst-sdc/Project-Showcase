"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Filter, SortDesc } from "lucide-react"
import { useSession } from "next-auth/react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { ProjectCard } from "@/components/project-card"
import type { Project } from "@/types/project"
import { getAllProjects } from "@/lib/api"

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest")
  const { data: session } = useSession()

  // Fetch projects from database
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true)
        const data = await getAllProjects()
        setProjects(data)
        setFilteredProjects(data)
      } catch (error) {
        console.error("Error fetching projects:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjects()
  }, [])

  // Handle search
  useEffect(() => {
    if (!projects) return

    const filtered = projects.filter((project) =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.githubUsername?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
    )

    setFilteredProjects(filtered)
  }, [projects, searchTerm])

  // Handle sort
  useEffect(() => {
    if (!filteredProjects) return

    const sortedProjects = [...filteredProjects].sort((a, b) => {
      const dateA = new Date(a.createdAt || Date.now())
      const dateB = new Date(b.createdAt || Date.now())
      
      if (sortOrder === "newest") {
        return dateB.getTime() - dateA.getTime()
      }
      return dateA.getTime() - dateB.getTime()
    })

    setFilteredProjects(sortedProjects)
  }, [filteredProjects, sortOrder])

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-semibold">
            <Link href="/">
              <span className="text-primary">Project</span>Showcase
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 container py-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-3xl font-bold">Browse Projects</h1>
            
            {session?.user && (
              <Link href="/projects/new" className="inline-flex items-center gap-2">
                <Button>
                  <span>Add Project</span>
                </Button>
              </Link>
            )}
          </div>

          <div className="flex gap-4 mb-8">
            {/* Search Input */}
            <div className="flex-1">
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Sort Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <SortDesc className="h-4 w-4" />
                  Sort by
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSortOrder("newest")}>
                  Newest First
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOrder("oldest")}>
                  Oldest First
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {isLoading ? (
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
          ) : filteredProjects.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <h3 className="text-xl font-semibold">No projects found</h3>
                <p className="text-muted-foreground mt-2">Try adjusting your search or filter criteria.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onProjectsChange={() => {
                    // Refresh projects when a project is deleted
                    const fetchProjects = async () => {
                      try {
                        setIsLoading(true)
                        const data = await getAllProjects()
                        setProjects(data)
                        setFilteredProjects(data)
                      } catch (error) {
                        console.error("Error fetching projects:", error)
                      } finally {
                        setIsLoading(false)
                      }
                    }

                    fetchProjects()
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="border-t py-6 md:py-8">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2 font-semibold">
            <span className="text-primary">Project</span>Showcase
          </div>
          <p className="text-sm text-muted-foreground">
            {new Date().getFullYear()} ProjectShowcase. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
