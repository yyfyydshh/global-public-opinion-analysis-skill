---
name: global-public-opinion-analysis
description: Collect, clean, and analyze global brand, product, and event reputation signals using a configured read-only search MCP. Use for product VOC, launch feedback, competitor perception, recalls, customer complaints, or commercial reputation monitoring that needs evidence-linked Markdown, Excel, or self-contained HTML reports.
---

# Global Public Opinion Analysis

Create traceable market-intelligence deliverables from public web evidence. This skill is platform-agnostic: configure a compatible MCP connector before collection; this repository contains no credentials.

## Workflow

1. Confirm the topic, time range, desired record count, and source policy. Default to 30 days, three batches, and global coverage. Use `overseas_first` or `overseas_only` only when requested.
2. Verify that the configured connector exposes read-only equivalents of `list_platforms` and `search_platform_content`. Stop before collection if it is unavailable.
3. Screen out political, geopolitical, military, weapons, or intelligence topics with `scripts/scope_guard.mjs`. Do not collect for blocked topics.
4. Create and lock the source policy, then initialize a run manifest with `scripts/source_policy.mjs` and `scripts/run_contract.mjs`.
5. Collect in batches. Before every search, create a collection permit with `scripts/collection_guard.mjs`. Keep the original URLs, query context, and timestamps.
6. Show a small preview after the first useful batch, then clean and deduplicate records with `scripts/prepare_records.mjs`. Keep excluded records and reasons.
7. Produce a formal report only when the evidence gate passes: at least 100 valid records, five domains, and two source types. Otherwise deliver the data package, coverage gaps, and a continuation option.
8. Generate the evidence analysis and Markdown report with `scripts/generate_report.mjs`, then create the workbook with `scripts/build_workbook.mjs`. Generate HTML only when requested, using `scripts/render_html_report.mjs`.

## Guardrails

- Treat every claim as evidence-linked: preserve `record_id` and URL for each fact, metric, example, and recommendation.
- Never include credentials, authorization headers, or account balances in artifacts, logs, reports, or spreadsheets.
- Do not claim whole-web coverage, market share, or population sentiment from the collected sample.
- Do not invent quotes, sources, dates, or social metrics. Mark uncertainty and insufficient evidence explicitly.
- Keep raw, cleaned, excluded, query-log, and report artifacts separate. Do not expose raw collections in the narrative report.
- Use `references/product-voc-report-standard.md` for product-focused work and `references/event-reputation-report-standard.md` for brand or event reputation work. Use `references/report-analysis-schema.md` for the analysis payload.

## Deliverables

Create a run directory containing:

- `scope-decision.json`, `source-policy.json`, `run-manifest.json`, and `query-log.json`
- `prepared.json`, including raw, cleaned, excluded, source-audit, and gate results
- `analysis.json` and an evidence-linked Markdown report when the gate passes
- An Excel workbook with Summary, Raw, Cleaned, Excluded, Query Log, and Dictionary sheets
- An optional self-contained HTML report with no remote scripts, trackers, or external assets

## Connector configuration

Copy `mcp.example.json` into the configuration location required by your MCP host. Set the environment variable it references locally or through your secret manager. Do not commit a populated connection file.
