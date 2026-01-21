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
        servers.push({
          name,
          transport: server.type === 'remote' || server.url ? 'http' : 'stdio',
          command: server.command,
          args: server.args,
          env: server.env,
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

export function convertConfig(
  inputConfig: string,
  sourceFormat: EditorType,
  targetFormat: EditorType
): { success: true; output: string } | { success: false; error: string } {
  try {
    const parsed = JSON.parse(inputConfig);
    const universal = parseToUniversal(parsed, sourceFormat);
    const converted = convertFromUniversal(universal, targetFormat);
    return {
      success: true,
      output: JSON.stringify(converted, null, 2),
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error occurred',
    };
  }
}
