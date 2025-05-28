const fs = require("fs").promises;
const path = require("path");
const fetch = require("node-fetch");

const dataDir = path.join(__dirname, "..", "data");
const GITHUB_API_TOKEN = process.env.GITHUB_API_TOKEN; // Recommended for higher rate limits

async function getRepoMetadata(repoUrl) {
  if (!repoUrl || !repoUrl.includes("github.com")) {
    console.warn(`Invalid or non-GitHub repository URL: ${repoUrl}`);
    return null;
  }
  const parts = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!parts || parts.length < 3) {
    console.warn(`Could not parse owner/repo from URL: ${repoUrl}`);
    return null;
  }
  const owner = parts[1];
  const repo = parts[2].replace(".git", ""); // Remove .git if present

  const apiUrl = `https://api.github.com/repos/${owner}/${repo}`;
  const headers = {};
  if (GITHUB_API_TOKEN) {
    headers["Authorization"] = `token ${GITHUB_API_TOKEN}`;
  }

  try {
    const response = await fetch(apiUrl, { headers });
    if (!response.ok) {
      console.error(`Error fetching ${apiUrl}: ${response.status} ${response.statusText}`);
      return null;
    }
    const data = await response.json();
    return {
      stars: data.stargazers_count,
      forks: data.forks_count, // Added forks_count as per your schema, though not in initial request
      last_updated: new Date(data.pushed_at).toISOString().split("T")[0], // YYYY-MM-DD
    };
  } catch (error) {
    console.error(`Error fetching metadata for ${repoUrl}:`, error);
    return null;
  }
}

function meetsAwesomeStandard(agentData, metadata) {
  // Simple standard: must have at least 50 stars after update
  // And metadata must have been successfully fetched
  return !!(metadata && agentData.stars >= 50);
}

async function processAgentFile(filePath) {
  try {
    const fileContent = await fs.readFile(filePath, "utf8");
    const agentData = JSON.parse(fileContent);

    if (!agentData.repository) {
      console.warn(`Skipping ${path.basename(filePath)}: missing repository field.`);
      return;
    }

    const metadata = await getRepoMetadata(agentData.repository);

    if (metadata) {
      agentData.stars = metadata.stars;
      // agentData.forks = metadata.forks; // Uncomment if you add forks to your schema and want to save it
      agentData.last_updated = metadata.last_updated;

      const isAwesome = meetsAwesomeStandard(agentData, metadata);
      // You could add a field like `is_awesome_validated: true/false` or similar
      console.log(
        `${agentData.name} (${agentData.slug}): Stars: ${agentData.stars}, Last Updated: ${agentData.last_updated}, Meets Standard: ${isAwesome}`
      );

      // Write back the updated data
      await fs.writeFile(filePath, JSON.stringify(agentData, null, 2));
      console.log(`Updated ${path.basename(filePath)}`);
    } else {
      console.warn(`Could not fetch metadata for ${agentData.repository} in ${path.basename(filePath)}. File not updated.`);
    }
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
  }
}

async function main() {
  try {
    const files = await fs.readdir(dataDir);
    for (const file of files) {
      if (path.extname(file) === ".json") {
        const filePath = path.join(dataDir, file);
        await processAgentFile(filePath);
      }
    }
    console.log("GitHub metadata fetch and update complete.");
  } catch (error) {
    console.error("Error reading data directory:", error);
  }
}

// If run directly, execute main
if (require.main === module) {
  main();
}

module.exports = { getRepoMetadata, meetsAwesomeStandard, processAgentFile, main };

