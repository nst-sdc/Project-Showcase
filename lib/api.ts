import { getSession } from "next-auth/react"
import { PROJECT_ENDPOINTS } from "./config"
import type { Project } from "@/types/project"

// Helper function to get auth header safely and check for authentication
const getAuthHeader = async (): Promise<{ headers: HeadersInit, isAuthenticated: boolean }> => {
  const headers: Record<string, string> = {}
  let isAuthenticated = false
  const session = await getSession()
  
  if (session?.user) {
    // Just using the session existence to determine authentication,
    // since our token system might not be fully implemented yet
    isAuthenticated = true
    
    // We could add the actual token here if available
    // headers['Authorization'] = `Bearer ${session.user.token || ''}`
    headers['Authorization'] = `Bearer session-token`
  }
  
  return { headers, isAuthenticated }
}

// Function to handle API errors
const handleApiError = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    console.error('API Error:', {
      status: response.status,
      statusText: response.statusText,
      error: errorData
    })
    throw new Error(errorData.error || `API error: ${response.status}`)
  }
  return response
}

// Get all projects
export const getAllProjects = async (): Promise<Project[]> => {
  try {
    const { headers } = await getAuthHeader()
    const response = await fetch(PROJECT_ENDPOINTS.all, { 
      headers,
      cache: 'no-store' // Disable caching to get fresh data
    })
    await handleApiError(response)
    return await response.json()
  } catch (error) {
    console.error("Error fetching all projects:", error)
    throw error
  }
}

// Get user's projects
export const getUserProjects = async (): Promise<Project[]> => {
  try {
    const { headers, isAuthenticated } = await getAuthHeader()
    const session = await getSession()
    
    if (!isAuthenticated || !session?.user?.id) {
      throw new Error('Authentication required')
    }
    
    const response = await fetch(`${PROJECT_ENDPOINTS.userProjects}${session.user.id}`, { 
      headers,
      cache: 'no-store'
    })
    await handleApiError(response)
    return await response.json()
  } catch (error) {
    console.error("Error fetching user projects:", error)
    throw error
  }
}

// Add a new project
export const addProject = async (projectData: FormData): Promise<{ id: string; message: string }> => {
  try {
    const { headers, isAuthenticated } = await getAuthHeader()
    
    // Check if user is authenticated
    if (!isAuthenticated) {
      throw new Error("Authentication required")
    }

    const response = await fetch(PROJECT_ENDPOINTS.all, {
      method: "POST",
      headers,
      body: projectData,
    })

    await handleApiError(response)
    return await response.json()
  } catch (error) {
    console.error("Error adding project:", error)
    throw error
  }
}

// Delete a project
export const deleteProject = async (id: string): Promise<{ message: string }> => {
  try {
    const { headers, isAuthenticated } = await getAuthHeader()
    
    // Check if user is authenticated
    if (!isAuthenticated) {
      throw new Error("Authentication required")
    }

    const response = await fetch(PROJECT_ENDPOINTS.project(id), {
      method: "DELETE",
      headers,
    })

    await handleApiError(response)
    return await response.json()
  } catch (error) {
    console.error("Error deleting project:", error)
    throw error
  }
}

// Update a project
export const updateProject = async (id: string, projectData: FormData): Promise<{ message: string }> => {
  try {
    const { headers, isAuthenticated } = await getAuthHeader()
    
    // Check if user is authenticated
    if (!isAuthenticated) {
      throw new Error("Authentication required")
    }

    const response = await fetch(PROJECT_ENDPOINTS.project(id), {
      method: "PUT",
      headers,
      body: projectData,
    })

    await handleApiError(response)
    return await response.json()
  } catch (error) {
    console.error("Error updating project:", error)
    throw error
  }
}

// Get a single project by ID
export const getProjectById = async (id: string): Promise<Project> => {
  try {
    const response = await fetch(PROJECT_ENDPOINTS.project(id))
    await handleApiError(response)
    return await response.json()
  } catch (error) {
    console.error(`Error fetching project with ID ${id}:`, error)
    throw error
  }
}

