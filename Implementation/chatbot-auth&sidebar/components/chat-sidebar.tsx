"use client"

import { useState } from "react"
import { format } from "date-fns"
import { PlusCircle, MessageSquare, Search, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sidebar, SidebarContent, SidebarHeader, SidebarTrigger } from "@/components/ui/sidebar"

export type ChatSession = {
  id: string
  title: string
  createdAt: Date
  updatedAt: Date
  messages: ChatMessage[]
}

export type ChatMessage = {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
}

interface ChatSidebarProps {
  chatSessions: ChatSession[]
  activeChatId: string | null
  onChatSelect: (chatId: string) => void
  onNewChat: () => void
}

export function ChatSidebar({ chatSessions, activeChatId, onChatSelect, onNewChat }: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredSessions = chatSessions.filter((session) =>
    session.title.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <Sidebar className="border-r border-primary-100">
      <SidebarHeader className="px-3 py-2">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-primary-800">Conversations</h2>
          <SidebarTrigger />
        </div>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-primary-400" />
          <Input
            placeholder="Search conversations..."
            className="pl-8 bg-white border-primary-200 focus-visible:ring-primary-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button className="w-full mt-2 bg-primary hover:bg-primary-600 text-white" onClick={onNewChat}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Conversation
        </Button>
      </SidebarHeader>
      <SidebarContent className="px-3 py-2">
        {filteredSessions.length === 0 ? (
          <div className="text-center py-4 text-primary-500">
            {searchQuery ? "No conversations found" : "No conversations yet"}
          </div>
        ) : (
          <div className="space-y-1">
            {filteredSessions.map((session) => (
              <Button
                key={session.id}
                variant="ghost"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  activeChatId === session.id
                    ? "bg-primary-100 text-primary-800"
                    : "hover:bg-primary-50 text-primary-700",
                )}
                onClick={() => onChatSelect(session.id)}
              >
                <div className="flex items-center w-full">
                  <MessageSquare className="mr-2 h-4 w-4 text-primary-500" />
                  <div className="flex-1 truncate">
                    <div className="truncate">{session.title}</div>
                    <div className="text-xs text-primary-500">{format(session.updatedAt, "MMM d, yyyy")}</div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-primary-400" />
                </div>
              </Button>
            ))}
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  )
}
