// deno-lint-ignore-file
import { ActivityStats, GitHubEvent, RepoStats } from '../types.ts'

// deno-lint-ignore-file
async function fetchGitHubActivity(username: string): Promise<GitHubEvent[]> {
  const response = await fetch(`https://api.github.com/users/${username}/events/public`)
  if (!response.ok) {
    throw new Error(`Failed to fetch GitHub activity: ${response.statusText}`)
  }
  return await response.json()
}

function initRepoStats(repoName: string): RepoStats {
  return {
    name: repoName,
    commits: 0,
    issuesOpened: 0,
    issuesClosed: 0,
    prsOpened: 0,
    prsClosed: 0,
    stars: 0
  }
}

function processEvents(events: GitHubEvent[]): ActivityStats {
  const repoStats = new Map<string, RepoStats>()
  for (const event of events) {
    const repoName = event.repo.name
    const stats = repoStats.get(repoName) || initRepoStats(repoName)

    switch (event.type) {
      case 'PushEvent':
        const commitCount = event.payload.commits?.length || 0
        stats.commits += commitCount
        break

      case 'IssuesEvent':
        if (event.payload.action === 'opened') {
          stats.issuesOpened++
        } else if (event.payload.action === 'closed') {
          stats.issuesClosed++
        }
        break

      case 'PullRequestEvent':
        if (event.payload.action === 'opened') {
          stats.prsOpened++
        } else if (event.payload.action === 'closed') {
          stats.prsClosed++
        }
        break

      case 'WatchEvent':
        if (event.payload.action === 'started') {
          stats.stars++
        }
        break
    }

    repoStats.set(repoName, stats)
  }

  return { repoStats }
}

function formatStatistics(stats: Map<string, RepoStats>): string[] {
  const output: string[] = []
  const statsByType = new Map<string, string[]>()

  // Process commits
  const commitStats = Array.from(stats.values())
    .filter((s) => s.commits > 0)
    .sort((a, b) => b.commits - a.commits)
    .map((s) => `- Pushed ${s.commits} commit${s.commits > 1 ? 's' : ''} to ${s.name}`)
  if (commitStats.length) statsByType.set('Commits', commitStats)

  // Process issues
  const issueStats = Array.from(stats.values())
    .filter((s) => s.issuesOpened > 0 || s.issuesClosed > 0)
    .sort((a, b) => b.issuesOpened + b.issuesClosed - (a.issuesOpened + a.issuesClosed))
    .flatMap((s) => {
      const messages: string[] = []
      if (s.issuesOpened > 0)
        messages.push(
          `- Opened ${s.issuesOpened} issue${s.issuesOpened > 1 ? 's' : ''} in ${s.name}`
        )
      if (s.issuesClosed > 0)
        messages.push(
          `- Closed ${s.issuesClosed} issue${s.issuesClosed > 1 ? 's' : ''} in ${s.name}`
        )
      return messages
    })
  if (issueStats.length) statsByType.set('Issues', issueStats)

  // Process pull requests
  const prStats = Array.from(stats.values())
    .filter((s) => s.prsOpened > 0 || s.prsClosed > 0)
    .sort((a, b) => b.prsOpened + b.prsClosed - (a.prsOpened + a.prsClosed))
    .flatMap((s) => {
      const messages: string[] = []
      if (s.prsOpened > 0)
        messages.push(
          `- Created ${s.prsOpened} pull request${s.prsOpened > 1 ? 's' : ''} in ${
            s.name
          }`
        )
      if (s.prsClosed > 0)
        messages.push(
          `- Closed ${s.prsClosed} pull request${s.prsClosed > 1 ? 's' : ''} in ${s.name}`
        )
      return messages
    })
  if (prStats.length) statsByType.set('Pull Requests', prStats)

  // Process stars
  const starStats = Array.from(stats.values())
    .filter((s) => s.stars > 0)
    .sort((a, b) => b.stars - a.stars)
    .map((s) => `- Starred ${s.name}`)
  if (starStats.length) statsByType.set('Stars', starStats)

  // Build final output
  for (const [type, messages] of statsByType) {
    output.push(`\n${type}:`)
    output.push(...messages)
  }

  return output
}

async function main() {
  if (Deno.args.length !== 1) {
    console.error('Please provide a GitHub username')
    Deno.exit(1)
  }

  const username = Deno.args[0]
  try {
    const events = await fetchGitHubActivity(username)
    const { repoStats } = processEvents(events)

    const statistics = formatStatistics(repoStats)
    if (statistics.length > 0) {
      console.log(statistics.join('\n'))
    }
  } catch (error) {
    console.error('Error:', (error as Error).message)
    Deno.exit(1)
  }
}

main()
