import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-gradient-to-b from-white to-primary-50">
      <div className="max-w-3xl space-y-6">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-primary-900">AskNutrionist Chatbot</h1>
        <p className="text-lg text-primary-800">
          Get personalized nutrition advice and answers to your health questions in a secure, authenticated environment.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-primary hover:bg-primary-600">
            <Link href="/register">Get Started</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-primary-300 text-primary-700 hover:bg-primary-50 bg-white"
          >
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
