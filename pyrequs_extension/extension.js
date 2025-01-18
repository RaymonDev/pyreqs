// Import necessary VS Code modules
const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const ignore = require('ignore');

/**
 * This function extracts library names from Python files by analyzing import statements.
 * @param {string} fileContent - Content of a Python file.
 * @returns {Set<string>} - A set of library names.
 */
function extractLibraries(fileContent) {
    const standardLibraries = new Set([
        "abc", "argparse", "collections", "copy", "datetime", "functools", "json", 
        "math", "os", "random", "re", "shutil", "sys", "time", "types", "unittest", 
        "warnings", "itertools", "typing", "subprocess" // Extend this list as needed
    ]);

    const librarySet = new Set();
    const importRegex = /^(?:import|from)\s+([a-zA-Z0-9_]+)/gm;
    let match;

    while ((match = importRegex.exec(fileContent)) !== null) {
        const library = match[1];
        if (!standardLibraries.has(library)) {
            librarySet.add(library);
        }
    }

    return librarySet;
}

/**
 * Reads and parses a .gitignore file to filter out ignored files and directories.
 * @param {string} workspaceFolder - The root folder of the workspace.
 * @returns {ignore.Ignore} - An ignore instance with parsed rules.
 */
function getGitIgnoreFilter(workspaceFolder) {
    const gitignorePath = path.join(workspaceFolder, '.gitignore');
    const ig = ignore();

    if (fs.existsSync(gitignorePath)) {
        const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
        ig.add(gitignoreContent);
    }

    return ig;
}

/**
 * This function reads all Python files in the workspace and generates a `requirements.txt` file.
 */
async function generateRequirements() {
    if (!vscode.workspace.workspaceFolders) {
        vscode.window.showErrorMessage('No workspace folder is open.');
        return;
    }

    const workspaceFolder = vscode.workspace.workspaceFolders[0].uri.fsPath;
    const pythonFiles = [];
    const gitignoreFilter = getGitIgnoreFilter(workspaceFolder);

    // Recursively search for Python files in the workspace
    function findPythonFiles(dir) {
        const files = fs.readdirSync(dir);

        files.forEach(file => {
            const fullPath = path.join(dir, file);
            const relativePath = path.relative(workspaceFolder, fullPath);

            // Skip files and directories ignored by .gitignore
            if (gitignoreFilter.ignores(relativePath)) {
                return;
            }

			// Skip .venv and hidden directories explicitly
			if (file.startsWith('.') || file === 'venv' || file === '.venv' || gitignoreFilter.ignores(relativePath)) {
				return;
			}

            if (fs.statSync(fullPath).isDirectory()) {
                findPythonFiles(fullPath);
            } else if (file.endsWith('.py')) {
                pythonFiles.push(fullPath);
            }
        });
    }

    findPythonFiles(workspaceFolder);

    if (pythonFiles.length === 0) {
        vscode.window.showErrorMessage('No Python files found in the workspace.');
        return;
    }

    const libraries = new Set();

    pythonFiles.forEach(file => {
        const content = fs.readFileSync(file, 'utf8');
        const fileLibraries = extractLibraries(content);
        fileLibraries.forEach(lib => libraries.add(lib));
    });

    const requirementsContent = Array.from(libraries).join('\n');
    const requirementsPath = path.join(workspaceFolder, 'requirements.txt');

    fs.writeFileSync(requirementsPath, requirementsContent, 'utf8');

    vscode.window.showInformationMessage('requirements.txt has been generated.');
}

/**
 * This method is called when the extension is activated.
 * @param {vscode.ExtensionContext} context - The extension context.
 */
function activate(context) {
    const disposable = vscode.commands.registerCommand('pyreqs.generateRequirements', generateRequirements);
    context.subscriptions.push(disposable);
}

/**
 * This method is called when the extension is deactivated.
 */
function deactivate() {}

module.exports = {
    activate,
    deactivate
};
