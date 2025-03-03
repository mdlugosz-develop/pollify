export interface Community {
  id: string
  name: string
  description: string | null
  created_at: string
  _count?: {
    members: number
  }
}

export interface Poll {
  id: string
  title: string
  description: string
  created_at: string
  users: { email: string }
  community?: Community
  poll_options: Array<{
    id: string
    option_text: string
    votes: number
  }>
} 