---
name: screen-public-opinion-scope
description: 在任何全球新闻舆情检索前判断主题是否属于允许的产品、品牌、企业或普通社会事件范围，并阻止政治人物、政党选举、主权地缘、战争军队、武器部署、作战和情报主题。仅由八爪鱼全球新闻舆情主编排 Skill 调用。
---

# 舆情检索范围守卫

## Mission

在搜索前输出唯一的 `scope-decision.json`。允许任务进入采集；敏感任务进入终态 `scope_blocked`。

## When to use

每个新任务、续采主题发生变化、别名或查询意图明显变化时使用。不得在首次 MCP 调用后补做。

阶段契约：前置=连接器已就绪；输入=用户主题、别名与真实目的；工具=`scope_guard.mjs`，禁止MCP；输出=`scope-decision.json`；成功=`allowed`或终态`scope_blocked`；返回=主编排器。

## Hard constraints

- 阻止政治人物、政党、选举、政权、主权地缘、战争、军队、武器、军事部署、作战和情报主题。
- 允许产品口碑、品牌声誉、召回、消费者保护、商业诉讼、企业监管和非政治军事社会事件。
- “企业监管处罚”“军工级防摔”等商业语境不因单个词自动拦截。
- 同时执行语义判断和 `scripts/scope_guard.mjs` 确定性检查；任一层判断为敏感即阻止。
- 被阻止时不生成扩展关键词，不调用 MCP，不计算费用；文件中不保存完整主题，只保存哈希、分类和原因码。
- 不得为了获取更多数据把敏感主题改写成看似商业的查询。

## Core workflow

1. 读取用户主题、别名和真实分析目的。
2. 语义判断核心对象与目的是否属于敏感范围。
3. 运行：

```powershell
node scripts/scope_guard.mjs --topic "<主题>" --semantic-decision "<allowed|blocked>" --output "<运行目录>/scope-decision.json"
```

4. 检查 `semantic_decision`、`decision`、`search_allowed`、`topic_hash` 和 `reason_codes`。
5. `blocked` 时返回边界说明；`allowed` 时保存并校验决定。两种结果均返回主编排器，不直接启动下游阶段。

## Output format

允许结果包含 `semantic_decision=allowed`、`decision=allowed`、原主题、主题哈希、决定ID和时间。阻止结果包含语义判断、`decision=blocked`、主题哈希、敏感分类、原因码和替代商业主题，不包含完整主题。

## Done criteria

- 决定文件通过 Schema 校验。
- 允许主题没有敏感命中。
- 阻止主题没有查询许可、批次或费用。
- 同一主题的后续采集能够校验主题哈希和决定ID。
