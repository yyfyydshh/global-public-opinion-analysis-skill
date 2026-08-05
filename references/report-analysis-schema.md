# 正式报告结构化分析 JSON

正式门槛通过后，基于 `prepared.json.cleaned` 生成 `analysis.json`，再运行 Markdown 渲染器。JSON不得包含URL；只用 `record_id`，由渲染器解析真实链接。

## 通用规则

- `report_mode` 只能为 `product_voc` 或 `event_reputation`。
- 所有事实、判断、排行、策略和行动均使用 `evidence_ids: ["<record_id>"]`；单条原声使用 `evidence_id`。
- `quotes[].original` 必须逐字存在于对应记录的标题、片段或摘要；`quotes` 最多8条。
- 两种模式的顶层字段必须齐全。条件模块证据不足时用空数组，渲染器保留标题并说明不足。
- 禁止API Key、Authorization、占位语、虚构引文及 `raw_records`、`cleaned_records`、`all_records`、`raw_data` 等原始集合。
- 模块只保存形成决策所需的代表性分析，不逐条改写搜索结果。

## product_voc

必填顶层字段：

- `report_mode="product_voc"`
- `executive_summary`：`findings[]`（`title,finding,confidence,evidence_ids`）和 `priority_decision`（`finding,evidence_ids`）
- `limitations[]`
- `trend_insights[]`
- `dimensions[]`：`name,sample_count,finding,confidence,evidence_ids`
- `journey[]`：`stage,scenario,need,barrier,finding,evidence_ids`
- `pain_points[]`
- `strengths[]`：`name,manifestation,scenario,decision_value,finding,confidence,evidence_ids`
- `anomaly_signals[]`
- `competitors[]`：`name,quantitative,finding,evidence_ids`
- `pgc_ugc_gap[]`
- `opportunities[]`：`scenario,unmet_need,opportunity,validation,evidence_ids`
- `actions[]`：`priority,timeframe,owner,problem,action,metric,side_effect,evidence_ids`
- `quotes[]`：`original,translation,evidence_id`

## event_reputation

必填顶层字段：

- `report_mode="event_reputation"`
- `executive_summary`：`event_judgement`、`findings[]`、`priority_action`；判断项使用 `finding,evidence_ids`
- `limitations[]`
- `facts[]`：`fact_type,statement,evidence_grade,confidence,evidence_ids`
- `timeline[]`：`time,node,evidence_grade,impact,evidence_ids`
- `lifecycle`：`stage,finding,evidence_ids`
- `trend_peaks[]`
- `issues[]`：`name,finding,stance,emotion,emotion_target,demand,evidence_ids`
- `source_frames[]`、`stakeholders[]`、`rumors[]`
- `risk_assessment`：`level,rationale,confidence,evidence_gaps,escalation_signals,deescalation_signals,monitoring_priorities,evidence_ids`
- `scenarios[]`：`name,trigger,impact,response,evidence_ids`
- `actions[]`：`priority,timeframe,owner,problem,action,metric,side_effect,evidence_ids`
- `quotes[]`：`original,translation,evidence_id`

事件风险对象禁止 `score`、`total`、`points`、`分数`或`得分`字段。
