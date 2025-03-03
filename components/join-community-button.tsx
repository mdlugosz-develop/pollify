'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Users } from 'lucide-react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

interface JoinCommunityButtonProps {
  communityId: string
  initialIsMember: boolean
}

export function JoinCommunityButton({ communityId, initialIsMember }: JoinCommunityButtonProps) {
  const [isMember, setIsMember] = useState(initialIsMember)
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClientComponentClient()
  const router = useRouter()

  const handleJoin = async () => {
    try {
      setIsLoading(true)
      
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login')
        return
      }

      if (isMember) {
        // Leave community
        await supabase
          .from('community_members')
          .delete()
          .eq('community_id', communityId)
          .eq('user_id', user.id)
        
        setIsMember(false)
      } else {
        // Join community
        await supabase
          .from('community_members')
          .insert([
            {
              community_id: communityId,
              user_id: user.id,
            }
          ])
        
        setIsMember(true)
      }
      
      router.refresh()
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button 
      onClick={handleJoin} 
      disabled={isLoading}
      variant={isMember ? "outline" : "default"}
    >
      <Users className="mr-2 h-4 w-4" />
      {isMember ? 'Leave Community' : 'Join Community'}
    </Button>
  )
} 