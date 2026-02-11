import { describe, it, expect } from 'vitest';
import { convertConfig } from '../lib/mcp-converter';
import type { EditorType } from '../lib/mcp-formats';

describe('MCP Config Converter - New Editors', () => {
    // 1. Roo Code Tests (JSON)
    describe('Roo Code', () => {
        const rooConfig = {
            mcpServers: {
                'roo-server': {
                    command: 'npx',
                    args: ['-y', 'server-package'],
                    env: { API_KEY: 'test-key' },
                    alwaysAllow: ['tool1'],
                    disabled: false,
                },
            },
        };
        const rooString = JSON.stringify(rooConfig, null, 2);

        it('should parse Roo Code config correctly', () => {
            const result = convertConfig(rooString, 'roo-code', 'claude-desktop');
            expect(result.success).toBe(true);
            if (result.success) {
                const output = JSON.parse(result.output);
                expect(output.mcpServers['roo-server']).toBeDefined();
                expect(output.mcpServers['roo-server'].command).toBe('npx');
            }
        });

        it('should convert to Roo Code format correctly', () => {
            const claudeConfig = {
                mcpServers: {
                    'test-server': {
                        command: 'npx',
                        args: ['server'],
                    },
                },
            };
            const result = convertConfig(JSON.stringify(claudeConfig), 'claude-desktop', 'roo-code');
            expect(result.success).toBe(true);
            if (result.success) {
                const output = JSON.parse(result.output);
                expect(output.mcpServers['test-server']).toBeDefined();
            }
        });
    });

    // 2. GitHub Copilot CLI Tests (JSON)
    describe('GitHub Copilot CLI', () => {
        const copilotConfig = {
            servers: {
                'copilot-server': {
                    type: 'stdio',
                    command: 'npx',
                    args: ['server'],
                },
            },
        };
        const copilotString = JSON.stringify(copilotConfig);

        it('should parse Copilot CLI config correctly', () => {
            const result = convertConfig(copilotString, 'copilot-cli', 'claude-desktop');
            expect(result.success).toBe(true);
            if (result.success) {
                const output = JSON.parse(result.output);
                expect(output.mcpServers['copilot-server']).toBeDefined();
            }
        });
    });

    // 3. Continue Dev Tests (YAML)
    describe('Continue Dev', () => {
        const continueYaml = `
name: Test Config
version: 0.0.1
mcpServers:
  - name: continue-server
    type: stdio
    command: npx
    args:
      - server-pkg
    env:
      KEY: value
`;

        it('should parse Continue Dev YAML correctly', () => {
            const result = convertConfig(continueYaml, 'continue-dev', 'claude-desktop');
            expect(result.success).toBe(true);
            if (result.success) {
                const output = JSON.parse(result.output);
                expect(output.mcpServers['continue-server']).toBeDefined();
                expect(output.mcpServers['continue-server'].command).toBe('npx');
            }
        });

        it('should convert to Continue Dev YAML correctly', () => {
            const claudeConfig = {
                mcpServers: {
                    'test-server': {
                        command: 'python',
                        args: ['main.py'],
                    },
                },
            };
            const result = convertConfig(JSON.stringify(claudeConfig), 'claude-desktop', 'continue-dev');
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.output).toContain('name: test-server');
                expect(result.output).toContain('command: python');
            }
        });

        it('should handle invalid YAML gracefully', () => {
            const result = convertConfig('invalid: yaml: content:', 'continue-dev', 'claude-desktop');
            expect(result.success).toBe(false);
        });
    });

    // 4. Codex CLI Tests (TOML)
    describe('Codex CLI', () => {
        const codexToml = `
[mcp_servers.codex-server]
command = "npx"
args = ["server"]
env = { KEY = "val" }
`;

        it('should parse Codex CLI TOML correctly', () => {
            const result = convertConfig(codexToml, 'codex-cli', 'claude-desktop');
            expect(result.success).toBe(true);
            if (result.success) {
                const output = JSON.parse(result.output);
                expect(output.mcpServers['codex-server']).toBeDefined();
                expect(output.mcpServers['codex-server'].command).toBe('npx');
            }
        });

        it('should convert to Codex CLI TOML correctly', () => {
            const claudeConfig = {
                mcpServers: {
                    'test-server': {
                        command: 'node',
                        args: ['index.js'],
                    },
                },
            };
            const result = convertConfig(JSON.stringify(claudeConfig), 'claude-desktop', 'codex-cli');
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.output).toContain('[mcp_servers.test-server]');
                expect(result.output).toContain('command = "node"');
            }
        });

        it('should handle invalid TOML gracefully', () => {
            const result = convertConfig('invalid = [ toml', 'codex-cli', 'claude-desktop');
            expect(result.success).toBe(false);
        });
    });

    // 5. Claude Code Tests (JSON)
    describe('Claude Code', () => {
        const claudeCodeConfig = {
            mcpServers: {
                'cc-server': {
                    type: 'stdio',
                    command: 'npx',
                    args: ['-y', 'server-pkg'],
                },
            },
            allowedMcpServers: ['cc-server'],
        };
        const ccString = JSON.stringify(claudeCodeConfig, null, 2);

        it('should parse Claude Code config correctly', () => {
            const result = convertConfig(ccString, 'claude-code', 'claude-desktop');
            expect(result.success).toBe(true);
            if (result.success) {
                const output = JSON.parse(result.output);
                expect(output.mcpServers['cc-server']).toBeDefined();
            }
        });

        it('should convert to Claude Code format correctly', () => {
            const claudeConfig = {
                mcpServers: {
                    'test-server': {
                        command: 'npx',
                        args: ['server'],
                    },
                },
            };
            const result = convertConfig(JSON.stringify(claudeConfig), 'claude-desktop', 'claude-code');
            expect(result.success).toBe(true);
            if (result.success) {
                const output = JSON.parse(result.output);
                expect(output.mcpServers['test-server']).toBeDefined();
                expect(output.mcpServers['test-server'].type).toBe('stdio');
                expect(output.allowedMcpServers).toContain('test-server');
            }
        });
    });
});

// 6. AmpCode Tests (JSON)
describe('AmpCode', () => {
    const ampCodeConfig = {
        'amp.mcpServers': {
            'fs-server': {
                command: 'npx',
                args: ['-y', '@modelcontextprotocol/server-filesystem', '/data'],
                env: { API_KEY: 'test-key' },
            },
            'remote-api': {
                url: 'http://localhost:3000/mcp',
                headers: { Authorization: 'Bearer token123' },
            },
        },
    };
    const ampString = JSON.stringify(ampCodeConfig, null, 2);

    it('should parse AmpCode config correctly', () => {
        const result = convertConfig(ampString, 'ampcode', 'claude-desktop');
        expect(result.success).toBe(true);
        if (result.success) {
            const output = JSON.parse(result.output);
            expect(output.mcpServers['fs-server']).toBeDefined();
            expect(output.mcpServers['fs-server'].command).toBe('npx');
            expect(output.mcpServers['fs-server'].args).toEqual(['-y', '@modelcontextprotocol/server-filesystem', '/data']);
            expect(output.mcpServers['remote-api']).toBeDefined();
            expect(output.mcpServers['remote-api'].url).toBe('http://localhost:3000/mcp');
        }
    });

    it('should convert to AmpCode format correctly', () => {
        const claudeConfig = {
            mcpServers: {
                'test-server': {
                    command: 'npx',
                    args: ['server'],
                    env: { KEY: 'value' },
                },
            },
        };
        const result = convertConfig(JSON.stringify(claudeConfig), 'claude-desktop', 'ampcode');
        expect(result.success).toBe(true);
        if (result.success) {
            const output = JSON.parse(result.output);
            expect(output['amp.mcpServers']['test-server']).toBeDefined();
            expect(output['amp.mcpServers']['test-server'].command).toBe('npx');
            expect(output['amp.mcpServers']['test-server'].type).toBe('local');
        }
    });

    it('should set type to remote for HTTP servers', () => {
        const claudeConfig = {
            mcpServers: {
                'remote-server': {
                    url: 'http://localhost:8080/api',
                    headers: { 'X-API-Key': 'secret' },
                },
            },
        };
        const result = convertConfig(JSON.stringify(claudeConfig), 'claude-desktop', 'ampcode');
        expect(result.success).toBe(true);
        if (result.success) {
            const output = JSON.parse(result.output);
            expect(output['amp.mcpServers']['remote-server'].type).toBe('remote');
            expect(output['amp.mcpServers']['remote-server'].url).toBe('http://localhost:8080/api');
        }
    });
});

// 7. Zed Tests (JSON)
describe('Zed', () => {
    const zedConfig = {
        context_servers: {
            'fs-server': {
                command: 'npx',
                args: ['-y', '@modelcontextprotocol/server-filesystem', '/data'],
                env: { NODE_ENV: 'production' },
            },
        },
    };
    const zedString = JSON.stringify(zedConfig, null, 2);

    it('should parse Zed config correctly', () => {
        const result = convertConfig(zedString, 'zed', 'claude-desktop');
        expect(result.success).toBe(true);
        if (result.success) {
            const output = JSON.parse(result.output);
            expect(output.mcpServers['fs-server']).toBeDefined();
            expect(output.mcpServers['fs-server'].command).toBe('npx');
            expect(output.mcpServers['fs-server'].args).toEqual(['-y', '@modelcontextprotocol/server-filesystem', '/data']);
        }
    });

    it('should convert to Zed format correctly', () => {
        const claudeConfig = {
            mcpServers: {
                'test-server': {
                    command: 'npx',
                    args: ['server'],
                    env: { KEY: 'value' },
                },
            },
        };
        const result = convertConfig(JSON.stringify(claudeConfig), 'claude-desktop', 'zed');
        expect(result.success).toBe(true);
        if (result.success) {
            const output = JSON.parse(result.output);
            expect(output.context_servers['test-server']).toBeDefined();
            expect(output.context_servers['test-server'].command).toBe('npx');
            expect(output.context_servers['test-server'].env).toEqual({ KEY: 'value' });
        }
    });
});

// 8. Sourcegraph Cody Tests (JSON)
describe('Sourcegraph Cody', () => {
    const codyConfig = {
        mcpServers: {
            'cody-server': {
                command: 'npx',
                args: ['-y', 'server-pkg'],
                env: { CODY_TOKEN: 'token123' },
            },
        },
    };
    const codyString = JSON.stringify(codyConfig, null, 2);

    it('should parse Sourcegraph Cody config correctly', () => {
        const result = convertConfig(codyString, 'sourcegraph-cody', 'claude-desktop');
        expect(result.success).toBe(true);
        if (result.success) {
            const output = JSON.parse(result.output);
            expect(output.mcpServers['cody-server']).toBeDefined();
            expect(output.mcpServers['cody-server'].command).toBe('npx');
        }
    });

    it('should convert to Sourcegraph Cody format correctly', () => {
        const claudeConfig = {
            mcpServers: {
                'test-server': {
                    command: 'node',
                    args: ['index.js'],
                },
            },
        };
        const result = convertConfig(JSON.stringify(claudeConfig), 'claude-desktop', 'sourcegraph-cody');
        expect(result.success).toBe(true);
        if (result.success) {
            const output = JSON.parse(result.output);
            expect(output.mcpServers['test-server']).toBeDefined();
            expect(output.mcpServers['test-server'].command).toBe('node');
        }
    });
});

// 9. Goose Tests (YAML)
describe('Goose', () => {
    const gooseYaml = `
extensions:
  filesystem:
    type: stdio
    cmd: npx
    args:
      - "-y"
      - "@modelcontextprotocol/server-filesystem"
      - "/path/to/files"
    enabled: true
    envs:
      NODE_ENV: production
`;

    it('should parse Goose YAML correctly', () => {
        const result = convertConfig(gooseYaml, 'goose', 'claude-desktop');
        expect(result.success).toBe(true);
        if (result.success) {
            const output = JSON.parse(result.output);
            expect(output.mcpServers['filesystem']).toBeDefined();
            expect(output.mcpServers['filesystem'].command).toBe('npx');
            expect(output.mcpServers['filesystem'].env).toEqual({ NODE_ENV: 'production' });
        }
    });

    it('should convert to Goose YAML correctly', () => {
        const claudeConfig = {
            mcpServers: {
                'test-server': {
                    command: 'python',
                    args: ['main.py'],
                    env: { API_KEY: 'secret' },
                },
            },
        };
        const result = convertConfig(JSON.stringify(claudeConfig), 'claude-desktop', 'goose');
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.output).toContain('cmd: python');
            expect(result.output).toContain('envs:');
            expect(result.output).toContain('enabled: true');
        }
    });

    it('should handle invalid YAML gracefully', () => {
        const result = convertConfig('invalid: yaml: :::content:', 'goose', 'claude-desktop');
        expect(result.success).toBe(false);
    });
});

// 10. LibreChat Tests (YAML)
describe('LibreChat', () => {
    const libreChatYaml = `
mcpServers:
  filesystem:
    type: stdio
    command: npx
    args:
      - "-y"
      - "@modelcontextprotocol/server-filesystem"
      - "/path/to/files"
    timeout: 60000
`;

    it('should parse LibreChat YAML correctly', () => {
        const result = convertConfig(libreChatYaml, 'librechat', 'claude-desktop');
        expect(result.success).toBe(true);
        if (result.success) {
            const output = JSON.parse(result.output);
            expect(output.mcpServers['filesystem']).toBeDefined();
            expect(output.mcpServers['filesystem'].command).toBe('npx');
        }
    });

    it('should convert to LibreChat YAML correctly', () => {
        const claudeConfig = {
            mcpServers: {
                'test-server': {
                    command: 'python',
                    args: ['main.py'],
                },
            },
        };
        const result = convertConfig(JSON.stringify(claudeConfig), 'claude-desktop', 'librechat');
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.output).toContain('type: stdio');
            expect(result.output).toContain('command: python');
        }
    });

    it('should handle invalid YAML gracefully', () => {
        const result = convertConfig('invalid: yaml: :::content:', 'librechat', 'claude-desktop');
        expect(result.success).toBe(false);
    });
});
