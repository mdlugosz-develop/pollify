'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight, User, Settings, UserCircle, LogOut } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface UserSidebarProps {
  className?: string
}

export function UserSidebar({ className }: UserSidebarProps) {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [isCollapsed, setIsCollapsed] = useState(false)

  // Sample user data - replace with real user data later
  const sampleUser = {
    name: "John Doe",
    email: "john@example.com",
    avatarUrl: "https://github.com/shadcn.png" // Sample avatar URL
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  return (
    <aside 
      data-expanded={!isCollapsed}
      className={cn(
        "fixed left-0 top-0 h-full transition-all duration-300",
        isCollapsed ? "w-16" : "w-80",
        className
      )}
    >
      <Card className="h-full rounded-none relative flex flex-col">
        <div className="absolute -right-6 top-4 z-50 w-12 h-12 flex items-center justify-center">
          <Button 
            variant="ghost" 
            size="icon"
            className="rounded-full bg-background border shadow-md hover:bg-accent hover:text-accent-foreground"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </Button>
        </div>

        <div className={cn(
          "p-6 border-b transition-all duration-300",
          isCollapsed ? "flex justify-center" : ""
        )}>
          <div className={cn(
            "flex items-center gap-4",
            isCollapsed ? "flex-col gap-2" : ""
          )}>
            <Avatar className="h-12 w-12">
              <AvatarImage src={sampleUser.avatarUrl} alt={sampleUser.name} />
              <AvatarFallback>
                <User className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            {!isCollapsed && (
              <div className="space-y-1">
                <h2 className="font-semibold leading-none">{sampleUser.name}</h2>
                <p className="text-sm text-muted-foreground">{sampleUser.email}</p>
              </div>
            )}
          </div>
        </div>

        <CardContent className="flex-1 flex flex-col items-center py-6">
          {!isCollapsed ? (
            <div className="space-y-4 w-full">
              <Button variant="outline" className="w-full justify-start" onClick={() => router.push('/profile')}>
                <UserCircle className="mr-2 h-4 w-4" />
                Profile
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => router.push('/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-4">
              <Button variant="ghost" size="icon" onClick={() => router.push('/profile')}>
                <UserCircle className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => router.push('/settings')}>
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>

        {/* Sign out button at the bottom */}
        <div className={cn(
          "p-6 border-t",
          isCollapsed ? "flex justify-center" : ""
        )}>
          {!isCollapsed ? (
            <Button variant="destructive" className="w-full justify-start" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          ) : (
            <Button variant="ghost" size="icon" className="text-destructive" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          )}
        </div>
      </Card>
    </aside>
  )
} 