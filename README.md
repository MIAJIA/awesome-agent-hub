# 🧠 Awesome AI Agents Hub - Development Repository

This is the **development repository** for the Awesome AI Agents Hub project. It contains both the public-facing content and private development tools.

## 📁 Project Structure

```
awesome-agent-hub/
├── public/awesome-agent-hub/    # 🌍 PUBLIC VERSION (for community)
│   ├── README.md               # Community-facing documentation
│   ├── CONTRIBUTING.md         # Contribution guidelines
│   ├── schemas/               # JSON schema for validation
│   └── LICENSE                # MIT License
├── data/                      # 🔒 PRIVATE: Agent data files (845+ agents)
├── scripts/                   # 🔒 PRIVATE: Development automation tools
├── package.json              # 🔒 PRIVATE: Node.js dependencies
└── README.md                 # 🔒 PRIVATE: This development documentation
```

## 🌍 Public Version

**For community users and contributors**, please visit the public version:

📍 **Location**: [`public/awesome-agent-hub/`](./public/awesome-agent-hub/)

This contains:
- ✅ Clean, community-focused README
- ✅ Contribution guidelines
- ✅ JSON schema for validation
- ✅ 845+ featured AI agents by category
- ✅ MIT License

## 🔒 Private Development Tools

This development repository includes private automation tools:

### 📊 Data Management
- **845 agent JSON files** in `data/` directory
- **Agent validation** and schema compliance
- **Bulk operations** for field updates and migrations

### 🤖 AI-Powered Scripts
- **`promote-drafts.js`**: LLM-powered agent metadata enhancement using GPT-4o
- **`generate-featured-agents.js`**: Automatic README generation with categorized agents
- **`discover-agents.js`**: GitHub discovery and metadata extraction
- **`bulk-operations`**: Field removal, renaming, and data cleanup

### 🛠️ Development Utilities
- **JSON schema validation**
- **Git automation**
- **Category management**
- **Star count tracking**

## 🚀 Development Workflow

### For Maintainers

1. **Add new agents**: Use discovery scripts or manual entry in `data/`
2. **Process with AI**: Run `promote-drafts.js` for LLM enhancement
3. **Generate public content**: Run `generate-featured-agents.js`
4. **Update public version**: Copy updated content to `public/awesome-agent-hub/`
5. **Deploy**: Push public version to community-facing platforms

### Common Commands

```bash
# Install dependencies
npm install

# Validate all agent data
npm run validate-data

# Process draft agents with AI
npm run promote-drafts --count 5

# Generate featured agents README
npm run generate-featured-agents

# Discover new agents from GitHub
npm run fetch-github-meta
```

## 📈 Statistics

- **Total Agents**: 845+
- **Categories**: 20
- **Processing Pipeline**: AI-powered with GPT-4o
- **Validation**: JSON Schema + Custom Rules
- **Auto-generation**: Featured sections, categorization

## 🔧 Development Setup

```bash
# Clone repository
git clone https://github.com/MIAJIA/awesome-agent-hub.git
cd awesome-agent-hub

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Add your OpenAI API key for LLM processing

# Run validation
npm run validate-data
```

## 📝 Environment Variables

```bash
OPENAI_API_KEY=your_openai_api_key_here  # For AI processing
```

## 🌟 Features

### AI-Powered Processing
- **GPT-4o integration** for intelligent agent categorization
- **Automated field completion** (purpose, principle, limitations, highlights)
- **Smart category selection** avoiding "experimental" defaults
- **Repository analysis** for technology stack detection

### Data Pipeline
- **Schema validation** with strict JSON compliance
- **Bulk operations** for field management
- **Git integration** for version control
- **Automated README generation** with category grouping

### Quality Assurance
- **50+ star minimum** for all agents
- **Active maintenance** requirement checking
- **Duplicate detection** and cleanup
- **Category consistency** enforcement

## 📚 For Contributors

If you want to **contribute an agent**, please use the public version:

👉 **[Go to Public Version](./public/awesome-agent-hub/)**

The public version contains:
- Simple contribution guidelines
- Schema documentation
- Community-focused README
- Clear submission process

## ❤️ Maintained by

**Mia Jia** [@miajia](https://github.com/miajia)

**Development Team**: Internal automation and AI processing tools
**Community**: Public contributions via [`public/awesome-agent-hub/`](./public/awesome-agent-hub/)

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

*Development tools are for internal use. Public content is available under MIT license.*