import type {
  EditorType,
  UniversalConfig,
  UniversalMcpServer,
  ClaudeDesktopConfig,
  VSCodeConfig,
  OpenCodeConfig,
  GeminiCliConfig,
  LMStudioConfig,
  AntigravityConfig,
} from './mcp-formats';

// Parse any format to universal format
export function parseToUniversal(config: unknown, sourceFormat: EditorType): UniversalConfig {
  const servers: UniversalMcpServer[] = [];

  switch (sourceFormat) {
    case 'claude-desktop':
    case 'lmstudio':
    case 'antigravity':
    case 'cursor': {
      const cfg = config as ClaudeDesktopConfig | LMStudioConfig | AntigravityConfig;
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
        const cmdArray = server.command as unknown;
        let command: string | undefined;
        let args: string[] | undefined;
        
        if (Array.isArray(cmdArray)) {
          command = cmdArray[0];
          args = cmdArray.slice(1);
        } else {
          command = server.command;
          args = server.args;
        }
        
        // Handle both "env" and "environment" keys
        const env = server.env || (server as Record<string, unknown>).environment as Record<string, string> | undefined;
        
        servers.push({
          name,
          transport: server.type === 'remote' || server.url ? 'http' : 'stdio',
          command,
          args,
          env,
          cwd: server.cwd,
          url: server.url,
          headers: server.http_headers,
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
  }

  return { servers };
}

// Convert universal format to target format
export function convertFromUniversal(universal: UniversalConfig, targetFormat: EditorType): unknown {
  switch (targetFormat) {
    case 'claude-desktop':
    case 'cursor': {
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
        result.mcp[server.name] = {
          ...(isRemote && { type: 'remote' as const }),
          ...(!isRemote && server.command && { command: server.command }),
          ...(server.args?.length && { args: server.args }),
          ...(server.env && Object.keys(server.env).length && { env: server.env }),
          ...(server.cwd && { cwd: server.cwd }),
          ...(server.url && { url: server.url }),
          ...(server.headers && Object.keys(server.headers).length && { http_headers: server.headers }),
          enabled: true,
        };
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
          ...(server.url && { url: server.url }),
          ...(server.headers && Object.keys(server.headers).length && { headers: server.headers }),
        };
      }
      return result;
    }
  }
}

// Try to fix incomplete JSON (e.g., `"mcp": {...}` without outer braces)
function normalizeJsonInput(input: string): string {
  const trimmed = input.trim();
  
  // If it already starts with {, try parsing as-is first
  if (trimmed.startsWith('{')) {
    return trimmed;
  }
  
  // If it starts with a key like "mcp": or "mcpServers":, wrap it
  if (trimmed.startsWith('"')) {
    return `{${trimmed}}`;
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
  
  // Strategy 3: Handle case where user pasted inner content
  // e.g., "mcp": { ... } without outer { }
  const keyMatch = trimmed.match(/^"(\w+)":\s*\{/);
  if (keyMatch) {
    try {
      return JSON.parse(`{${trimmed}}`);
    } catch {
      // Continue
    }
  }
  
  throw new Error('유효하지 않은 JSON 형식입니다. 전체 설정 파일을 복사해서 붙여넣어 주세요.');
}

export function convertConfig(
  inputConfig: string,
  sourceFormat: EditorType,
  targetFormat: EditorType
): { success: true; output: string; serverCount: number } | { success: false; error: string } {
  try {
    const parsed = parseJsonFlexible(inputConfig);
    const universal = parseToUniversal(parsed, sourceFormat);
    
    if (universal.servers.length === 0) {
      return {
        success: false,
        error: '변환할 MCP 서버를 찾을 수 없습니다. 올바른 형식인지 확인해 주세요.',
      };
    }
    
    const converted = convertFromUniversal(universal, targetFormat);
    return {
      success: true,
      output: JSON.stringify(converted, null, 2),
      serverCount: universal.servers.length,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.',
    };
  }
}
