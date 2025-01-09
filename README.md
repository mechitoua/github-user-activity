# GitHub Activity CLI

A command-line tool to fetch and display GitHub user activity, including commits, issues, pull requests, and stars.

## Features

- View recent GitHub activity for any public user
- Track:
  - Commit pushes
  - Issues opened/closed
  - Pull requests created/closed
  - Repository stars
- Cross-platform support (works with both Deno and Node.js)
- No external dependencies required for basic functionality

## Prerequisites

Either of these runtimes:

- [Deno](https://deno.land/manual/getting_started/installation) (Recommended)
- [Node.js](https://nodejs.org/) (v18 or higher)

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd github-activity-cli
```

2. Make the script executable:

```bash
chmod +x github-activity
```

3. (Optional) Add to PATH for system-wide access:

```bash
# Add this line to your ~/.bashrc or ~/.zshrc
export PATH="$PATH:/path/to/github-activity-cli"
```

### Node.js Setup (Optional)

If you prefer using Node.js, install the required TypeScript dependencies:

```bash
npm install
```

## Usage

Basic command:

```bash
./github-activity <github-username>
```

Example:

```bash
./github-activity octocat
```

Output format:

```
Commits:
- Pushed 5 commits to octocat/Hello-World

Issues:
- Opened 2 issues in octocat/Hello-World
- Closed 1 issue in octocat/Hello-World

Pull Requests:
- Created 3 pull requests in octocat/Hello-World
- Closed 2 pull requests in octocat/Hello-World

Stars:
- Starred octocat/Hello-World
```

## File Structure

```
.
├── github-activity     # Main shell script
├── main.ts            # Entry point
├── utils.ts           # Core functionality
├── package.json       # Node.js dependencies (optional)
└── tsconfig.json      # TypeScript configuration (optional)
```

## How It Works

1. The script first checks for available runtimes (Deno or Node.js)
2. Fetches the user's recent public GitHub activity
3. Processes and categorizes different types of events
4. Displays formatted statistics grouped by activity type

## Error Handling

The CLI handles common errors:

- Missing username argument
- Invalid GitHub username
- Network connectivity issues
- Missing runtime environments

## Limitations

- Only fetches recent public activity (limited by GitHub API)
- Requires GitHub API access (may be rate-limited)
- Some events might not be captured if they exceed the API's event limit

## Contributing

Feel free to open issues or submit pull requests for improvements.

## License

[MIT License](LICENSE)
