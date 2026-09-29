---
name: build-public-opinion-workbook
description: 根据获准的prepared.json生成并验证全球新闻舆情Excel数据包，包含Summary、Raw、Cleaned、Excluded、Query Log和Dictionary六张工作表。只负责工作簿，不检索、不分析、不编写Markdown。
---

# 舆情 Excel 数据包

## Mission

生成可审计、可筛选、可追溯的六表 Excel 数据包，并完成公式和视觉检查。

## When to use

清洗完成后始终使用；正式门槛通过与否都生成Excel。

阶段契约：前置=`prepared.json`已校验；输入=prepared与字段字典；工具=`build_workbook.mjs`及渲染检查，禁止MCP；输出=六表Excel；成功=公式、关键区域、图表、布局与密钥扫描通过；返回=主编排器。

## Hard constraints

- 输入范围必须为 `allowed`，且prepared结构通过校验。
- 使用 `@oai/artifact-tool`，不使用其他工作簿写入库。
- 固定六张表：Summary、Raw、Cleaned、Excluded、Query Log、Dictionary。
- Raw保存上游实际字段；Cleaned保存有效记录和派生字段；Excluded保存原因。
- Summary展示时间窗、有效/排除数、域名、来源类型、来源策略、海外/中国大陆/未知记录数与占比、门槛、情感、来源、TOP问题和趋势。
- Cleaned保存 `source_region_class`；Query Log保存批次角色、来源策略和合规状态。
- 工作簿各表不展示账单、余额、额度、API Key或鉴权头。
- 公式、日期、数字保持可计算类型；URL使用普通可点击文本。

## Core workflow

读取字段字典并运行：

```powershell
node scripts/build_workbook.mjs --input "<prepared.json>" --output "<主题>-全球新闻舆情数据包.xlsx" --render-dir "<渲染目录>"
```

检查六张表、关键区域、公式错误、图表、列宽、换行、冻结窗格和密钥扫描；完成后返回主编排器，不改变分析结论。

## Output format

文件名固定为 `<主题>-全球新闻舆情数据包.xlsx`。完整记录和全部URL只在数据表中呈现，Summary保持管理视图。

## Done criteria

- 六张表存在且无默认空白表。
- Raw、Cleaned、Excluded数量与prepared一致。
- Summary门槛、覆盖、地域审计和金额一致。
- 公式错误扫描为零。
- 所有工作表完成视觉检查，没有裁切、重叠或空白图表。
- 工作簿不含密钥或鉴权头。
