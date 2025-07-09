"use client"

import * as React from "react"
import { useRouter } from "next/navigation" // Import useRouter
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { signOut, useSession } from "next-auth/react"
import { Button } from "./ui/button"
import { Input } from "@/components/ui/input"
import { io } from "socket.io-client" // Import socket.io-client

const socket = io(); // Connects to the host where the client is served (e.g., your Next.js app)

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [query, setQuery] = React.useState("")
  const [searchResults, setSearchResults] = React.useState<any[]>([]) // Renamed 'users' to 'searchResults' for clarity
  const { data: session } = useSession()
  const router = useRouter() // Initialize useRouter hook

  // --- Debounced Search Logic ---
  React.useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      // Only search if query is long enough and user is logged in
      if (query.length > 1 && session?.user?.email) {
        try {
          const res = await fetch("/api/searchUser", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              query,
              currentUserEmail: session.user.email,
            }),
          })
          const data = await res.json()
          setSearchResults(data) // Update searchResults state
        } catch (error) {
          console.error("Failed to fetch search results:", error)
          setSearchResults([]) // Clear results on error
        }
      } else {
        setSearchResults([]) // Clear results if query is too short or no session
      }
    }, 300) 

    return () => clearTimeout(delayDebounceFn)
  }, [query, session]) 

  // --- Handle connecting to a chat room ---
  const handleConnect = React.useCallback((targetUserEmail: string) => {
    const currentUserEmail = session?.user?.email
    if (!currentUserEmail) {
      console.warn("Current user email is not available for connection.")
      return
    }

    // Create a consistent room ID by sorting the emails
    const roomId = [currentUserEmail, targetUserEmail].sort().join("_")

    socket.emit("join-room", roomId) // Emit socket event to join the room
    router.push(`/chat/${roomId}`) // Navigate to the chat room page
  }, [session, router]) // Dependencies for useCallback

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        {/* Input for searching users */}
        <div className="p-2"> {/* Use a div instead of form if not submitting on Enter */}
          <Input
            placeholder="Search users..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full"
          />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Search Results</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {searchResults.length > 0 ? (
                searchResults.map((user) => (
                  <SidebarMenuItem key={user.email} className="flex items-center">
                    <Avatar>
                      <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} />
                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                    <SidebarMenuButton asChild>
                      {/* Use a button to trigger handleConnect */}
                      <Button variant="link" onClick={() => handleConnect(user.email)} className="justify-start text-left flex-grow">
                        {user.name}
                      </Button>
                    </SidebarMenuButton>
                    {/* Placeholder for actual online status */}
                    <Badge variant="secondary" className="bg-gray-500 ml-auto">
                      Status
                    </Badge>
                  </SidebarMenuItem>
                ))
              ) : (
                <p className="p-4 text-sm text-gray-500">No users found or start typing to search...</p>
              )}
              <div className="pt-4">
                <Button onClick={() => {signOut();
                router.replace('/login');}} variant="outline" className="w-full">
                  LOG OUT
                </Button>
              </div>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  )
}