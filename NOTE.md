总结一下最终的设计要点：
新脚本名称 (暂定): scripts/discover-agents.js
1. "高质量 AI Agent"标准:
GitHub Stars: >= 100
Pushed At: 最近 1 年内
必须有 README.md
必须有 LICENSE (通过 repo.license != null 初步判断)
archived == false, disabled == false, visibility == "public"
2. Agent 项目的发现来源:
主要：GitHub API (search/repositories)，查询条件来自配置文件。
次要 (TODO): Awesome Lists, ArXiv, Social Media.
3. 脚本核心工作流程:
阶段 1: 候选项目搜集与初步过滤
从配置文件加载 GitHub API 查询、门槛值。
执行搜索，去重，对照 data/ 中现有数据。
阶段 2: 详细元数据获取与"高质量"标准校验
获取仓库详情 (/repos/{owner}/{repo}) 和 README 信息 (/repos/{owner}/{repo}/readme)。
应用详细的"高质量"标准进行筛选。
阶段 3: Agent JSON 文件生成
自动填充字段:
name: repo.name
slug: repo.owner.login-repo.name (小写，特殊字符转 -, 确保唯一性，冲突加后缀)
description: repo.description (空则 "N/A")
repository: repo.html_url
stars: repo.stargazers_count
originator: repo.owner.login
tags: repo.topics
open_source: true
license: repo.license.spdx_id (若有效)
last_updated: repo.pushed_at (YYYY-MM-DD)
language: repo.language
部分自动/默认填充:
category: "experimental"
stack: 初始加入 repo.language，尝试从 topics 提取。
status: "alpha"
人工填充 (留空或默认): highlight, purpose, principle, reusability, limitations, useful_links, badge, security_grade, license_grade, quality_grade, platforms.
maintainer_verified: false
文件生成位置: data/drafts/
文件名: slug.json
阶段 4: 日志与报告
4. 技术与配置:
Node.js, node-fetch, fs.promises.
配置文件 (例如 scripts/config/discover-agents.config.js或 scripts/config/discover-agents.config.json) 存放：
GitHub API 查询列表
星标数、活跃度等门槛值
GitHub API Token 从 GITHUB_API_TOKEN 环境变量读取。
Rate Limiting 处理： 检查响应头 X-RateLimit-Remaining。如果接近0或遇到403，脚本将暂停一段时间（例如1分钟，或根据 X-RateLimit-Reset 头计算等待时间）并打印提示信息，然后尝试继续。如果持续失败，则中止并提示用户。
