import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import Link from 'next/link'

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

  return (
    <Link href={`/poll/${poll.id}`}>
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle>{poll.title}</CardTitle>
          <p className="text-sm text-muted-foreground">
            Created by {poll.users.email} • {new Date(poll.created_at).toLocaleDateString()}
          </p>
        </CardHeader>
        <CardContent>
          <p className="mb-4">{poll.description}</p>
          <div className="space-y-4">
            {poll.poll_options.map((option) => (
              <div key={option.id}>
                <div className="flex justify-between mb-1">
                  <span>{option.option_text}</span>
                  <span>{totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0}%</span>
                </div>
                <Progress value={totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
} 