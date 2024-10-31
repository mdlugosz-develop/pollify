'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SearchBar } from "@/components/search-bar"
import { User, Users, Hash, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Community } from '@/types'
import { useRouter } from 'next/navigation'

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
  const [communities, setCommunities] = useState<Community[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClientComponentClient()
  const router = useRouter()
  
  // Fetch communities data
  useEffect(() => {
    async function fetchCommunities() {
      try {
        // First, get the communities
        const { data: communitiesData, error: communitiesError } = await supabase
          .from('communities')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5)

        if (communitiesError) throw communitiesError

        // Then, for each community, get the member count
        const communitiesWithCounts = await Promise.all(
          communitiesData.map(async (community) => {
            const { count } = await supabase
              .from('community_members')
              .select('*', { count: 'exact', head: true })
              .eq('community_id', community.id)

            return {
              ...community,
              _count: {
                members: count || 0
              }
            }
          })
        )

        setCommunities(communitiesWithCounts)
      } catch (error) {
        console.error('Error fetching communities:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCommunities()
  }, [supabase])
  
  // Handle resize and auto-collapse/expand
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsCollapsed(true)
      } else {
        setIsCollapsed(false)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const formatMemberCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k members`
    }
    return `${count} members`
  }

  // Generate a consistent color based on community name
  const getCommunityColor = (name: string) => {
    const colors = [
      'bg-blue-500',
      'bg-purple-500',
      'bg-red-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-indigo-500',
      'bg-pink-500'
    ]
    const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return colors[index % colors.length]
  }

  return (
    <aside 
      className={cn(
        "fixed top-0 h-full transition-all duration-300 bg-background",
        isCollapsed ? "right-0 w-12" : "right-0 w-80",
        className
      )}
    >
      <Card className="h-full rounded-none relative flex flex-col">
        <div className="absolute -left-3 top-2 z-50 w-6 h-6 lg:hidden">
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
          <div className="space-y-4 p-4 overflow-y-auto">
            {/* Search Section */}
            <Card>
              <CardHeader>
                <CardTitle>Search</CardTitle>
              </CardHeader>
              <CardContent>
                <SearchBar />
              </CardContent>
            </Card>

            {/* Communities Section */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Communities</CardTitle>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Users className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoading ? (
                  <div className="text-sm text-muted-foreground">Loading communities...</div>
                ) : communities.length === 0 ? (
                  <div className="text-sm text-muted-foreground">No communities found</div>
                ) : (
                  communities.map((community) => (
                    <div 
                      key={community.id} 
                      className="flex items-center gap-3 hover:bg-accent rounded-lg p-2 cursor-pointer"
                      onClick={() => router.push(`/community/${community.id}`)}
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className={getCommunityColor(community.name)}>
                          {community.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 overflow-hidden">
                        <p className="font-medium leading-none truncate">{community.name}</p>
                        <p className="text-sm text-muted-foreground truncate">
                          {formatMemberCount(community._count?.members || 0)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Following Section */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Following</CardTitle>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <User className="h-4 w-4" />
                </Button>
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
          <div className="flex flex-col items-center pt-12 space-y-4">
            <Button variant="ghost" size="icon">
              <Hash className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Users className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <User className="h-4 w-4" />
            </Button>
          </div>
        )}
      </Card>
    </aside>
  )
} 