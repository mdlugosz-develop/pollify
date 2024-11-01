'use client'

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { VoteButton } from "@/components/vote-button"
import type { Poll } from "@/types"

interface PollCardProps {
  poll: Poll
  userVote?: string | null // The ID of the option the user voted for
  totalVotes: number
}

export function PollCard({ poll, userVote, totalVotes }: PollCardProps) {
  const hasVoted = !!userVote
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">{poll.title}</h3>
            {poll.description && (
              <p className="text-muted-foreground mt-1">{poll.description}</p>
            )}
          </div>
          <div className="text-sm text-muted-foreground">
            by {poll.users.email.split('@')[0]}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {poll.poll_options.map((option) => (
            <VoteButton
              key={option.id}
              pollId={poll.id}
              optionId={option.id}
              hasVoted={hasVoted}
              isSelected={option.id === userVote}
            >
              {option.option_text}
            </VoteButton>
          ))}
          <div className="text-sm text-muted-foreground text-right mt-2">
            {totalVotes} {totalVotes === 1 ? 'vote' : 'votes'}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 