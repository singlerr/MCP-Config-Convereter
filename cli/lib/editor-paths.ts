// Editor configuration types for CLI
import type { EditorType } from '../../src/lib/mcp-formats';

export interface EditorPaths {
    id: EditorType;
    name: string;
    configFileName: string;
    // Global config paths by OS
    paths: {
        windows: string;
        darwin: string; // macOS
        linux: string;
    };
    // For editors that store MCP config within a larger settings file
    mcpKey?: string;
    // File format
    format: 'json' | 'yaml' | 'toml';
}

// Path expansion helper
export function expandPath(path: string): string {
    const homeDir = process.env.HOME || process.env.USERPROFILE || '';
    const appData = process.env.APPDATA || '';
    const userProfile = process.env.USERPROFILE || '';

    return path
        .replace(/^~/, homeDir)
        .replace(/%APPDATA%/gi, appData)
        .replace(/%USERPROFILE%/gi, userProfile);
}

// Get the config path for current OS
export function getConfigPath(editor: EditorPaths): string {
    const platform = process.platform as 'win32' | 'darwin' | 'linux';
    const osKey = platform === 'win32' ? 'windows' : platform;
    const rawPath = editor.paths[osKey] || editor.paths.linux;
    return expandPath(rawPath);
}

// Editor paths configuration
export const editorPaths: EditorPaths[] = [
    {
        id: 'claude-desktop',
        name: 'Claude Desktop',
        configFileName: 'claude_desktop_config.json',
        paths: {
            windows: '%APPDATA%\\Claude\\claude_desktop_config.json',
            darwin: '~/Library/Application Support/Claude/claude_desktop_config.json',
            linux: '~/.config/Claude/claude_desktop_config.json',
        },
        format: 'json',
    },
    {
        id: 'cursor',
        name: 'Cursor',
        configFileName: 'mcp.json',
        paths: {
            windows: '%USERPROFILE%\\.cursor\\mcp.json',
            darwin: '~/.cursor/mcp.json',
            linux: '~/.cursor/mcp.json',
        },
        format: 'json',
    },
    {
        id: 'vscode',
        name: 'VS Code',
        configFileName: 'mcp.json',
        paths: {
            windows: '%APPDATA%\\Code\\User\\mcp.json',
            darwin: '~/Library/Application Support/Code/User/mcp.json',
            linux: '~/.config/Code/User/mcp.json',
        },
        format: 'json',
    },
    {
        id: 'gemini-cli',
        name: 'Gemini CLI',
        configFileName: 'settings.json',
        paths: {
            windows: '%USERPROFILE%\\.gemini\\settings.json',
            darwin: '~/.gemini/settings.json',
            linux: '~/.gemini/settings.json',
        },
        mcpKey: 'mcpServers', // MCP servers are stored within settings.json
        format: 'json',
    },
    {
        id: 'lmstudio',
        name: 'LM Studio',
        configFileName: 'mcp.json',
        paths: {
            windows: '%USERPROFILE%\\.lmstudio\\mcp.json',
            darwin: '~/.lmstudio/mcp.json',
            linux: '~/.lmstudio/mcp.json',
        },
        format: 'json',
    },
    {
        id: 'antigravity',
        name: 'Antigravity',
        configFileName: 'mcp_config.json',
        paths: {
            windows: '%USERPROFILE%\\.gemini\\mcp_config.json',
            darwin: '~/.gemini/mcp_config.json',
            linux: '~/.gemini/mcp_config.json',
        },
        format: 'json',
    },
    {
        id: 'opencode',
        name: 'OpenCode',
        configFileName: 'opencode.json',
        paths: {
            windows: '%USERPROFILE%\\.opencode\\opencode.json',
            darwin: '~/.opencode/opencode.json',
            linux: '~/.opencode/opencode.json',
        },
        format: 'json',
    },
    {
        id: 'copilot-cli',
        name: 'GitHub Copilot CLI',
        configFileName: 'mcp-config.json',
        paths: {
            windows: '%USERPROFILE%\\.copilot\\mcp-config.json',
            darwin: '~/.copilot/mcp-config.json',
            linux: '~/.copilot/mcp-config.json',
        },
        format: 'json',
    },
    {
        id: 'roo-code',
        name: 'Roo Code',
        configFileName: 'cline_mcp_settings.json',
        paths: {
            windows: '%APPDATA%\\Code\\User\\globalStorage\\rooveterinaryinc.roo-cline\\settings\\cline_mcp_settings.json',
            darwin: '~/Library/Application Support/Code/User/globalStorage/rooveterinaryinc.roo-cline/settings/cline_mcp_settings.json',
            linux: '~/.config/Code/User/globalStorage/rooveterinaryinc.roo-cline/settings/cline_mcp_settings.json',
        },
        format: 'json',
    },
    {
        id: 'continue-dev',
        name: 'Continue',
        configFileName: 'config.yaml',
        paths: {
            windows: '%USERPROFILE%\\.continue\\config.yaml',
            darwin: '~/.continue/config.yaml',
            linux: '~/.continue/config.yaml',
        },
        mcpKey: 'mcpServers',
        format: 'yaml',
    },
    {
        id: 'codex-cli',
        name: 'Codex CLI',
        configFileName: 'config.toml',
        paths: {
            windows: '%USERPROFILE%\\.codex\\config.toml',
            darwin: '~/.codex/config.toml',
            linux: '~/.codex/config.toml',
        },
        mcpKey: 'mcp_servers',
        format: 'toml',
    },
];

// Get editor by ID
export function getEditorById(id: EditorType): EditorPaths | undefined {
    return editorPaths.find(e => e.id === id);
}

// Get all supported editor IDs
export function getSupportedEditorIds(): EditorType[] {
    return editorPaths.map(e => e.id);
}
