import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { UserSidebar } from '@/components/user-sidebar'
import { RightSidebar } from '@/components/right-sidebar'
import { PollCard } from '@/components/poll-card'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, Mail, Calendar } from "lucide-react"

export const revalidate = 0

export default async function Profile() {
  const supabase = createServerComponentClient({ cookies })

  // TODO: Replace with real user data
  const sampleUser = {
    name: "John Doe",
    email: "john@example.com",
    avatarUrl: "https://github.com/shadcn.png",
    joinDate: "January 2024",
    pollsCreated: 15,
    totalVotes: 234
  }

  // Fetch user's polls (using sample data for now)
  const { data: polls, error } = await supabase
    .from('polls')
    .select(`
      *,
      users (email),
      poll_options (
        id,
        option_text,
        votes
      )
    `)
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div className="flex min-h-screen">
      <UserSidebar />
      
      <main className="flex-1 transition-all duration-300 p-8 sidebar-content">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Profile Header */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={sampleUser.avatarUrl} alt={sampleUser.name} />
                  <AvatarFallback>
                    <User className="h-12 w-12" />
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h1 className="text-2xl font-bold">{sampleUser.name}</h1>
                      <div className="flex items-center gap-2 text-muted-foreground mt-1">
                        <Mail className="h-4 w-4" />
                        <span>{sampleUser.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground mt-1">
                        <Calendar className="h-4 w-4" />
                        <span>Joined {sampleUser.joinDate}</span>
                      </div>
                    </div>
                    <Button>Edit Profile</Button>
                  </div>

                  <div className="flex gap-6 mt-6">
                    <div>
                      <p className="text-2xl font-bold">{sampleUser.pollsCreated}</p>
                      <p className="text-muted-foreground">Polls Created</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{sampleUser.totalVotes}</p>
                      <p className="text-muted-foreground">Total Votes</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User's Polls */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Recent Polls</h2>
            <div className="grid gap-6">
              {polls?.map((poll) => (
                <PollCard key={poll.id} poll={poll} />
              ))}
            </div>
          </div>
        </div>
      </main>

      <RightSidebar />
    </div>
  )
} 