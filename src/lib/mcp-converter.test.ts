import { describe, it, expect } from 'vitest';
import { parseToUniversal, convertFromUniversal } from './mcp-converter';
import type {
  OpenCodeConfig,
  AntigravityConfig,
  GeminiCliConfig,
  ContinueDevConfig,
  CodexCliConfig,
} from './mcp-formats';

describe('mcp-converter field variations', () => {
  describe('OpenCode command-as-array format', () => {
    it('should parse command as array', () => {
      const config: OpenCodeConfig = {
        mcp: {
          filesystem: {
            type: 'local',
            command: ['uvx', 'perplexica-mcp', 'stdio'],
            environment: {
              API_KEY: 'test',
            },
            enabled: true,
          },
        },
      };

      const universal = parseToUniversal(config, 'opencode');

      expect(universal.servers).toHaveLength(1);
      expect(universal.servers[0].name).toBe('filesystem');
      expect(universal.servers[0].command).toBe('uvx');
      expect(universal.servers[0].args).toEqual(['perplexica-mcp', 'stdio']);
      expect(universal.servers[0].env).toEqual({ API_KEY: 'test' });
    });

    it('should convert to command as array', () => {
      const universal = {
        servers: [
          {
            name: 'filesystem',
            transport: 'stdio' as const,
            command: 'npx',
            args: ['-y', '@modelcontextprotocol/server-filesystem'],
            env: { PATH: '/usr/bin' },
            cwd: '/home/user',
          },
        ],
      };

      const result = convertFromUniversal(universal, 'opencode') as OpenCodeConfig;

      expect(result.mcp.filesystem.type).toBe('local');
      expect(result.mcp.filesystem.command).toEqual(['npx', '-y', '@modelcontextprotocol/server-filesystem']);
      expect(result.mcp.filesystem.environment).toEqual({ PATH: '/usr/bin' });
      expect(result.mcp.filesystem.cwd).toBe('/home/user');
    });

    it('should handle both env and environment fields', () => {
      const configWithEnv: OpenCodeConfig = {
        mcp: {
          server1: {
            type: 'local',
            command: ['node', 'server.js'],
            env: { KEY1: 'value1' },
            enabled: true,
          },
        },
      };

      const configWithEnvironment: OpenCodeConfig = {
        mcp: {
          server2: {
            type: 'local',
            command: ['node', 'server.js'],
            environment: { KEY2: 'value2' },
            enabled: true,
          },
        },
      };

      const universal1 = parseToUniversal(configWithEnv, 'opencode');
      const universal2 = parseToUniversal(configWithEnvironment, 'opencode');

      expect(universal1.servers[0].env).toEqual({ KEY1: 'value1' });
      expect(universal2.servers[0].env).toEqual({ KEY2: 'value2' });
    });

    it('should handle string command format', () => {
      const config: OpenCodeConfig = {
        mcp: {
          filesystem: {
            type: 'local',
            command: 'node',
            args: ['server.js'],
            enabled: true,
          },
        },
      };

      const universal = parseToUniversal(config, 'opencode');

      expect(universal.servers[0].command).toBe('node');
      expect(universal.servers[0].args).toEqual(['server.js']);
    });
  });

  describe('Antigravity serverUrl field', () => {
    it('should parse serverUrl field', () => {
      const config: AntigravityConfig = {
        mcpServers: {
          remote: {
            serverUrl: 'http://localhost:3000',
            headers: { Authorization: 'Bearer token' },
          },
        },
      };

      const universal = parseToUniversal(config, 'antigravity');

      expect(universal.servers).toHaveLength(1);
      expect(universal.servers[0].name).toBe('remote');
      expect(universal.servers[0].transport).toBe('http');
      expect(universal.servers[0].url).toBe('http://localhost:3000');
      expect(universal.servers[0].headers).toEqual({ Authorization: 'Bearer token' });
    });

    it('should convert to serverUrl field', () => {
      const universal = {
        servers: [
          {
            name: 'remote',
            transport: 'http' as const,
            url: 'http://localhost:3000',
            headers: { 'X-API-Key': 'secret' },
          },
        ],
      };

      const result = convertFromUniversal(universal, 'antigravity') as AntigravityConfig;

      expect(result.mcpServers.remote.serverUrl).toBe('http://localhost:3000');
      expect(result.mcpServers.remote.headers).toEqual({ 'X-API-Key': 'secret' });
    });

    it('should handle stdio servers without serverUrl', () => {
      const config: AntigravityConfig = {
        mcpServers: {
          local: {
            command: 'npx',
            args: ['-y', 'server'],
            env: { NODE_ENV: 'production' },
          },
        },
      };

      const universal = parseToUniversal(config, 'antigravity');

      expect(universal.servers[0].transport).toBe('stdio');
      expect(universal.servers[0].url).toBeUndefined();
    });
  });

  describe('Gemini httpUrl field', () => {
    it('should parse httpUrl field', () => {
      const config: GeminiCliConfig = {
        mcpServers: {
          remote: {
            httpUrl: 'http://localhost:4000/mcp',
            headers: { 'Content-Type': 'application/json' },
            timeout: 30000,
          },
        },
      };

      const universal = parseToUniversal(config, 'gemini-cli');

      expect(universal.servers).toHaveLength(1);
      expect(universal.servers[0].name).toBe('remote');
      expect(universal.servers[0].transport).toBe('http');
      expect(universal.servers[0].url).toBe('http://localhost:4000/mcp');
      expect(universal.servers[0].timeout).toBe(30000);
    });

    it('should parse url field (standard)', () => {
      const config: GeminiCliConfig = {
        mcpServers: {
          remote: {
            url: 'http://localhost:4000/mcp',
            timeout: 15000,
          },
        },
      };

      const universal = parseToUniversal(config, 'gemini-cli');

      expect(universal.servers[0].url).toBe('http://localhost:4000/mcp');
      expect(universal.servers[0].timeout).toBe(15000);
    });

    it('should prefer url over httpUrl when both present', () => {
      const config: GeminiCliConfig = {
        mcpServers: {
          remote: {
            url: 'http://localhost:5000',
            httpUrl: 'http://localhost:4000',
          },
        },
      };

      const universal = parseToUniversal(config, 'gemini-cli');

      expect(universal.servers[0].url).toBe('http://localhost:5000');
    });

    it('should convert to url field (not httpUrl)', () => {
      const universal = {
        servers: [
          {
            name: 'remote',
            transport: 'http' as const,
            url: 'http://localhost:4000',
            timeout: 20000,
          },
        ],
      };

      const result = convertFromUniversal(universal, 'gemini-cli') as GeminiCliConfig;

      expect(result.mcpServers.remote.url).toBe('http://localhost:4000');
      expect(result.mcpServers.remote.timeout).toBe(20000);
      // Should not have httpUrl field
      expect('httpUrl' in result.mcpServers.remote).toBe(false);
    });
  });

  describe('Continue Dev array-based mcpServers', () => {
    it('should parse array-based mcpServers', () => {
      const config: ContinueDevConfig = {
        name: 'Test Config',
        version: '0.0.1',
        schema: 'v1',
        mcpServers: [
          {
            name: 'filesystem',
            type: 'stdio',
            command: 'npx',
            args: ['-y', '@modelcontextprotocol/server-filesystem'],
            env: { DEBUG: 'true' },
          },
          {
            name: 'remote',
            type: 'sse',
            url: 'http://localhost:3000/sse',
          },
        ],
      };

      const universal = parseToUniversal(config, 'continue-dev');

      expect(universal.servers).toHaveLength(2);
      expect(universal.servers[0].name).toBe('filesystem');
      expect(universal.servers[0].command).toBe('npx');
      expect(universal.servers[0].transport).toBe('stdio');
      expect(universal.servers[1].name).toBe('remote');
      expect(universal.servers[1].transport).toBe('sse');
      expect(universal.servers[1].url).toBe('http://localhost:3000/sse');
    });

    it('should convert to array-based mcpServers', () => {
      const universal = {
        servers: [
          {
            name: 'server1',
            transport: 'stdio' as const,
            command: 'node',
            args: ['index.js'],
            env: { PORT: '3000' },
          },
          {
            name: 'server2',
            transport: 'sse' as const,
            url: 'http://localhost:4000',
          },
        ],
      };

      const result = convertFromUniversal(universal, 'continue-dev') as ContinueDevConfig;

      expect(Array.isArray(result.mcpServers)).toBe(true);
      expect(result.mcpServers).toHaveLength(2);
      expect(result.mcpServers[0].name).toBe('server1');
      expect(result.mcpServers[0].command).toBe('node');
      expect(result.mcpServers[1].name).toBe('server2');
      expect(result.mcpServers[1].type).toBe('sse');
    });

    it('should handle streamable-http type', () => {
      const config: ContinueDevConfig = {
        mcpServers: [
          {
            name: 'http-server',
            type: 'streamable-http',
            url: 'http://localhost:5000',
          },
        ],
      };

      const universal = parseToUniversal(config, 'continue-dev');

      expect(universal.servers[0].transport).toBe('http');
    });

    it('should convert http transport to streamable-http type', () => {
      const universal = {
        servers: [
          {
            name: 'http-server',
            transport: 'http' as const,
            url: 'http://localhost:5000',
          },
        ],
      };

      const result = convertFromUniversal(universal, 'continue-dev') as ContinueDevConfig;

      expect(result.mcpServers[0].type).toBe('streamable-http');
    });
  });

  describe('Codex CLI mcp_servers with underscores', () => {
    it('should parse mcp_servers field', () => {
      const config: CodexCliConfig = {
        mcp_servers: {
          filesystem: {
            command: 'npx',
            args: ['-y', '@modelcontextprotocol/server-filesystem'],
            env: { HOME: '/home/user' },
            cwd: '/workspace',
            startup_timeout_sec: 30,
          },
        },
      };

      const universal = parseToUniversal(config, 'codex-cli');

      expect(universal.servers).toHaveLength(1);
      expect(universal.servers[0].name).toBe('filesystem');
      expect(universal.servers[0].command).toBe('npx');
      expect(universal.servers[0].cwd).toBe('/workspace');
      expect(universal.servers[0].timeout).toBe(30000); // 30 seconds = 30000 ms
    });

    it('should convert to mcp_servers field', () => {
      const universal = {
        servers: [
          {
            name: 'filesystem',
            transport: 'stdio' as const,
            command: 'node',
            args: ['server.js'],
            env: { NODE_ENV: 'development' },
            cwd: '/app',
            timeout: 45000, // 45 seconds in milliseconds
          },
        ],
      };

      const result = convertFromUniversal(universal, 'codex-cli') as CodexCliConfig;

      expect(result.mcp_servers).toBeDefined();
      expect('mcpServers' in result).toBe(false);
      expect(result.mcp_servers.filesystem.command).toBe('node');
      expect(result.mcp_servers.filesystem.cwd).toBe('/app');
      expect(result.mcp_servers.filesystem.startup_timeout_sec).toBe(45); // Converted to seconds
    });

    it('should handle HTTP servers', () => {
      const config: CodexCliConfig = {
        mcp_servers: {
          remote: {
            url: 'http://localhost:3000/mcp',
          },
        },
      };

      const universal = parseToUniversal(config, 'codex-cli');

      expect(universal.servers[0].transport).toBe('http');
      expect(universal.servers[0].url).toBe('http://localhost:3000/mcp');
    });

    it('should handle timeout conversion with rounding', () => {
      const universal = {
        servers: [
          {
            name: 'server1',
            transport: 'stdio' as const,
            command: 'node',
            args: [],
            timeout: 12500, // 12.5 seconds
          },
        ],
      };

      const result = convertFromUniversal(universal, 'codex-cli') as CodexCliConfig;

      // Should round 12.5 to 13 seconds
      expect(result.mcp_servers.server1.startup_timeout_sec).toBe(13);
    });
  });

  describe('Cross-format conversions', () => {
    it('should convert OpenCode array command to Antigravity', () => {
      const opencode: OpenCodeConfig = {
        mcp: {
          server: {
            type: 'local',
            command: ['uvx', 'mcp-server', '--flag'],
            enabled: true,
          },
        },
      };

      const universal = parseToUniversal(opencode, 'opencode');
      const antigravity = convertFromUniversal(universal, 'antigravity') as AntigravityConfig;

      expect(antigravity.mcpServers.server.command).toBe('uvx');
      expect(antigravity.mcpServers.server.args).toEqual(['mcp-server', '--flag']);
    });

    it('should convert Gemini httpUrl to Continue Dev array format', () => {
      const gemini: GeminiCliConfig = {
        mcpServers: {
          remote: {
            httpUrl: 'http://localhost:4000',
            timeout: 20000,
          },
        },
      };

      const universal = parseToUniversal(gemini, 'gemini-cli');
      const continueDev = convertFromUniversal(universal, 'continue-dev') as ContinueDevConfig;

      expect(Array.isArray(continueDev.mcpServers)).toBe(true);
      expect(continueDev.mcpServers[0].name).toBe('remote');
      expect(continueDev.mcpServers[0].url).toBe('http://localhost:4000');
    });

    it('should convert Codex CLI mcp_servers to OpenCode mcp', () => {
      const codex: CodexCliConfig = {
        mcp_servers: {
          local: {
            command: 'python',
            args: ['-m', 'server'],
            cwd: '/app',
            startup_timeout_sec: 15,
          },
        },
      };

      const universal = parseToUniversal(codex, 'codex-cli');
      const opencode = convertFromUniversal(universal, 'opencode') as OpenCodeConfig;

      expect(opencode.mcp.local.type).toBe('local');
      expect(opencode.mcp.local.command).toEqual(['python', '-m', 'server']);
      expect(opencode.mcp.local.cwd).toBe('/app');
    });
  });

  describe('Round-trip conversion validation for all 16 editors', () => {
    describe('Claude Desktop round-trip', () => {
      it('should preserve stdio server configuration', () => {
        const config = {
          mcpServers: {
            filesystem: {
              command: 'npx',
              args: ['-y', '@modelcontextprotocol/server-filesystem', '/Users/username/Documents'],
              env: { DEBUG: 'mcp:*' },
            },
          },
        };

        const universal = parseToUniversal(config, 'claude-desktop');
        const result = convertFromUniversal(universal, 'claude-desktop');

        expect(result).toEqual(config);
      });

      it('should preserve HTTP server configuration', () => {
        const config = {
          mcpServers: {
            remote: {
              url: 'http://localhost:3000/mcp',
              headers: { Authorization: 'Bearer token123' },
            },
          },
        };

        const universal = parseToUniversal(config, 'claude-desktop');
        const result = convertFromUniversal(universal, 'claude-desktop');

        expect(result).toEqual(config);
      });
    });

    describe('VS Code round-trip', () => {
      it('should preserve servers key and configuration', () => {
        const config = {
          servers: {
            filesystem: {
              command: 'npx',
              args: ['-y', '@modelcontextprotocol/server-filesystem', '/workspace'],
              env: { NODE_ENV: 'production' },
              cwd: '/home/user/projects',
            },
            'sequential-thinking': {
              type: 'stdio' as const,
              command: 'npx',
              args: ['-y', '@modelcontextprotocol/server-sequential-thinking'],
            },
          },
        };

        const universal = parseToUniversal(config, 'vscode');
        const result = convertFromUniversal(universal, 'vscode');

        expect(result).toEqual(config);
      });

      it('should preserve HTTP server with type', () => {
        const config = {
          servers: {
            remote: {
              type: 'http' as const,
              url: 'http://localhost:8080/api',
              headers: { 'X-API-Key': 'secret' },
            },
          },
        };

        const universal = parseToUniversal(config, 'vscode');
        const result = convertFromUniversal(universal, 'vscode');

        expect(result).toEqual(config);
      });
    });

    describe('Windsurf round-trip', () => {
      it('should preserve standard mcpServers format', () => {
        const config = {
          mcpServers: {
            filesystem: {
              command: 'npx',
              args: ['-y', '@modelcontextprotocol/server-filesystem', '/path/to/files'],
            },
            github: {
              command: 'npx',
              args: ['-y', '@modelcontextprotocol/server-github'],
              env: { GITHUB_TOKEN: 'ghp_token123' },
            },
          },
        };

        const universal = parseToUniversal(config, 'windsurf');
        const result = convertFromUniversal(universal, 'windsurf');

        expect(result).toEqual(config);
      });

      it('should preserve url field for HTTP servers', () => {
        const config = {
          mcpServers: {
            remote: {
              url: 'http://api.example.com/mcp',
              headers: { Authorization: 'Bearer xyz' },
            },
          },
        };

        const universal = parseToUniversal(config, 'windsurf');
        const result = convertFromUniversal(universal, 'windsurf');

        expect(result).toEqual(config);
      });
    });

    describe('Cline round-trip', () => {
      it('should preserve alwaysAllow and autoApprove arrays', () => {
        const config = {
          mcpServers: {
            filesystem: {
              command: 'npx',
              args: ['-y', '@modelcontextprotocol/server-filesystem', '/home'],
              disabled: false,
              alwaysAllow: ['read_file', 'list_directory'],
              autoApprove: ['write_file'],
            },
          },
        };

        const universal = parseToUniversal(config, 'cline');
        const result = convertFromUniversal(universal, 'cline');

        expect(result).toEqual(config);
      });

      it('should preserve empty permission arrays', () => {
        const config = {
          mcpServers: {
            sequentialThinking: {
              command: 'uvx',
              args: ['mcp-server-sequential-thinking'],
              disabled: false,
              alwaysAllow: [],
              autoApprove: [],
            },
          },
        };

        const universal = parseToUniversal(config, 'cline');
        const result = convertFromUniversal(universal, 'cline');

        expect(result).toEqual(config);
      });
    });

    describe('Cursor round-trip', () => {
      it('should preserve disabled and autoApprove fields', () => {
        const config = {
          mcpServers: {
            filesystem: {
              command: 'npx',
              args: ['-y', '@modelcontextprotocol/server-filesystem', '/workspace'],
              disabled: false,
              autoApprove: ['read_file', 'search_files'],
            },
          },
        };

        const universal = parseToUniversal(config, 'cursor');
        const result = convertFromUniversal(universal, 'cursor');

        expect(result).toEqual(config);
      });

      it('should handle servers without autoApprove', () => {
        const config = {
          mcpServers: {
            fetch: {
              command: 'uvx',
              args: ['mcp-server-fetch'],
            },
          },
        };

        const universal = parseToUniversal(config, 'cursor');
        const result = convertFromUniversal(universal, 'cursor');

        expect(result).toEqual(config);
      });
    });

    describe('OpenCode round-trip', () => {
      it('should preserve array-based command format', () => {
        const config = {
          mcp: {
            filesystem: {
              type: 'local' as const,
              command: ['uvx', 'mcp-server-filesystem', '/data'],
              environment: { PATH: '/usr/local/bin:/usr/bin' },
              enabled: true,
            },
          },
        };

        const universal = parseToUniversal(config, 'opencode');
        const result = convertFromUniversal(universal, 'opencode');

        expect(result).toEqual(config);
      });

      it('should preserve remote server type', () => {
        const config = {
          mcp: {
            api: {
              type: 'remote' as const,
              url: 'https://api.example.com/mcp',
              headers: { 'X-Custom': 'header' },
              enabled: true,
            },
          },
        };

        const universal = parseToUniversal(config, 'opencode');
        const result = convertFromUniversal(universal, 'opencode');

        expect(result).toEqual(config);
      });
    });

    describe('Gemini CLI round-trip', () => {
      it('should preserve timeout and standard url', () => {
        const config = {
          mcpServers: {
            filesystem: {
              command: 'npx',
              args: ['-y', '@modelcontextprotocol/server-filesystem', '/docs'],
              timeout: 30000,
              env: { LOG_LEVEL: 'debug' },
            },
          },
        };

        const universal = parseToUniversal(config, 'gemini-cli');
        const result = convertFromUniversal(universal, 'gemini-cli');

        expect(result).toEqual(config);
      });

      it('should convert httpUrl to url on round-trip', () => {
        const config = {
          mcpServers: {
            remote: {
              httpUrl: 'http://localhost:5000',
              timeout: 15000,
            },
          },
        };

        const universal = parseToUniversal(config, 'gemini-cli');
        const result = convertFromUniversal(universal, 'gemini-cli');

        expect(result).toEqual({
          mcpServers: {
            remote: {
              url: 'http://localhost:5000',
              timeout: 15000,
            },
          },
        });
      });
    });

    describe('LM Studio round-trip', () => {
      it('should preserve basic mcpServers format', () => {
        const config = {
          mcpServers: {
            filesystem: {
              command: 'npx',
              args: ['-y', '@modelcontextprotocol/server-filesystem', '/storage'],
              env: { DEBUG: 'true' },
            },
            brave: {
              command: 'npx',
              args: ['-y', '@modelcontextprotocol/server-brave-search'],
              env: { BRAVE_API_KEY: 'BSA123' },
            },
          },
        };

        const universal = parseToUniversal(config, 'lmstudio');
        const result = convertFromUniversal(universal, 'lmstudio');

        expect(result).toEqual(config);
      });
    });

    describe('Antigravity round-trip', () => {
      it('should preserve serverUrl field', () => {
        const config = {
          mcpServers: {
            remote: {
              serverUrl: 'http://localhost:3000/api',
              headers: { Authorization: 'Bearer token' },
            },
          },
        };

        const universal = parseToUniversal(config, 'antigravity');
        const result = convertFromUniversal(universal, 'antigravity');

        expect(result).toEqual(config);
      });

      it('should preserve stdio servers', () => {
        const config = {
          mcpServers: {
            'sequential-thinking': {
              command: 'npx',
              args: ['-y', '@modelcontextprotocol/server-sequential-thinking'],
            },
            qdrant: {
              command: 'uvx',
              args: ['mcp-server-qdrant'],
              env: {
                QDRANT_URL: 'http://localhost:6333',
                COLLECTION_NAME: 'my-collection',
              },
            },
          },
        };

        const universal = parseToUniversal(config, 'antigravity');
        const result = convertFromUniversal(universal, 'antigravity');

        expect(result).toEqual(config);
      });
    });

    describe('Junie round-trip', () => {
      it('should preserve standard mcpServers format', () => {
        const config = {
          mcpServers: {
            filesystem: {
              command: 'npx',
              args: ['-y', '@modelcontextprotocol/server-filesystem', '/projects'],
            },
            postgres: {
              command: 'npx',
              args: ['-y', '@modelcontextprotocol/server-postgres'],
              env: { POSTGRES_CONNECTION: 'postgresql://localhost:5432/db' },
            },
          },
        };

        const universal = parseToUniversal(config, 'junie');
        const result = convertFromUniversal(universal, 'junie');

        expect(result).toEqual(config);
      });
    });

    describe('Roo Code round-trip', () => {
      it('should preserve alwaysAllow and disabled fields', () => {
        const config = {
          mcpServers: {
            filesystem: {
              command: 'npx',
              args: ['-y', '@modelcontextprotocol/server-filesystem', '/workspace'],
              cwd: '/home/user',
              alwaysAllow: ['read_file', 'write_file'],
              disabled: false,
            },
          },
        };

        const universal = parseToUniversal(config, 'roo-code');
        const result = convertFromUniversal(universal, 'roo-code');

        expect(result).toEqual(config);
      });

      it('should handle servers without permission arrays', () => {
        const config = {
          mcpServers: {
            github: {
              command: 'uvx',
              args: ['mcp-server-github'],
              env: { GITHUB_TOKEN: 'ghp_xyz' },
            },
          },
        };

        const universal = parseToUniversal(config, 'roo-code');
        const result = convertFromUniversal(universal, 'roo-code');

        expect(result).toEqual(config);
      });
    });

    describe('Copilot CLI round-trip', () => {
      it('should preserve servers key structure', () => {
        const config = {
          servers: {
            filesystem: {
              command: 'npx',
              args: ['-y', '@modelcontextprotocol/server-filesystem', '/code'],
              env: { LOG_LEVEL: 'info' },
              cwd: '/home/dev',
            },
          },
        };

        const universal = parseToUniversal(config, 'copilot-cli');
        const result = convertFromUniversal(universal, 'copilot-cli');

        expect(result).toEqual(config);
      });

      it('should preserve SSE server type', () => {
        const config = {
          servers: {
            events: {
              type: 'sse' as const,
              url: 'http://localhost:4000/events',
            },
          },
        };

        const universal = parseToUniversal(config, 'copilot-cli');
        const result = convertFromUniversal(universal, 'copilot-cli');

        expect(result).toEqual(config);
      });
    });

    describe('Continue Dev round-trip', () => {
      it('should preserve array-based mcpServers', () => {
        const config = {
          name: 'Dev Config',
          version: '0.0.1',
          schema: 'v1',
          mcpServers: [
            {
              name: 'filesystem',
              type: 'stdio' as const,
              command: 'npx',
              args: ['-y', '@modelcontextprotocol/server-filesystem'],
              env: { DEBUG: 'mcp:*' },
            },
            {
              name: 'remote',
              type: 'sse' as const,
              url: 'http://localhost:3000/sse',
            },
          ],
        };

        const universal = parseToUniversal(config, 'continue-dev');
        const result = convertFromUniversal(universal, 'continue-dev');

        expect(result).toEqual({
          name: 'MCP Config',
          version: '0.0.1',
          schema: 'v1',
          mcpServers: [
            {
              name: 'filesystem',
              type: 'stdio',
              command: 'npx',
              args: ['-y', '@modelcontextprotocol/server-filesystem'],
              env: { DEBUG: 'mcp:*' },
            },
            {
              name: 'remote',
              type: 'sse',
              url: 'http://localhost:3000/sse',
            },
          ],
        });
      });

      it('should preserve streamable-http type', () => {
        const config = {
          mcpServers: [
            {
              name: 'api',
              type: 'streamable-http' as const,
              url: 'http://api.example.com',
            },
          ],
        };

        const universal = parseToUniversal(config, 'continue-dev');
        const result = convertFromUniversal(universal, 'continue-dev');

        expect(result).toEqual({
          name: 'MCP Config',
          version: '0.0.1',
          schema: 'v1',
          mcpServers: [
            {
              name: 'api',
              type: 'streamable-http',
              url: 'http://api.example.com',
            },
          ],
        });
      });
    });

    describe('Codex CLI round-trip', () => {
      it('should preserve mcp_servers with underscore', () => {
        const config = {
          mcp_servers: {
            filesystem: {
              command: 'npx',
              args: ['-y', '@modelcontextprotocol/server-filesystem', '/data'],
              env: { NODE_ENV: 'production' },
              cwd: '/app',
            },
          },
        };

        const universal = parseToUniversal(config, 'codex-cli');
        const result = convertFromUniversal(universal, 'codex-cli');

        expect(result).toEqual(config);
      });

      it('should preserve startup_timeout_sec', () => {
        const config = {
          mcp_servers: {
            slow_server: {
              command: 'python',
              args: ['-m', 'server'],
              startup_timeout_sec: 60,
            },
          },
        };

        const universal = parseToUniversal(config, 'codex-cli');
        const result = convertFromUniversal(universal, 'codex-cli');

        expect(result).toEqual(config);
      });
    });

    describe('Claude Code round-trip', () => {
      it('should preserve allowedMcpServers list', () => {
        const config = {
          mcpServers: {
            filesystem: {
              command: 'npx',
              args: ['-y', '@modelcontextprotocol/server-filesystem', '/docs'],
            },
            github: {
              command: 'uvx',
              args: ['mcp-server-github'],
              env: { GITHUB_TOKEN: 'token' },
            },
          },
          allowedMcpServers: ['filesystem', 'github'],
        };

        const universal = parseToUniversal(config, 'claude-code');
        const result = convertFromUniversal(universal, 'claude-code');

        expect(result).toEqual(config);
      });

      it('should add type field and generate allowed list', () => {
        const config = {
          mcpServers: {
            filesystem: {
              command: 'npx',
              args: ['-y', '@modelcontextprotocol/server-filesystem'],
            },
          },
        };

        const universal = parseToUniversal(config, 'claude-code');
        const result = convertFromUniversal(universal, 'claude-code');

        expect(result).toEqual({
          mcpServers: {
            filesystem: {
              type: 'stdio',
              command: 'npx',
              args: ['-y', '@modelcontextprotocol/server-filesystem'],
            },
          },
          allowedMcpServers: ['filesystem'],
        });
      });
    });

    describe('Complex multi-server round-trip tests', () => {
      it('should handle VS Code config with multiple servers and types', () => {
        const config = {
          servers: {
            filesystem: {
              command: 'npx',
              args: ['-y', '@modelcontextprotocol/server-filesystem', '/workspace'],
              env: { DEBUG: 'true' },
              cwd: '/projects',
            },
            remote: {
              type: 'http' as const,
              url: 'http://localhost:8080',
              headers: { Authorization: 'Bearer xyz' },
            },
            sse: {
              type: 'sse' as const,
              url: 'http://localhost:9000/events',
            },
          },
        };

        const universal = parseToUniversal(config, 'vscode');
        const result = convertFromUniversal(universal, 'vscode');

        expect(result).toEqual(config);
      });

      it('should handle Cline config with mixed permission settings', () => {
        const config = {
          mcpServers: {
            filesystem: {
              command: 'npx',
              args: ['-y', '@modelcontextprotocol/server-filesystem'],
              disabled: false,
              alwaysAllow: ['read_file'],
              autoApprove: ['list_directory', 'search_files'],
            },
            github: {
              command: 'uvx',
              args: ['mcp-server-github'],
              env: { GITHUB_TOKEN: 'secret' },
              disabled: false,
              alwaysAllow: [],
              autoApprove: [],
            },
          },
        };

        const universal = parseToUniversal(config, 'cline');
        const result = convertFromUniversal(universal, 'cline');

        expect(result).toEqual(config);
      });
    });

    describe('Cross-editor conversion accuracy', () => {
      it('should correctly convert VS Code servers to Windsurf mcpServers', () => {
        const vscode = {
          servers: {
            filesystem: {
              command: 'npx',
              args: ['-y', '@modelcontextprotocol/server-filesystem'],
            },
          },
        };

        const universal = parseToUniversal(vscode, 'vscode');
        const windsurf = convertFromUniversal(universal, 'windsurf');

        expect(windsurf).toEqual({
          mcpServers: {
            filesystem: {
              command: 'npx',
              args: ['-y', '@modelcontextprotocol/server-filesystem'],
            },
          },
        });
      });

      it('should correctly convert Windsurf url to Antigravity serverUrl', () => {
        const windsurf = {
          mcpServers: {
            remote: {
              url: 'http://localhost:3000',
              headers: { 'X-Key': 'value' },
            },
          },
        };

        const universal = parseToUniversal(windsurf, 'windsurf');
        const antigravity = convertFromUniversal(universal, 'antigravity');

        expect(antigravity).toEqual({
          mcpServers: {
            remote: {
              serverUrl: 'http://localhost:3000',
              headers: { 'X-Key': 'value' },
            },
          },
        });
      });

      it('should correctly convert Cline to Cursor (alwaysAllow to autoApprove)', () => {
        const cline = {
          mcpServers: {
            filesystem: {
              command: 'npx',
              args: ['-y', '@modelcontextprotocol/server-filesystem'],
              disabled: false,
              alwaysAllow: ['read_file', 'write_file'],
              autoApprove: ['search'],
            },
          },
        };

        const universal = parseToUniversal(cline, 'cline');
        const cursor = convertFromUniversal(universal, 'cursor');

        expect(cursor).toEqual({
          mcpServers: {
            filesystem: {
              command: 'npx',
              args: ['-y', '@modelcontextprotocol/server-filesystem'],
            },
          },
        });
      });
    });

    describe('Real-world example configs', () => {
      it('should handle Claude Desktop filesystem and sequential-thinking', () => {
        const config = {
          mcpServers: {
            filesystem: {
              command: 'npx',
              args: ['-y', '@modelcontextprotocol/server-filesystem', '/Users/username/Desktop'],
            },
            'sequential-thinking': {
              command: 'npx',
              args: ['-y', '@modelcontextprotocol/server-sequential-thinking'],
            },
          },
        };

        const universal = parseToUniversal(config, 'claude-desktop');
        const result = convertFromUniversal(universal, 'claude-desktop');

        expect(result).toEqual(config);
      });

      it('should handle OpenCode with uvx command array', () => {
        const config = {
          mcp: {
            perplexica: {
              type: 'local' as const,
              command: ['uvx', 'perplexica-mcp', 'stdio'],
              environment: { PERPLEXICA_API_KEY: 'sk-test' },
              enabled: true,
            },
          },
        };

        const universal = parseToUniversal(config, 'opencode');
        const result = convertFromUniversal(universal, 'opencode');

        expect(result).toEqual(config);
      });

      it('should handle Antigravity qdrant server example', () => {
        const config = {
          mcpServers: {
            qdrant: {
              command: 'uvx',
              args: ['mcp-server-qdrant'],
              env: {
                QDRANT_URL: 'http://localhost:6333',
                COLLECTION_NAME: 'my-collection',
              },
            },
          },
        };

        const universal = parseToUniversal(config, 'antigravity');
        const result = convertFromUniversal(universal, 'antigravity');

        expect(result).toEqual(config);
      });

      it('should handle Codex CLI with timeout configuration', () => {
        const config = {
          mcp_servers: {
            filesystem: {
              command: 'npx',
              args: ['-y', '@modelcontextprotocol/server-filesystem', '/home/user'],
              startup_timeout_sec: 30,
            },
          },
        };

        const universal = parseToUniversal(config, 'codex-cli');
        const result = convertFromUniversal(universal, 'codex-cli');

        expect(result).toEqual(config);
      });
    });
  });
});
