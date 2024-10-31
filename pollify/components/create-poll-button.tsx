import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function CreatePollButton() {
  return (
    <Link href="/create">
      <Button>Create Poll</Button>
    </Link>
  )
} 