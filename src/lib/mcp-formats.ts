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
  | 'codex-cli'
  | 'cline'
  | 'windsurf'
  | 'claude-code'
  | 'ampcode'
  | 'zed'
  | 'sourcegraph-cody'
  | 'goose'
  | 'librechat';

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
    description: 'Anthropic Claude Desktop App',
    configFileName: 'claude_desktop_config.json',
    docsUrl: 'https://modelcontextprotocol.io/quickstart/user',
    exampleConfig: `{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/Users/username/Desktop"]
    },
    "sequential-thinking": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
    }
  }
}`,
  },
  {
    id: 'windsurf',
    name: 'Windsurf',
    description: 'Codeium Windsurf Editor',
    configFileName: 'mcp_config.json',
    docsUrl: 'https://docs.codeium.com/',
    exampleConfig: `{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/files"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "ghp_your_token_here"
      }
    }
  }
}`,
  },
  {
    id: 'cline',
    name: 'Cline',
    description: 'Autonomous Coding Agent',
    configFileName: 'cline_mcp_settings.json',
    docsUrl: 'https://github.com/cline/cline',
    exampleConfig: `{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/files"],
      "disabled": false,
      "alwaysAllow": ["read_file", "list_directory"],
      "autoApprove": ["write_file"]
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
    },
    "sequential-thinking": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
    }
  }
}`,
  },
  {
    id: 'cursor',
    name: 'Cursor',
    description: 'AI-first 코드 에디터 (전역: ~/.cursor/mcp.json, 프로젝트: .cursor/mcp.json)',
    configFileName: '.cursor/mcp.json',
    docsUrl: 'https://docs.cursor.com/context/model-context-protocol',
    exampleConfig: `{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/files"],
      "disabled": false,
      "autoApprove": ["read_file", "search_files"]
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
    },
    "perplexica": {
      "type": "local",
      "command": ["uvx", "perplexica-mcp", "stdio"],
      "environment": {
        "PERPLEXICA_API_KEY": "sk-your-key-here"
      },
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
    },
    "brave-search": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-brave-search"],
      "env": {
        "BRAVE_API_KEY": "BSA_your_api_key_here"
      }
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
    },
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "POSTGRES_CONNECTION": "postgresql://localhost:5432/db"
      }
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
      "alwaysAllow": ["read_file", "write_file"],
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
      - /path/to/files
  - name: remote
    type: sse
    url: http://localhost:3000/sse`,
  },
  {
    id: 'codex-cli',
    name: 'Codex CLI',
    description: 'OpenAI Codex CLI (TOML 형식)',
    configFileName: '~/.codex/config.toml',
    docsUrl: 'https://openai.com/codex',
    exampleConfig: `[mcp_servers.filesystem]
command = "npx"
args = ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/files"]

[mcp_servers.slow_server]
command = "python"
args = ["-m", "server"]
startup_timeout_sec = 60`,
  },
  {
    id: 'claude-code',
    name: 'Claude Code',
    description: 'Anthropic Claude CLI Agent',
    configFileName: '.claude.json',
    docsUrl: 'https://code.claude.com/docs/mcp',
    exampleConfig: `{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/files"]
    },
    "github": {
      "command": "uvx",
      "args": ["mcp-server-github"],
      "env": {
        "GITHUB_TOKEN": "token"
      }
    }
  },
  "allowedMcpServers": ["filesystem", "github"]
}`,
  },
  {
    id: 'ampcode',
    name: 'AmpCode',
    description: 'Sourcegraph AI Coding Agent',
    configFileName: '.amp/settings.json',
    docsUrl: 'https://ampcode.com',
    exampleConfig: `{
  "amp.mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/files"]
    },
    "github": {
      "command": "uvx",
      "args": ["mcp-server-github"],
      "env": {
        "GITHUB_TOKEN": "ghp_your_token_here"
      }
    }
  }
}`,
  },
  {
    id: 'zed',
    name: 'Zed',
    description: 'High-performance code editor',
    configFileName: 'settings.json',
    docsUrl: 'https://zed.dev/docs/assistant/model-context-protocol',
    exampleConfig: `{
  "context_servers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/files"],
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}`,
  },
  {
    id: 'sourcegraph-cody',
    name: 'Sourcegraph Cody',
    description: 'AI coding assistant by Sourcegraph',
    configFileName: 'mcp_servers.json',
    docsUrl: 'https://sourcegraph.com/docs/cody/clients/mcp',
    exampleConfig: `{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/files"],
      "env": {
        "CODY_TOKEN": "your_token_here"
      }
    }
  }
}`,
  },
  {
    id: 'goose',
    name: 'Goose',
    description: 'Open-source AI agent (YAML)',
    configFileName: 'config.yaml',
    docsUrl: 'https://block.github.io/goose/docs/getting-started/using-extensions',
    exampleConfig: `extensions:
  filesystem:
    type: stdio
    cmd: npx
    args:
      - "-y"
      - "@modelcontextprotocol/server-filesystem"
      - "/path/to/files"
    enabled: true
    envs:
      NODE_ENV: production`,
  },
  {
    id: 'librechat',
    name: 'LibreChat',
    description: 'Self-hosted AI chat interface (YAML)',
    configFileName: 'librechat.yaml',
    docsUrl: 'https://www.librechat.ai/docs/configuration/mcp_servers',
    exampleConfig: `mcpServers:
  filesystem:
    type: stdio
    command: npx
    args:
      - "-y"
      - "@modelcontextprotocol/server-filesystem"
      - "/path/to/files"
    timeout: 60000`,
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

/**
 * Cursor-specific MCP server configuration with permission controls.
 * 
 * @remarks
 * Extends base MCP server with Cursor-specific fields for controlling server behavior and auto-approvals.
 */
export interface CursorMcpServer extends McpServerBase {
  disabled?: boolean;
  autoApprove?: string[];
}

/**
 * Claude Desktop MCP configuration format.
 * 
 * @remarks
 * **Official Config Path:**
 * - macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
 * - Windows: `%APPDATA%\Claude\claude_desktop_config.json`
 * 
 * **Key Structure:**
 * - Uses `mcpServers` object with server name as keys
 * - Standard MCP format without special extensions
 * 
 * **Field Support:**
 * - `command`, `args`, `env` for stdio transport
 * - `url`, `headers` for SSE/HTTP transport
 */
export interface ClaudeDesktopConfig {
  mcpServers: Record<string, McpServerBase>;
}

/**
 * Cursor MCP configuration format.
 * 
 * @remarks
 * **Official Config Path:**
 * - Global: `~/.cursor/mcp.json` (macOS/Linux) or `%USERPROFILE%\.cursor\mcp.json` (Windows)
 * - Project: `.cursor/mcp.json`
 * 
 * **Key Structure:**
 * - Uses `mcpServers` object with server name as keys
 * - Extends base format with Cursor-specific permission controls
 * 
 * **Field Support:**
 * - All standard fields (`command`, `args`, `env`, `url`, `headers`)
 * - `disabled`: Boolean to disable a server without removing it
 * - `autoApprove`: Array of tool/resource patterns to auto-approve
 */
export interface CursorConfig {
  mcpServers: Record<string, CursorMcpServer>;
}

/**
 * VS Code MCP server configuration.
 * 
 * @remarks
 * Used by GitHub Copilot MCP extension.
 */
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

/**
 * VS Code MCP configuration format.
 * 
 * @remarks
 * **Official Config Path:**
 * - Project: `.vscode/mcp.json`
 * 
 * **Key Structure:**
 * - Uses `servers` (not `mcpServers`) object with server name as keys
 * - Supports `inputs` array for dynamic configuration (e.g., password prompts)
 * 
 * **Field Support:**
 * - `type`: Explicit transport type ('stdio', 'http', 'sse')
 * - `command`, `args`: For stdio transport
 * - `env`: Environment variables object
 * - `envFile`: Path to .env file for environment variables
 * - `cwd`: Working directory for server process
 * - `url`, `headers`: For HTTP/SSE transport
 * - `inputs`: Array for prompting users for sensitive data like passwords
 *   - Each input has `type`, `id`, `description`, and optional `password` boolean
 */
export interface VSCodeConfig {
  inputs?: Array<{
    type: string;
    id: string;
    description: string;
    password?: boolean;
  }>;
  servers: Record<string, VSCodeMcpServer>;
}

/**
 * OpenCode MCP server configuration.
 * 
 * @remarks
 * Supports both JSON and TOML formats with flexible command specification.
 */
export interface OpenCodeMcpServer {
  type?: 'local' | 'remote';
  command?: string | string[];
  args?: string[];
  env?: Record<string, string>;
  environment?: Record<string, string>;
  cwd?: string;
  url?: string;
  headers?: Record<string, string>;
  enabled?: boolean;
  debug?: boolean;
}

/**
 * OpenCode MCP configuration format.
 * 
 * @remarks
 * **Official Config Path:**
 * - `opencode.json` or `opencode.toml`
 * 
 * **Key Structure:**
 * - Uses `mcp` (not `mcpServers`) object with server name as keys
 * - Supports both JSON and TOML format variants
 * 
 * **Field Support:**
 * - `type`: 'local' or 'remote' server type
 * - `command`: Can be string or array format (e.g., `["uvx", "server-name"]`)
 * - `args`: Additional arguments array
 * - `env` or `environment`: Both supported for environment variables
 * - `cwd`: Working directory
 * - `url`, `headers`: For remote servers
 * - `enabled`: Boolean to enable/disable server
 * - `debug`: Boolean to enable debug mode
 */
export interface OpenCodeConfig {
  mcp: Record<string, OpenCodeMcpServer>;
}

/**
 * Gemini CLI MCP server configuration.
 * 
 * @remarks
 * Includes Gemini-specific fields for tool filtering and trust management.
 */
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

/**
 * Gemini CLI MCP configuration format.
 * 
 * @remarks
 * **Official Config Path:**
 * - `settings.json`
 * 
 * **Key Structure:**
 * - Uses `mcpServers` object with server name as keys
 * - Extended with Gemini-specific tool management fields
 * 
 * **Field Support:**
 * - All standard fields (`command`, `args`, `env`, `cwd`)
 * - `url` or `httpUrl`: HTTP endpoint (two naming variations)
 * - `headers`: HTTP headers
 * - `timeout`: Connection timeout in milliseconds
 * - `trust`: Boolean to trust server without confirmation
 * - `includeTools`: Whitelist of tool names to expose
 * - `excludeTools`: Blacklist of tool names to hide
 */
export interface GeminiCliConfig {
  mcpServers: Record<string, GeminiMcpServer>;
}

/**
 * LM Studio MCP configuration format.
 * 
 * @remarks
 * **Official Config Path:**
 * - `mcp.json`
 * 
 * **Key Structure:**
 * - Uses `mcpServers` object with server name as keys
 * - Follows standard MCP format similar to Claude Desktop
 * 
 * **Field Support:**
 * - Standard fields: `command`, `args`, `env`, `url`, `headers`
 */
export interface LMStudioConfig {
  mcpServers: Record<string, McpServerBase>;
}

/**
 * Antigravity MCP server configuration.
 * 
 * @remarks
 * Uses `serverUrl` instead of standard `url` field.
 */
export interface AntigravityMcpServer {
  command?: string;
  args?: string[];
  env?: Record<string, string>;
  serverUrl?: string;
  headers?: Record<string, string>;
}

/**
 * Antigravity MCP configuration format.
 * 
 * @remarks
 * **Official Config Path:**
 * - `mcp_config.json`
 * 
 * **Key Structure:**
 * - Uses `mcpServers` object with server name as keys
 * 
 * **Field Support:**
 * - Standard fields: `command`, `args`, `env`, `headers`
 * - `serverUrl` (not `url`): Non-standard field name for HTTP endpoint
 */
export interface AntigravityConfig {
  mcpServers: Record<string, AntigravityMcpServer>;
}

/**
 * JetBrains Junie / AI Assistant MCP configuration format.
 * 
 * @remarks
 * **Official Config Path:**
 * - `.junie/mcp/mcp.json`
 * 
 * **Key Structure:**
 * - Uses `mcpServers` object with server name as keys
 * - Follows standard MCP format
 * 
 * **Field Support:**
 * - Standard fields: `command`, `args`, `env`, `url`, `headers`
 */
export interface JunieConfig {
  mcpServers: Record<string, McpServerBase>;
}

/**
 * Roo Code MCP server configuration.
 * 
 * @remarks
 * Extends base format with working directory and permission controls.
 */
export interface RooCodeMcpServer extends McpServerBase {
  cwd?: string;
  alwaysAllow?: string[];
  disabled?: boolean;
}

/**
 * Roo Code MCP configuration format.
 * 
 * @remarks
 * **Official Config Path:**
 * - `.roo/mcp.json`
 * 
 * **Key Structure:**
 * - Uses `mcpServers` object with server name as keys
 * - Extended with Roo Code-specific permission controls
 * 
 * **Field Support:**
 * - All standard fields (`command`, `args`, `env`, `url`, `headers`)
 * - `cwd`: Working directory for server process
 * - `alwaysAllow`: Array of tool/resource patterns to auto-approve without prompting
 * - `disabled`: Boolean to disable a server without removing it
 */
export interface RooCodeConfig {
  mcpServers: Record<string, RooCodeMcpServer>;
}

/**
 * GitHub Copilot CLI MCP configuration format.
 * 
 * @remarks
 * **Official Config Path:**
 * - `mcp-config.json`
 * 
 * **Key Structure:**
 * - Uses `servers` (not `mcpServers`) object with server name as keys
 * - Similar to VS Code format with inputs support
 * 
 * **Field Support:**
 * - Same as VS Code: `type`, `command`, `args`, `env`, `envFile`, `cwd`, `url`, `headers`
 * - `inputs`: Array for dynamic configuration and password prompts
 */
export interface CopilotCliConfig {
  servers: Record<string, VSCodeMcpServer>;
  inputs?: Array<{
    type: string;
    id: string;
    description: string;
    password?: boolean;
  }>;
}

/**
 * Continue Dev MCP server configuration.
 * 
 * @remarks
 * Array-based configuration with named servers.
 */
export interface ContinueMcpServer {
  name: string;
  type?: 'stdio' | 'sse' | 'streamable-http';
  command?: string;
  args?: string[];
  env?: Record<string, string>;
  url?: string;
}

/**
 * Continue Dev MCP configuration format.
 * 
 * @remarks
 * **Official Config Path:**
 * - `.continue/mcpServers/*.yaml`
 * 
 * **Key Structure:**
 * - Uses YAML format (not JSON)
 * - `mcpServers` is an array of server objects (not a keyed object)
 * - Each server has `name` property for identification
 * 
 * **Field Support:**
 * - `name`: Required server identifier
 * - `type`: Transport type ('stdio', 'sse', 'streamable-http')
 * - `command`, `args`: For stdio transport
 * - `env`: Environment variables
 * - `url`: For SSE/HTTP transport
 * - Top-level `name`, `version`, `schema`: Metadata for the config file
 */
export interface ContinueDevConfig {
  name?: string;
  version?: string;
  schema?: string;
  mcpServers: ContinueMcpServer[];
}

/**
 * Codex CLI MCP server configuration.
 * 
 * @remarks
 * TOML-based configuration with snake_case naming.
 */
export interface CodexMcpServer {
  command?: string;
  args?: string[];
  env?: Record<string, string>;
  cwd?: string;
  url?: string;
  startup_timeout_sec?: number;
}

/**
 * Codex CLI MCP configuration format.
 * 
 * @remarks
 * **Official Config Path:**
 * - `~/.codex/config.toml`
 * 
 * **Key Structure:**
 * - Uses TOML format (not JSON)
 * - Uses `mcp_servers` with underscore (not `mcpServers`)
 * - Server configurations use snake_case naming
 * 
 * **Field Support:**
 * - Standard fields: `command`, `args`, `env`, `cwd`, `url`
 * - `startup_timeout_sec`: Timeout in seconds for server startup
 */
export interface CodexCliConfig {
  mcp_servers: Record<string, CodexMcpServer>;
}

/**
 * Cline MCP server configuration.
 * 
 * @remarks
 * Extends base format with dual permission control arrays.
 */
export interface ClineMcpServer extends McpServerBase {
  disabled?: boolean;
  alwaysAllow?: string[];
  autoApprove?: string[];
}

/**
 * Cline MCP configuration format.
 * 
 * @remarks
 * **Official Config Path:**
 * - `cline_mcp_settings.json`
 * 
 * **Key Structure:**
 * - Uses `mcpServers` object with server name as keys
 * - Extended with comprehensive permission controls
 * 
 * **Field Support:**
 * - All standard fields (`command`, `args`, `env`, `url`, `headers`)
 * - `disabled`: Boolean to disable a server without removing it
 * - `alwaysAllow`: Array of tool/resource patterns to always allow without prompting
 * - `autoApprove`: Array of tool/resource patterns to automatically approve
 * 
 * Note: Cline is unique in having both `alwaysAllow` AND `autoApprove` arrays
 */
export interface ClineConfig {
  mcpServers: Record<string, ClineMcpServer>;
}

/**
 * Windsurf MCP configuration format.
 * 
 * @remarks
 * **Official Config Path:**
 * - `mcp_config.json`
 * 
 * **Key Structure:**
 * - Uses `mcpServers` object with server name as keys
 * - Follows standard MCP format
 * 
 * **Field Support:**
 * - Standard fields: `command`, `args`, `env`
 * - `url` (not `serverUrl`): Standard field name for HTTP endpoints
 * - `headers`: HTTP headers
 * 
 * Note: Uses standard `url` field, unlike Antigravity which uses `serverUrl`
 */
export interface WindsurfConfig {
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

/**
 * Claude Code MCP server configuration.
 * 
 * @remarks
 * Extends base format with optional type field.
 */
export interface ClaudeCodeMcpServer extends McpServerBase {
  type?: string;
}

/**
 * Claude Code MCP configuration format.
 * 
 * @remarks
 * **Official Config Path:**
 * - `.claude.json`
 * 
 * **Key Structure:**
 * - Uses `mcpServers` object with server name as keys
 * - Includes server allowlist/denylist arrays at root level
 * 
 * **Field Support:**
 * - All standard fields (`command`, `args`, `env`, `url`, `headers`)
 * - `type`: Optional server type field
 * - `allowedMcpServers`: Array of server names to whitelist
 * - `deniedMcpServers`: Array of server names to blacklist
 */
export interface ClaudeCodeConfig {
  mcpServers: Record<string, ClaudeCodeMcpServer>;
  allowedMcpServers?: string[];
  deniedMcpServers?: string[];
}

/**
 * AmpCode MCP server configuration.
 * 
 * @remarks
 * Supports both local and remote server types with optional enabled flag.
 */
export interface AmpCodeMcpServer {
  type?: 'local' | 'remote';
  command?: string;
  args?: string[];
  env?: Record<string, string>;
  url?: string;
  headers?: Record<string, string>;
  enabled?: boolean;
}

/**
 * AmpCode MCP configuration format.
 * 
 * @remarks
 * **Official Config Path:**
 * - Project: `.amp/settings.json`
 * 
 * **Key Structure:**
 * - Uses `amp.mcpServers` namespaced key within a settings JSON file
 * - Supports both local and remote server types
 * 
 * **Field Support:**
 * - `type`: 'local' or 'remote' server type
 * - `command`, `args`: For local servers
 * - `env`: Environment variables
 * - `url`, `headers`: For remote servers
 * - `enabled`: Boolean to enable/disable server
 */
export interface AmpCodeConfig {
  'amp.mcpServers': Record<string, AmpCodeMcpServer>;
}

/**
 * Zed editor MCP server configuration.
 * 
 * @remarks
 * Follows standard base format.
 */
export type ZedMcpServer = McpServerBase;

/**
 * Zed MCP configuration format.
 * 
 * @remarks
 * **Official Config Path:**
 * - `~/.config/zed/settings.json` (Linux/macOS)
 * - `%APPDATA%\Zed\settings.json` (Windows)
 * - Project: `.zed/settings.json`
 * 
 * **Key Structure:**
 * - Uses `context_servers` (not `mcpServers`) object with server name as keys
 * 
 * **Field Support:**
 * - Standard fields: `command`, `args`, `env`
 * - `url`, `headers` for HTTP transport
 */
export interface ZedConfig {
  context_servers: Record<string, ZedMcpServer>;
}

/**
 * Sourcegraph Cody MCP server configuration.
 * 
 * @remarks
 * Standard format identical to Claude Desktop.
 */
export type SourcegraphCodyMcpServer = McpServerBase;

/**
 * Sourcegraph Cody MCP configuration format.
 * 
 * @remarks
 * **Official Config Path:**
 * - `~/.config/cody/mcp_servers.json` (Linux/macOS)
 * - `%USERPROFILE%\.config\cody\mcp_servers.json` (Windows)
 * 
 * **Key Structure:**
 * - Uses `mcpServers` object with server name as keys
 * 
 * **Field Support:**
 * - Standard fields: `command`, `args`, `env`
 */
export interface SourcegraphCodyConfig {
  mcpServers: Record<string, SourcegraphCodyMcpServer>;
}

/**
 * Goose MCP extension (server) configuration.
 * 
 * @remarks
 * Uses non-standard field names: `cmd` instead of `command`, `envs` instead of `env`.
 */
export interface GooseMcpExtension {
  type?: 'stdio' | 'sse' | 'streamable-http';
  cmd?: string;
  args?: string[];
  env_keys?: string[];
  envs?: Record<string, string>;
  enabled?: boolean;
  timeout?: number;
  name?: string;
  display_name?: string;
  url?: string;
}

/**
 * Goose MCP configuration format.
 * 
 * @remarks
 * **Official Config Path:**
 * - `~/.config/goose/config.yaml`
 * 
 * **Key Structure:**
 * - Uses YAML format
 * - `extensions` is an object with extension name as key
 * - Uses `cmd` (not `command`) and `envs` (not `env`)
 * 
 * **Field Support:**
 * - `type`: Transport type ('stdio', 'sse', 'streamable-http')
 * - `cmd`, `args`: For stdio transport
 * - `envs`: Environment variables (not `env`)
 * - `env_keys`: Array of required env var names
 * - `enabled`: Boolean to enable/disable
 * - `timeout`: Timeout in seconds
 * - `url`: For SSE/HTTP transport
 */
export interface GooseConfig {
  extensions: Record<string, GooseMcpExtension>;
}

/**
 * LibreChat MCP server configuration.
 * 
 * @remarks
 * Extends standard format with transport type and description.
 */
export interface LibreChatMcpServer {
  type?: 'stdio' | 'websocket' | 'sse' | 'streamable-http';
  command?: string;
  args?: string[];
  env?: Record<string, string>;
  url?: string;
  headers?: Record<string, string>;
  description?: string;
  timeout?: number;
}

/**
 * LibreChat MCP configuration format.
 * 
 * @remarks
 * **Official Config Path:**
 * - `librechat.yaml` in project root
 * 
 * **Key Structure:**
 * - Uses YAML format
 * - `mcpServers` object with server name as keys
 * 
 * **Field Support:**
 * - `type`: Transport type ('stdio', 'websocket', 'sse', 'streamable-http')
 * - `command`, `args`: For stdio transport
 * - `env`: Environment variables
 * - `url`, `headers`: For remote transport
 * - `description`: Human-readable server description
 * - `timeout`: Timeout in milliseconds
 */
export interface LibreChatConfig {
  mcpServers: Record<string, LibreChatMcpServer>;
}

export function detectFormat(config: unknown): EditorType | null {
  if (typeof config !== 'object' || config === null) return null;

  const obj = config as Record<string, unknown>;

  // Claude Code specific: has "allowedMcpServers" or "deniedMcpServers" key
  if ('allowedMcpServers' in obj || 'deniedMcpServers' in obj) {
    return 'claude-code';
  }

  // Codex CLI specific: has "mcp_servers" key (underscore)
  if ('mcp_servers' in obj && typeof obj.mcp_servers === 'object') {
    return 'codex-cli';
  }

  // VS Code / Copilot CLI specific: has "servers" key (not "mcpServers")
  if ('servers' in obj && typeof obj.servers === 'object') {
    return 'vscode';
  }

  // AmpCode specific: has "amp.mcpServers" key
  if ('amp.mcpServers' in obj && typeof obj['amp.mcpServers'] === 'object') {
    return 'ampcode';
  }

  // Zed specific: has "context_servers" key
  if ('context_servers' in obj && typeof obj.context_servers === 'object') {
    return 'zed';
  }

  // Goose specific: has "extensions" key (YAML-parsed)
  if ('extensions' in obj && typeof obj.extensions === 'object') {
    return 'goose';
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
      // Cline-specific: has both alwaysAllow AND autoApprove
      if ('alwaysAllow' in firstServer && 'autoApprove' in firstServer) {
        return 'cline';
      }
      // Roo Code specific: has alwaysAllow but not autoApprove
      if ('alwaysAllow' in firstServer) {
        return 'roo-code';
      }
      // Cursor-specific: has autoApprove but not alwaysAllow
      if ('autoApprove' in firstServer) {
        return 'cursor';
      }
    }

    // Default to claude-desktop as it's the most common
    return 'claude-desktop';
  }

  return null;
}
