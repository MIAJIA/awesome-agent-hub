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

## ❤️ Maintained by

Mia Jia [@miajia](https://github.com/miajia)
Contributions welcome!
