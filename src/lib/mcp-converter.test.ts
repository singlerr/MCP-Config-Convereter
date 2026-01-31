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
});
