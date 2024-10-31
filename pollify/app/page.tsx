import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { PollCard } from '@/components/poll-card'
import { UserSidebar } from '@/components/user-sidebar'
import { RightSidebar } from '@/components/right-sidebar'
import { CreatePollButton } from '@/components/create-poll-button'

export const revalidate = 0

export default async function Home() {
  const supabase = createServerComponentClient({ cookies })

  // Fetch all polls with their options, votes, and community info
  const { data: polls, error } = await supabase
    .from('polls')
    .select(`
      *,
      users (email),
      poll_options (
        id,
        option_text,
        votes
      ),
      community_polls (
        community:communities (
          id,
          name
        )
      )
    `)
    .order('created_at', { ascending: false })

  // Transform the data to flatten the community information
  const transformedPolls = polls?.map(poll => ({
    ...poll,
    community: poll.community_polls?.[0]?.community || null
  }))

  if (error) {
    console.error('Error fetching polls:', error)
    return <div>Error loading polls</div>
  }

  return (
    <div className="flex min-h-screen">
      <UserSidebar />
      
      <main className="flex-1 transition-all duration-300 p-8 sidebar-content mr-80"> 
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Polls</h1>
            <CreatePollButton />
          </div>
          
          <div className="grid gap-6">
            {transformedPolls?.map((poll) => (
              <PollCard key={poll.id} poll={poll} />
            ))}
          </div>
        </div>
      </main>

      <RightSidebar />
    </div>
  )
}
