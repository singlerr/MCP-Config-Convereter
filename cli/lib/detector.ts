// Detect installed editors by checking if their config directories exist
import * as fs from 'fs';
import * as path from 'path';
import { editorPaths, getConfigPath, type EditorPaths } from './editor-paths';

export interface InstalledEditor {
    editor: EditorPaths;
    configPath: string;
    exists: boolean;
    parentDirExists: boolean;
}

/**
 * Check if an editor is installed by verifying its config directory exists
 */
export function checkEditorInstalled(editor: EditorPaths): InstalledEditor {
    const configPath = getConfigPath(editor);
    const parentDir = path.dirname(configPath);

    return {
        editor,
        configPath,
        exists: fs.existsSync(configPath),
        parentDirExists: fs.existsSync(parentDir),
    };
}

/**
 * Find all installed editors on the system
 * An editor is considered "installed" if its parent config directory exists
 */
export function findInstalledEditors(): InstalledEditor[] {
    return editorPaths
        .map(editor => checkEditorInstalled(editor))
        .filter(result => result.parentDirExists);
}

/**
 * Find editors that have existing config files
 */
export function findEditorsWithConfig(): InstalledEditor[] {
    return editorPaths
        .map(editor => checkEditorInstalled(editor))
        .filter(result => result.exists);
}

/**
 * Get installed editor by ID
 */
export function getInstalledEditor(editorId: string): InstalledEditor | null {
    const editor = editorPaths.find(e => e.id === editorId);
    if (!editor) return null;

    const result = checkEditorInstalled(editor);
    return result.parentDirExists ? result : null;
}
