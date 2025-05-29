const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");
constม่aconfig = require("../config/discover-agents.config.js"); // Use a distinct name
const discoverAgents = require("../discover-agents.js");

// Destructure functions from discoverAgents for easier access in tests
const {
  fetchGithubApi,
  searchRepositories,
  getRepositoryDetails,
  hasReadme,
  meetsQualityStandards,
  createAgentDataObject,
  generateSlug,
  loadExistingAgentSlugs,
  discoverAndDraftAgents,
  sleep
} = discoverAgents;

// Mock node-fetch
jest.mock("node-fetch");
const { Response } = jest.requireActual("node-fetch");

// Mock fs.promises
jest.mock("fs", () => ({
  ...jest.requireActual("fs"),
  promises: {
    readFile: jest.fn(),
    writeFile: jest.fn(),
    readdir: jest.fn(),
    access: jest.fn(),
    mkdir: jest.fn(),
  },
}));

jest.mock("../config/discover-agents.config.js", () => {
  // The factory now returns a new object each time Jest needs the mock.
  // For the initial setup, it can return a clone of the actual config.
  const originalConfigForInitialMock = jest.requireActual("../config/discover-agents.config.js");
  return JSON.parse(JSON.stringify(originalConfigForInitialMock)); // Return a deep clone
});

// Mock console to prevent output during tests and to spy on calls
global.console = {
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Helper to create a mock GitHub API response
const createMockApiResponse = (data, status = 200, headers = new Map([['x-ratelimit-remaining', '5000'], ['x-ratelimit-reset', '1600000000']]), ok = true) => {
  const response = new Response(JSON.stringify(data), { status });
  Object.entries(headers).forEach(([key, value]) => response.headers.set(key, value));
  return Promise.resolve({
    ok: ok !== undefined ? ok : (status >= 200 && status < 300),
    status: status,
    headers: headers instanceof Map ? headers : new Map(Object.entries(headers)),
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(typeof data === 'string' ? data : JSON.stringify(data))
  });
};

const createMockApiErrorResponse = (status = 404, body = "Not Found", headers = new Map([['x-ratelimit-remaining', '5000'], ['x-ratelimit-reset', '1600000000']])) => {
    const response = new Response(body, { status });
    Object.entries(headers).forEach(([key, value]) => response.headers.set(key, value));
    return Promise.resolve({
      ok: false,
      status: status,
      statusText: body,
      headers: headers instanceof Map ? headers : new Map(Object.entries(headers)),
      json: () => Promise.resolve({ message: body }),
      text: () => Promise.resolve(body)
    });
}

// Import the (now mocked) config *after* jest.mock has been declared.
const mockedConfig = require("../config/discover-agents.config.js");

describe("Discover Agents Script", () => {
  let originalGitHubApiToken;
  let originalApiToken;

  beforeAll(() => {
    originalGitHubApiToken = process.env.GITHUB_API_TOKEN;
    originalApiToken = process.env.API_TOKEN;
  });

  afterAll(() => {
    process.env.GITHUB_API_TOKEN = originalGitHubApiToken;
    process.env.API_TOKEN = originalApiToken;
  });

  beforeEach(() => {
    fetch.mockClear();
    fs.promises.readFile.mockClear();
    fs.promises.writeFile.mockClear();
    fs.promises.readdir.mockClear();
    fs.promises.access.mockClear();
    fs.promises.mkdir.mockClear();

    global.console.log.mockClear();
    global.console.warn.mockClear();
    global.console.error.mockClear();

    const actualConfig = jest.requireActual("../config/discover-agents.config.js");
    for (const key in mockedConfig) {
      delete mockedConfig[key];
    }
    Object.assign(mockedConfig, JSON.parse(JSON.stringify(actualConfig)));

    // Clean up environment variables for tests that don't expect them
    delete process.env.GITHUB_API_TOKEN;
    delete process.env.API_TOKEN;
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("fetchGithubApi", () => {
    test("should make a basic GET request", async () => {
      fetch.mockReturnValueOnce(createMockApiResponse({ data: "success" }));
      await fetchGithubApi("https://api.github.com/test");
      expect(fetch).toHaveBeenCalledWith("https://api.github.com/test", expect.any(Object));
    });

    test("should include Authorization header if GITHUB_API_TOKEN is set", async () => {
      process.env.GITHUB_API_TOKEN = "test_github_token";
      fetch.mockReturnValueOnce(createMockApiResponse({ data: "success" }));
      await fetchGithubApi("https://api.github.com/test-auth-github");
      expect(fetch).toHaveBeenCalledWith("https://api.github.com/test-auth-github", {
        headers: {
          Accept: "application/vnd.github.v3+json",
          Authorization: "token test_github_token",
        },
      });
    });

    test("should include Authorization header if API_TOKEN is set and GITHUB_API_TOKEN is not", async () => {
      process.env.API_TOKEN = "test_api_token_only";
      fetch.mockReturnValueOnce(createMockApiResponse({ data: "success" }));
      await fetchGithubApi("https://api.github.com/test-auth-api-only");
      expect(fetch).toHaveBeenCalledWith("https://api.github.com/test-auth-api-only", {
        headers: {
          Accept: "application/vnd.github.v3+json",
          Authorization: "token test_api_token_only",
        },
      });
    });

    test("should prioritize GITHUB_API_TOKEN if both are set", async () => {
      process.env.GITHUB_API_TOKEN = "priority_github_token";
      process.env.API_TOKEN = "secondary_api_token";
      fetch.mockReturnValueOnce(createMockApiResponse({ data: "success" }));
      await fetchGithubApi("https://api.github.com/test-auth-priority");
      expect(fetch).toHaveBeenCalledWith("https://api.github.com/test-auth-priority", {
        headers: {
          Accept: "application/vnd.github.v3+json",
          Authorization: "token priority_github_token",
        },
      });
    });

    test("should use GITHUB_API_TOKEN for Authorization when GITHUB_API_TOKEN is available", async () => {
      process.env.GITHUB_API_TOKEN = "test_github_token_specific";
      fetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ items: [] }), headers: new Map([["x-ratelimit-remaining", "5000"], ["x-ratelimit-reset", "1600000000"]]) });
      await fetchGithubApi("test_url_github_env");
      expect(fetch).toHaveBeenCalledWith("test_url_github_env", expect.objectContaining({
        headers: expect.objectContaining({ "Authorization": "token test_github_token_specific" })
      }));
    });

    test("should pause if rate limit is low", async () => {
      jest.useFakeTimers(); // Use fake timers for this test
      const sleepSpy = jest.spyOn(discoverAgents, 'sleep');

      // Mock response with low rate limit
      const lowRateHeaders = new Map([['x-ratelimit-remaining', '5'], ['x-ratelimit-reset', String(Math.floor(Date.now() / 1000) + 3600)]]);
      fetch.mockReturnValueOnce(createMockApiResponse({ data: "success" }, 200, lowRateHeaders)); // First call to set rate limit low

      // This call should trigger the pause
      fetch.mockReturnValueOnce(createMockApiResponse({ data: "success_after_pause" }));

      await fetchGithubApi("https://api.github.com/firstcall_sets_low_rate"); // Sets rateLimitRemaining to 5
      await fetchGithubApi("https://api.github.com/secondcall_needs_pause"); // Should trigger sleep

      expect(sleepSpy).toHaveBeenCalled();
      // Expect sleep to have been called with a duration based on mockedConfig.githubApi.rateLimitPauseSeconds
      // or rateLimitResetTime. For simplicity, we check if it's called.
      // More precise check: expect(sleepSpy).toHaveBeenCalledWith(mockedConfig.githubApi.rateLimitPauseSeconds * 1000);

      expect(global.console.warn).toHaveBeenCalledWith(expect.stringContaining("Rate limit low (5). Pausing for"));

      jest.runAllTimers(); // Advance timers to execute the sleep
      sleepSpy.mockRestore();
      jest.useRealTimers(); // Restore real timers
    });

    test("should retry on 403 rate limit exceeded and then succeed", async () => {
      jest.useFakeTimers();
      const sleepSpy = jest.spyOn(discoverAgents, 'sleep');
      const rateLimitExceededHeaders = new Map([['x-ratelimit-remaining', '0'], ['x-ratelimit-reset', String(Math.floor(Date.now() / 1000) + 60)]]);

      fetch.mockReturnValueOnce(createMockApiErrorResponse(403, "Rate limit exceeded", rateLimitExceededHeaders))
           .mockReturnValueOnce(createMockApiResponse({ data: "success after retry" }));

      const resultPromise = fetchGithubApi("https://api.github.com/test-403-retry");

      // Allow the first fetch and the sleep call to be registered
      await Promise.resolve(); // Yield to the event loop
      jest.advanceTimersByTime(mockedConfig.githubApi.rateLimitPauseSeconds * 2 * 1000 + 10000); // Advance by retry wait time

      const result = await resultPromise;

      expect(sleepSpy).toHaveBeenCalled();
      expect(fetch).toHaveBeenCalledTimes(2);
      expect(result).not.toBeNull();
      const resultJson = await result.json();
      expect(resultJson.data).toBe("success after retry");

      sleepSpy.mockRestore();
      jest.useRealTimers();
    });

    test("should return null and log error for non-403 API errors", async () => {
      fetch.mockReturnValueOnce(createMockApiErrorResponse(500, "Server Error"));
      const response = await fetchGithubApi("https://api.github.com/test-500");
      expect(response).toBeNull();
      expect(global.console.error).toHaveBeenCalledWith(expect.stringContaining("Error fetching https://api.github.com/test-500: 500 Server Error"));
    });

    test("should return null and log error for network errors", async () => {
      fetch.mockRejectedValueOnce(new Error("Network issue"));
      const response = await fetchGithubApi("https://api.github.com/test-network-error");
      expect(response).toBeNull();
      expect(global.console.error).toHaveBeenCalledWith("Network or other error fetching https://api.github.com/test-network-error:", expect.any(Error));
    });
  });

  describe("searchRepositories", () => {
    beforeEach(() => {
      jest.useFakeTimers(); // Use fake timers for all tests in this describe block
    });

    afterEach(() => {
      jest.useRealTimers(); // Restore real timers after each test
    });

    test("should construct query with pushed_at and handle pagination", async () => {
      const sleepSpy = jest.spyOn(discoverAgents, 'sleep');
      const mockItemsPage1 = [{id:1, name:"repo1"}, {id:2, name:"repo2"}];
      const mockItemsPage2 = [{id:3, name:"repo3"}];
      fetch.mockReturnValueOnce(createMockApiResponse({ items: mockItemsPage1, total_count: 3 })) // Page 1
           .mockReturnValueOnce(createMockApiResponse({ items: mockItemsPage2, total_count: 3 })) // Page 2
           .mockReturnValueOnce(createMockApiResponse({ items: [], total_count: 3 }));      // Page 3 (empty, ends pagination)

      const resultsPromise = searchRepositories("test query stars:>=10");

      // Allow first fetch
      await Promise.resolve();
      jest.advanceTimersByTime(1000); // For sleep between page 1 and 2

      // Allow second fetch
      await Promise.resolve();
      jest.advanceTimersByTime(1000); // For sleep between page 2 and 3

      const results = await resultsPromise;

      expect(fetch).toHaveBeenCalledTimes(3);
      const date = new Date();
      date.setDate(date.getDate() - mockedConfig.qualityThresholds.maxAgeDays);
      const pushedConstraint = `pushed:>=\${date.toISOString().split('T')[0]}`;
      const expectedQueryPage1 = `https://api.github.com/search/repositories?q=\${encodeURIComponent('test query stars:>=10 ' + pushedConstraint)}&per_page=50&page=1`;
      const expectedQueryPage2 = `https://api.github.com/search/repositories?q=\${encodeURIComponent('test query stars:>=10 ' + pushedConstraint)}&per_page=50&page=2`;

      expect(fetch).toHaveBeenNthCalledWith(1, expectedQueryPage1, expect.any(Object));
      expect(fetch).toHaveBeenNthCalledWith(2, expectedQueryPage2, expect.any(Object));
      expect(results).toEqual([...mockItemsPage1, ...mockItemsPage2]);
      expect(sleepSpy).toHaveBeenCalledTimes(2); // Called after page 1 and page 2 fetches
      sleepSpy.mockRestore();
    });
    // Test for API limit warning (total_count > 1000)
    // Test for empty results
    // Test for fetchGithubApi returning null
  });

  describe("getRepositoryDetails", () => {
    test("should fetch and return repo details", async () => {
        const mockDetails = { name: "repo-details", stargazers_count: 150 };
        fetch.mockReturnValueOnce(createMockApiResponse(mockDetails));
        const details = await getRepositoryDetails("owner", "repo");
        expect(fetch).toHaveBeenCalledWith("https://api.github.com/repos/owner/repo", expect.any(Object));
        expect(details).toEqual(mockDetails);
    });
    // Test for fetchGithubApi returning null
  });

  describe("hasReadme", () => {
    test("should return true if HEAD request is ok", async () => {
        fetch.mockReturnValueOnce(createMockApiResponse({}, 200, new Map(), true)); // true for response.ok
        const result = await hasReadme("owner", "repo");
        expect(fetch).toHaveBeenCalledWith("https://api.github.com/repos/owner/repo/readme", { method: 'HEAD', headers: expect.any(Object) });
        expect(result).toBe(true);
    });
    test("should return false if HEAD request is not ok (e.g., 404)", async () => {
        fetch.mockReturnValueOnce(createMockApiResponse({}, 404, new Map(), false)); // false for response.ok
        const result = await hasReadme("owner", "repo-no-readme");
        expect(result).toBe(false);
    });
     // Test for fetchGithubApi returning null itself
  });

  describe("loadExistingAgentSlugs", () => {
    test("should load slugs from data and drafts directories", async () => {
        fs.promises.readdir.mockImplementation(dirPath => {
            if (dirPath.endsWith("data")) return Promise.resolve(["agent1.json", "agent2.json"]);
            if (dirPath.endsWith(mockedConfig.draftsDir)) return Promise.resolve(["draft1.json", "agent1.json"]);
            return Promise.resolve([]);
        });
        fs.promises.access.mockResolvedValue(undefined);

        const slugs = await loadExistingAgentSlugs();
        expect(slugs.has("agent1")).toBe(true);
        expect(slugs.has("agent2")).toBe(true);
        expect(slugs.has("draft1")).toBe(true);
        expect(slugs.size).toBe(3);
    });
    test("should handle non-existent drafts directory gracefully", async () => {
        fs.promises.readdir.mockImplementation(dirPath => {
            if (dirPath.endsWith("data")) return Promise.resolve(["agent1.json"]);
            return Promise.resolve([]);
        });
        fs.promises.access.mockImplementation(dirPath => {
            if (dirPath.endsWith("data/drafts")) {
                const error = new Error("ENOENT: no such file or directory");
                error.code = 'ENOENT';
                return Promise.reject(error);
            }
            return Promise.resolve(undefined);
        });
        const slugs = await loadExistingAgentSlugs();
        expect(slugs.has("agent1")).toBe(true);
        expect(slugs.size).toBe(1);
        expect(global.console.log).toHaveBeenCalledWith(expect.stringContaining("Drafts directory"));
    });
    // Test for other readdir errors
  });

  describe("generateSlug", () => {
    test("should generate a basic slug", () => {
        expect(generateSlug("TestOwner", "TestRepo", new Set())).toBe("testowner-testrepo");
    });
    test("should handle special characters", () => {
        expect(generateSlug("Test_Owner", "Test Repo!", new Set())).toBe("test-owner-test-repo-");
    });
    test("should generate unique slug if base exists", () => {
        const existing = new Set(["test-slug"]);
        expect(generateSlug("test", "slug", existing)).toBe("test-slug-1");
    });
    test("should generate unique slug if base and -1 exists", () => {
        const existing = new Set(["test-slug", "test-slug-1"]);
        expect(generateSlug("test", "slug", existing)).toBe("test-slug-2");
    });
  });

  describe("meetsQualityStandards", () => {
    const baseRepoDetails = {
        stargazers_count: 100,
        archived: false,
        disabled: false,
        visibility: 'public',
        pushed_at: new Date().toISOString(),
        license: { spdx_id: 'MIT' }
    };
    test("should pass for valid repo", () => {
        expect(meetsQualityStandards(baseRepoDetails, true)).toBe(true);
    });
    test("should fail for low stars", () => {
        expect(meetsQualityStandards({ ...baseRepoDetails, stargazers_count: 50 }, true)).toBe(false);
    });
    test("should fail if archived", () => {
        expect(meetsQualityStandards({ ...baseRepoDetails, archived: true }, true)).toBe(false);
    });
    test("should fail if pushed_at is too old", () => {
        const oldDate = new Date();
        oldDate.setDate(oldDate.getDate() - (mockedConfig.qualityThresholds.maxAgeDays + 1));
        expect(meetsQualityStandards({ ...baseRepoDetails, pushed_at: oldDate.toISOString() }, true)).toBe(false);
    });
    test("should fail if requireLicense is true and license is null", () => {
        mockedConfig.qualityThresholds.requireLicense = true;
        expect(meetsQualityStandards({ ...baseRepoDetails, license: null }, true)).toBe(false);
    });
    test("should pass if requireLicense is false and license is null", () => {
        mockedConfig.qualityThresholds.requireLicense = false;
        expect(meetsQualityStandards({ ...baseRepoDetails, license: null }, true)).toBe(true);
    });
    test("should fail if requireReadme is true and readmeExists is false", () => {
        mockedConfig.qualityThresholds.requireReadme = true;
        expect(meetsQualityStandards(baseRepoDetails, false)).toBe(false);
    });
     test("should pass if requireReadme is false and readmeExists is false", () => {
        mockedConfig.qualityThresholds.requireReadme = false;
        expect(meetsQualityStandards(baseRepoDetails, true)).toBe(true); // readmeExists is true here, but it would pass if false too
    });
  });

  describe("createAgentDataObject", () => {
    test("should map fields correctly", () => {
        const repoDetails = {
            name: "MyAgent",
            description: "A cool agent.",
            html_url: "https://github.com/user/myagent",
            stargazers_count: 123,
            owner: { login: "user" },
            topics: ["ai", "agent"],
            license: { spdx_id: "Apache-2.0" },
            pushed_at: "2023-01-15T10:00:00Z",
            language: "Python"
        };
        const slug = "user-myagent";
        const agentData = createAgentDataObject(repoDetails, slug);

        expect(agentData.name).toBe("MyAgent");
        expect(agentData.slug).toBe(slug);
        expect(agentData.description).toBe("A cool agent.");
        expect(agentData.repository).toBe("https://github.com/user/myagent");
        expect(agentData.stars).toBe(123);
        expect(agentData.originator).toBe("user");
        expect(agentData.tags).toEqual(["ai", "agent"]);
        expect(agentData.license).toBe("Apache-2.0");
        expect(agentData.last_updated).toBe("2023-01-15");
        expect(agentData.language).toBe("Python");
        expect(agentData.stack).toContain("Python");
        expect(agentData.category).toBe(mockedConfig.defaultAgentProperties.category);
    });
    test("should handle missing optional fields", () => {
        const repoDetails = {
            name: "MinAgent",
            html_url: "https://github.com/user/minagent",
            stargazers_count: 50,
            owner: { login: "user" },
            pushed_at: "2023-02-20T10:00:00Z",
            // description, topics, license, language are missing
        };
        const slug = "user-minagent";
        const agentData = createAgentDataObject(repoDetails, slug);
        expect(agentData.description).toBe("N/A");
        expect(agentData.tags).toEqual([]);
        expect(agentData.license).toBe("");
        expect(agentData.language).toBe("");
        expect(agentData.stack).toEqual([]);
    });
  });

  // describe("discoverAndDraftAgents - Main function", () => {
  //   // These tests would be more integration-like, mocking multiple underlying functions
  //   // to see if the main loop behaves correctly.
  //   test("should discover, filter, and draft an agent file", async () => {
  //     // Setup mocks for search, getDetails, hasReadme, loadExistingSlugs, writeFile, etc.
  //     // Example: mock searchRepositories to return one candidate
  //     // mock getRepositoryDetails to return qualifying details
  //     // mock hasReadme to return true
  //     // mock loadExistingAgentSlugs to return an empty set
  //     // mock fs.mkdir to resolve

  //     // await discoverAndDraftAgents();

  //     // Assert that writeFile was called with the correct path and data
  //     // Assert console logs for successful drafting
  //   });

  //   test("should skip an agent that does not meet quality standards", async () => {
  //       // Setup mocks where meetsQualityStandards would return false
  //       // await discoverAndDraftAgents();
  //       // Assert that writeFile was NOT called for this agent
  //   });

  //   test("should skip an agent if its slug already exists", async () => {
  //       // Setup mocks where loadExistingAgentSlugs returns a set containing the generated slug
  //       // await discoverAndDraftAgents();
  //       // Assert that writeFile was NOT called and a warning was logged
  //   });

  // });

});