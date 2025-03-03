import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { PollCard } from '@/components/poll-card'
import { CreatePollDialog } from '@/components/create-poll-dialog'
import { UserSidebar } from '@/components/user-sidebar'
import { RightSidebar } from '@/components/right-sidebar'

export const revalidate = 0

export default async function Home() {
  const supabase = createServerComponentClient({ cookies })

  // Get current user
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch all polls with their options and vote counts
  const { data: polls, error: pollsError } = await supabase
    .from('polls')
    .select(`
      *,
      users (email),
      poll_options (
        id,
        option_text,
        votes
      ),
      votes:votes(count)
    `)
    .order('created_at', { ascending: false })

  if (pollsError) {
    console.error('Error fetching polls:', pollsError)
    return <div>Error loading polls</div>
  }

  // Fetch user's votes if logged in
  const { data: userVotes } = user ? await supabase
    .from('votes')
    .select('poll_id, option_id')
    .eq('user_id', user.id) : { data: [] }

  // Create a map of poll_id to voted option_id
  const voteMap = new Map(userVotes?.map(vote => [vote.poll_id, vote.option_id]))

  return (
    <div className="flex min-h-screen">
      <UserSidebar />
      
      <main className="flex-1 transition-all duration-300 p-8 sidebar-content">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Header section */}
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Recent Polls</h1>
            <CreatePollDialog buttonText="Create New Poll" />
          </div>

          {/* Polls grid */}
          {polls && polls.length > 0 ? (
            <div className="grid gap-6">
              {polls.map((poll) => (
                <PollCard 
                  key={poll.id} 
                  poll={poll}
                  userVote={voteMap.get(poll.id)}
                  totalVotes={poll.votes[0]?.count || 0}
                />
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              No polls have been created yet. Be the first to create one!
            </div>
          )}
        </div>
      </main>

      <RightSidebar />
    </div>
  )
}
