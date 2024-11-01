'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'

interface VoteButtonProps {
  pollId: string
  optionId: string
  hasVoted: boolean
  isSelected: boolean
  children: React.ReactNode
}

export function VoteButton({ 
  pollId, 
  optionId, 
  hasVoted, 
  isSelected,
  children 
}: VoteButtonProps) {
  const [isVoting, setIsVoting] = useState(false)
  const supabase = createClientComponentClient()
  const router = useRouter()
  const { user } = useAuth()

  const handleVote = async () => {
    if (!user || isVoting) return
    setIsVoting(true)

    try {
      if (isSelected) {
        // Remove vote
        await supabase.rpc('remove_vote', {
          p_user_id: user.id,
          p_poll_id: pollId,
          p_option_id: optionId
        })
      } else {
        // If user has already voted for a different option, first remove that vote
        if (hasVoted) {
          return // Don't allow voting for multiple options
        }
        
        // Add new vote
        await supabase.rpc('add_vote', {
          p_user_id: user.id,
          p_poll_id: pollId,
          p_option_id: optionId
        })
      }

      router.refresh()
    } catch (error) {
      console.error('Error voting:', error)
    } finally {
      setIsVoting(false)
    }
  }

  return (
    <Button
      variant={isSelected ? "default" : "outline"}
      className="w-full justify-start"
      disabled={isVoting || (hasVoted && !isSelected)}
      onClick={handleVote}
    >
      {children}
    </Button>
  )
} 