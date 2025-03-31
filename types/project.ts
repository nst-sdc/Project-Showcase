export interface Project {
  id?: string
  _id?: string
  title: string
  screenshot: string
  hostedLink?: string
  githubLink?: string
  description: string
  githubUsername?: string
  tags?: string[]
  techStack?: string[]
  user?: string
  likes?: number
  views?: number
  featured?: boolean
  createdAt?: string
  updatedAt?: string
}

