# 🤝 Contributing to Awesome AI Agents Hub

Thank you for your interest in contributing to the Awesome AI Agents Hub! This guide will help you understand how to add your AI agent to our curated list.

## ✅ Requirements

Before submitting your agent, please ensure it meets these criteria:

- **GitHub Stars**: Minimum 50 stars ⭐
- **Active Maintenance**: Recent commits and active development
- **Clear Documentation**: Well-documented repository with README
- **Working Project**: The agent should be functional, not just a concept

## 📝 Submission Process

### 1. Fork and Star
- Fork this repository
- Give it a star ⭐ to show your support

### 2. Create Your Agent Entry

Create a new JSON file following this structure:

```json
{
  "name": "Your Agent Name",
  "slug": "your-agent-name",
  "description": "Brief description of what your agent does",
  "highlight": "Key standout feature that makes it unique",
  "purpose": "What problem does it solve?",
  "repository": "https://github.com/username/repo",
  "stars": 123,
  "category": "productivity",
  "originator": "Your Name/Organization",
  "principle": "How it works technically",
  "stack": ["Python", "OpenAI", "LangChain"],
  "tags": ["automation", "ai", "productivity"],
  "reusability": "How others can use/integrate it",
  "limitations": "Known constraints or issues",
  "status": "beta",
  "open_source": true,
  "license": "MIT",
  "useful_links": [
    "https://demo.example.com",
    "https://docs.example.com"
  ],
  "last_updated": "2024-12-20",
  "language": "Python",
  "platforms": ["Web", "CLI"]
}
```

### 3. Choose the Right Category

Select the most appropriate category for your agent:

- **commerce**: E-commerce, shopping, sales
- **payment**: Payment processing, transactions
- **finance**: Financial analysis, trading, investment
- **productivity**: Task management, efficiency tools
- **education**: Learning, tutoring, academic tools
- **infra-tools**: Developer tools, APIs, infrastructure
- **meta-agents**: Agent orchestration, multi-agent systems
- **writing**: Content generation, editing, copywriting
- **research-and-analysis**: Data analysis, research, reporting
- **lifestyle**: Personal assistants, wellness, hobbies
- **programming**: Code generation, development tools
- **art**: Creative tools, music, visual arts
- **iot**: Hardware integration, embedded systems
- **data-visualization**: Charts, dashboards, visual analytics
- **social-media**: Social platform automation, content creation
- **gaming**: Game development, NPCs, game AI
- **workflow-automation**: Business process automation
- **marketing**: Marketing automation, SEO, campaigns
- **communication**: Chat, collaboration, messaging
- **experimental**: Research projects, proof-of-concepts

### 4. Validate Your Entry

Ensure your JSON entry validates against our schema:
- Check the `schemas/agent.schema.json` file for complete field definitions
- Required fields: `name`, `slug`, `description`, `repository`, `stars`, `category`
- Use kebab-case for the `slug` field (e.g., "my-awesome-agent")

### 5. Submit Pull Request

- Create a pull request with your new agent entry
- Use a descriptive title: "Add [Agent Name] - [Brief Description]"
- Include a brief description of your agent in the PR description
- Mention which category you've chosen and why

## 📋 Field Guidelines

### Required Fields

- **name**: Human-readable project name
- **slug**: URL-safe identifier (kebab-case)
- **description**: 1-2 sentence summary
- **repository**: GitHub repository URL
- **stars**: Current star count (minimum 50)
- **category**: One of our predefined categories

### Recommended Fields

- **highlight**: What makes your agent special?
- **purpose**: What problem does it solve?
- **principle**: How does it work?
- **limitations**: Be honest about constraints
- **useful_links**: Demos, docs, tutorials
- **stack**: Key technologies used

## 🔍 Review Process

1. **Automated Checks**: We validate JSON format and schema compliance
2. **Manual Review**: Maintainers review for quality and fit
3. **Feedback**: We may request changes or clarifications
4. **Merge**: Approved entries are merged and featured

## 💡 Tips for Success

- **Be Honest**: Accurately represent your agent's capabilities and limitations
- **Stay Updated**: Keep your star count and information current
- **Quality Over Quantity**: Focus on making your agent description clear and compelling
- **Category Fit**: Choose the most specific category that applies
- **Documentation**: Ensure your repository has good documentation

## ❌ What We Don't Accept

- Agents with fewer than 50 stars
- Abandoned or unmaintained projects
- Duplicate entries
- Commercial advertisements without substantial open-source component
- Agents that don't actually work or are just concepts

## 🆘 Need Help?

- Check existing entries for examples
- Review the schema file for field definitions
- Open an issue if you have questions
- Follow our code of conduct in all interactions

## 📈 After Acceptance

Once your agent is accepted:
- It will appear in our featured agents section
- Monitor your repository for increased interest
- Keep your entry updated with significant changes
- Consider contributing to other aspects of the project

---

Thank you for contributing to the AI agent community! 🚀
