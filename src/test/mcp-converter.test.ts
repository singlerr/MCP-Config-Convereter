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
