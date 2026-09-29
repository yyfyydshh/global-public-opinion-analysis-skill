---
name: ensure-public-opinion-connector
description: 在舆情任务开始前检查 WorkBuddy 的 DataHub 连接器和四个必需工具；缺失时引导客户用自己的账号完成连接授权。只负责连接状态。
---

# DataHub MCP 连接器就绪检查

## Mission

在任何范围判断、查询生成或搜索前输出 `connector-readiness.json`。四个 DataHub 工具都可用且客户授权生效时状态才是 `ready`。

## When to use

每次新会话首次调用主 Skill 时执行；连接状态或工具列表变化时复检。

阶段契约：前置=新会话或连接状态待复检；输入=宿主工具列表与连接状态；工具=连接管理与 `connector_guard.mjs`，禁止搜索；输出=`connector-readiness.json`；成功=`ready`或已发出明确连接提示；返回=主编排器。

## Hard constraints

- 先于范围守卫和来源治理执行；配置文件存在不等于运行时工具已加载。
- 只有 `get_data_app_details`、`run_data_app`、`get_run_status`、`get_run_result` 全部可用且连接已认证，才可继续。
- 工具缺失时不得生成范围决定、运行清单、查询词、采集许可或任何 DataHub Run。
- WorkBuddy「连接器」负责客户账号授权。包内 `mcp.json` 仅定义服务地址与工具，不含凭证；不得向客户索取 API Key 或手动配置 Header。
- 客户回复“已连接”后仍须重新读取工具列表并复检，之后继续原任务。

## Core workflow

1. 读取当前宿主公开的工具名称，不运行 App。
2. 执行 `node scripts/connector_guard.mjs --available-tools "<工具名列表>" --connection-configured <true|false> --output "<运行目录>/connector-readiness.json"`。
3. `ready` 时保存并校验产物；否则检查 WorkBuddy「连接器」中的 DataHub 是否已连接。需要客户操作时明确提示“打开 WorkBuddy「连接器」，找到 DataHub，点击「连接」并使用您自己的账号完成授权；完成后回复‘已连接’。”客户完成后复检。

## Output format

`connector-readiness.json` 包含 `schema_version`、`server_id`、`status`、`can_proceed`、`required_tools`、`available_tools`、`missing_tools`、`next_action`、`customer_message` 和 `checked_at`；不得包含 Header 或密钥。

## Done criteria

- 四个必需工具均可用且 `can_proceed=true`；或已发送准确连接提示并停在门禁，没有任何搜索或下游产物。
