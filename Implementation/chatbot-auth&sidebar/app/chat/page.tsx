"use client"

import { AuthGuard } from "@/components/auth-guard"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { UserIcon, SendIcon } from "lucide-react"
import { type FormEvent, useState, useEffect } from "react"
import { ChatSidebar, type ChatSession, type ChatMessage } from "@/components/chat-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { v4 as uuidv4 } from "uuid"

// Helper function to generate a title from the first user message
function generateChatTitle(content: string): string {
  // Truncate to first 30 chars if longer
  if (content.length > 30) {
    return content.substring(0, 30) + "..."
  }
  return content
}

export default function ChatPage() {
  const { user } = useAuth()
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([])
  const [activeChatId, setActiveChatId] = useState<string | null>(null)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Get the active chat session
  const activeChat = activeChatId ? chatSessions.find((chat) => chat.id === activeChatId) : null

  // Initialize with a default chat session if none exists
  useEffect(() => {
    if (chatSessions.length === 0) {
      createNewChat()
    }
  }, [])

  // Create a new chat session
  const createNewChat = () => {
    const newChatId = uuidv4()
    const newChat: ChatSession = {
      id: newChatId,
      title: "New Conversation",
      createdAt: new Date(),
      updatedAt: new Date(),
      messages: [
        {
          id: uuidv4(),
          content: "Hello! I'm your nutrition assistant. How can I help with your diet and health questions today?",
          isUser: false,
          timestamp: new Date(),
        },
      ],
    }

    setChatSessions((prev) => [...prev, newChat])
    setActiveChatId(newChatId)
  }

  // Handle sending a message
  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault()
    if (!input.trim() || !activeChatId) return

    const userMessage: ChatMessage = {
      id: uuidv4(),
      content: input,
      isUser: true,
      timestamp: new Date(),
    }

    // Update chat sessions with the new message
    setChatSessions((prev) =>
      prev.map((chat) => {
        if (chat.id === activeChatId) {
          // If this is the first user message, update the chat title
          const isFirstUserMessage = !chat.messages.some((m) => m.isUser)
          return {
            ...chat,
            title: isFirstUserMessage ? generateChatTitle(input) : chat.title,
            updatedAt: new Date(),
            messages: [...chat.messages, userMessage],
          }
        }
        return chat
      }),
    )

    setInput("")
    setIsLoading(true)

    try {
      // Simulate API call for bot response
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const botResponse: ChatMessage = {
        id: uuidv4(),
        content: `Thank you for your question about "${input}". As a nutrition assistant, I'd be happy to provide guidance on this topic.`,
        isUser: false,
        timestamp: new Date(),
      }

      // Add bot response to the chat
      setChatSessions((prev) =>
        prev.map((chat) => {
          if (chat.id === activeChatId) {
            return {
              ...chat,
              updatedAt: new Date(),
              messages: [...chat.messages, botResponse],
            }
          }
          return chat
        }),
      )
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthGuard>
      <SidebarProvider>
        <div className="flex h-screen">
          <ChatSidebar
            chatSessions={chatSessions}
            activeChatId={activeChatId}
            onChatSelect={setActiveChatId}
            onNewChat={createNewChat}
          />
          <SidebarInset>
            <div className="flex flex-col h-screen max-h-screen">
              <header className="border-b border-primary-100 p-4 flex items-center justify-between bg-white">
                <h1 className="text-xl font-semibold text-primary-800">AskNutrionist Chatbot</h1>
                <div className="flex items-center gap-2">
                  {user && <span className="text-sm text-primary-600">{user.name}</span>}
                  <Avatar className="h-8 w-8 bg-primary-100">
                    <AvatarFallback className="text-primary-700">
                      <UserIcon className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                </div>
              </header>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {activeChat?.messages.map((message) => (
                  <div key={message.id} className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
                    <Card
                      className={`max-w-[80%] p-3 ${
                        message.isUser ? "bg-primary text-primary-foreground" : "bg-primary-50 border-primary-100"
                      }`}
                    >
                      <p className={message.isUser ? "text-white" : "text-primary-900"}>{message.content}</p>
                      <div
                        className={`text-xs mt-1 ${message.isUser ? "text-primary-foreground/80" : "text-primary-600"}`}
                      >
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </Card>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <Card className="max-w-[80%] p-3 bg-primary-50 border-primary-100">
                      <div className="flex space-x-2">
                        <div className="h-2 w-2 bg-primary-400 rounded-full animate-bounce"></div>
                        <div className="h-2 w-2 bg-primary-400 rounded-full animate-bounce delay-75"></div>
                        <div className="h-2 w-2 bg-primary-400 rounded-full animate-bounce delay-150"></div>
                      </div>
                    </Card>
                  </div>
                )}
              </div>

              <div className="border-t border-primary-100 p-4 bg-white">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 border-primary-200 focus-visible:ring-primary-400 bg-white"
                    disabled={isLoading}
                  />
                  <Button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="bg-primary hover:bg-primary-600"
                  >
                    <SendIcon className="h-4 w-4" />
                    <span className="sr-only">Send</span>
                  </Button>
                </form>
              </div>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </AuthGuard>
  )
}
