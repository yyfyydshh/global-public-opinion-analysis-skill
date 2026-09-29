---
name: render-public-opinion-html
description: 在证据化Markdown正式报告生成且客户明确接受后，把报告和prepared数据转换为自包含、响应式、带SVG图表、数据表、目录与证据链接的可视化HTML。只负责HTML渲染与视觉验证，不检索、不分析、不改写结论。
---

# 舆情可视化 HTML

## Mission

把已验证的正式 Markdown 报告转换为标准、直观、美观且可离线打开的 HTML，保持结论与证据不变。

## When to use

仅在正式门槛通过、Markdown与Excel已生成、状态为 `html_offered` 且客户明确接受时使用。客户拒绝、未回答或数据不足时不得使用。

阶段契约：前置=客户已接受且状态`html_offered`；输入=同任务正式Markdown与`prepared.json`；工具=`render_html_report.mjs`及本地视觉检查，禁止MCP；输出=自包含HTML；成功=内容一致、安全、图表与双端视觉检查通过；退出=`html_rendered`；返回=主编排器。

## Hard constraints

- 只使用正式 Markdown 和同一任务的 `prepared.json`；不得重新分析、改写结论或调用 MCP。
- HTML必须自包含：CSS和SVG内嵌，不加载远程脚本、字体、样式库、统计代码或追踪像素。
- 图形至少包含有数据支持的3项：情感、来源类型、TOP议题、时间趋势或来源域名；缺数据的图形显示“数据不足”，不补造。
- 使用内嵌SVG作为信息图形；不添加无来源照片、品牌Logo、人物照片或装饰性网络图片。
- 保留Markdown中的表格和真实证据链接；增加数据概览、TOP来源表和目录。
- HTML不得嵌入Raw、Cleaned或超过24条证据明细，不泄漏密钥、鉴权头、查询许可或内部状态。
- 页面必须响应式、可打印，正文宽度、颜色对比、表格滚动、标题层级和图形标签可读。

## Core workflow

运行：

```powershell
node scripts/render_html_report.mjs --markdown "<正式报告.md>" --prepared "<prepared.json>" --output "<主题>-全球新闻舆情可视化报告.html"
```

检查HTML结构、安全策略、标题、目录、摘要卡、图形、表格、证据链接和金额。使用本地浏览器分别按桌面与移动宽度渲染截图；通过后把状态推进到 `html_rendered` 并返回主编排器。

## Output format

文件名固定为 `<主题>-全球新闻舆情可视化报告.html`。页面依次包含标题区、数据概览、可视化仪表板、Markdown报告正文和证据附录。

## Done criteria

- 客户选择为接受，且输入Markdown与prepared属于同一主题。
- 至少3个真实数据图形、2个表格、目录和证据链接存在。
- 结论、数字、金额和证据URL与Markdown/prepared一致。
- HTML无外部依赖、脚本、密钥、原始数据堆砌或虚构图片。
- 桌面和移动截图无溢出、遮挡、断字或不可读图形。
- 状态为 `html_rendered`。
