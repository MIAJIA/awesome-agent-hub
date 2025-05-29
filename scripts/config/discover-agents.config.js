module.exports = {
  // GitHub API search queries to discover potential agent repositories
  // For query syntax, see: https://docs.github.com/en/search-github/searching-on-github/searching-for-repositories
  githubSearchQueries: [
    {
      query: '"AI agent" OR "autonomous agent" in:name,description,readme stars:>=100',
      // Parameters like sort, order can be added here if needed by the API call logic
      // sort: "updated",
      // order: "desc"
    },
    {
      query: 'topic:langchain topic:agent stars:>=100',
    },
    {
      query: 'topic:crewai topic:agent stars:>=100',
    },
    {
      query: 'topic:autogen topic:agent stars:>=100',
    },
    {
      query: 'topic:llama-index topic:agent stars:>=100',
    },
    // Add more queries as needed
  ],

  // Minimum criteria for an agent to be considered "high quality" for drafting
  qualityThresholds: {
    minStars: 100,
    maxAgeDays: 365, // Pushed within the last N days
    requireReadme: true,
    requireLicense: true, // Checks repo.license object is not null
  },

  // Output directory for newly discovered agent JSON files (pending manual review)
  draftsDir: "data/drafts",

  // GitHub API settings
  githubApi: {
    baseUrl: "https://api.github.com",
    // Headers will be dynamically set based on GITHUB_API_TOKEN presence
    rateLimitLowWaterMark: 10, // If X-RateLimit-Remaining is below this, pause
    rateLimitPauseSeconds: 60, // Pause for this many seconds if rate limit is low
  },

  // Fields to be auto-populated or set to defaults
  defaultAgentProperties: {
    category: "experimental",
    status: "alpha",
    highlight: "",
    purpose: "",
    principle: "",
    reusability: "",
    limitations: "",
    useful_links: [],
    badge: "",
    security_grade: "",
    license_grade: "",
    quality_grade: "",
    platforms: [],
    maintainer_verified: false,
    stack: [], // Base stack, language might be added automatically
  },

  // TODO: Future expansion - Awesome Lists to scrape
  awesomeLists: [],
};