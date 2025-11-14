"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { type FormEvent, useState } from "react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // API call would go here
      // await fetch('/api/auth/forgot-password', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email }),
      // })

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setIsSubmitted(true)
      toast({
        title: "Reset link sent",
        description: "If your email exists in our system, you will receive a password reset link",
      })
    } catch (error) {
      toast({
        title: "Failed to send reset link",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-6">
      <Card className="w-full max-w-md border-primary-200 bg-white shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl">Reset Password</CardTitle>
          <CardDescription>Enter your email address and we'll send you a link to reset your password</CardDescription>
        </CardHeader>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full bg-primary hover:bg-primary-600" disabled={isLoading}>
                {isLoading ? "Sending..." : "Send Reset Link"}
              </Button>
              <div className="text-center text-sm">
                Remembered your password?{" "}
                <Link href="/login" className="text-primary-600 hover:text-primary-700 hover:underline">
                  Back to login
                </Link>
              </div>
            </CardFooter>
          </form>
        ) : (
          <CardContent className="space-y-4">
            <div className="p-4 bg-primary-50 border border-primary-200 rounded-md text-center">
              <p className="text-primary-700">Check your email</p>
              <p className="text-sm text-primary-600 mt-1">We've sent a password reset link to {email}</p>
            </div>
            <div className="text-center pt-4">
              <Link href="/login" className="text-primary-600 hover:text-primary-700 hover:underline">
                Back to login
              </Link>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
