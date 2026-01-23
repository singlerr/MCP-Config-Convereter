export type EditorType =
  | 'claude-desktop'
  | 'vscode'
  | 'cursor'
  | 'opencode'
  | 'gemini-cli'
  | 'lmstudio'
  | 'antigravity'
  | 'junie'
  | 'roo-code'
  | 'copilot-cli'
  | 'continue-dev'
  | 'codex-cli';

export interface EditorInfo {
  id: EditorType;
  name: string;
  description: string;
  configFileName: string;
  docsUrl: string;
  exampleConfig: string;
}

export const editors: EditorInfo[] = [
  {
    id: 'claude-desktop',
    name: 'Claude Desktop',
    description: 'Anthropic의 Claude 데스크톱 앱',
    configFileName: 'claude_desktop_config.json',
    docsUrl: 'https://modelcontextprotocol.io/quickstart/user',
    exampleConfig: `{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/files"]
    }
  }
}`,
  },
  {
    id: 'vscode',
    name: 'VS Code',
    description: 'GitHub Copilot MCP 지원',
    configFileName: '.vscode/mcp.json',
    docsUrl: 'https://code.visualstudio.com/docs/copilot/chat/mcp-servers',
    exampleConfig: `{
  "servers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/files"]
    }
  }
}`,
  },
  {
    id: 'cursor',
    name: 'Cursor',
    description: 'AI-first 코드 에디터',
    configFileName: '.cursor/mcp.json',
    docsUrl: 'https://docs.cursor.com/context/model-context-protocol',
    exampleConfig: `{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/files"],
      "disabled": false,
      "autoApprove": []
    }
  }
}`,
  },
  {
    id: 'opencode',
    name: 'OpenCode',
    description: '터미널 AI 코딩 에이전트',
    configFileName: 'opencode.json',
    docsUrl: 'https://opencode.ai/docs/mcp',
    exampleConfig: `{
  "mcp": {
    "filesystem": {
      "type": "local",
      "command": ["npx", "-y", "@modelcontextprotocol/server-filesystem", "/path/to/files"],
      "enabled": true
    }
  }
}`,
  },
  {
    id: 'gemini-cli',
    name: 'Gemini CLI',
    description: 'Google Gemini CLI 도구',
    configFileName: 'settings.json',
    docsUrl: 'https://github.com/google-gemini/gemini-cli',
    exampleConfig: `{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/files"],
      "timeout": 30000
    }
  }
}`,
  },
  {
    id: 'lmstudio',
    name: 'LM Studio',
    description: '로컬 LLM 실행 앱',
    configFileName: 'mcp.json',
    docsUrl: 'https://lmstudio.ai/docs/mcp',
    exampleConfig: `{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/files"]
    }
  }
}`,
  },
  {
    id: 'antigravity',
    name: 'Antigravity',
    description: 'AI 개발 도구',
    configFileName: 'mcp_config.json',
    docsUrl: 'https://antigravity.dev',
    exampleConfig: `{
  "mcpServers": {
    "sequential-thinking": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
    },
    "qdrant": {
      "command": "uvx",
      "args": ["mcp-server-qdrant"],
      "env": {
        "QDRANT_URL": "http://localhost:6333",
        "COLLECTION_NAME": "my-collection"
      }
    }
  }
}`,
  },
  {
    id: 'junie',
    name: 'JetBrains Junie / AI Assistant',
    description: 'JetBrains IDE AI Assistant',
    configFileName: '.junie/mcp/mcp.json',
    docsUrl: 'https://www.jetbrains.com/help/idea/ai-assistant.html',
    exampleConfig: `{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/files"]
    }
  }
}`,
  },
  {
    id: 'roo-code',
    name: 'Roo Code',
    description: 'AI 코딩 어시스턴트 VS Code 확장',
    configFileName: '.roo/mcp.json',
    docsUrl: 'https://docs.roocode.com/features/mcp/using-mcp-in-roo',
    exampleConfig: `{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/files"],
      "alwaysAllow": [],
      "disabled": false
    }
  }
}`,
  },
  {
    id: 'copilot-cli',
    name: 'GitHub Copilot CLI',
    description: 'GitHub Copilot 명령줄 도구',
    configFileName: 'mcp-config.json',
    docsUrl: 'https://github.com/github/copilot-cli',
    exampleConfig: `{
  "servers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/files"]
    }
  }
}`,
  },
  {
    id: 'continue-dev',
    name: 'Continue',
    description: 'AI 코드 어시스턴트 (YAML 형식)',
    configFileName: '.continue/mcpServers/*.yaml',
    docsUrl: 'https://docs.continue.dev/customize/deep-dives/mcp',
    exampleConfig: `name: Filesystem MCP
version: 0.0.1
mcpServers:
  - name: filesystem
    type: stdio
    command: npx
    args:
      - -y
      - "@modelcontextprotocol/server-filesystem"
      - /path/to/files`,
  },
  {
    id: 'codex-cli',
    name: 'Codex CLI',
    description: 'OpenAI Codex CLI (TOML 형식)',
    configFileName: '~/.codex/config.toml',
    docsUrl: 'https://openai.com/codex',
    exampleConfig: `[mcp_servers.filesystem]
command = "npx"
args = ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/files"]`,
  },
];

// Common MCP Server structure
export interface McpServerBase {
  command?: string;
  args?: string[];
  env?: Record<string, string>;
  url?: string;
  headers?: Record<string, string>;
}

// Cursor-specific server with additional options
export interface CursorMcpServer extends McpServerBase {
  disabled?: boolean;
  autoApprove?: string[];
}

// Claude Desktop format
export interface ClaudeDesktopConfig {
  mcpServers: Record<string, McpServerBase>;
}

// Cursor format
export interface CursorConfig {
  mcpServers: Record<string, CursorMcpServer>;
}

// VS Code format
export interface VSCodeMcpServer {
  type?: 'stdio' | 'http' | 'sse';
  command?: string;
  args?: string[];
  env?: Record<string, string>;
  envFile?: string;
  cwd?: string;
  url?: string;
  headers?: Record<string, string>;
}

export interface VSCodeConfig {
  inputs?: Array<{
    type: string;
    id: string;
    description: string;
    password?: boolean;
  }>;
  servers: Record<string, VSCodeMcpServer>;
}

// OpenCode format (supports both TOML and JSON)
export interface OpenCodeMcpServer {
  type?: 'local' | 'remote';
  command?: string | string[];  // Can be array like ["uvx", "server-name"]
  args?: string[];
  env?: Record<string, string>;
  environment?: Record<string, string>;  // Alternative to env
  cwd?: string;
  url?: string;
  headers?: Record<string, string>;
  enabled?: boolean;
  debug?: boolean;
}

export interface OpenCodeConfig {
  mcp: Record<string, OpenCodeMcpServer>;
}

// Gemini CLI format
export interface GeminiMcpServer {
  command?: string;
  args?: string[];
  env?: Record<string, string>;
  cwd?: string;
  url?: string;
  httpUrl?: string;
  headers?: Record<string, string>;
  timeout?: number;
  trust?: boolean;
  includeTools?: string[];
  excludeTools?: string[];
}

export interface GeminiCliConfig {
  mcpServers: Record<string, GeminiMcpServer>;
}

// LM Studio format (follows Cursor notation)
export interface LMStudioConfig {
  mcpServers: Record<string, McpServerBase>;
}

// Antigravity format
export interface AntigravityMcpServer {
  command?: string;
  args?: string[];
  env?: Record<string, string>;
  serverUrl?: string;
  headers?: Record<string, string>;
}

export interface AntigravityConfig {
  mcpServers: Record<string, AntigravityMcpServer>;
}

// JetBrains Junie format
export interface JunieConfig {
  mcpServers: Record<string, McpServerBase>;
}

// Roo Code format
export interface RooCodeMcpServer extends McpServerBase {
  cwd?: string;
  alwaysAllow?: string[];
  disabled?: boolean;
}

export interface RooCodeConfig {
  mcpServers: Record<string, RooCodeMcpServer>;
}

// GitHub Copilot CLI format (same as VS Code)
export interface CopilotCliConfig {
  servers: Record<string, VSCodeMcpServer>;
  inputs?: Array<{
    type: string;
    id: string;
    description: string;
    password?: boolean;
  }>;
}

// Continue Dev format (YAML-based)
export interface ContinueMcpServer {
  name: string;
  type?: 'stdio' | 'sse' | 'streamable-http';
  command?: string;
  args?: string[];
  env?: Record<string, string>;
  url?: string;
}

export interface ContinueDevConfig {
  name?: string;
  version?: string;
  schema?: string;
  mcpServers: ContinueMcpServer[];
}

// Codex CLI format (TOML-based)
export interface CodexMcpServer {
  command?: string;
  args?: string[];
  env?: Record<string, string>;
  cwd?: string;
  url?: string;
  startup_timeout_sec?: number;
}

export interface CodexCliConfig {
  mcp_servers: Record<string, CodexMcpServer>;
}

// Universal intermediate format for conversion
export interface UniversalMcpServer {
  name: string;
  transport: 'stdio' | 'http' | 'sse';
  command?: string;
  args?: string[];
  env?: Record<string, string>;
  cwd?: string;
  url?: string;
  headers?: Record<string, string>;
  timeout?: number;
}

export interface UniversalConfig {
  servers: UniversalMcpServer[];
}

export function detectFormat(config: unknown): EditorType | null {
  if (typeof config !== 'object' || config === null) return null;

  const obj = config as Record<string, unknown>;

  // Codex CLI specific: has "mcp_servers" key (underscore)
  if ('mcp_servers' in obj && typeof obj.mcp_servers === 'object') {
    return 'codex-cli';
  }

  // VS Code / Copilot CLI specific: has "servers" key (not "mcpServers")
  if ('servers' in obj && typeof obj.servers === 'object') {
    return 'vscode';
  }

  // OpenCode specific: has "mcp" key
  if ('mcp' in obj && typeof obj.mcp === 'object') {
    return 'opencode';
  }

  // Continue Dev specific: mcpServers is an array
  if ('mcpServers' in obj && Array.isArray(obj.mcpServers)) {
    return 'continue-dev';
  }

  // Most others use "mcpServers" as object
  if ('mcpServers' in obj) {
    const servers = obj.mcpServers as Record<string, Record<string, unknown>>;
    const firstServer = Object.values(servers)[0];

    if (firstServer) {
      // Gemini-specific fields
      if ('httpUrl' in firstServer || 'trust' in firstServer || 'includeTools' in firstServer) {
        return 'gemini-cli';
      }
      // Roo Code specific fields
      if ('alwaysAllow' in firstServer) {
        return 'roo-code';
      }
    }

    // Default to claude-desktop as it's the most common
    return 'claude-desktop';
  }

  return null;
}
