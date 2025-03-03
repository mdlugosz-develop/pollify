import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { UserSidebar } from '@/components/user-sidebar'
import { RightSidebar } from '@/components/right-sidebar'
import { PollCard } from '@/components/poll-card'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, Mail, Calendar } from "lucide-react"
import { redirect } from 'next/navigation'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import Link from 'next/link'

export const revalidate = 0

export default async function Profile() {
  const supabase = createServerComponentClient({ cookies })
  
  // Get authenticated user
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Fetch user profile data
  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) {
    return <div>Error loading profile</div>
  }

  // Fetch user's polls with vote counts
  const { data: polls, error: pollsError } = await supabase
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
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  // Calculate total votes across all polls
  const totalVotes = polls?.reduce((sum, poll) => {
    const pollVotes = poll.poll_options.reduce((total: number, option: any) => total + (option.votes || 0), 0)
    return sum + pollVotes
  }, 0) || 0

  // Replace the existing communities query with this:
  const { data: userCommunities, error: communitiesError } = await supabase
    .from('community_members')
    .select(`
      community_id,
      created_at,
      communities:community_id (
        id,
        name,
        description,
        created_at
      )
    `)
    .eq('user_id', user.id)

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
                  <AvatarImage src={profile.avatar_url} alt={profile.full_name || user.email} />
                  <AvatarFallback>
                    <User className="h-12 w-12" />
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h1 className="text-2xl font-bold">{profile.full_name || user.email}</h1>
                      <div className="flex items-center gap-2 text-muted-foreground mt-1">
                        <Mail className="h-4 w-4" />
                        <span>{user.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground mt-1">
                        <Calendar className="h-4 w-4" />
                        <span>Joined {new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                      </div>
                    </div>
                    <Button>Edit Profile</Button>
                  </div>

                  <div className="flex gap-6 mt-6">
                    <div>
                      <p className="text-2xl font-bold">{polls?.length || 0}</p>
                      <p className="text-muted-foreground">Polls Created</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{totalVotes}</p>
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
                <PollCard 
                  key={poll.id} 
                  poll={poll} 
                  totalVotes={poll.poll_options.reduce((sum: number, option: any) => sum + (option.votes || 0), 0)}
                  showDeleteButton={true}
                  userId={user.id}
                />
              ))}
              {polls?.length === 0 && (
                <p className="text-muted-foreground text-center py-8">
                  You haven't created any polls yet.
                </p>
              )}
            </div>
          </div>

          {/* Add this new Communities section */}
          <div>
            <h2 className="text-xl font-semibold mb-4">My Communities</h2>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              {userCommunities?.map((membership) => {
                const community = membership.communities
                return (
                  <Link href={`/community/${community.id}`} key={community.id}>
                    <Card className="hover:bg-accent transition-colors">
                      <CardHeader>
                        <CardTitle className="text-lg">{community.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{community.description}</p>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm text-muted-foreground">
                          <p>Joined {new Date(membership.created_at).toLocaleDateString()}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
              {(!userCommunities || userCommunities.length === 0) && (
                <p className="text-muted-foreground text-center py-8 col-span-2">
                  You haven't joined any communities yet.
                </p>
              )}
            </div>
          </div>

        </div>
      </main>

      <RightSidebar />
    </div>
  )
} 