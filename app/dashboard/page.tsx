"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Filter, Search } from "lucide-react"
import { useSession } from "next-auth/react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { ProjectList } from "@/components/project-list"
import { DashboardHeader } from "@/components/dashboard-header"
import { addProject } from "@/lib/api"

const projectSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  hostedLink: z.string().url({
    message: "Please enter a valid URL.",
  }),
  githubLink: z.string().url({
    message: "Please enter a valid GitHub URL.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  githubUsername: z.string().min(1, {
    message: "GitHub username is required.",
  }),
})

export default function DashboardPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [screenshot, setScreenshot] = useState<File | null>(null)
  const [authError, setAuthError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [showOnlyMyProjects, setShowOnlyMyProjects] = useState(true)
  const [currentUsername, setCurrentUsername] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("projects")

  // Initialize form before using it in useEffect
  const form = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      hostedLink: "",
      githubLink: "",
      description: "",
      githubUsername: "",
    },
  })

  // Check if user is authenticated using NextAuth
  const { data: session, status } = useSession()
  
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  useEffect(() => {
    if (status === "unauthenticated") {
      console.log("Not authenticated, redirecting to login")
      // Don't redirect if we're already being redirected by middleware
      // This prevents potential redirect loops
      if (typeof window !== 'undefined') {
        const searchParams = new URLSearchParams(window.location.search)
        if (!searchParams.has("callbackUrl")) {
          router.replace("/login") 
        }
      }
      return
    }
    
    if (status === "authenticated" && session?.user) {
      // Set current username for filtering
      setCurrentUsername(session.user.name || null)
      
      // Pre-fill the GitHub username in the form
      form.setValue("githubUsername", session.user.name || '')
    }
  }, [status, session, router, form])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setScreenshot(e.target.files[0])
    }
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const toggleMyProjects = () => {
    setShowOnlyMyProjects(!showOnlyMyProjects)
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  async function onSubmit(values: z.infer<typeof projectSchema>) {
    if (!screenshot) {
      toast({
        title: "Error",
        description: "Please upload a screenshot of your project.",
        variant: "destructive",
      })
      return
    }
    
    // Check if user is authenticated
    if (status !== "authenticated" || !session?.user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to add a project.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Create a FormData object to send the file
      const formData = new FormData()
      formData.append("screenshot", screenshot)
      formData.append("title", values.title)
      formData.append("hostedLink", values.hostedLink)
      formData.append("githubLink", values.githubLink)
      formData.append("description", values.description)
      formData.append("githubUsername", values.githubUsername || session.user.name || '')

      // Call the API to add the project to MongoDB
      const result = await addProject(formData)
      
      toast({
        title: "Project added!",
        description: "Your project has been successfully added to the database.",
      })

      // Reset the form
      form.reset()
      setScreenshot(null)

      // Switch to the projects tab
      setActiveTab("projects")
    } catch (error) {
      console.error("Error adding project:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Show loading state when NextAuth is checking the session or when client-side rendering hasn't started
  if (!isClient || status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  // Show error state if there's an authentication error
  if (authError) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-xl text-destructive">Authentication Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{authError}</p>
            <Button
              className="w-full mt-4"
              onClick={() => {
                router.replace("/login")
              }}
            >
              Back to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  // If not authenticated, don't render the page content
  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 container py-8">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
          <TabsList>
            <TabsTrigger value="projects">My Projects</TabsTrigger>
            <TabsTrigger value="add">Add Project</TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="max-w-sm"
                  />
                </div>
                <Button
                  variant={showOnlyMyProjects ? "outline" : "default"}
                  onClick={() => setShowOnlyMyProjects(false)}
                >
                  All Projects
                </Button>
                <Button
                  variant={showOnlyMyProjects ? "default" : "outline"}
                  onClick={() => setShowOnlyMyProjects(true)}
                >
                  My Projects
                </Button>
              </div>
            </div>
            <ProjectList
              searchTerm={searchTerm}
              filterByUser={showOnlyMyProjects}
              onProjectsChange={() => {
                // Refresh the list when projects change
                setSearchTerm("")
              }}
            />
          </TabsContent>

          <TabsContent value="add">
            <Card>
              <CardHeader>
                <CardTitle>Add New Project</CardTitle>
                <CardDescription>Showcase your work by adding a new project to your portfolio.</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project Title</FormLabel>
                          <FormControl>
                            <Input placeholder="My Awesome Project" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormItem>
                      <FormLabel>Screenshot</FormLabel>
                      <FormControl>
                        <Input type="file" accept="image/*" onChange={handleFileChange} />
                      </FormControl>
                      <FormDescription>Upload a screenshot of your project (PNG, JPG, or WEBP)</FormDescription>
                      <FormMessage />
                    </FormItem>

                    <FormField
                      control={form.control}
                      name="hostedLink"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hosted Link</FormLabel>
                          <FormControl>
                            <Input placeholder="https://myproject.com" {...field} />
                          </FormControl>
                          <FormDescription>Link to the live version of your project</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="githubLink"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>GitHub Link</FormLabel>
                          <FormControl>
                            <Input placeholder="https://github.com/username/repo" {...field} />
                          </FormControl>
                          <FormDescription>Link to your project's GitHub repository</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="githubUsername"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>GitHub Username</FormLabel>
                          <FormControl>
                            <Input placeholder="username" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe your project, technologies used, and any other relevant information."
                              className="min-h-[120px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Adding Project..." : "Add Project"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

