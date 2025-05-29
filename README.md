# 🧠 Awesome AI Agents Hub

A curated list of high-quality, reusable AI agents and tools that can act autonomously or semi-autonomously in specific domains like commerce, education, productivity, and more.

---

## 🧭 Categories

- 🛒 **Commerce & Checkout**
- 💳 **Payment & Finance**
- 🎓 **Education**
- ⚙️ **Productivity**
- 🤖 **Agent Frameworks & Toolkits**
- 🧪 **Experimental / Research**

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
    - `purpose` (string): The primary purpose or goal of the agent.
    - `repository` (string, required, format: uri): The GitHub (or other VCS) link to the agent's source code.
    - `stars` (integer, required, minimum: 50): The number of stars the repository has.
    - `category` (string, required, enum: `commerce`, `payment`, `productivity`, `education`, `infra`, `meta`, `experimental`): The primary category the agent belongs to.
    - `originator` (string): The original creator or organization behind the agent.
    - `principle` (string): Core principles or design philosophy of the agent.
    - `stack` (array of strings): Key technologies or frameworks used (e.g., "LangChain", "Puppeteer", "GPT-4").
    - `tags` (array of strings): Relevant keywords or tags (e.g., "checkout", "open-source", "research").
    - `reusability` (string): Notes on how the agent can be reused (e.g., "LangChain compatible", "Standalone API").
    - `limitations` (string): Known limitations or important considerations.
    - `status` (string, enum: `alpha`, `beta`, `production`): The development status of the agent.
    - `open_source` (boolean): Whether the agent is open source.
    - `license` (string): The license under which the agent is distributed (e.g., "MIT", "Apache 2.0").
    - `demo_links` (array of strings, format: uri): Links to live demos or examples.
    - `badge` (string, enum: `official`, `community`, `experimental`): A badge to display, if applicable.
    - `security_grade` (string, enum: `A`, `B`, `C`): Self-assessed security grade.
    - `license_grade` (string, enum: `A`, `B`, `C`): Self-assessed license clarity/permissiveness.
    - `quality_grade` (string, enum: `A`, `B`, `C`): Self-assessed overall quality.
    - `last_updated` (string, format: date): The date the agent entry was last updated (YYYY-MM-DD).
    - `language` (string): Primary programming language.
    - `platforms` (array of strings): Supported platforms (e.g., "Web", "iOS", "CLI").
    - `maintainer_verified` (boolean): Whether the maintainer of this list has verified the entry.

---

## 🌟 Available Categories

This project uses the following categories to classify AI agents. When contributing, please select the most appropriate primary category for your agent from this list. This helps maintain consistency and improves discoverability.

1.  **Commerce**: E-commerce agents for shopping, checkout, recommendation, etc.
2.  **Payment & Finance**: Agents for payments, transfers, financial planning.
3.  **Productivity**: Tools to increase efficiency, summarize, organize tasks.
4.  **Education**: AI tutors, learning aids, academic tools.
5.  **Infra Tools**: Agent infrastructure such as memory, browser, APIs.
6.  **Meta Agents**: Agents that orchestrate or manage other agents.
7.  **Writing**: Tools focused on content generation and editing.
8.  **Research and Analysis**: Agents that gather, analyze or report information.
9.  **Lifestyle**: Assistants for life tasks, wellness, hobbies, etc.
10. **Programming**: Code generation, analysis, or AI coding assistants.
11. **Art**: Agents used in visual arts, music, creative design.
12. **IoT**: Interfaces with physical devices or embedded systems.
13. **Data Visualization**: Charts, dashboards, visual summaries.
14. **Finance**: Analysis and management of financial data. *(Note: This seems to overlap with "Payment & Finance". Consider clarifying or merging if they represent the same scope. For now, both are included as provided.)*
15. **Social Media**: Tools for creating, managing, or automating social presence.
16. **Gaming**: Agents for games, game development, or NPCs.
17. **Workflow Automation**: Automate repetitive digital workflows.
18. **Marketing**: Market analysis, campaign automation, sales assistance.
19. **Communication**: Enhancing or automating messaging and collaboration.

---

## ❤️ Maintained by

Mia Jia [@miajia](https://github.com/miajia)
Contributions welcome!
