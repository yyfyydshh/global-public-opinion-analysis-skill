import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";

export const CONNECTOR_READINESS_SCHEMA_VERSION = "1.0";
export const CONNECTOR_SERVER_ID = "public-opinion-search";
export const REQUIRED_CONNECTOR_TOOLS = Object.freeze([
  "list_platforms",
  "search_platform_content",
]);

export function normalizeAvailableTools(value) {
  const values = Array.isArray(value) ? value : String(value ?? "").split(/[\s,|]+/u);
  return [...new Set(values.map((item) => String(item).trim()).filter(Boolean))].sort();
}

export function assessConnectorReadiness({ availableTools = [], connectionConfigured = false } = {}) {
  const available = normalizeAvailableTools(availableTools);
  const missing = REQUIRED_CONNECTOR_TOOLS.filter((tool) => !available.includes(tool));
  const ready = missing.length === 0;

  return {
    schema_version: CONNECTOR_READINESS_SCHEMA_VERSION,
    server_id: CONNECTOR_SERVER_ID,
    status: ready ? "ready" : connectionConfigured ? "connector_disabled" : "connector_missing",
    can_proceed: ready,
    required_tools: [...REQUIRED_CONNECTOR_TOOLS],
    available_tools: available,
    missing_tools: missing,
    next_action: ready ? "continue" : connectionConfigured ? "enable_connection" : "configure_connection",
    customer_message: ready
      ? "The public-opinion search connector is ready."
      : "Configure or enable a read-only public-opinion MCP connector with list_platforms and search_platform_content before collecting data.",
    checked_at: new Date().toISOString(),
  };
}

export function assertConnectorReady(readiness) {
  if (
    readiness?.schema_version !== CONNECTOR_READINESS_SCHEMA_VERSION ||
    readiness?.server_id !== CONNECTOR_SERVER_ID ||
    readiness?.status !== "ready" ||
    readiness?.can_proceed !== true ||
    !Array.isArray(readiness?.missing_tools) ||
    readiness.missing_tools.length !== 0
  ) {
    throw new Error("connector_not_ready: configure a compatible read-only MCP connector before continuing");
  }
  return readiness;
}

if (process.argv[1] && fileURLToPath(import.meta.url).toLowerCase() === process.argv[1].toLowerCase()) {
  const args = Object.fromEntries(
    process.argv.slice(2).reduce((pairs, token, index, argv) => {
      if (!token.startsWith("--")) return pairs;
      const key = token.slice(2);
      const next = argv[index + 1];
      pairs.push([key, next && !next.startsWith("--") ? next : true]);
      return pairs;
    }, []),
  );
  const readiness = assessConnectorReadiness({
    availableTools: args["available-tools"] === true ? "" : args["available-tools"] ?? "",
    connectionConfigured: String(args["connection-configured"] ?? "false").toLowerCase() === "true",
  });
  if (args.output && args.output !== true) await fs.writeFile(String(args.output), `${JSON.stringify(readiness, null, 2)}\n`, "utf8");
  console.log(JSON.stringify(readiness));
}
