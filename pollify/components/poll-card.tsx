'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Users, Trash2 } from 'lucide-react'
import type { Poll } from '@/types'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface PollCardProps {
  poll: Poll & {
    community?: {
      id: string
      name: string
    }
  }
}

export function PollCard({ poll }: PollCardProps) {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const totalVotes = poll.poll_options.reduce((sum, option) => sum + option.votes, 0)

  const handleVote = async (optionId: string) => {
    // TODO: Implement voting functionality with Supabase
    console.log('Voted for option:', optionId)
  }

  const handleDelete = async () => {
    try {
      // Delete the poll
      const { error } = await supabase
        .from('polls')
        .delete()
        .eq('id', poll.id)

      if (error) throw error

      // Refresh the page to show updated list
      router.refresh()
    } catch (error) {
      console.error('Error deleting poll:', error)
    }
  }

  // Generate a consistent color for the community badge
  const getCommunityColor = (name: string) => {
    const colors = [
      'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20',
      'bg-purple-500/10 text-purple-500 hover:bg-purple-500/20',
      'bg-red-500/10 text-red-500 hover:bg-red-500/20',
      'bg-green-500/10 text-green-500 hover:bg-green-500/20',
      'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20',
      'bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500/20',
      'bg-pink-500/10 text-pink-500 hover:bg-pink-500/20'
    ]
    const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return colors[index % colors.length]
  }

  return (
    <Card className="hover:shadow-lg transition-shadow relative">
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        {poll.community && (
          <Link 
            href={`/community/${poll.community.id}`}
            onClick={(e) => e.stopPropagation()}
          >
            <Badge 
              variant="secondary"
              className={cn(
                "cursor-pointer transition-colors flex items-center gap-1",
                getCommunityColor(poll.community.name)
              )}
            >
              <Users className="h-3 w-3" />
              {poll.community.name}
            </Badge>
          </Link>
        )}
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={(e) => e.stopPropagation()}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Poll</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this poll? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      
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