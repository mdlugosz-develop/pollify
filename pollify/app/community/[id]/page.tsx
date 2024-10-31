import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { UserSidebar } from '@/components/user-sidebar'
import { RightSidebar } from '@/components/right-sidebar'
import { PollCard } from '@/components/poll-card'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Users } from "lucide-react"
import { notFound } from 'next/navigation'

interface PageProps {
  params: {
    id: string
  }
}

export const revalidate = 0

export default async function CommunityPage({ params }: PageProps) {
  const supabase = createServerComponentClient({ cookies })

  // Fetch community details
  const { data: community, error: communityError } = await supabase
    .from('communities')
    .select('*')
    .eq('id', params.id)
    .single()

  if (communityError || !community) {
    notFound()
  }

  // Fetch member count
  const { count: memberCount } = await supabase
    .from('community_members')
    .select('*', { count: 'exact', head: true })
    .eq('community_id', params.id)

  // First, get the poll IDs for this community
  const { data: communityPolls } = await supabase
    .from('community_polls')
    .select('poll_id')
    .eq('community_id', params.id)

  const pollIds = communityPolls?.map(cp => cp.poll_id) || []

  // Then fetch the actual polls if we have any IDs
  const { data: polls, error: pollsError } = pollIds.length > 0 
    ? await supabase
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
        .in('id', pollIds)
        .order('created_at', { ascending: false })
    : { data: [], error: null }

  if (pollsError) {
    console.error('Error fetching polls:', pollsError)
    return <div>Error loading polls</div>
  }

  // Generate a consistent color for the community
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
    <div className="flex min-h-screen">
      <UserSidebar />
      
      <main className="flex-1 transition-all duration-300 p-8 sidebar-content">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Community Header */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarFallback className={getCommunityColor(community.name)}>
                    {community.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h1 className="text-2xl font-bold">{community.name}</h1>
                      <p className="text-muted-foreground mt-2">
                        {community.description}
                      </p>
                    </div>
                    <Button>
                      <Users className="mr-2 h-4 w-4" />
                      Join Community
                    </Button>
                  </div>

                  <div className="flex gap-6 mt-6">
                    <div>
                      <p className="text-2xl font-bold">{memberCount}</p>
                      <p className="text-muted-foreground">Members</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{polls?.length || 0}</p>
                      <p className="text-muted-foreground">Polls</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Community Polls */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Community Polls</h2>
              <Button>Create Poll</Button>
            </div>
            
            {polls && polls.length > 0 ? (
              <div className="grid gap-6">
                {polls.map((poll) => (
                  <PollCard key={poll.id} poll={poll} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-8">
                  <p className="text-center text-muted-foreground">
                    No polls have been created in this community yet.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      <RightSidebar />
    </div>
  )
} 