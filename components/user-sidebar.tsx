'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { 
  ChevronLeft, 
  ChevronRight, 
  User, 
  Settings, 
  UserCircle, 
  LogOut, 
  PanelLeftClose, 
  PanelLeftOpen,
  Home
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/auth-context'

interface UserSidebarProps {
  className?: string
}

interface UserData {
  id: string
  email: string
  created_at: string
}

export function UserSidebar({ className }: UserSidebarProps) {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [userData, setUserData] = useState<UserData | null>(null)
  const { user, signOut } = useAuth()

  useEffect(() => {
    // Load collapsed state from localStorage on mount
    const savedState = localStorage.getItem('sidebarCollapsed')
    if (savedState !== null) {
      setIsCollapsed(JSON.parse(savedState))
    }
  }, [])

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single()

        if (error) {
          console.error('Error fetching user data:', error)
          return
        }

        setUserData(data)
      }
    }

    fetchUserData()
  }, [user, supabase])

  // Save collapsed state to localStorage whenever it changes
  const handleCollapse = (collapsed: boolean) => {
    setIsCollapsed(collapsed)
    localStorage.setItem('sidebarCollapsed', JSON.stringify(collapsed))
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/login')
  }

  // Get first letter of email for avatar fallback
  const getAvatarFallback = () => {
    if (!userData?.email) return '?'
    return userData.email.charAt(0).toUpperCase()
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
        <div className="absolute -right-3 top-2 z-50 w-6 h-6">
          <Button 
            variant="ghost" 
            size="icon"
            className="h-6 w-6 rounded-full bg-background border shadow-md hover:bg-accent hover:text-accent-foreground p-1"
            onClick={() => handleCollapse(!isCollapsed)}
          >
            {isCollapsed ? <PanelLeftOpen size={12} /> : <PanelLeftClose size={12} />}
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
              <AvatarFallback>
                {getAvatarFallback()}
              </AvatarFallback>
            </Avatar>
            {!isCollapsed && userData && (
              <div className="space-y-1">
                <h2 className="font-semibold leading-none">
                  {userData.email.split('@')[0]}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {userData.email}
                </p>
              </div>
            )}
          </div>
        </div>

        <CardContent className="flex-1 flex flex-col items-center py-6">
          {!isCollapsed ? (
            <div className="space-y-4 w-full">
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={() => router.push('/')}
              >
                <Home className="mr-2 h-4 w-4" />
                Home
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={() => router.push('/profile')}
              >
                <UserCircle className="mr-2 h-4 w-4" />
                Profile
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={() => router.push('/settings')}
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-4">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => router.push('/')}
              >
                <Home className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => router.push('/profile')}
              >
                <UserCircle className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => router.push('/settings')}
              >
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