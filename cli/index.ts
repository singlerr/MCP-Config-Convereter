#!/usr/bin/env node
import { Command } from 'commander';
import { syncCommand } from './commands/sync';
import { getSupportedEditorIds } from './lib/editor-paths';

const program = new Command();

const supportedEditors = getSupportedEditorIds().join(', ');

program
    .name('mcpconv')
    .description('Sync MCP configurations across different AI code editors')
    .version('1.0.0');

program
    .command('sync')
    .description('Detect config in current directory and sync to installed editors')
    .option(
        '-t, --target <editors...>',
        `Target specific editors (use "all" for all installed). Supported: ${supportedEditors}`,
    )
    .option('-d, --dry-run', 'Show what would be done without making changes')
    .option('-v, --verbose', 'Show detailed output')
    .option('-f, --force', 'Overwrite without confirmation')
    .action(syncCommand);

program
    .command('list')
    .description('List installed editors and their config paths')
    .action(async () => {
        const { findInstalledEditors } = await import('./lib/detector');
        const chalk = (await import('chalk')).default;

        console.log(chalk.blue('\n🔍 Scanning for installed editors...\n'));

        const installed = findInstalledEditors();

        if (installed.length === 0) {
            console.log(chalk.yellow('No editors found.'));
            return;
        }

        console.log(chalk.green(`Found ${installed.length} editor(s):\n`));

        for (const editor of installed) {
            const status = editor.exists
                ? chalk.green('✓ Config exists')
                : chalk.gray('○ No config');

            console.log(`  ${chalk.bold(editor.editor.name)} (${editor.editor.id})`);
            console.log(`    ${status}`);
            console.log(chalk.gray(`    ${editor.configPath}`));
            console.log('');
        }
    });

program
    .command('editors')
    .description('List all supported editors')
    .action(async () => {
        const { editorPaths } = await import('./lib/editor-paths');
        const chalk = (await import('chalk')).default;

        console.log(chalk.blue('\nSupported editors:\n'));

        for (const editor of editorPaths) {
            console.log(`  ${chalk.bold(editor.name)}`);
            console.log(chalk.gray(`    ID: ${editor.id}`));
            console.log(chalk.gray(`    Config: ${editor.configFileName}`));
            console.log(chalk.gray(`    Format: ${editor.format.toUpperCase()}`));
            console.log('');
        }
    });

program.parse();
