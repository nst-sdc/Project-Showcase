"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { signIn } from "next-auth/react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"

const loginSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
})

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setIsLoading(true)
    setLoginError(null)
    
    try {
      console.log('Attempting login with email:', values.email);
      
      // Check URL for existing error
      const searchParams = new URLSearchParams(window.location.search)
      const urlError = searchParams.get("error")
      
      if (urlError) {
        console.log('Found error in URL:', urlError);
        // Clear the error from the URL
        const newUrl = window.location.pathname
        window.history.replaceState({}, document.title, newUrl)
      }
      
      // Try to authenticate using credentials provider
      const result = await signIn('credentials', {
        redirect: false, // Handle redirect manually to provide better error handling
        email: values.email,
        password: values.password,
      })
      
      console.log('Authentication result:', result);
      
      if (result?.error) {
        console.log('Authentication error:', result.error);
        // Handle error messages
        let errorMessage = "Login failed. Please check your credentials."
        
        // Extract more specific error messages
        if (result.error.includes("No user found")) {
          errorMessage = "No account found with this email address."
        } else if (result.error.includes("Invalid password")) {
          errorMessage = "Invalid password. Please try again."
        } else if (result.error.includes("MongoDB") || result.error.includes("database")) {
          errorMessage = "Unable to connect to database. Please try again later."
        }
        
        setLoginError(errorMessage)
        toast({
          title: "Login Error",
          description: errorMessage,
          variant: "destructive",
        })
        return
      }
      
      // Success case
      console.log('Login successful! Redirecting to dashboard');
      toast({
        title: "Login successful!",
        description: "Welcome back to ProjectShowcase.",
      })
      
      // Redirect to dashboard
      router.push("/dashboard")
    } catch (error) {
      console.error("Login error:", error)
      setLoginError(error instanceof Error ? error.message : "Invalid email or password. Please try again.")
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Invalid email or password. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex h-screen items-center justify-center py-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {loginError && <div className="text-sm text-destructive">{loginError}</div>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-primary underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
