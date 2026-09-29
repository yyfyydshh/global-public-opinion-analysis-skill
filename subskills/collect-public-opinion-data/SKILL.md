---
name: collect-public-opinion-data
description: 在范围守卫允许后使用三个指定 DataHub App 检索公开内容、解析原文链接、展示候选预览并记录批次与查询日志。仅负责采集，不清洗、不分析、不生成报告。
allowed-tools: get_data_app_details run_data_app get_run_status get_run_result
---

# 舆情数据采集

## Mission

产出可审计的 `raw-batches.json`、`query-log.json` 和客户可见的首批预览，把运行状态推进到 `previewed`。

## When to use

只在主编排器提供 `status=ready` 的 `connector-readiness.json`、同主题且 `decision=allowed` 的 `scope-decision.json`、锁定的 `source-policy.json` 后使用。新任务和获准续采均使用。

阶段契约：前置=连接就绪、范围允许、来源策略锁定且状态允许采集；输入=三个门禁JSON与`run-manifest.json`；工具=四个DataHub工具和采集守卫；输出=`raw-batches.json`、`query-log.json`、许可与预览；成功=达到本轮停止条件或连接/服务故障已安全停止；退出=`previewed`；返回=主编排器。

## Hard constraints

- 本 Skill 是唯一可以运行 DataHub App 的内部 Skill。固定 App ID：关键词检索 `app_ce135270dd97`、一句话检索 `app_75e95cb205ca`、条件检索 `app_d0b3c5d95406`。不得静默换成其他 App。
- 每次新会话先对所用 App 调用 `get_data_app_details` 复核输入契约和 `accepting_runs`，再调用 `run_data_app`。
- 每次搜索前运行 `scripts/collection_guard.mjs`；许可必须对应实际主题、查询、批次、来源策略，只使用一次。
- `overseas_first` 继续按海外、海外、全球补充循环；`overseas_only` 每批均为海外。海外批次保留已验证域名清单并解析原始 URL 后筛选。DataHub 不支持上游域名 include，这些批次一律记来源策略未完全满足，正式报告门槛失败；不得声称已实现旧接口的预检索域名限制。
- 默认严格执行 3 批。指定目标为 1–1000 条清洗去重后的有效记录时，逐批续采直至达到目标或无足够新增数据。
- 未指定时间时使用最近 30 天，必要时在已有批次额度内放宽到最多 90 天。关键词 App 传 `freshness`、`page=1`、`pageSize=50`；一句话和条件 App 传 `count=50`、`freshness`。条件 App 始终传 `include_summary=true`。
- 查询探索用一句话检索；明确必须词、排除词、地域时用条件检索；需要精确短语和分页时用关键词检索。条件检索过严返回 0 条时，在现有批次额度内放宽 `must` 或地域条件并记录原因，不把 0 条伪装成采集成功。
- 终态为 `SUCCEEDED` 或 `PARTIALLY_SUCCEEDED` 才取结果。`QUEUED`/`RUNNING` 使用不超过 30 秒的有界 `get_run_status` 等待，仍未终态时把当前状态返回主编排器，由主编排器按 45/60 秒节流规则反馈后继续；不得高频轮询。超过 50 条用 `get_run_result` 分页取全。保存 Run ID、App ID、实际输入、终态和记录数；账单字段不进入客户交付物。
- DataHub 返回的 `url.sz.dataduoduo.com` 是跳转链接，必须解析到首个原文地址；解析失败的记录不得进入 Cleaned 或作为证据。不得用跳转域名做来源地域、域名数或来源类型判断。
- 首批或前两批先展示 5–8 条候选记录；不足 5 条展示全部并注明样本较少。每条包含标题、时间、来源、原文域名、概览和真实链接。随后继续执行本轮任务。
- 每批终态后把批次序号、计划批次数、本批返回量、累计原始量和下一阶段返回主编排器；不得把原始量称为有效量。候选预览末尾注明将自动继续，无需客户回复。
- 仅将标题、摘要、发布时间和真实 URL 写入适配后的 `webPages.value`；不推测互动量、作者或正文。图片和视频不计样本。
- 鉴权失效、连接失败或服务不可用时停止新 Run，不盲目重试；查询日志记录脱敏的故障类型，保留已完成批次。鉴权失效引导客户回到 WorkBuddy「连接器」重新授权 DataHub。

## Core workflow

1. 读取门禁 JSON、运行清单、来源策略和 App 手册；生成 8–12 组差异化候选查询。
2. 每批运行采集许可：

```powershell
node scripts/collection_guard.mjs --connector-readiness "<connector-readiness.json>" --scope "<scope-decision.json>" --manifest "<run-manifest.json>" --topic "<主题>" --query "<实际查询>" --batch-number "<累计批次号>" --include "<海外批次已验证域名或空>" --output "<collection-permit.json>"
```

3. 用选定 App ID 和满足手册的 `input` 调用 `run_data_app`。同步 App 最多等待 30 秒；若未终态，用最长 30 秒的有界状态检查继续，向主编排器返回可见进度所需的真实状态。完整取回分页并保存无密钥 Run JSON。
4. 用 `scripts/adapt_datahub_run.mjs` 将终态 Run、许可、App ID 和输入 JSON 转为旧清洗器接受的批次结构；合并进 `raw-batches.json`。适配器只解析原文链接，不改写标题或摘要。
5. 保存 `query-log.json` 和预览；达到停止条件后校验产物并返回主编排器。

## Output format

- `raw-batches.json`：逐批保存适配后的 `webPages.value`、App ID、Run ID、来源策略与查询参数。
- `query-log.json`：批次号、角色、查询、时间范围、App ID、Run ID、返回量、状态和已脱敏错误。
- `collection-permit.json`：当前查询的临时单次许可，不进入客户报告。
- 对话中的 5–8 条候选预览与继续清洗提示。
- 返回主编排器的批次进度：已完成/计划批次、本批返回量、累计原始量、当前 Run 状态和下一步；不含账单或凭证。

## Done criteria

- 每个 Run 对应一个有效许可和一条查询日志。
- 连接缺失、范围拒绝或敏感查询时 Run 数为 0。
- 默认任务没有第 4 批，海外优先批次角色顺序正确。
- 预览及批次使用解析后的真实 URL；无法解析的跳转链接不进入 Cleaned。
- 长等待采用有界状态检查，主编排器获得足够信息发送节流进度；没有虚构完成比例、有效数据量或剩余时间。
- 连接或服务失败时没有后续盲目重试，已有数据可承接，凭证未进入任何产物。
