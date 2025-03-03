'use client'

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { VoteButton } from "@/components/vote-button"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import type { Poll } from "@/types"
import { DeletePollDialog } from "@/components/delete-poll-dialog"

interface PollCardProps {
  poll: Poll
  userVote?: string | null
  totalVotes: number
  showDeleteButton?: boolean
  userId?: string
}

export function PollCard({ 
  poll, 
  userVote, 
  totalVotes,
  showDeleteButton = false,
  userId
}: PollCardProps) {
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
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              by {poll.users.email.split('@')[0]}
            </div>
            {showDeleteButton && userId && (
              <DeletePollDialog pollId={poll.id} userId={userId} />
            )}
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