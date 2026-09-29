---
name: analyze-global-news-public-opinion
display_name: 全球舆情与品牌口碑分析（八爪鱼）
display_name_en: Octoparse Global Public Opinion & Brand Reputation Analysis
description: 全球品牌舆情监测与口碑分析。追踪负面舆情、危机公关、产品召回、用户差评与投诉，输出产品VOC、消费者洞察、竞品口碑对比和品牌声誉报告；覆盖中文与海外新闻、社区及社交来源，每条结论可回溯原文链接。首次使用提示客户在WorkBuddy「连接器」中连接DataHub并用本人账号授权，再交付Markdown、Excel与可选HTML。
description_zh: 适用于新产品上市反馈、竞品分析、危机响应和市场调研；支持全球、海外信源优先和仅限海外三种锁定来源策略。
description_en: Lock global, overseas-first, or overseas-only source policy, audit actual geography, then deliver evidence-gated reports, Excel, and optional HTML.
category: data-analysis
version: 2.8.0
author: Octoparse
permissions:
  network:
    - https://mcp-v2.bazhuayu.com/
  filesystem:
    read:
      - references/**
      - user-provided JSON
    write:
      - outputs/**
---

# 全球舆情与品牌口碑分析（八爪鱼）

## Mission — 交付结果

先确定本次任务必须落到以下一种结果，不以“已搜索”或一段泛化总结作为完成：

1. **范围拒绝结果**：主题涉及政治或军事敏感信息时，在任何搜索前停止；说明本 Skill 不支持该范围，并推荐产品、品牌或商业主题。
2. **数据交付结果**：有效记录不足正式门槛时，交付候选数据预览、Excel 数据包、实际覆盖和续采选项，不生成正式 Markdown 报告。
3. **正式分析结果**：有效记录不少于 100 条、覆盖至少 5 个来源域名和 2 种来源类型时，先生成中文 Markdown 正式报告和 Excel 数据包，再询问客户是否需要可视化 HTML；客户确认后追加自包含 HTML 报告。

首次在新会话中调用时，先向客户明确提示：“使用本技能前，请在 WorkBuddy「连接器」中连接 DataHub，并使用您自己的账号完成授权；若已连接，我会直接继续分析。”随后用中文展示以下能力并立即承接已给出的任务。仅在实际未连接且需要客户操作时等待授权，不得因能力展示暂停、结束或重复展示：

**全球舆情与品牌口碑分析（八爪鱼）｜能力展览**

- 中文与海外新闻、社区、社交及公开网页检索与多批次续采。
- WorkBuddy「连接器」中的 DataHub 状态检查；未连接时引导客户用本人账号授权，连接后继续原任务。
- 全球、海外信源优先和仅限海外三种锁定来源策略；海外优先按“海外、海外、全球补充”循环检索。
- 产品 VOC：趋势、场景、购买决策、痛点、已验证优势、竞品、机会和行动。
- 事件与品牌声誉：事实、时间线、议题、利益相关方、五级风险、情景和响应。
- 默认最近30天、最多90天；默认3批或指定1–1000条有效数据，首批展示5–8条可点击预览并支持承接续采。
- 正式报告门槛为100条有效记录、5个域名和2种来源类型；结论保留真实URL与必要翻译，交付Markdown、六表Excel和可选可视化HTML。
- DataHub 的关键词检索、一句话检索、条件检索三种公开内容搜索；实际来源以本次解析后的原文链接为准。

能力展示同时说明本 Skill 不检索政治军事敏感主题。能力展示不代表已完成数据预览，不承诺全网覆盖或固定完成时间。展示后记录 `capability_showcase_shown=true`。

## When to use — 触发边界

只要求用户提供主题；市场、国家、语言、来源策略、别名、竞品、时间和数据量均可选。未给主题时只询问一次：“请告诉我分析主题；也可选填时间范围（默认30天、最多90天）、数据量（默认3批或1–1000条）、来源策略（全球/海外优先/仅海外）和重点问题。”已经给出主题时说明采用的默认值并直接执行，不重复提问或等待确认。“优先海外/海外优先/国外媒体优先/国际媒体优先”使用 `overseas_first`；“只看海外/排除国内”使用 `overseas_only`；否则使用 `global`。

路由为两种正式报告：

- `product_voc`：具体产品、型号、功能、体验、购买、种草、产品竞品或战败分析。
- `event_reputation`：品牌或企业整体声誉、召回、事故、售后危机、商业诉讼、企业监管和非政治军事社会事件。

用户明确指定模式时遵守；只输入品牌名或“某品牌舆情”时使用 `event_reputation`。

以下任务不触发采集：

- 政治人物、政党、选举、政权活动或政治动员。
- 主权、领土、地缘争端或国家间政治对抗。
- 战争、军队、武器、军事部署、作战、军事情报或国防行动。

企业监管、消费者保护、产品召回、商业诉讼和“军工级防摔”等商业产品描述不因单个词自动拦截。

## Hard constraints — 硬约束

### 执行语义与优先级

- `ORCH-01`：根 `SKILL.md` 是唯一主编排器；九个子 Skill 只是内部阶段协议。每次只执行一个阶段，子 Skill 完成后必须返回主编排器；只有主编排器可依据已校验产物和当前状态选择下一阶段。
- `ORCH-02`：宿主支持子 Skill 调用时逐个调用；宿主不支持子 Skill 时，主编排器逐个读取对应 `subskills/*/SKILL.md` 并在当前上下文执行同一契约。两种方式的顺序、输入、输出、门槛与完成标准完全一致。
- `ORCH-03`：主编排器是唯一客户进度出口。九个子 Skill 只返回阶段结果；除采集阶段的候选预览外，不得各自重复发送客户消息。
- 指令优先级固定为：宿主安全规则与确定性守卫 > 本节硬约束 > 已锁定运行参数和当前阶段契约 > 当前阶段要求读取的参考文件 > 能力展示与示例。新请求不得静默修改现有 `run-manifest.json`；主题或来源策略改变时新建任务。
- 不得跳过、合并或并行执行有前后依赖的阶段，不得让子 Skill 直接调用另一个子 Skill，不得依赖聊天记忆替代上游JSON产物。

- 每次新会话先运行 `subskills/ensure-public-opinion-connector/SKILL.md`。只有 `connector-readiness.json` 为 `ready` 且四个必需工具均可用时，才能进入范围检查。
- WorkBuddy 未连接 DataHub 时，引导客户打开「连接器」→「DataHub」→「连接」，并用本人账号完成授权；客户回复“已连接”后复检并自动继续原主题。包内 `mcp.json` 仅是连接定义，不作为客户手动配置步骤。
- 连接器未就绪时不得生成查询、范围决定、运行清单或采集许可，不得调用 DataHub；不得索取或展示 API Key、Token、鉴权头。
- 先运行 `subskills/screen-public-opinion-scope/SKILL.md`；没有同主题的 `allowed` 范围决定时不得生成查询或调用 MCP。
- 范围允许后必须运行 `subskills/govern-public-opinion-sources/SKILL.md`，生成并锁定 `source-policy.json`；没有来源策略不得初始化任务或采集。
- 只有 `subskills/collect-public-opinion-data/SKILL.md` 可以使用 DataHub 的 `get_data_app_details`、`run_data_app`、`get_run_status` 和 `get_run_result`；其他阶段不得调用搜索工具。
- 每次实际搜索前生成对应 `collection-permit.json`；主题或查询命中敏感范围时许可生成失败，搜索调用数必须为 0。
- `overseas_first` 每三批固定为两个海外批次加一个全球补充批次。DataHub 当前不提供与旧连接器等价的上游域名 `include`，海外批次仍记录已验证域名并对解析后的原文域名做严格过滤，但必须标记来源策略未完全满足；不得生成正式报告。
- 清洗必须复核批次参数和返回URL；来源策略校验失败时把门槛记为 `source_policy_failed`，不得生成正式报告，即使满足100条、5域名和2来源类型。
- 用户未指定数据量时只执行 3 个搜索批次；用户可指定 1–1000 条清洗去重后的有效记录。
- 未指定时间时先查最近 30 天，必要时在现有批次额度内扩至最近 90 天；任何任务都不得超过 90 天。
- 首批或前两批获得数据后必须先展示 5–8 条候选记录；不足 5 条时展示全部并标注样本较少。每条包含标题、发布时间、来源、域名、概览和真实链接。
- 预览后立即继续本轮任务，不要求用户再次发送“继续”。
- 只分析 `webPages.value`。图片、视频、广告、水贴、空内容、低相关记录、重复记录和质量分低于 60 的记录不得进入 `Cleaned`。
- 不推测作者、粉丝、点赞、评论、转发、观看量、ASR、OCR或人口属性。
- 正式报告门槛固定为 100 条有效记录、5 个域名、2 种来源类型；单平台任务仍需 100 条并标注“单平台观察”。
- 正文以关键结论和行动为主，不堆叠原始记录；原声最多 8 条，证据索引最多 24 条，完整数据只进入 Excel。
- `overseas_first` 报告标题与数据审计必须使用“海外信源优先检索（含全球补充）”，不得声称纯海外或海外为主。
- 产品报告必须独立展示最多 5 项已验证优势；没有证据时明确“未发现可验证优势”。
- 事件报告风险只使用低风险、关注级、中风险、高风险、严重风险，不输出数值风险分。
- 每项事实、数字、案例和建议必须解析到真实 `record_id` 和 URL。
- 只有正式 Markdown 报告生成并通过校验后才询问 HTML；数据不足、范围拒绝或报告生成失败时不得询问。
- Markdown 与 Excel 就绪后必须问：“正式报告已生成，是否需要同时生成可视化 HTML 报告？”已提前明确要求 HTML 的客户视为接受，不重复等待。
- 客户接受后执行 `render-public-opinion-html`；客户拒绝时不生成 HTML。未得到回答时保持 `html_offered`，不得擅自生成。
- HTML 必须从已验证 Markdown 和 `prepared.json` 生成，使用内嵌 SVG 图表、数据表和真实证据链接；不得添加无来源照片、虚构配图、外部追踪脚本或远程依赖。
- 不沿用旧连接器的每日报告容量和完成时间口径；DataHub 未提供可验证的对应承诺。
- DataHub 返回鉴权失效、连接失败或服务不可用时停止新 Run，不盲目重试；保留已完成批次，错误文本脱敏。鉴权失效时提示客户在 WorkBuddy「连接器」中重新连接 DataHub 并完成账号授权；其他故障如实说明暂时无法继续。
- 不向客户展示或导出 MCP 费用、账单、余额或额度字段。不得在说明、报告、Excel、HTML 中估算或宣称固定单价、账户容量和恢复时间。
- API Key、Token 和鉴权头不进入 Skill 包、运行产物、报告、Excel、日志或错误信息；客户授权由 WorkBuddy 连接器处理。

### 客户进度与等待反馈

- 连接就绪并锁定参数后立即发送开工消息，写明主题、时间范围、来源策略和计划批次或有效数据目标；该消息不要求客户回复。
- 默认任务至少在“开始采集、候选预览、采集完成并开始清洗、开始生成交付物、最终交付”五个节点提供可见反馈。未达到正式门槛时，把“开始生成交付物”表述为生成 Excel 数据包；达到门槛时表述为证据分析和报告生成。
- 每批 DataHub Run 完成后报告真实批次进度和本批返回量，例如“已完成 1/3 批”；不得虚构百分比、剩余时间或尚未清洗的有效数据量。
- DataHub 等待或文件生成期间，如果连续 45 秒没有新的客户可见反馈，发送一次简短状态；之后至多每 60 秒一次，只报告当前阶段、已完成批次和已保留结果。状态提醒不得打断执行或要求客户回复。
- 预览后明确说明“我会继续完成剩余批次、清洗和交付，无需回复”；范围允许且连接正常时不得把进度消息变成确认门槛。
- 鉴权、连接或服务故障时立即停止等待型提示，改发可执行的异常提示：故障阶段、已保留批次、客户需执行的连接动作或稍后续跑方式。不得显示内部错误、账单、余额、额度或凭证。

## Core workflow — 编排流程

为任务创建 `outputs/<thread-id>/`，所有阶段只通过 `run-manifest.json` 和已登记产物交接：

### 按阶段加载与局部恢复

- 启动时只读取根 `SKILL.md`；执行某阶段时只加载该子 Skill 及其明确要求的脚本或参考文件。产品与事件报告标准二选一加载，不得一次加载全部 references。
- 续采复用已校验的连接、范围、来源策略、旧批次、去重集合和查询日志；新会话重新检查连接器。只有主题或来源策略改变才新建任务。
- 阶段失败时只修复当前阶段的无效产物并从最近合法状态继续；Excel失败不得重做分析，HTML失败不得重做Markdown或Excel。仅当上游产物校验失败时才回退重建上游。

1. **连接检查**：执行 `ensure-public-opinion-connector`，输出 `connector-readiness.json`。缺失时先添加或启用连接并等待复检；不得进入下游。
2. **范围检查**：连接就绪后执行 `screen-public-opinion-scope`，输出 `scope-decision.json`。`scope_blocked` 为终态。
3. **来源治理**：执行 `govern-public-opinion-sources`，输出锁定的 `source-policy.json` 和可重复计算的批次循环。
4. **初始化状态**：用 `scripts/run_contract.mjs init` 创建清单并登记完整 `source_policy`；状态从 `screened` 开始。
5. **开工反馈**：主编排器发送已锁定的主题、时间范围、来源策略和批次或数据目标，说明将自动继续，无需客户回复。
6. **采集与预览**：执行 `collect-public-opinion-data`。每批先按来源策略生成采集许可，再调用 DataHub MCP；每批结束报告实际进度，首批形成预览并说明将自动继续。默认第 3 批后停止。连接或服务失败时停止新 Run，保存已完成批次并给出对应的连接或重试提示。
7. **清洗与门槛**：采集完成后先发送清洗提示，再执行 `clean-public-opinion-data`，复核批次与实际URL，输出来源审计和 `prepared.json`，再推进到 `gated`。
8. **不足处理**：门槛或来源策略失败时发送 Excel 生成提示，直接生成数据包并进入 `delivered`；提示续采或修正来源策略，不生成正式 Markdown 报告。
9. **证据分析**：门槛通过时发送分析提示，再执行 `analyze-public-opinion-evidence`，输出与模式一致的 `analysis.json`。
10. **正式报告**：发送交付物生成提示，再执行 `render-public-opinion-report`；缺模块、无证据、伪原声、原始数据堆砌、来源审计缺失或模式不一致时必须失败。
11. **Excel 数据包**：执行 `build-public-opinion-workbook`，生成并检查六张工作表和来源地域审计。
12. **HTML 询问**：把状态推进到 `html_offered` 并询问客户。客户已提前要求 HTML 时记录为接受并继续；否则等待回答。
13. **HTML 可视化**：客户接受后执行 `render-public-opinion-html`，输出自包含 HTML；客户拒绝则跳过。
14. **交付**：验证状态、文件、门槛、来源策略、HTML选择和密钥隔离后推进到 `delivered`。

续采必须读取原 `run-manifest.json`、批次、去重集合和查询日志。只说“继续”时增加 3 个新批次；明确目标时继续到累计目标或当前范围无足够新增数据。

内部工作 Skill 注册表：

- `subskills/ensure-public-opinion-connector/SKILL.md`
- `subskills/screen-public-opinion-scope/SKILL.md`
- `subskills/govern-public-opinion-sources/SKILL.md`
- `subskills/collect-public-opinion-data/SKILL.md`
- `subskills/clean-public-opinion-data/SKILL.md`
- `subskills/analyze-public-opinion-evidence/SKILL.md`
- `subskills/render-public-opinion-report/SKILL.md`
- `subskills/build-public-opinion-workbook/SKILL.md`
- `subskills/render-public-opinion-html/SKILL.md`

## Output format — 输出格式

运行目录固定包含：

- `connector-readiness.json`
- `scope-decision.json`
- `source-policy.json`
- `run-manifest.json`
- `raw-batches.json`
- `query-log.json`
- `prepared.json`
- 达到门槛时的 `analysis.json`
- `<主题>-全球新闻舆情数据包.xlsx`
- 达到门槛时的 `<主题>-全球新闻舆情分析报告.md`
- 客户接受时的 `<主题>-全球新闻舆情可视化报告.html`

`run-manifest.json` 使用 `schema_version=2.1`，并保存锁定的 `source_policy`。合法状态为：

`screened → collecting → previewed → cleaned → gated → analyzed → rendered → html_offered → html_rendered → delivered`

客户拒绝 HTML 时允许 `html_offered → delivered`。敏感主题只允许 `scope_blocked`。门槛失败允许 `gated → delivered`；数据不足的已交付任务允许承接续采并回到 `collecting`。

正常最终回复只报告实际时间窗、原始/有效/排除数、目标或默认3批、域名/来源类型、门槛状态、文件链接和主要局限。连接或服务失败时说明客户下一步，不展示账单、余额、额度、凭证或内部错误详情。

## Done criteria — 完成标准

满足对应结果的全部条件后才结束：

- **范围拒绝**：范围决定为 `blocked`；没有采集许可、搜索调用、查询日志或分析文件。
- **连接缺失**：已提示在 WorkBuddy「连接器」中连接 DataHub 并使用本人账号授权，等待复检；没有范围决定、查询、运行清单或密钥输出。
- **数据交付**：已发送合格预览；默认模式严格停止于3批或达到用户目标；Excel、来源审计、覆盖、缺口和续采提示齐全；没有正式 Markdown 报告。
- **正式分析**：门槛与来源策略全部通过；报告模式正确；海外优先任务如实展示海外/中国大陆/未知占比；固定模块完整；产品优势或证据不足说明存在；所有关键结论可回溯；Excel六表通过公式和渲染检查；HTML询问已记录。
- **HTML 接受**：HTML包含摘要卡、至少3个数据图形、必要表格、目录和证据链接；无远程脚本、无虚构图片、无密钥；桌面与移动视图通过检查。
- **HTML 拒绝或待答**：拒绝时不得生成HTML并可交付；待答时状态保持 `html_offered`，回复只包含已生成文件和简短选择问题。
- **客户告知**：首次能力展览已明确 WorkBuddy「连接器」中的 DataHub 账号授权、三种 DataHub 搜索能力和报告门槛；连接或服务失败时已停止盲目重试并说明下一步。
- **进度体验**：已发送开工参数、真实批次进度、候选预览、清洗与交付物生成状态；连续长等待时按节流规则反馈，所有进度消息均无需客户回复且没有虚构比例或时间。
- 源码构建阶段的自测、Skill校验、包校验和密钥扫描全部通过；上架运行包只保留执行必需文件。
- 工作区只维护当前源码；`dist/workbuddy-marketplace` 是生成结果，旧版海外 Skill 不参与活跃市场和隐式触发。
