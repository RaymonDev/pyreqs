![Pyreqs Banner](pyrequs_extension/images/icon.png)

# pyreqs

Welcome to **pyreqs**, a Visual Studio Code extension that automatically generates a ```requirements.txt``` file for your Python projects. With pyreqs, you can save time and ensure your dependencies are accurately listed by scanning your project files.

## Features


- **Automatic Dependency Detection**: Scans all ```.py``` files in your workspace to identify required libraries.

- **Excludes Standard Libraries**: Filters out Python's built-in modules, ensuring only external libraries are included.

- **Handles ```.gitignore```**: Respects your ```.gitignore``` file to avoid unnecessary files and directories like ```.venv```.

- **One-Click Execution**: Generate a ```requirements.txt``` file by simply running the ```Generate requirements.txt``` command.

## Example

1. Open your Python project in VS Code.

2. Run the command ```Generate requirements.txt``` from the Command Palette (```Ctrl+Shift+P``` or ```Cmd+Shift+P``` on macOS).

3. Find your ```requirements.txt``` file in the root of your workspace.


## Extension Settings

This extension currently does not require additional settings. Future updates may include customizable options.

## Known Issues

- Large projects with thousands of files may take longer to scan.

- Nested imports within dynamically loaded modules might not be detected.

## Release Notes

### 1.0.0

- Initial release of pyreqs.

- Automatic generation of ```requirements.txt``` with standard library exclusion using Command Palette

- ```.gitignore``` support to exclude ignored files and directories.
