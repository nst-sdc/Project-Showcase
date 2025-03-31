"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Filter, SortDesc } from "lucide-react"

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
// Import the PROJECT_ENDPOINTS
import { PROJECT_ENDPOINTS } from "@/lib/config"

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest")

  // Update the useEffect to use the PROJECT_ENDPOINTS
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Build query parameters for filtering
        const queryParams = new URLSearchParams()
        if (searchTerm && searchTerm.trim().length > 0) {
          queryParams.append("username", searchTerm)
        }
        if (sortOrder) {
          queryParams.append("sort", sortOrder)
        }

        const url = `${PROJECT_ENDPOINTS.all}?${queryParams.toString()}`
        const response = await fetch(url)

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to fetch projects")
        }

        const data = await response.json()
        setProjects(data)
        setFilteredProjects(data)
      } catch (error) {
        console.error("Error fetching projects:", error)

        // If we can't fetch real data, use mock data for demo purposes
        if (process.env.NODE_ENV === "development") {
          const mockProjects: Project[] = [
            {
              id: "1",
              title: "E-commerce Platform",
              screenshot: "/placeholder.svg?height=300&width=500",
              hostedLink: "https://ecommerce-example.com",
              githubLink: "https://github.com/username/ecommerce",
              description:
                "A full-stack e-commerce platform built with React, Node.js, and MongoDB. Features include user authentication, product catalog, shopping cart, and payment processing.",
              githubUsername: "developer1",
              createdAt: new Date("2023-03-15").toISOString(),
            },
            {
              id: "2",
              title: "Task Management App",
              screenshot: "/placeholder.svg?height=300&width=500",
              hostedLink: "https://tasks-example.com",
              githubLink: "https://github.com/username/tasks",
              description:
                "A task management application with drag-and-drop functionality. Built with React, TypeScript, and Firebase.",
              githubUsername: "developer2",
              createdAt: new Date("2023-04-20").toISOString(),
            },
            {
              id: "3",
              title: "Weather Dashboard",
              screenshot: "/placeholder.svg?height=300&width=500",
              hostedLink: "https://weather-example.com",
              githubLink: "https://github.com/username/weather",
              description:
                "A weather dashboard that displays current weather conditions and forecasts for any location. Uses OpenWeatherMap API and React.",
              githubUsername: "developer1",
              createdAt: new Date("2023-05-10").toISOString(),
            },
          ]

          setProjects(mockProjects)
          setFilteredProjects(mockProjects)
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjects()
  }, [])

  useEffect(() => {
    // Filter and sort projects when search term or sort order changes
    let result = [...projects]

    // Filter by search term
    if (searchTerm) {
      result = result.filter(
        (project) =>
          project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.githubUsername.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Sort by date
    result.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime()
      const dateB = new Date(b.createdAt).getTime()

      return sortOrder === "newest" ? dateB - dateA : dateA - dateB
    })

    setFilteredProjects(result)
  }, [searchTerm, sortOrder, projects])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const filterByUsername = (username: string) => {
    setSearchTerm(username)
  }

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
            <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
            <div className="flex items-center gap-2">
              <div className="relative w-full sm:w-64">
                <Input placeholder="Search projects..." value={searchTerm} onChange={handleSearch} className="w-full" />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <SortDesc className="h-4 w-4" />
                    <span className="sr-only">Sort projects</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setSortOrder("newest")}>Newest first</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortOrder("oldest")}>Oldest first</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                    <span className="sr-only">Filter projects</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filter by user</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setSearchTerm("")}>All users</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => filterByUsername("developer1")}>developer1</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => filterByUsername("developer2")}>developer2</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
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
          ) : filteredProjects.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <h3 className="text-xl font-semibold">No projects found</h3>
                <p className="text-muted-foreground mt-2">Try adjusting your search or filter criteria.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <footer className="border-t py-6 md:py-8">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2 font-semibold">
            <span className="text-primary">Project</span>Showcase
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} ProjectShowcase. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

