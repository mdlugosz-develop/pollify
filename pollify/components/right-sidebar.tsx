'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SearchBar } from "@/components/search-bar"
import { User, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

// Sample following data - replace with real data later
const sampleFollowing = [
  {
    id: 1,
    name: "Sarah Wilson",
    email: "sarah@example.com",
    avatarUrl: "https://github.com/shadcn.png",
    pollsCount: 12
  },
  {
    id: 2,
    name: "Mike Johnson",
    email: "mike@example.com",
    avatarUrl: null,
    pollsCount: 8
  },
  {
    id: 3,
    name: "Emma Davis",
    email: "emma@example.com",
    avatarUrl: "https://github.com/shadcn.png",
    pollsCount: 15
  },
  {
    id: 4,
    name: "Alex Brown",
    email: "alex@example.com",
    avatarUrl: null,
    pollsCount: 6
  }
]

interface RightSidebarProps {
  className?: string
}

export function RightSidebar({ className }: RightSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  
  // Handle resize and auto-collapse/expand
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsCollapsed(true)
      } else {
        setIsCollapsed(false)
      }
    }

    // Initial check
    handleResize()

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <aside 
      className={cn(
        "fixed top-0 h-full transition-all duration-300 bg-background",
        isCollapsed ? "right-0 w-12" : "right-0 w-80",
        className
      )}
    >
      <Card className="h-full rounded-none relative flex flex-col">
        <div className="absolute -left-3 top-2 z-50 w-6 h-6 lg:hidden"> {/* Hide on large screens */}
          <Button 
            variant="ghost" 
            size="icon"
            className="h-6 w-6 rounded-full bg-background border shadow-md hover:bg-accent hover:text-accent-foreground p-1"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <ChevronLeft size={12} /> : <ChevronRight size={12} />}
          </Button>
        </div>

        {!isCollapsed ? (
          <div className="space-y-4 p-4">
            {/* Search Section */}
            <Card>
              <CardHeader>
                <CardTitle>Search</CardTitle>
              </CardHeader>
              <CardContent>
                <SearchBar />
              </CardContent>
            </Card>

            {/* Following Section */}
            <Card>
              <CardHeader>
                <CardTitle>Following</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {sampleFollowing.map((user) => (
                  <div key={user.id} className="flex items-center gap-3 hover:bg-accent rounded-lg p-2 cursor-pointer">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatarUrl || ""} alt={user.name} />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 overflow-hidden">
                      <p className="font-medium leading-none truncate">{user.name}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {user.pollsCount} polls
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="flex flex-col items-center pt-12">
            <Button variant="ghost" size="icon" className="mb-4">
              <User className="h-4 w-4" />
            </Button>
          </div>
        )}
      </Card>
    </aside>
  )
} 