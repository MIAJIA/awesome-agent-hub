require('dotenv').config();

const fs = require("fs").promises;
const path = require("path");
const fetch = require("node-fetch");
const { URL } = require("url");
const config = require("./config/discover-agents.config.js");

const DATA_DIR = path.join(__dirname, "..", "data");
const DRAFTS_DIR = path.join(__dirname, "..", "data", "drafts");
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;
let rateLimitResetTime = 0;

/**
 * Delays execution for a specified number of milliseconds.
 * @param {number} ms - The number of milliseconds to wait.
 * @returns {Promise<void>}
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Makes a request to the GitHub API, handling rate limiting.
 * @param {string} url - The API URL to fetch.
 * @param {object} options - Fetch options (headers, etc.).
 * @returns {Promise<Response|null>} The fetch Response object or null if an error occurs.
 */
async function fetchGithubApi(url, options = {}) {
  if (Date.now() < rateLimitResetTime) {
    const waitTime = rateLimitResetTime - Date.now();
    console.warn(`Rate limit active. Waiting for ${Math.ceil(waitTime / 1000)}s...`);
    await sleep(waitTime);
  }

  const headers = { ...(options.headers || {}) };
  // Read GITHUB_API_TOKEN first, then API_TOKEN as a fallback
  const githubToken = process.env.GITHUB_API_TOKEN;
  const apiToken = process.env.API_TOKEN;
  const currentToken = githubToken || apiToken;

  if (currentToken) {
    headers["Authorization"] = `token ${currentToken}`;
  }
  headers["Accept"] = "application/vnd.github.v3+json";

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      // console.log(`Fetching (attempt ${attempt}): ${url}`);
      const response = await fetch(url, { ...options, headers });

      if (response.status === 403 && response.headers.get('x-ratelimit-remaining') === '0') {
        const resetTimestamp = parseInt(response.headers.get('x-ratelimit-reset'), 10);
        rateLimitResetTime = resetTimestamp * 1000;
        const waitTime = rateLimitResetTime - Date.now();
        console.warn(`GitHub API rate limit exceeded. Waiting for ${Math.ceil(waitTime / 1000)}s to retry...`);
        if (attempt < MAX_RETRIES) {
          await sleep(waitTime > 0 ? waitTime : RETRY_DELAY_MS); // Ensure positive wait time
          continue; // Retry the request
        } else {
          console.error("GitHub API rate limit exceeded. Max retries reached.");
          return { error: "Rate limit exceeded", status: response.status, data: null, headers: response.headers };
        }
      }

      if (!response.ok) {
        const errorBody = await response.text(); // Read error body for more details
        console.error(
          `Error fetching ${url}: ${response.status} ${response.statusText}. Body: ${errorBody}`
        );
         if (attempt === MAX_RETRIES) {
          // Return a structured error object or throw
          return { error: `API error: ${response.statusText}`, status: response.status, data: null, headers: response.headers };
        }
        await sleep(RETRY_DELAY_MS * attempt); // Exponential backoff might be better
        continue;
      }
      const data = await response.json();
      return { data, headers: response.headers, status: response.status };
    } catch (error) {
      console.error(`Network or other error fetching ${url} (attempt ${attempt}):`, error);
      if (attempt === MAX_RETRIES) {
        return { error: `Network error: ${error.message}`, status: 0, data: null, headers: null }; // status 0 for network error
      }
      await sleep(RETRY_DELAY_MS * attempt);
    }
  }
  return { error: "Max retries reached after errors", status: 0, data: null, headers: null };
}

/**
 * Searches GitHub for repositories based on a query.
 * @param {string} searchQuery - The GitHub search query string.
 * @returns {Promise<Array<object>>} A list of repository items.
 */
async function searchRepositories(searchQuery) {
  console.log(`Searching GitHub for: ${searchQuery}`);
  const collectedItems = [];
  let page = 1;
  const perPage = 50; // Max allowed by GitHub is 100, but 30-50 is often safer for large result sets

  // Add pushed date constraint to the query
  const date = new Date();
  date.setDate(date.getDate() - config.qualityThresholds.maxAgeDays);
  const pushedDateConstraint = `pushed:>=${date.toISOString().split('T')[0]}`;
  const fullQuery = `${searchQuery} ${pushedDateConstraint}`;

  while (true) {
    const url = `${config.githubApi.baseUrl}/search/repositories?q=${encodeURIComponent(fullQuery)}&per_page=${perPage}&page=${page}`;
    const response = await fetchGithubApi(url);
    if (!response) break;

    const data = await response.json();
    if (!data.items || data.items.length === 0) {
      break;
    }
    collectedItems.push(...data.items);

    // GitHub search API only returns up to 1000 results (typically 10 pages of 100)
    if (collectedItems.length >= 1000 || data.items.length < perPage) {
        if (data.total_count > collectedItems.length) {
            console.warn(`Search for "${searchQuery}" yielded ${data.total_count} results, but API limit restricts to ~1000. Consider refining your query.`);
        }
        break;
    }
    page++;
    await sleep(1000); // Be polite to the API
  }
  console.log(`Found ${collectedItems.length} initial candidates for query: ${searchQuery}`);
  return collectedItems;
}

/**
 * Gets detailed information for a single repository.
 * @param {string} owner - The repository owner.
 * @param {string} repoName - The repository name.
 * @returns {Promise<object|null>} Detailed repository object or null.
 */
async function getRepositoryDetails(owner, repoName) {
  const url = `${config.githubApi.baseUrl}/repos/${owner}/${repoName}`;
  const response = await fetchGithubApi(url);
  if (!response) return null;
  return response.json();
}

/**
 * Checks if a repository has a README file.
 * @param {string} owner - The repository owner.
 * @param {string} repoName - The repository name.
 * @returns {Promise<boolean>} True if a README exists, false otherwise.
 */
async function hasReadme(owner, repoName) {
  const url = `${config.githubApi.baseUrl}/repos/${owner}/${repoName}/readme`;
  const response = await fetchGithubApi(url, { method: 'HEAD' }); // Use HEAD to check existence without fetching content
  return response ? response.ok : false;
}

/**
 * Loads existing agent slugs from the data and drafts directories.
 * @returns {Promise<Set<string>>}
 */
async function loadExistingAgentSlugs() {
  const slugs = new Set();
  const allDirs = [DATA_DIR, DRAFTS_DIR];
  for (const dir of allDirs) {
    try {
      await fs.access(dir); // Check if directory exists
      const files = await fs.readdir(dir);
      files.forEach(file => {
        if (file.endsWith(".json")) {
          slugs.add(file.replace(".json", ""));
        }
      });
    } catch (error) {
      if (error.code === 'ENOENT' && dir === DRAFTS_DIR) {
        console.log(`Drafts directory ${DRAFTS_DIR} does not exist. Will attempt to create it.`);
      } else if (error.code !== 'ENOENT') {
        console.warn(`Error reading directory ${dir}:`, error.message);
      }
    }
  }
  return slugs;
}

/**
 * Generates a unique slug for an agent.
 * @param {string} ownerLogin - The owner's login.
 * @param {string} repoName - The repository name.
 * @param {Set<string>} existingSlugs - A set of already used slugs.
 * @returns {string} A unique slug.
 */
function generateSlug(ownerLogin, repoName, existingSlugs) {
  let baseSlug = `${ownerLogin}-${repoName}`.toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/--+/g, "-");
  let slug = baseSlug;
  let counter = 1;
  while (existingSlugs.has(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  return slug;
}

/**
 * Checks if a repository meets the defined quality standards.
 * @param {object} repoDetails - The detailed repository object from GitHub API.
 * @param {boolean} readmeExists - Whether a README file was found.
 * @returns {boolean} True if it meets the standards, false otherwise.
 */
function meetsQualityStandards(repoDetails, readmeExists) {
  const { qualityThresholds } = config;
  if (repoDetails.stargazers_count < qualityThresholds.minStars) return false;
  if (repoDetails.archived || repoDetails.disabled || repoDetails.visibility !== 'public') return false;

  const pushedAt = new Date(repoDetails.pushed_at);
  const thresholdDate = new Date();
  thresholdDate.setDate(thresholdDate.getDate() - qualityThresholds.maxAgeDays);
  if (pushedAt < thresholdDate) return false;

  if (qualityThresholds.requireLicense && !repoDetails.license) return false;
  // Could add more specific license checks here, e.g., repoDetails.license.spdx_id !== 'NOASSERTION'
  if (qualityThresholds.requireReadme && !readmeExists) return false;

  return true;
}

/**
 * Creates an agent data object from repository details.
 * @param {object} repoDetails - Detailed repository object.
 * @param {string} slug - The generated slug for the agent.
 * @returns {object} The agent data object.
 */
function createAgentDataObject(repoDetails, slug) {
  const agent = { ...config.defaultAgentProperties }; // Start with defaults

  agent.name = repoDetails.name;
  agent.slug = slug;
  agent.description = repoDetails.description || "N/A";
  agent.repository = repoDetails.html_url;
  agent.stars = repoDetails.stargazers_count;
  agent.originator = repoDetails.owner.login;
  agent.tags = repoDetails.topics || [];
  agent.open_source = true; // Assumed from GitHub
  agent.license = repoDetails.license ? repoDetails.license.spdx_id || repoDetails.license.name || "" : "";
  agent.last_updated = new Date(repoDetails.pushed_at).toISOString().split('T')[0];
  agent.language = repoDetails.language || "";

  // Attempt to add language to stack if not already present from topics (simple check)
  if (agent.language && !agent.stack.includes(agent.language)) {
    agent.stack.push(agent.language);
  }
  // TODO: More sophisticated stack population based on topics/keywords in a future iteration

  return agent;
}

/**
 * Main function to discover and draft new agent entries.
 */
async function discoverAndDraftAgents() {
  console.log("Starting agent discovery process...");
  await fs.mkdir(DRAFTS_DIR, { recursive: true }); // Ensure drafts directory exists
  const existingSlugs = await loadExistingAgentSlugs();
  let newAgentsDrafted = 0;

  for (const queryConfig of config.githubSearchQueries) {
    const candidateRepos = await searchRepositories(queryConfig.query);
    console.log(`Processing ${candidateRepos.length} candidates from query: "${queryConfig.query}"`);

    for (const repo of candidateRepos) {
      const preliminarySlug = `${repo.owner.login}-${repo.name}`.toLowerCase();
      if (existingSlugs.has(preliminarySlug.split('-').slice(0,2).join('-'))) { // Basic check if similar slug base exists, can be more robust
          // console.log(`Skipping ${repo.full_name}, slug base ${preliminarySlug.split('-').slice(0,2).join('-')} might already exist or be processed.`);
          // This is a very basic check to avoid re-processing already known repo by a slightly different slug from search. A more robust check would be against repo.html_url in existingSlugs (if we stored it) or repo.id
          // For now, we rely on the full slug check later when generating.
      }

      console.log(`Fetching details for ${repo.full_name}...`);
      const repoDetails = await getRepositoryDetails(repo.owner.login, repo.name);
      if (!repoDetails) continue;

      const readmeExists = await hasReadme(repo.owner.login, repo.name);

      if (meetsQualityStandards(repoDetails, readmeExists)) {
        const slug = generateSlug(repo.owner.login, repo.name, existingSlugs);
        if (existingSlugs.has(slug)) { // Double check, should be handled by generateSlug logic but good for safety
            console.warn(`Generated slug ${slug} for ${repo.full_name} already exists. Skipping.`);
            continue;
        }

        console.log(`Repository ${repo.full_name} meets quality standards. Drafting agent file...`);
        const agentData = createAgentDataObject(repoDetails, slug);
        const filePath = path.join(DRAFTS_DIR, `${slug}.json`);

        try {
          await fs.writeFile(filePath, JSON.stringify(agentData, null, 2));
          console.log(`Drafted agent file: ${filePath}`);
          existingSlugs.add(slug); // Add to existing slugs to prevent duplicates in this run
          newAgentsDrafted++;
        } catch (err) {
          console.error(`Error writing agent file ${filePath}:`, err);
        }
      } else {
        // console.log(`Repository ${repo.full_name} does not meet quality standards.`);
      }
      await sleep(500); // Be polite between processing individual repos
    }
  }
  console.log(`Agent discovery complete. Drafted ${newAgentsDrafted} new agent files in ${DRAFTS_DIR}.`);
}

if (require.main === module) {
  discoverAndDraftAgents().catch(error => {
    console.error("Unhandled error in discoverAndDraftAgents:", error);
    process.exit(1);
  });
}

module.exports = {
  fetchGithubApi,
  searchRepositories,
  getRepositoryDetails,
  hasReadme,
  loadExistingAgentSlugs,
  generateSlug,
  meetsQualityStandards,
  createAgentDataObject,
  discoverAndDraftAgents,
  sleep // Ensuring sleep is exported
};