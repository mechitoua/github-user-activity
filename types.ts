interface RepoStats {
  name: string
  commits: number
  issuesOpened: number
  issuesClosed: number
  prsOpened: number
  prsClosed: number
  stars: number
}

interface GitHubEvent {
  id: string
  type: string
  actor: {
    id: number
    login: string
  }
  repo: {
    id: number
    name: string
    url: string
  }
  payload: {
    size: number
    description: string | null
    pusher_type: string
    action: string
    commits: string[]
  }
  public: boolean
  created_at: string
}

interface ActivityStats {
  repoStats: Map<string, RepoStats>
}

export type { RepoStats, GitHubEvent, ActivityStats }
