---
name: govern-public-opinion-sources
description: 把用户对全球、海外优先或仅限海外信源的要求转换为锁定的来源策略、三批循环和已验证域名限制，并审核批次与来源合规。仅负责来源治理，不调用MCP、不清洗内容、不分析或写报告。
---

# 舆情来源治理

## Mission

生成同一任务唯一的 `source-policy.json`，把“海外优先”从自然语言偏好转换成采集与报告必须通过的确定性契约。

## When to use

范围检查为 `allowed` 后、初始化 `run-manifest.json` 前执行。新任务必须执行；续采读取并继承原策略，不重新推断。

阶段契约：前置=范围决定为`allowed`；输入=用户来源要求与地域表；工具=`source_policy.mjs`，禁止MCP；输出=锁定的`source-policy.json`；成功=模式、域名与批次循环校验通过；返回=主编排器。

## Hard constraints

- 将“优先海外、海外优先、国外媒体优先、国际媒体优先”映射为 `overseas_first`。
- 将“只看海外、仅限海外、不要国内、排除中国大陆”映射为 `overseas_only`；其他任务使用 `global`。
- `overseas_first` 的批次循环固定为 `overseas → overseas → global_fallback`；指定数量和续采均按累计批次继续循环。
- 海外限定批次只能使用 `references/source-region-policy.json` 中 `verified_data` 且允许海外检索的域名。
- 未知域名不得计为海外；中国大陆以外计为海外，港澳台计入海外。
- 来源策略创建后锁定。用户明确切换策略时创建新任务，不混用旧批次。
- 本 Skill 不拥有MCP工具，不承诺海外数据最终占多数。

## Core workflow

运行：

```powershell
node scripts/source_policy.mjs resolve --request-text "<用户完整来源要求>" --mode "<auto|global|overseas_first|overseas_only>" --output "<source-policy.json>"
```

校验输出并返回主编排器；由主编排器初始化 `run-manifest.json` 并登记完整 `source_policy`。本阶段不得直接启动采集。

## Output format

`source-policy.json` 固定包含 `schema_version`、`policy_version`、`mode`、`overseas_definition`、`batch_cycle`、`verified_overseas_domains` 和 `locked`。

## Done criteria

- 策略模式与用户要求一致且已锁定。
- 海外域名来自已验证允许表，未知或国内域名未混入。
- 批次循环可由任意正整数批次号重复计算。
- `run-manifest.json` 已登记 `source_policy` 和 `source-policy.json` 产物。
