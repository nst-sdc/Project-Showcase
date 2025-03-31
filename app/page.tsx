import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-semibold">
            <span className="text-primary">Project</span>Showcase
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
      <main className="flex-1">
        <section className="container py-24 md:py-32">
          <div className="grid gap-10 md:grid-cols-2 md:gap-16">
            <div className="flex flex-col justify-center space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Showcase Your Projects to the World
              </h1>
              <p className="text-muted-foreground md:text-xl">
                A platform for developers to share their work, get feedback, and connect with others. Upload your
                projects, browse others' work, and build your portfolio.
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/signup">
                  <Button size="lg" className="w-full min-[400px]:w-auto">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/projects">
                  <Button variant="outline" size="lg" className="w-full min-[400px]:w-auto">
                    Browse Projects
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative h-[350px] w-full rounded-lg bg-muted p-4 shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg" />
                <div className="relative z-10 flex h-full flex-col items-center justify-center space-y-4 text-center">
                  <div className="rounded-full bg-primary/10 p-3">
                    <div className="rounded-full bg-primary/20 p-3">
                      <div className="rounded-full bg-primary p-3 text-primary-foreground">
                        <ArrowRight className="h-6 w-6" />
                      </div>
                    </div>
                  </div>
                  <h3 className="text-xl font-medium">Showcase Your Work</h3>
                  <p className="text-sm text-muted-foreground max-w-[250px]">
                    Upload screenshots, add links to your GitHub repositories and live demos.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="container py-16 md:py-20">
          <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl text-center mb-12">
            How It Works
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center text-center space-y-4 p-6 border rounded-lg">
              <div className="rounded-full bg-primary/10 p-3">
                <div className="rounded-full bg-primary p-2 text-primary-foreground">1</div>
              </div>
              <h3 className="text-xl font-medium">Create an Account</h3>
              <p className="text-muted-foreground">
                Sign up with your email, password, and GitHub profile to get started.
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4 p-6 border rounded-lg">
              <div className="rounded-full bg-primary/10 p-3">
                <div className="rounded-full bg-primary p-2 text-primary-foreground">2</div>
              </div>
              <h3 className="text-xl font-medium">Add Your Projects</h3>
              <p className="text-muted-foreground">
                Upload screenshots, add links to your GitHub repositories and live demos.
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4 p-6 border rounded-lg">
              <div className="rounded-full bg-primary/10 p-3">
                <div className="rounded-full bg-primary p-2 text-primary-foreground">3</div>
              </div>
              <h3 className="text-xl font-medium">Share & Connect</h3>
              <p className="text-muted-foreground">
                Get feedback on your work and discover projects from other developers.
              </p>
            </div>
          </div>
        </section>
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

