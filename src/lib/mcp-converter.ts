import type {
  EditorType,
  UniversalConfig,
  UniversalMcpServer,
  ClaudeDesktopConfig,
  CursorConfig,
  VSCodeConfig,
  OpenCodeConfig,
  GeminiCliConfig,
  LMStudioConfig,
  AntigravityConfig,
  JunieConfig,
  RooCodeConfig,
  CopilotCliConfig,
  ContinueDevConfig,
  CodexCliConfig,
  ClineConfig,
} from './mcp-formats';
import YAML from 'yaml';
import * as TOML from '@iarna/toml';

// Parse any format to universal format
export function parseToUniversal(config: unknown, sourceFormat: EditorType): UniversalConfig {
  const servers: UniversalMcpServer[] = [];

  switch (sourceFormat) {
    case 'claude-desktop':
    case 'lmstudio':
    case 'junie': {
      const cfg = config as ClaudeDesktopConfig | LMStudioConfig | JunieConfig;
      for (const [name, server] of Object.entries(cfg.mcpServers || {})) {
        servers.push({
          name,
          transport: server.url ? 'http' : 'stdio',
          command: server.command,
          args: server.args,
          env: server.env,
          url: server.url,
          headers: server.headers,
        });
      }
      break;
    }


    case 'cline': {
      const cfg = config as ClineConfig;
      for (const [name, server] of Object.entries(cfg.mcpServers || {})) {
        servers.push({
          name,
          transport: server.url ? 'http' : 'stdio',
          command: server.command,
          args: server.args,
          env: server.env,
          url: server.url,
          headers: server.headers,
        });
      }
      break;
    }

    case 'antigravity': {
      const cfg = config as AntigravityConfig;
      for (const [name, server] of Object.entries(cfg.mcpServers || {})) {
        servers.push({
          name,
          transport: server.serverUrl ? 'http' : 'stdio',
          command: server.command,
          args: server.args,
          env: server.env,
          url: server.serverUrl,
          headers: server.headers,
        });
      }
      break;
    }

    case 'cursor': {
      const cfg = config as CursorConfig;
      for (const [name, server] of Object.entries(cfg.mcpServers || {})) {
        servers.push({
          name,
          transport: server.url ? 'http' : 'stdio',
          command: server.command,
          args: server.args,
          env: server.env,
          url: server.url,
          headers: server.headers,
        });
      }
      break;
    }

    case 'vscode': {
      const cfg = config as VSCodeConfig;
      for (const [name, server] of Object.entries(cfg.servers || {})) {
        servers.push({
          name,
          transport: server.type || (server.url ? 'http' : 'stdio'),
          command: server.command,
          args: server.args,
          env: server.env,
          cwd: server.cwd,
          url: server.url,
          headers: server.headers,
        });
      }
      break;
    }

    case 'opencode': {
      const cfg = config as OpenCodeConfig;
      for (const [name, server] of Object.entries(cfg.mcp || {})) {
        // Handle command as array (OpenCode uses ["uvx", "perplexica-mcp", "stdio"])
        let command: string | undefined;
        let args: string[] | undefined;

        if (Array.isArray(server.command)) {
          command = server.command[0];
          args = server.command.slice(1);
        } else if (typeof server.command === 'string') {
          command = server.command;
          args = server.args;
        }

        // Handle both "env" and "environment" keys
        const env = server.env || server.environment;

        servers.push({
          name,
          transport: server.type === 'remote' || server.url ? 'http' : 'stdio',
          command,
          args,
          env,
          cwd: server.cwd,
          url: server.url,
          headers: server.headers,
        });
      }
      break;
    }

    case 'gemini-cli': {
      const cfg = config as GeminiCliConfig;
      for (const [name, server] of Object.entries(cfg.mcpServers || {})) {
        servers.push({
          name,
          transport: server.url || server.httpUrl ? 'http' : 'stdio',
          command: server.command,
          args: server.args,
          env: server.env,
          cwd: server.cwd,
          url: server.url || server.httpUrl,
          headers: server.headers,
          timeout: server.timeout,
        });
      }
      break;
    }

    case 'roo-code': {
      const cfg = config as RooCodeConfig;
      for (const [name, server] of Object.entries(cfg.mcpServers || {})) {
        servers.push({
          name,
          transport: server.url ? 'http' : 'stdio',
          command: server.command,
          args: server.args,
          env: server.env,
          cwd: server.cwd,
          url: server.url,
          headers: server.headers,
        });
      }
      break;
    }

    case 'copilot-cli': {
      const cfg = config as CopilotCliConfig;
      for (const [name, server] of Object.entries(cfg.servers || {})) {
        servers.push({
          name,
          transport: server.type || (server.url ? 'http' : 'stdio'),
          command: server.command,
          args: server.args,
          env: server.env,
          cwd: server.cwd,
          url: server.url,
          headers: server.headers,
        });
      }
      break;
    }

    case 'continue-dev': {
      const cfg = config as ContinueDevConfig;
      for (const server of cfg.mcpServers || []) {
        servers.push({
          name: server.name,
          transport: server.type === 'sse' ? 'sse' : (server.type === 'streamable-http' ? 'http' : (server.url ? 'http' : 'stdio')),
          command: server.command,
          args: server.args,
          env: server.env,
          url: server.url,
        });
      }
      break;
    }

    case 'codex-cli': {
      const cfg = config as CodexCliConfig;
      for (const [name, server] of Object.entries(cfg.mcp_servers || {})) {
        servers.push({
          name,
          transport: server.url ? 'http' : 'stdio',
          command: server.command,
          args: server.args,
          env: server.env,
          cwd: server.cwd,
          url: server.url,
        });
      }
      break;
    }
  }

  return { servers };
}

// Convert universal format to target format
export function convertFromUniversal(universal: UniversalConfig, targetFormat: EditorType): unknown {
  switch (targetFormat) {
    case 'claude-desktop': {
      const result: ClaudeDesktopConfig = { mcpServers: {} };
      for (const server of universal.servers) {
        result.mcpServers[server.name] = {
          ...(server.command && { command: server.command }),
          ...(server.args?.length && { args: server.args }),
          ...(server.env && Object.keys(server.env).length && { env: server.env }),
          ...(server.url && { url: server.url }),
          ...(server.headers && Object.keys(server.headers).length && { headers: server.headers }),
        };
      }
      return result;
    }

    case 'cursor': {
      const result: CursorConfig = { mcpServers: {} };
      for (const server of universal.servers) {
        result.mcpServers[server.name] = {
          ...(server.command && { command: server.command }),
          ...(server.args?.length && { args: server.args }),
          ...(server.env && Object.keys(server.env).length && { env: server.env }),
          ...(server.url && { url: server.url }),
          ...(server.headers && Object.keys(server.headers).length && { headers: server.headers }),
        };
      }
      return result;
    }

    case 'vscode': {
      const result: VSCodeConfig = { servers: {} };
      for (const server of universal.servers) {
        result.servers[server.name] = {
          ...(server.transport !== 'stdio' && { type: server.transport }),
          ...(server.command && { command: server.command }),
          ...(server.args?.length && { args: server.args }),
          ...(server.env && Object.keys(server.env).length && { env: server.env }),
          ...(server.cwd && { cwd: server.cwd }),
          ...(server.url && { url: server.url }),
          ...(server.headers && Object.keys(server.headers).length && { headers: server.headers }),
        };
      }
      return result;
    }

    case 'opencode': {
      const result: OpenCodeConfig = { mcp: {} };
      for (const server of universal.servers) {
        const isRemote = server.transport !== 'stdio' || !!server.url;
        if (isRemote) {
          result.mcp[server.name] = {
            type: 'remote' as const,
            url: server.url,
            ...(server.headers && Object.keys(server.headers).length && { headers: server.headers }),
            enabled: true,
          };
        } else {
          // OpenCode uses command as array: ["command", ...args]
          const commandArray = server.command
            ? [server.command, ...(server.args || [])]
            : undefined;
          result.mcp[server.name] = {
            type: 'local' as const,
            ...(commandArray && { command: commandArray }),
            ...(server.env && Object.keys(server.env).length && { environment: server.env }),
            enabled: true,
          };
        }
      }
      return result;
    }

    case 'gemini-cli': {
      const result: GeminiCliConfig = { mcpServers: {} };
      for (const server of universal.servers) {
        result.mcpServers[server.name] = {
          ...(server.command && { command: server.command }),
          ...(server.args?.length && { args: server.args }),
          ...(server.env && Object.keys(server.env).length && { env: server.env }),
          ...(server.cwd && { cwd: server.cwd }),
          ...(server.url && { url: server.url }),
          ...(server.headers && Object.keys(server.headers).length && { headers: server.headers }),
          ...(server.timeout && { timeout: server.timeout }),
        };
      }
      return result;
    }

    case 'lmstudio': {
      const result: LMStudioConfig = { mcpServers: {} };
      for (const server of universal.servers) {
        result.mcpServers[server.name] = {
          ...(server.command && { command: server.command }),
          ...(server.args?.length && { args: server.args }),
          ...(server.env && Object.keys(server.env).length && { env: server.env }),
          ...(server.url && { url: server.url }),
          ...(server.headers && Object.keys(server.headers).length && { headers: server.headers }),
        };
      }
      return result;
    }

    case 'antigravity': {
      const result: AntigravityConfig = { mcpServers: {} };
      for (const server of universal.servers) {
        result.mcpServers[server.name] = {
          ...(server.command && { command: server.command }),
          ...(server.args?.length && { args: server.args }),
          ...(server.env && Object.keys(server.env).length && { env: server.env }),
          ...(server.url && { serverUrl: server.url }),
          ...(server.headers && Object.keys(server.headers).length && { headers: server.headers }),
        };
      }
      return result;
    }



    case 'cline': {
      const result: ClineConfig = { mcpServers: {} };
      for (const server of universal.servers) {
        result.mcpServers[server.name] = {
          ...(server.command && { command: server.command }),
          ...(server.args?.length && { args: server.args }),
          ...(server.env && Object.keys(server.env).length && { env: server.env }),
          ...(server.url && { url: server.url }),
          ...(server.headers && Object.keys(server.headers).length && { headers: server.headers }),
          disabled: false,
          autoApprove: [],
        };
      }
      return result;
    }

    case 'junie': {
      const result: JunieConfig = { mcpServers: {} };
      for (const server of universal.servers) {
        result.mcpServers[server.name] = {
          ...(server.command && { command: server.command }),
          ...(server.args?.length && { args: server.args }),
          ...(server.env && Object.keys(server.env).length && { env: server.env }),
          ...(server.url && { url: server.url }),
          ...(server.headers && Object.keys(server.headers).length && { headers: server.headers }),
        };
      }
      return result;
    }

    case 'roo-code': {
      const result: RooCodeConfig = { mcpServers: {} };
      for (const server of universal.servers) {
        result.mcpServers[server.name] = {
          ...(server.command && { command: server.command }),
          ...(server.args?.length && { args: server.args }),
          ...(server.env && Object.keys(server.env).length && { env: server.env }),
          ...(server.cwd && { cwd: server.cwd }),
          ...(server.url && { url: server.url }),
          ...(server.headers && Object.keys(server.headers).length && { headers: server.headers }),
        };
      }
      return result;
    }

    case 'copilot-cli': {
      const result: CopilotCliConfig = { servers: {} };
      for (const server of universal.servers) {
        result.servers[server.name] = {
          ...(server.transport !== 'stdio' && { type: server.transport }),
          ...(server.command && { command: server.command }),
          ...(server.args?.length && { args: server.args }),
          ...(server.env && Object.keys(server.env).length && { env: server.env }),
          ...(server.cwd && { cwd: server.cwd }),
          ...(server.url && { url: server.url }),
          ...(server.headers && Object.keys(server.headers).length && { headers: server.headers }),
        };
      }
      return result;
    }

    case 'continue-dev': {
      const result: ContinueDevConfig = {
        name: 'MCP Config',
        version: '0.0.1',
        schema: 'v1',
        mcpServers: [],
      };
      for (const server of universal.servers) {
        result.mcpServers.push({
          name: server.name,
          ...(server.transport === 'sse' && { type: 'sse' }),
          ...(server.transport === 'http' && { type: 'streamable-http' }),
          ...(server.command && { command: server.command }),
          ...(server.args?.length && { args: server.args }),
          ...(server.env && Object.keys(server.env).length && { env: server.env }),
          ...(server.url && { url: server.url }),
        });
      }
      return result;
    }

    case 'codex-cli': {
      const result: CodexCliConfig = { mcp_servers: {} };
      for (const server of universal.servers) {
        result.mcp_servers[server.name] = {
          ...(server.command && { command: server.command }),
          ...(server.args?.length && { args: server.args }),
          ...(server.env && Object.keys(server.env).length && { env: server.env }),
          ...(server.cwd && { cwd: server.cwd }),
          ...(server.url && { url: server.url }),
        };
      }
      return result;
    }
  }
}

// Count braces and brackets to detect imbalance
function countBraces(text: string): { open: number; close: number; openBracket: number; closeBracket: number } {
  let open = 0, close = 0, openBracket = 0, closeBracket = 0;
  let inString = false;
  let escape = false;

  for (const char of text) {
    if (escape) {
      escape = false;
      continue;
    }
    if (char === '\\') {
      escape = true;
      continue;
    }
    if (char === '"') {
      inString = !inString;
      continue;
    }
    if (!inString) {
      if (char === '{') open++;
      else if (char === '}') close++;
      else if (char === '[') openBracket++;
      else if (char === ']') closeBracket++;
    }
  }

  return { open, close, openBracket, closeBracket };
}

// Try to repair imbalanced braces
function repairJson(input: string): string {
  let trimmed = input.trim();

  // Remove trailing commas before } or ]
  trimmed = trimmed.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');

  const counts = countBraces(trimmed);

  // Add missing closing braces
  const missingClose = counts.open - counts.close;
  const missingCloseBracket = counts.openBracket - counts.closeBracket;

  if (missingClose > 0) {
    trimmed += '}'.repeat(missingClose);
  }
  if (missingCloseBracket > 0) {
    trimmed += ']'.repeat(missingCloseBracket);
  }

  // Add missing opening braces (wrap if needed)
  if (missingClose < 0) {
    trimmed = '{'.repeat(-missingClose) + trimmed;
  }
  if (missingCloseBracket < 0) {
    trimmed = '['.repeat(-missingCloseBracket) + trimmed;
  }

  return trimmed;
}

// Try multiple JSON parsing strategies
function parseJsonFlexible(input: string): unknown {
  const trimmed = input.trim();

  // Strategy 1: Direct parse
  try {
    return JSON.parse(trimmed);
  } catch {
    // Continue to next strategy
  }

  // Strategy 2: Wrap with braces if starts with key
  if (trimmed.startsWith('"')) {
    try {
      return JSON.parse(`{${trimmed}}`);
    } catch {
      // Continue
    }
  }

  // Strategy 3: Repair imbalanced braces and parse
  try {
    const repaired = repairJson(trimmed);
    return JSON.parse(repaired);
  } catch {
    // Continue
  }

  // Strategy 4: Wrap with braces and repair
  if (trimmed.startsWith('"')) {
    try {
      const wrapped = `{${trimmed}}`;
      const repaired = repairJson(wrapped);
      return JSON.parse(repaired);
    } catch {
      // Continue
    }
  }

  // Strategy 5: Wrap non-object content
  const keyMatch = trimmed.match(/^"(\w+)":\s*\{/);
  if (keyMatch) {
    try {
      const wrapped = `{${trimmed}}`;
      const repaired = repairJson(wrapped);
      return JSON.parse(repaired);
    } catch {
      // Continue
    }
  }

  // Show helpful error with brace count
  const counts = countBraces(trimmed);
  const braceInfo = counts.open !== counts.close
    ? `{ ${counts.open}개, } ${counts.close}개 - ${Math.abs(counts.open - counts.close)}개가 ${counts.open > counts.close ? '닫히지 않음' : '여는 괄호 부족'}`
    : '';

  throw new Error(
    `유효하지 않은 JSON 형식입니다. ${braceInfo ? `(괄호 불균형: ${braceInfo})` : ''}\n전체 설정 파일을 복사해서 붙여넣어 주세요.`
  );
}

export function convertConfig(
  inputConfig: string,
  sourceFormat: EditorType,
  targetFormat: EditorType
): { success: true; output: string; serverCount: number } | { success: false; error: string } {
  try {
    let parsed: unknown;

    // Parse input based on source format
    if (sourceFormat === 'continue-dev') {
      // Continue Dev uses YAML
      try {
        parsed = YAML.parse(inputConfig);
      } catch {
        throw new Error('유효하지 않은 YAML 형식입니다. Continue Dev 설정 파일을 확인해 주세요.');
      }
    } else if (sourceFormat === 'codex-cli') {
      // Codex CLI uses TOML
      try {
        parsed = TOML.parse(inputConfig);
      } catch {
        throw new Error('유효하지 않은 TOML 형식입니다. Codex CLI config.toml 파일을 확인해 주세요.');
      }
    } else {
      // All other formats use JSON
      parsed = parseJsonFlexible(inputConfig);
    }

    const universal = parseToUniversal(parsed, sourceFormat);

    if (universal.servers.length === 0) {
      return {
        success: false,
        error: '변환할 MCP 서버를 찾을 수 없습니다. 올바른 형식인지 확인해 주세요.',
      };
    }

    const converted = convertFromUniversal(universal, targetFormat);

    // Format output based on target format
    let output: string;
    if (targetFormat === 'continue-dev') {
      // Continue Dev uses YAML
      output = YAML.stringify(converted);
    } else if (targetFormat === 'codex-cli') {
      // Codex CLI uses TOML
      output = TOML.stringify(converted as TOML.JsonMap);
    } else {
      // All other formats use JSON
      output = JSON.stringify(converted, null, 2);
    }

    return {
      success: true,
      output,
      serverCount: universal.servers.length,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.',
    };
  }
}

