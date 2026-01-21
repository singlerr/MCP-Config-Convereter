export type EditorType = 
  | 'claude-desktop'
  | 'vscode'
  | 'cursor'
  | 'opencode'
  | 'gemini-cli'
  | 'lmstudio'
  | 'antigravity';

export interface EditorInfo {
  id: EditorType;
  name: string;
  description: string;
  configFileName: string;
  docsUrl: string;
}

export const editors: EditorInfo[] = [
  {
    id: 'claude-desktop',
    name: 'Claude Desktop',
    description: 'Anthropic의 Claude 데스크톱 앱',
    configFileName: 'claude_desktop_config.json',
    docsUrl: 'https://modelcontextprotocol.io/quickstart/user',
  },
  {
    id: 'vscode',
    name: 'VS Code',
    description: 'GitHub Copilot MCP 지원',
    configFileName: '.vscode/mcp.json',
    docsUrl: 'https://code.visualstudio.com/docs/copilot/chat/mcp-servers',
  },
  {
    id: 'cursor',
    name: 'Cursor',
    description: 'AI-first 코드 에디터',
    configFileName: '.cursor/mcp.json',
    docsUrl: 'https://docs.cursor.com/context/model-context-protocol',
  },
  {
    id: 'opencode',
    name: 'OpenCode',
    description: '터미널 AI 코딩 에이전트',
    configFileName: 'opencode.json',
    docsUrl: 'https://opencode.ai/docs/mcp',
  },
  {
    id: 'gemini-cli',
    name: 'Gemini CLI',
    description: 'Google Gemini CLI 도구',
    configFileName: 'settings.json',
    docsUrl: 'https://github.com/google-gemini/gemini-cli',
  },
  {
    id: 'lmstudio',
    name: 'LM Studio',
    description: '로컬 LLM 실행 앱',
    configFileName: 'mcp.json',
    docsUrl: 'https://lmstudio.ai/docs/mcp',
  },
  {
    id: 'antigravity',
    name: 'Antigravity',
    description: 'AI 개발 도구',
    configFileName: 'mcp_config.json',
    docsUrl: 'https://antigravity.dev',
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
export interface AntigravityConfig {
  mcpServers: Record<string, McpServerBase>;
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
  
  // VS Code specific: has "servers" key (not "mcpServers")
  if ('servers' in obj && typeof obj.servers === 'object') {
    return 'vscode';
  }
  
  // OpenCode specific: has "mcp" key
  if ('mcp' in obj && typeof obj.mcp === 'object') {
    return 'opencode';
  }
  
  // Most others use "mcpServers"
  if ('mcpServers' in obj) {
    // Try to detect specific format based on server properties
    const servers = obj.mcpServers as Record<string, Record<string, unknown>>;
    const firstServer = Object.values(servers)[0];
    
    if (firstServer) {
      // Gemini-specific fields
      if ('httpUrl' in firstServer || 'trust' in firstServer || 'includeTools' in firstServer) {
        return 'gemini-cli';
      }
    }
    
    // Default to claude-desktop as it's the most common
    return 'claude-desktop';
  }
  
  return null;
}
