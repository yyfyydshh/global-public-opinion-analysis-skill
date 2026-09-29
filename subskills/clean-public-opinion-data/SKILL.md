---
name: clean-public-opinion-data
description: 把已获准采集的MCP批次规范化为Raw、Cleaned和Excluded记录，执行时间校验、URL规范化、去重、广告过滤、相关性与质量评分，并计算正式报告门槛。仅负责数据准备。
---

# 舆情数据清洗

## Mission

把获准采集结果转换为可供分析和Excel使用的 `prepared.json`，并给出可重复计算的门槛结果。

## When to use

采集完成一个或多个批次后使用；续采合并旧批次后重新使用。

阶段契约：前置=至少一个获准批次且状态为`previewed`；输入=范围、来源策略、清单、原始批次与查询日志；工具=`prepare_records.mjs`及字段规则，禁止MCP；输出=`prepared.json`与来源审计；成功=清洗和门槛可重复计算；退出=`gated`；返回=主编排器。

## Hard constraints

- 必须读取 `scope-decision.json`、`source-policy.json`、`run-manifest.json` 和全部原始批次；范围不是 `allowed` 或策略不一致时失败。
- 只提取适配后的 `webPages.value`。DataHub 跳转链接必须在采集阶段解析成真实原文 URL；不能解析的记录排除，不能以跳转域名计算来源。
- 保存标题、URL、片段、摘要、来源、发布时间、抓取时间、查询词和批次等上游实际字段。
- 执行时间校验、URL规范化、精确/近似去重、广告水贴过滤和主题相关性检查。
- 质量分由主题相关性40、内容证据20、来源可追溯性15、时效性15、独立性10构成；低于60不得进入Cleaned。
- 不为达到门槛降低阈值，不推测上游未返回字段。
- 门槛固定为100条有效记录、5个域名和2种来源类型；单平台仍需100条。
- 按来源地域表把每条记录分类为 `overseas`、`mainland_china` 或 `unknown`；未知不得计为海外。
- 复核每个海外批次的 `include` 和实际URL。缺少限定、使用越权域名、返回越权域名，或 DataHub 无法在上游执行域名 include 时标记 `source_policy_failed`；即使数量门槛通过也不得生成正式报告。
- DataHub 记录缺少可解析发布时间时排除，不能假定其落在请求时间窗内。不得把账单字段写入客户数据包。

## Core workflow

运行：

```powershell
node scripts/prepare_records.mjs --topic "<主题>" --input "<raw-batches.json>" --scope-decision "<scope-decision.json>" --manifest "<run-manifest.json>" --output "<prepared.json>" --window-days 30 --mode "<product_voc|event_reputation>"
```

读取字段字典和标签体系，只对Cleaned记录补充有证据的地区、语言、来源类型、情感、标签和模式专用字段。更新到 `cleaned`，完成门槛检查后进入 `gated`，校验产物并返回主编排器。

## Output format

`prepared.json` 固定包含 `metadata`、`raw`、`cleaned`、`excluded`、`query_log`、`summary` 和 `gate`。`metadata.source_audit` 必须展示海外、中国大陆、未知记录数、占比、域名数及策略合规状态；每条排除记录写明原因。

## Done criteria

- 范围决定、主题哈希和报告模式一致。
- 原始数等于有效数加排除数。
- Cleaned无重复URL、越界时间、低质量或敏感主题记录。
- 门槛统计可从Cleaned重新计算并一致。
- 来源审计可从Cleaned和Query Log重新计算；策略不合规时 `gate.passed=false`。
- 状态已推进到 `gated`。
