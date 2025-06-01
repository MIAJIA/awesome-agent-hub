# 项目计划 (Project Plan)

## 标签过滤功能实现计划

**目标：** 在每个已展示的分类下，提供基于标签的筛选功能，允许用户点击一个或多个标签，以仅显示该分类下同时拥有所有被选中标签的代理项目。

**实现位置：** 主要在 `ai-agent-hub-web/components/featured-agents.tsx` 组件中进行前端实现。

**详细步骤：**

1.  **状态管理**：
    *   `tagsPerCategory`: 使用 `useMemo` 计算并存储每个分类下的不重复标签列表。
        *   数据结构: `Record<string, string[]>` (例如：`{ "productivity": ["task management", "automation"], "finance": ["trading", "analysis"] }`)。
        *   生成时机: 当主要的代理数据 (`agentsByCategory`) 加载或更新时，一次性计算并填充此对象。
    *   `selectedFilterTags`: 使用 `useState` 创建状态，用于存储用户在各个分类下选中的标签。
        *   数据结构: `Record<string, string[]>` (例如：`{ "productivity": ["task management"], "finance": [] }`)。
        *   初始化: 当 `agentsByCategory` 加载时，为每个分类名初始化一个空数组 `[]` 作为其值。

2.  **计算并存储每个分类的唯一标签**：
    *   在 `useEffect` 钩子中（依赖 `agentsByCategory`）执行此逻辑。
    *   遍历 `agentsByCategory`，为每个分类收集其下所有代理的 `tags`，去重后存入 `tagsPerCategory` 的对应分类键中。
    *   同时，基于 `agentsByCategory` 的键来初始化 `selectedFilterTags`，确保每个分类都有一个空的选中标签数组。

3.  **渲染各分类下的标签列表**：
    *   在 `featured-agents.tsx` 中渲染每个分类区块时，于分类标题后、代理列表前，根据 `tagsPerCategory[categoryName]` 渲染可点击的标签按钮。
    *   标签按钮的视觉样式应能反映其是否被选中（即是否存在于 `selectedFilterTags[categoryName]` 中）。

4.  **处理标签点击事件** (`handleTagClick(categoryName: string, clickedTag: string)`)：
    *   获取 `selectedFilterTags[categoryName]` 作为当前分类的已选标签列表。
    *   如果 `clickedTag` 已在列表中，则移除它（取消选中）；否则，添加它（选中）。
    *   使用函数式更新方式更新 `selectedFilterTags` 状态，只修改对应 `categoryName` 的条目。

5.  **筛选并显示代理项目**：
    *   在为特定 `categoryName` 渲染代理列表时：
        *   获取该分类的原始代理列表 (`agentsByCategory[categoryName]`) 和已选过滤标签 (`selectedFilterTags[categoryName]`)。
        *   如果已选过滤标签为空，则显示所有原始代理。
        *   否则，筛选原始代理列表，只保留那些 `agent.tags` 数组中包含**所有**已选过滤标签的代理项目。
        *   渲染筛选后的代理列表。

## 搜索功能实现计划

### UI/UX 设计

*   **搜索框位置**: 将搜索框放置在 `ai-agent-hub-web/components/hero-section.tsx` 组件中（使用之前被注释掉的搜索框位置）。
*   **结果展示**: 用户输入搜索词后，直接在主页（`ai-agent-hub-web/components/featured-agents.tsx`）上筛选并更新现有的代理列表，无需跳转到新的结果页面。

### 后端 API 设计 (`ai-agent-hub-web/app/api/search/route.ts`)

*   **目标**: 实现一个灵活且性能可接受的后端搜索 API，避免在实时搜索路径中直接调用 LLM，以保证低延迟和低成本。
*   **输入**: API 接收一个名为 `q` (query) 的 URL 查询参数，代表用户的搜索输入。
*   **数据源**: API 将从 `ai-agent-hub-web/data/` 目录中读取所有 AI 代理的 JSON 文件。
*   **核心搜索逻辑**:
    1.  **用户输入处理 (Tokenization)**:
        *   获取用户输入的搜索查询字符串（例如："支付处理代理"）。
        *   将其转换为小写。
        *   将查询字符串分割成单独的搜索词（Token），例如：`["支付", "处理", "代理"]`。
    2.  **代理信息字段匹配**:
        *   对于 `data/` 目录中的每一个代理 JSON 文件：
            *   提取用于搜索的关键文本字段，包括：
                *   `name` (代理名称)
                *   `description` (代理描述)
                *   `tags` (标签，如果是数组，则将其元素合并为一个字符串)
                *   从 `repository_url` 中提取的仓库名称。
            *   将这些提取出的文本字段内容全部转换为小写。
    3.  **匹配算法**:
        *   判断用户输入的所有搜索词（Token）是否都作为子字符串出现在该代理的关键文本字段（合并后的小写版本）中。
        *   例如，如果一个代理的描述中包含 "此代理用于处理支付流程..."，并且用户的搜索是 "支付 处理"，则该代理匹配。
        *   （可选增强）未来可以考虑为不同字段的匹配设置不同的权重（例如，名称匹配的权重高于描述匹配）。
*   **输出**: API 返回一个 JSON 数组，其中包含所有匹配搜索条件的代理对象。如果查询为空，可以考虑返回所有代理或一个空数组（待定）。

### 前端集成

1.  **Hero Section (`ai-agent-hub-web/components/hero-section.tsx`)**:
    *   取消注释或重新添加之前设计的搜索输入框。
    *   确保搜索框的状态能被父组件或全局状态管理捕获。
2.  **Featured Agents (`ai-agent-hub-web/components/featured-agents.tsx`)**:
    *   引入新的状态变量来管理：
        *   `searchQuery` (字符串): 存储用户当前的搜索输入。
        *   `displayedAgents` (数组): 存储当前页面需要展示的代理列表（初始为所有代理，搜索后为过滤结果）。
    *   实现一个带有防抖 (debounce) 功能的函数：
        *   当 `searchQuery` 发生变化时（用户输入），该函数将被触发。
        *   此函数将调用后端 `/api/search` API，并传递当前的 `searchQuery`。
    *   根据 API 返回的结果更新 `displayedAgents` 状态。
    *   如果 `searchQuery` 为空，则 `displayedAgents`应重置为显示所有代理。

### 未来可能的增强 (不在此阶段实现)

*   **使用 LLM 进行离线标签/关键词生成**:
    *   创建一个脚本，利用 LLM 读取每个代理的描述信息，自动生成一组更丰富、更语义相关的关键词或标签。
    *   将这些由 LLM 生成的关键词补充到现有的 JSON 文件中，或存入一个独立的搜索索引文件。
    *   这样，实时的搜索 API 就可以利用这些增强的关键词进行搜索，从而在不牺牲实时性能的前提下提升搜索结果的相关性。
*   **构建简单索引**: 当代理数量非常多，导致实时遍历 JSON 文件出现性能瓶颈时，可以考虑构建一个倒排索引来加速搜索。
*   **集成专业搜索引擎**: 对于更大规模或需要更高级搜索功能（如模糊搜索、拼写纠错、自定义排序等）的场景，可以考虑集成如 Algolia、Typesense 等专业搜索引擎。