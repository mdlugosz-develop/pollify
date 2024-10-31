'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface UserSidebarProps {
  className?: string
}

export function UserSidebar({ className }: UserSidebarProps) {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [isCollapsed, setIsCollapsed] = useState(false)

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
      <Card className="h-full rounded-none relative">
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

        <CardHeader className={cn(
          "transition-opacity",
          isCollapsed ? "opacity-0" : "opacity-100"
        )}>
          <CardTitle>Account</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {!isCollapsed ? (
            <>
              <Button variant="outline" className="w-full" onClick={() => router.push('/profile')}>
                Profile
              </Button>
              <Button variant="outline" className="w-full" onClick={() => router.push('/settings')}>
                Settings
              </Button>
              <Button variant="destructive" className="w-full" onClick={handleSignOut}>
                Sign Out
              </Button>
            </>
          ) : (
            <div className="flex flex-col items-center space-y-4">
              <Button variant="ghost" size="icon" onClick={() => router.push('/profile')}>
                P
              </Button>
              <Button variant="ghost" size="icon" onClick={() => router.push('/settings')}>
                S
              </Button>
              <Button variant="ghost" size="icon" className="text-destructive" onClick={handleSignOut}>
                X
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </aside>
  )
} 