'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface PollCardProps {
  poll: {
    id: string
    title: string
    description: string
    created_at: string
    users: { email: string }
    poll_options: Array<{
      id: string
      option_text: string
      votes: number
    }>
  }
}

export function PollCard({ poll }: PollCardProps) {
  const totalVotes = poll.poll_options.reduce((sum, option) => sum + option.votes, 0)

  const handleVote = async (optionId: string) => {
    // TODO: Implement voting functionality with Supabase
    console.log('Voted for option:', optionId)
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle>{poll.title}</CardTitle>
        <p className="text-sm text-muted-foreground">
          Created by {poll.users.email} • {new Date(poll.created_at).toLocaleDateString()}
        </p>
      </CardHeader>
      <CardContent>
        <p className="mb-4">{poll.description}</p>
        <div className="space-y-3">
          {poll.poll_options.map((option) => (
            <button 
              key={option.id}
              onClick={() => handleVote(option.id)}
              className={cn(
                "w-full text-left rounded-lg border bg-card p-4 cursor-pointer transition-colors",
                "hover:bg-emerald-50 hover:border-emerald-200",
                "dark:hover:bg-emerald-950 dark:hover:border-emerald-800"
              )}
            >
              <div className="flex justify-between mb-2">
                <span className="font-medium">{option.option_text}</span>
                <span>{totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0}%</span>
              </div>
              <Progress 
                value={totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0}
                className="h-2"
              />
            </button>
          ))}
        </div>
        <p className="text-sm text-muted-foreground mt-4 text-center">
          {totalVotes} {totalVotes === 1 ? 'vote' : 'votes'} total
        </p>
      </CardContent>
    </Card>
  )
} 