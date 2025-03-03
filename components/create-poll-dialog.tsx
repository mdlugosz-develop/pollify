'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { CreatePollForm } from '@/components/create-poll-form'

interface CreatePollDialogProps {
  communityId?: string
  buttonText?: string
}

export function CreatePollDialog({ communityId, buttonText = "Create Poll" }: CreatePollDialogProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{buttonText}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <CreatePollForm communityId={communityId} onClose={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
} 