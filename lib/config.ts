// API base URL - use environment variable in production or localhost in development
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api"

// Authentication endpoints
export const AUTH_ENDPOINTS = {
  signup: `${API_URL}/auth/signup`,
  login: `${API_URL}/auth/login`,
}

// Project endpoints
export const PROJECT_ENDPOINTS = {
  all: `${API_URL}/projects`,
  userProjects: `${API_URL}/projects?userId=`, // Add the user ID as a query param
  project: (id: string) => `${API_URL}/projects/${id}`,
  like: (id: string) => `${API_URL}/projects/${id}/like`,
}

// User endpoints
export const USER_ENDPOINTS = {
  profile: (id: string) => `${API_URL}/user/${id}`,
}

