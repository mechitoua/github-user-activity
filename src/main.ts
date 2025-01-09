import { fetchGitHubActivity, formatStatistics, processEvents } from './utils.ts'
import process from 'node:process'

async function main() {
  if (process.argv.length !== 3) {
    console.error('Please provide a GitHub username')
    process.exit(1)
  }

  const username = process.argv[2]
  try {
    const events = await fetchGitHubActivity(username)
    const { repoStats } = processEvents(events)

    const statistics = formatStatistics(repoStats)
    if (statistics.length > 0) {
      console.log(statistics.join('\n'))
    }
  } catch (error) {
    console.error('Error:', (error as Error).message)
    process.exit(1)
  }
}

main()
