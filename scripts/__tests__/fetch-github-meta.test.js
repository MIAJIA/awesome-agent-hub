const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");
const { getRepoMetadata, meetsAwesomeStandard, processAgentFile, main } = require("../fetch-github-meta");

// Mock node-fetch
jest.mock("node-fetch");
const { Response } = jest.requireActual("node-fetch");

const mockActualFs = jest.requireActual("fs");

// Mock fs.promises
jest.mock("fs", () => ({
  ...jest.requireActual("fs"),
  promises: {
    readFile: jest.fn(),
    writeFile: jest.fn(),
    readdir: jest.fn(),
  },
}));

// Mock console to prevent output during tests and to spy on calls
global.console = {
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

describe("GitHub Metadata Fetcher", () => {
  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    fetch.mockClear();
    fs.promises.readFile.mockClear();
    fs.promises.writeFile.mockClear();
    fs.promises.readdir.mockClear();
    global.console.log.mockClear();
    global.console.warn.mockClear();
    global.console.error.mockClear();
  });

  describe("getRepoMetadata", () => {
    test("should fetch and parse metadata correctly", async () => {
      const mockRepoData = {
        stargazers_count: 123,
        forks_count: 45,
        pushed_at: "2023-10-27T10:00:00Z",
      };
      fetch.mockResolvedValueOnce(new Response(JSON.stringify(mockRepoData), { status: 200 }));

      const metadata = await getRepoMetadata("https://github.com/testuser/testrepo");
      expect(fetch).toHaveBeenCalledWith("https://api.github.com/repos/testuser/testrepo", { headers: {} });
      expect(metadata).toEqual({
        stars: 123,
        forks: 45,
        last_updated: "2023-10-27",
      });
    });

    test("should handle API errors gracefully", async () => {
      fetch.mockResolvedValueOnce(new Response("Not Found", { status: 404 }));
      const metadata = await getRepoMetadata("https://github.com/testuser/nonexistentrepo");
      expect(metadata).toBeNull();
      expect(global.console.error).toHaveBeenCalled();
    });

    test("should handle network errors gracefully", async () => {
      fetch.mockRejectedValueOnce(new Error("Network error"));
      const metadata = await getRepoMetadata("https://github.com/testuser/testrepo");
      expect(metadata).toBeNull();
      expect(global.console.error).toHaveBeenCalled();
    });

    test("should return null for invalid URLs", async () => {
      expect(await getRepoMetadata("invalid-url")).toBeNull();
      expect(await getRepoMetadata("https://gitlab.com/user/repo")).toBeNull();
      expect(global.console.warn).toHaveBeenCalledTimes(2);
    });
  });

  describe("meetsAwesomeStandard", () => {
    test("should return true if stars >= 50", () => {
      expect(meetsAwesomeStandard({ stars: 50 }, {})).toBe(true);
      expect(meetsAwesomeStandard({ stars: 100 }, {})).toBe(true);
    });

    test("should return false if stars < 50", () => {
      expect(meetsAwesomeStandard({ stars: 49 }, {})).toBe(false);
    });
    test("should return false if metadata is null", () => {
      expect(meetsAwesomeStandard({ stars: 100 }, null)).toBe(false);
    });
  });

  describe("processAgentFile", () => {
    test("should process a file, fetch meta, update, and write back", async () => {
      const mockAgentData = {
        name: "Test Agent",
        slug: "test-agent",
        repository: "https://github.com/testuser/test-agent-repo",
        stars: 10, // Initial stars
      };
      const mockApiData = {
        stargazers_count: 150,
        forks_count: 30,
        pushed_at: "2023-11-01T12:00:00Z",
      };
      fs.promises.readFile.mockResolvedValueOnce(JSON.stringify(mockAgentData));
      fetch.mockResolvedValueOnce(new Response(JSON.stringify(mockApiData), { status: 200 }));

      await processAgentFile("data/test-agent.json");

      expect(fs.promises.readFile).toHaveBeenCalledWith("data/test-agent.json", "utf8");
      expect(fetch).toHaveBeenCalledWith("https://api.github.com/repos/testuser/test-agent-repo", { headers: {} });

      const expectedUpdatedData = {
        ...mockAgentData,
        stars: 150,
        last_updated: "2023-11-01",
      };
      expect(fs.promises.writeFile).toHaveBeenCalledWith(
        "data/test-agent.json",
        JSON.stringify(expectedUpdatedData, null, 2)
      );
      expect(global.console.log).toHaveBeenCalledWith(expect.stringContaining("Updated test-agent.json"));
    });

    test("should skip processing if repository field is missing", async () => {
        const mockAgentData = { name: "No Repo Agent", slug: "no-repo" }; // No repository field
        fs.promises.readFile.mockResolvedValueOnce(JSON.stringify(mockAgentData));

        await processAgentFile("data/no-repo-agent.json");

        expect(fs.promises.readFile).toHaveBeenCalledWith("data/no-repo-agent.json", "utf8");
        expect(fetch).not.toHaveBeenCalled();
        expect(fs.promises.writeFile).not.toHaveBeenCalled();
        expect(global.console.warn).toHaveBeenCalledWith(expect.stringContaining("Skipping no-repo-agent.json: missing repository field."));
      });

    test("should handle errors when fetching metadata for a file", async () => {
        const mockAgentData = {
            name: "Error Agent",
            slug: "error-agent",
            repository: "https://github.com/testuser/error-repo",
            stars: 5
        };
        fs.promises.readFile.mockResolvedValueOnce(JSON.stringify(mockAgentData));
        fetch.mockResolvedValueOnce(new Response("Server Error", { status: 500 })); // Simulate API error

        await processAgentFile("data/error-agent.json");

        expect(fs.promises.writeFile).not.toHaveBeenCalled(); // Should not write if metadata fetch fails
        expect(global.console.warn).toHaveBeenCalledWith(expect.stringContaining("Could not fetch metadata for https://github.com/testuser/error-repo in error-agent.json. File not updated."));
      });
  });

  describe("main", () => {
    test("should read data directory and process JSON files", async () => {
      fs.promises.readdir.mockResolvedValueOnce(["agent1.json", "agent2.txt", "agent3.json"]);
      // Mock readFile and processAgentFile for this test as they are tested separately
      fs.promises.readFile.mockResolvedValue(JSON.stringify({ repository: "https://github.com/a/b" }));
      fetch.mockResolvedValue(new Response(JSON.stringify({ stargazers_count: 60, pushed_at: "2023-01-01T00:00:00Z" }), { status: 200 }));

      await main();

      expect(fs.promises.readdir).toHaveBeenCalledWith(path.join(__dirname, "..", "..", "data"));
      // Check if processAgentFile (mocked by virtue of its components being mocked) was effectively called for JSONs
      expect(fs.promises.readFile).toHaveBeenCalledTimes(2); // agent1.json, agent3.json
      expect(fs.promises.readFile).toHaveBeenCalledWith(path.join(__dirname, "..", "..", "data", "agent1.json"), "utf8");
      expect(fs.promises.readFile).toHaveBeenCalledWith(path.join(__dirname, "..", "..", "data", "agent3.json"), "utf8");
      expect(global.console.log).toHaveBeenCalledWith("GitHub metadata fetch and update complete.");
    });

    test("should handle errors when reading data directory", async () => {
        fs.promises.readdir.mockRejectedValueOnce(new Error("Cannot read dir"));

        await main();

        expect(global.console.error).toHaveBeenCalledWith("Error reading data directory:", expect.any(Error));
      });
  });
});
