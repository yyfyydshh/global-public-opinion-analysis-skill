---
name: render-public-opinion-report
description: 校验证据化analysis.json并渲染总结优先的产品VOC或事件与品牌声誉中文Markdown正式报告。只负责正式报告验证和渲染，不检索、不分析、不生成Excel。
---

# 舆情正式报告渲染

## Mission

把已验证的 `analysis.json` 渲染成可交付 Markdown，并拒绝不完整、无证据或堆叠原始数据的报告。

## When to use

仅在范围允许、正式门槛通过、状态为 `analyzed` 时使用。数据不足说明和预览不得调用本 Skill。

阶段契约：前置=状态`analyzed`且分析证据有效；输入=`prepared.json`、`analysis.json`与唯一对应报告标准；工具=`generate_report.mjs`，禁止MCP；输出=正式Markdown报告；成功=结构、证据、篇幅、来源审计与密钥扫描通过；退出=`rendered`；返回=主编排器。

## Hard constraints

- 产品和事件报告只能二选一。
- 管理层/执行摘要先给关键判断、优先级和下一步。
- 产品报告包含独立的已验证优势模块。
- 事件报告风险只输出五级文字，说明依据、置信度、缺口、升级和降低条件。
- 固定模块缺失时失败；条件模块证据不足时保留标题并说明缺口。
- 正文不逐条复制Raw或Cleaned；原声最多8条，证据索引最多24条。
- 未知证据ID、伪原声、占位语、模式不一致、无门槛竞品量化和无双侧证据的PGC/UGC差距必须失败。
- 报告不展示 MCP 账单、余额或费用估算。
- 数据审计必须展示海外、中国大陆和未知来源的记录数、占比和域名数。
- `overseas_first` 报告标题固定使用“海外信源优先检索（含全球补充）”；不得声称纯海外或海外为主。
- 来源策略未通过时拒绝渲染；海外来源不足2个域名时省略海外观点差异量化结论并说明证据不足。

## Core workflow

运行：

```powershell
node scripts/generate_report.mjs --input "<prepared.json>" --analysis "<analysis.json>" --output "<主题>-全球新闻舆情分析报告.md"
```

对输出执行占位语、密钥、证据链接、固定标题和篇幅检查，把状态推进到 `rendered`，然后返回主编排器。

## Output format

文件名固定为 `<主题>-全球新闻舆情分析报告.md`。标题和元信息明确报告类型、来源策略、时间窗、样本覆盖、地域占比和门槛。

## Done criteria

- 报告类型正确，固定模块完整。
- 关键判断和行动可解析到真实URL。
- 来源策略合规，地域统计可从Cleaned重新计算。
- 正文没有原始数据堆砌、无效证据、敏感主题分析、占位语或密钥。
- 状态为 `rendered`。
