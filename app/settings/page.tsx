import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { UserSidebar } from '@/components/user-sidebar'
import { RightSidebar } from '@/components/right-sidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from '@/components/theme-toggle'

export const revalidate = 0

export default async function Settings() {
  const supabase = createServerComponentClient({ cookies })

  return (
    <div className="flex min-h-screen">
      <UserSidebar />
      
      <main className="flex-1 transition-all duration-300 p-8 sidebar-content">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-3xl font-bold">Settings</h1>

          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize how Pollify looks on your device
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h2 className="text-lg font-medium">Theme</h2>
                  <p className="text-sm text-muted-foreground">
                    Select your preferred theme
                  </p>
                </div>
                <ThemeToggle />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <RightSidebar />
    </div>
  )
} 