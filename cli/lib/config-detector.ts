// Config file detection in current directory
import * as fs from 'fs';
import * as path from 'path';
import type { EditorType } from '../../src/lib/mcp-formats';
import { detectFormat } from '../../src/lib/mcp-formats';
import { editorPaths, type EditorPaths } from './editor-paths';
import YAML from 'yaml';
import * as TOML from '@iarna/toml';

export interface DetectedConfig {
    filePath: string;
    fileName: string;
    editorType: EditorType;
    editor: EditorPaths;
    content: string;
    parsed: unknown;
}

// Config file patterns to search for
const CONFIG_PATTERNS = [
    // Claude Desktop
    'claude_desktop_config.json',
    // Cursor
    '.cursor/mcp.json',
    'mcp.json',
    // VS Code
    '.vscode/mcp.json',
    // OpenCode
    'opencode.json',
    // Gemini CLI
    'settings.json',
    '.gemini/settings.json',
    // LM Studio
    // Antigravity
    'mcp_config.json',
    // Roo Code
    '.roo/mcp.json',
    'cline_mcp_settings.json',
    // Copilot CLI
    'mcp-config.json',
    // Continue
    'config.yaml',
    '.continue/config.yaml',
    // Codex CLI
    'config.toml',
    '.codex/config.toml',
];

/**
 * Try to detect the editor type from a file path
 */
function detectEditorFromPath(filePath: string): EditorType | null {
    const fileName = path.basename(filePath);
    const parentDir = path.basename(path.dirname(filePath));

    // Check specific patterns
    if (fileName === 'claude_desktop_config.json') return 'claude-desktop';
    if (fileName === 'mcp.json' && parentDir === '.cursor') return 'cursor';
    if (fileName === 'mcp.json' && parentDir === '.vscode') return 'vscode';
    if (fileName === 'mcp.json' && parentDir === '.roo') return 'roo-code';
    if (fileName === 'opencode.json') return 'opencode';
    if (fileName === 'mcp_config.json') return 'antigravity';
    if (fileName === 'mcp-config.json') return 'copilot-cli';
    if (fileName === 'cline_mcp_settings.json') return 'roo-code';
    if (fileName === 'config.yaml' && parentDir === '.continue') return 'continue-dev';
    if (fileName === 'config.toml' && parentDir === '.codex') return 'codex-cli';

    return null;
}

/**
 * Parse config file based on format
 */
function parseConfigFile(content: string, format: 'json' | 'yaml' | 'toml'): unknown {
    switch (format) {
        case 'yaml':
            return YAML.parse(content);
        case 'toml':
            return TOML.parse(content);
        case 'json':
        default:
            return JSON.parse(content);
    }
}

/**
 * Get file format from extension
 */
function getFileFormat(filePath: string): 'json' | 'yaml' | 'toml' {
    const ext = path.extname(filePath).toLowerCase();
    if (ext === '.yaml' || ext === '.yml') return 'yaml';
    if (ext === '.toml') return 'toml';
    return 'json';
}

/**
 * Detect MCP config files in the given directory
 */
export function detectConfigsInDirectory(directory: string): DetectedConfig[] {
    const results: DetectedConfig[] = [];

    for (const pattern of CONFIG_PATTERNS) {
        const filePath = path.join(directory, pattern);

        if (fs.existsSync(filePath)) {
            try {
                const content = fs.readFileSync(filePath, 'utf-8');
                const format = getFileFormat(filePath);
                const parsed = parseConfigFile(content, format);

                // Try to detect editor from path first
                let editorType = detectEditorFromPath(filePath);

                // If not detected from path, try to detect from content
                if (!editorType && format === 'json') {
                    editorType = detectFormat(parsed);
                }

                if (editorType) {
                    const editor = editorPaths.find(e => e.id === editorType);
                    if (editor) {
                        results.push({
                            filePath,
                            fileName: path.basename(filePath),
                            editorType,
                            editor,
                            content,
                            parsed,
                        });
                    }
                }
            } catch {
                // Skip files that can't be parsed
                continue;
            }
        }
    }

    return results;
}

/**
 * Detect a single config file and return its info
 */
export function detectConfigFile(filePath: string): DetectedConfig | null {
    if (!fs.existsSync(filePath)) {
        return null;
    }

    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const format = getFileFormat(filePath);
        const parsed = parseConfigFile(content, format);

        let editorType = detectEditorFromPath(filePath);

        if (!editorType && format === 'json') {
            editorType = detectFormat(parsed);
        }

        if (editorType) {
            const editor = editorPaths.find(e => e.id === editorType);
            if (editor) {
                return {
                    filePath,
                    fileName: path.basename(filePath),
                    editorType,
                    editor,
                    content,
                    parsed,
                };
            }
        }
    } catch {
        return null;
    }

    return null;
}
