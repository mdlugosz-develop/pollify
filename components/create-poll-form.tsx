'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { X } from 'lucide-react'

interface CreatePollFormProps {
  communityId?: string
  onClose: () => void
}

export function CreatePollForm({ communityId, onClose }: CreatePollFormProps) {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [options, setOptions] = useState(['', '']) // Start with 2 empty options
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAddOption = () => {
    setOptions([...options, ''])
  }

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  const handleRemoveOption = (index: number) => {
    if (options.length <= 2) return // Maintain minimum 2 options
    const newOptions = options.filter((_, i) => i !== index)
    setOptions(newOptions)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return

    setIsSubmitting(true)
    try {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Create the poll
      const { data: poll, error: pollError } = await supabase
        .from('polls')
        .insert({
          title,
          description,
          user_id: user.id,
        })
        .select()
        .single()

      if (pollError) throw pollError

      // Create poll options
      const optionsToInsert = options
        .filter(option => option.trim() !== '')
        .map(option_text => ({
          poll_id: poll.id,
          option_text,
          votes: 0
        }))

      const { error: optionsError } = await supabase
        .from('poll_options')
        .insert(optionsToInsert)

      if (optionsError) throw optionsError

      // Only link to community if communityId is provided
      if (communityId) {
        const { error: communityPollError } = await supabase
          .from('community_polls')
          .insert({
            community_id: communityId,
            poll_id: poll.id
          })

        if (communityPollError) throw communityPollError
      }

      router.refresh()
      onClose()
    } catch (error) {
      console.error('Error creating poll:', error)
      alert('Failed to create poll')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create a New Poll</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <Input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's your question?"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
              placeholder="Add some context to your poll (optional)"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Options</label>
            {options.map((option, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  required
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                />
                {options.length > 2 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveOption(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={handleAddOption}
              className="w-full"
            >
              Add Option
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Poll'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
} 