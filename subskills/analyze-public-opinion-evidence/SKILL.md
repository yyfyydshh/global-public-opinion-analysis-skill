---
name: analyze-public-opinion-evidence
description: 在正式门槛通过后逐条阅读Cleaned记录，按product_voc或event_reputation生成证据化结构分析JSON。只负责分析，不检索、不清洗、不渲染报告。
---

# 舆情证据分析

## Mission

生成通过证据ID校验的 `analysis.json`，供报告渲染器使用。

## When to use

仅在 `prepared.gate.passed=true`、运行状态为 `gated` 且范围决定为 `allowed` 时使用。

阶段契约：前置=正式门槛与来源策略通过；输入=`prepared.json`、报告模式和对应报告标准；工具=分析与证据校验逻辑，禁止MCP；输出=`analysis.json`；成功=必填模块和全部证据ID通过校验；退出=`analyzed`；返回=主编排器。

## Hard constraints

- 逐条阅读Cleaned的标题、片段、摘要、来源、时间和URL。
- 每项事实、数字、排行、案例、建议和行动引用真实 `record_id`。
- 分析JSON不得嵌入Raw、Cleaned或等价原始记录集合。
- 原声必须逐字存在于对应记录；外语可附中文翻译。
- 产品模式必须覆盖摘要、趋势、体验维度、场景、决策链、痛点、独立优势、异常、竞品、承诺体验差距、机会和行动。
- 优势最多5项，写明表现、场景、决策价值、置信度和证据；证据不足时使用空数组并保留缺口说明。
- 事件/品牌模式必须覆盖事实、时间线、生命周期、议题、立场、诉求、叙事、利益相关方、信息缺口、五级风险、情景和行动。
- 不分析政治军事主题，不输出数值风险分，不把网页数写成市场份额或人口意见。
- 必须读取 `metadata.source_audit`。海外有效来源不足2个域名时，不生成海外观点差异、国家差异或海外量化比较结论。
- `overseas_first` 只能表述为“海外信源优先检索（含全球补充）”，不得写成纯海外、全海外或海外为主。
- 原声最多8条；分析载荷各模块遵守摘要优先上限。

## Core workflow

1. 读取 `references/report-analysis-schema.md`。
2. 产品模式读取 `references/product-voc-report-standard.md`；事件模式读取 `references/event-reputation-report-standard.md`。
3. 从Cleaned生成结构化结论并登记证据ID。
4. 调用报告脚本的 `validateAnalysisPayload()` 预校验。
5. 保存 `analysis.json`，把状态推进到 `analyzed`，校验后返回主编排器。

## Output format

输出只包含模式、结构化摘要、各固定模块、行动、局限、原声和证据ID，不包含鉴权信息和原始记录集合。

## Done criteria

- 模式与prepared一致。
- 固定字段完整且没有占位语。
- 所有证据ID解析到Cleaned真实URL。
- 来源地域结论与来源审计一致，未知域名未计入海外。
- 产品优势或证据不足说明可渲染。
- 事件风险使用五级文字。
- 状态为 `analyzed`。
