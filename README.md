# 🧠 Awesome AI Agents Hub

A curated list of high-quality, reusable AI agents and tools that can act autonomously or semi-autonomously in specific domains like commerce, education, productivity, and more.

---

## 🧭 Categories

This project uses the following categories to classify AI agents. When contributing, please select the most appropriate primary category for your agent from this list. This helps maintain consistency and improves discoverability.

1. **Commerce**: E-commerce agents for shopping, checkout, recommendation, etc.
2. **Payment**: Agents for payment processing, transfers, and transaction handling.
3. **Finance**: Agents for financial analysis, planning, and investment management.
4. **Productivity**: Tools to increase efficiency, summarize, organize tasks.
5. **Education**: AI tutors, learning aids, academic tools.
6. **Infra Tools**: Agent infrastructure such as memory, browser, APIs.
7. **Meta Agents**: Agents that orchestrate or manage other agents.
8. **Writing**: Tools focused on content generation and editing.
9. **Research and Analysis**: Agents that gather, analyze or report information.
10. **Lifestyle**: Assistants for life tasks, wellness, hobbies, etc.
11. **Programming**: Code generation, analysis, or AI coding assistants.
12. **Art**: Agents used in visual arts, music, creative design.
13. **IoT**: Interfaces with physical devices or embedded systems.
14. **Data Visualization**: Charts, dashboards, visual summaries.
15. **Social Media**: Tools for creating, managing, or automating social presence.
16. **Gaming**: Agents for games, game development, or NPCs.
17. **Workflow Automation**: Automate repetitive digital workflows.
18. **Marketing**: Market analysis, campaign automation, sales assistance.
19. **Communication**: Enhancing or automating messaging and collaboration.

---

## 📦 Featured Agents

### 🛒 Commerce

- **[ShopGPT](https://github.com/user/shopgpt)**
  🟊 150+ stars
  A GPT-powered shopping assistant that can browse and compare products, optimized for Amazon & eBay.
  ✅ Reusable as a LangChain agent
  ⚠️ Currently limited to English-only sites

- **[AutoCheckout Agent](https://github.com/user/autocheckout-agent)**
  🟊 75 stars
  Automates checkout flows using Puppeteer + GPT + Stripe API.
  ✅ Built-in Stripe Vault integration
  🚧 Limited support for Captcha-based flows

...

---

## 🛠️ How to Contribute

1. Fork and star the repo ⭐
2. Submit a PR with a new agent entry in the `data/` directory (e.g., `data/your-agent-slug.json`).
3. Ensure your JSON entry validates against the `schemas/agent.schema.json`.
4. The JSON entry should include the following fields:
    - `name` (string, required): The display name of the agent.
    - `slug` (string, required, pattern: `^[a-z0-9-]+$`): A unique identifier for the agent, used as the filename.
    - `description` (string, required): A brief description of the agent.
    - `highlight` (string): Key standout feature, differentiator, or notable capability that makes this agent unique.
    - `purpose` (string): The primary purpose or goal of the agent.
    - `repository` (string, required, format: uri): The GitHub (or other VCS) link to the agent's source code.
    - `stars` (integer, required, minimum: 50): The number of stars the repository has.
    - `category` (string, required, enum: `commerce`, `payment`, `finance`, `productivity`, `education`, `infra-tools`, `meta-agents`, `writing`, `research-and-analysis`, `lifestyle`, `programming`, `art`, `iot`, `data-visualization`, `social-media`, `gaming`, `workflow-automation`, `marketing`, `communication`, `experimental`): The primary category the agent belongs to.
    - `originator` (string): The original creator or organization behind the agent.
    - `principle` (string): Core principles or design philosophy of the agent.
    - `stack` (array of strings): Key technologies or frameworks used (e.g., "LangChain", "Puppeteer", "GPT-4").
    - `tags` (array of strings): Relevant keywords or tags (e.g., "checkout", "open-source", "research").
    - `reusability` (string): Notes on how the agent can be reused (e.g., "LangChain compatible", "Standalone API").
    - `limitations` (string): Known limitations or important considerations.
    - `status` (string, enum: `alpha`, `beta`, `production`): The development status of the agent.
    - `open_source` (boolean): Whether the agent is open source.
    - `license` (string): The license under which the agent is distributed (e.g., "MIT", "Apache 2.0").
    - `useful_links` (array of strings, format: uri): Important repository links including demos, documentation, tutorials, live applications, API docs, community resources, or other valuable references.
    - `badge` (string, enum: `official`, `community`, `experimental`): A badge to display, if applicable.
    - `security_grade` (string, enum: `A`, `B`, `C`): Self-assessed security grade.
    - `license_grade` (string, enum: `A`, `B`, `C`): Self-assessed license clarity/permissiveness.
    - `quality_grade` (string, enum: `A`, `B`, `C`): Self-assessed overall quality.
    - `last_updated` (string, format: date): The date the agent entry was last updated (YYYY-MM-DD).
    - `language` (string): Primary programming language.
    - `platforms` (array of strings): Supported platforms (e.g., "Web", "iOS", "CLI").
    - `maintainer_verified` (boolean): Whether the maintainer of this list has verified the entry.

---

## ❤️ Maintained by

Mia Jia [@miajia](https://github.com/miajia)
Contributions welcome!
