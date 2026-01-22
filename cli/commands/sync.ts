// Sync command handler
import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';
import { detectConfigsInDirectory, type DetectedConfig } from '../lib/config-detector';
import { findInstalledEditors, type InstalledEditor } from '../lib/detector';
import { editorPaths, getConfigPath, getSupportedEditorIds } from '../lib/editor-paths';
import { parseToUniversal, convertFromUniversal } from '../../src/lib/mcp-converter';
import type { EditorType } from '../../src/lib/mcp-formats';
import YAML from 'yaml';
import * as TOML from '@iarna/toml';
import * as readline from 'readline';

interface SyncOptions {
    target?: string[];
    dryRun?: boolean;
    verbose?: boolean;
    force?: boolean;
}

/**
 * Prompt user for confirmation
 */
async function confirm(message: string): Promise<boolean> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise(resolve => {
        rl.question(`${message} [Y/n] `, answer => {
            rl.close();
            const normalized = answer.trim().toLowerCase();
            resolve(normalized === '' || normalized === 'y' || normalized === 'yes');
        });
    });
}

/**
 * Format output based on editor's file format
 */
function formatOutput(data: unknown, format: 'json' | 'yaml' | 'toml'): string {
    switch (format) {
        case 'yaml':
            return YAML.stringify(data);
        case 'toml':
            return TOML.stringify(data as TOML.JsonMap);
        case 'json':
        default:
            return JSON.stringify(data, null, 2);
    }
}

/**
 * Read and merge existing config for editors that have settings files
 */
function readExistingConfig(filePath: string, format: 'json' | 'yaml' | 'toml'): Record<string, unknown> | null {
    if (!fs.existsSync(filePath)) {
        return null;
    }

    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        switch (format) {
            case 'yaml':
                return YAML.parse(content) as Record<string, unknown>;
            case 'toml':
                return TOML.parse(content) as Record<string, unknown>;
            case 'json':
            default:
                return JSON.parse(content) as Record<string, unknown>;
        }
    } catch {
        return null;
    }
}

/**
 * Parse target option
 * Returns list of editor IDs to target, or null if 'all'
 */
function parseTargets(targets: string[] | undefined): EditorType[] | null {
    if (!targets || targets.length === 0) {
        return null; // Default: all installed editors
    }

    // Check for 'all' keyword
    if (targets.length === 1 && targets[0].toLowerCase() === 'all') {
        return null;
    }

    // Parse comma-separated values
    const editorIds: EditorType[] = [];
    const supportedIds = getSupportedEditorIds();

    for (const target of targets) {
        const parts = target.split(',').map(s => s.trim().toLowerCase());
        for (const part of parts) {
            if (supportedIds.includes(part as EditorType)) {
                editorIds.push(part as EditorType);
            } else {
                console.log(chalk.yellow(`⚠ Unknown editor: ${part}`));
            }
        }
    }

    return editorIds.length > 0 ? editorIds : null;
}

/**
 * Main sync command
 */
export async function syncCommand(options: SyncOptions): Promise<void> {
    const cwd = process.cwd();

    console.log(chalk.blue('\n🔍 Scanning current directory for MCP config files...\n'));

    // Step 1: Detect config files in current directory
    const detectedConfigs = detectConfigsInDirectory(cwd);

    if (detectedConfigs.length === 0) {
        console.log(chalk.red('✗ No MCP config files found in current directory.'));
        console.log(chalk.gray('\nSupported config files:'));
        console.log(chalk.gray('  - claude_desktop_config.json (Claude Desktop)'));
        console.log(chalk.gray('  - .cursor/mcp.json (Cursor)'));
        console.log(chalk.gray('  - .vscode/mcp.json (VS Code)'));
        console.log(chalk.gray('  - settings.json (Gemini CLI)'));
        console.log(chalk.gray('  - mcp.json (LM Studio)'));
        console.log(chalk.gray('  - And more...'));
        process.exit(1);
    }

    // Use the first detected config
    const sourceConfig = detectedConfigs[0];
    console.log(chalk.green(`✓ Detected: ${chalk.bold(sourceConfig.fileName)} (${sourceConfig.editor.name} format)`));

    // Parse to universal format
    let universal;
    try {
        universal = parseToUniversal(sourceConfig.parsed, sourceConfig.editorType);
    } catch (error) {
        console.log(chalk.red(`✗ Failed to parse config: ${error}`));
        process.exit(1);
    }

    if (universal.servers.length === 0) {
        console.log(chalk.red('✗ No MCP servers found in config file.'));
        process.exit(1);
    }

    console.log(chalk.green(`✓ Found ${chalk.bold(universal.servers.length)} MCP server(s):`));
    for (const server of universal.servers) {
        console.log(chalk.gray(`  • ${server.name}`));
    }

    // Step 2: Find installed editors
    console.log(chalk.blue('\n🔍 Scanning for installed editors...\n'));

    const installedEditors = findInstalledEditors();

    // Filter out the source editor
    const targetEditors = installedEditors.filter(
        e => e.editor.id !== sourceConfig.editorType
    );

    if (targetEditors.length === 0) {
        console.log(chalk.yellow('⚠ No other editors found to sync to.'));
        process.exit(0);
    }

    // Parse target option
    const targetIds = parseTargets(options.target);

    // Filter by target option
    let filteredEditors: InstalledEditor[];
    if (targetIds) {
        filteredEditors = targetEditors.filter(e => targetIds.includes(e.editor.id));
        if (filteredEditors.length === 0) {
            console.log(chalk.red('✗ None of the specified target editors are installed.'));
            console.log(chalk.gray('\nInstalled editors:'));
            for (const editor of targetEditors) {
                console.log(chalk.gray(`  • ${editor.editor.name} (${editor.editor.id})`));
            }
            process.exit(1);
        }
    } else {
        filteredEditors = targetEditors;
    }

    console.log(chalk.green('Target editors:'));
    for (const editor of filteredEditors) {
        const status = editor.exists ? chalk.gray('(config exists)') : chalk.gray('(new config)');
        console.log(`  • ${editor.editor.name} ${status}`);
        if (options.verbose) {
            console.log(chalk.gray(`    ${editor.configPath}`));
        }
    }

    // Step 3: Confirm with user (unless --force)
    if (!options.force && !options.dryRun) {
        console.log('');
        const proceed = await confirm(
            chalk.yellow(`Sync ${universal.servers.length} MCP server(s) to ${filteredEditors.length} editor(s)?`)
        );

        if (!proceed) {
            console.log(chalk.gray('Cancelled.'));
            process.exit(0);
        }
    }

    // Step 4: Convert and save to each target
    console.log('');
    let successCount = 0;
    let failCount = 0;

    for (const target of filteredEditors) {
        const targetEditor = target.editor;

        try {
            // Convert to target format
            const converted = convertFromUniversal(universal, targetEditor.id);

            // For editors with mcpKey, we need to merge with existing config
            let finalConfig: unknown = converted;

            if (targetEditor.mcpKey && target.exists) {
                const existingConfig = readExistingConfig(target.configPath, targetEditor.format);
                if (existingConfig) {
                    // Merge: keep existing settings, update MCP servers part
                    const convertedObj = converted as Record<string, unknown>;
                    finalConfig = {
                        ...existingConfig,
                        ...convertedObj,
                    };
                }
            }

            // Format output
            const output = formatOutput(finalConfig, targetEditor.format);

            if (options.dryRun) {
                console.log(chalk.cyan(`[DRY-RUN] Would write to ${target.configPath}:`));
                if (options.verbose) {
                    console.log(chalk.gray(output.substring(0, 500) + (output.length > 500 ? '...' : '')));
                }
            } else {
                // Ensure directory exists
                const dir = path.dirname(target.configPath);
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir, { recursive: true });
                }

                // Write file
                fs.writeFileSync(target.configPath, output, 'utf-8');
                console.log(chalk.green(`✓ Synced to ${targetEditor.name}`));

                if (options.verbose) {
                    console.log(chalk.gray(`  → ${target.configPath}`));
                }
            }

            successCount++;
        } catch (error) {
            console.log(chalk.red(`✗ Failed to sync to ${targetEditor.name}: ${error}`));
            failCount++;
        }
    }

    // Summary
    console.log('');
    if (options.dryRun) {
        console.log(chalk.cyan(`[DRY-RUN] Would sync to ${successCount} editor(s).`));
    } else {
        console.log(
            chalk.green(`✓ Done! ${universal.servers.length} MCP server(s) synced to ${successCount} editor(s).`)
        );
        if (failCount > 0) {
            console.log(chalk.red(`  ${failCount} editor(s) failed.`));
        }
    }
}
