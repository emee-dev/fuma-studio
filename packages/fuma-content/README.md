# @trythis/fuma-content

A CLI tool for bundling HTTP collections and UI components from various sources for use in Fuma Studio. Currently supports Bruno, Panda, and Yaak HTTP clients for API collections, plus UI component bundling capabilities.

## Installation

```bash
npm install -g @trythis/fuma-content
```

Or use with npx:

```bash
npx @trythis/fuma-content [command]
```

## Commands

### `build <collection>`

Bundles your HTTP collection for use in Fuma Studio.

**Current Implementation Status**: ✅ Bruno collections are fully implemented and functional. Panda and Yaak support is planned but not yet implemented.

### `ui <path>`

Builds UI components for use in Fuma Studio.

**Current Implementation Status**: ⚠️ Command structure is defined but implementation is incomplete.

#### Usage

```bash
fuma-content build <collection> --api-key <your-api-key> --rest-client <client>
```

#### Arguments

- `<collection>` - Path to your HTTP collection directory or file

#### Required Options

- `--api-key <key>` - Your Fuma Studio API key for authentication
- `--rc, --rest-client <value>` - Specify your REST client type
  - Choices: `panda`, `bruno`, `yaak`
  - **Note**: Currently only `bruno` is fully implemented

#### Examples

**Bundle a Bruno collection (Fully Supported):**

```bash
fuma-content build ./my-api-collection --api-key your-api-key-here --rest-client bruno
```

**Bundle a Panda collection (Planned):**

```bash
# This will be supported in future versions
fuma-content build ./api-docs --api-key your-api-key-here --rc panda
```

**Bundle a Yaak collection (Planned):**

```bash
# This will be supported in future versions
fuma-content build ./collections/main --api-key your-api-key-here --rest-client yaak
```

### `ui <path>`

Builds UI components for use in Fuma Studio.

#### Usage

```bash
fuma-content ui <path> --api-key <your-api-key>
```

#### Arguments

- `<path>` - Path to your UI component directory or file

#### Required Options

- `--api-key <key>` - Your Fuma Studio API key for authentication

#### Examples

**Build UI components:**

```bash
fuma-content ui ./ui-components --api-key your-api-key-here
```

**Note**: This command is currently in development. The CLI accepts the arguments but the implementation is not yet complete.

### Global Options

- `-v, --version` - Display version number
- `-h, --help` - Display help information

## CLI Command Reference

### Program Information

The CLI is built using Commander.js and provides the following metadata:

- **Name**: `fuma-content`
- **Description**: "Bundles your HTTP collections for use in Fuma Studio. Currently supports Panda, Bruno HTTP clients."
- **Version**: Automatically retrieved from `package.json`

### Version Information

```bash
# Display version number
fuma-content --version
fuma-content -v

# Display help information
fuma-content --help
fuma-content -h

# Get help for specific commands
fuma-content build --help
fuma-content ui --help
```

### Command Structure

The CLI follows this structure:

```
fuma-content <command> <arguments> [options]
```

Where:

- `<command>`: Required command name (`build` or `ui`)
- `<arguments>`: Required positional arguments specific to each command
- `[options]`: Optional flags and parameters

## Supported REST Clients

### Bruno ✅ Fully Implemented

- Processes `.bru` files from your Bruno collection
- Maintains folder structure and organization
- Includes request content and metadata
- Recursively scans directories for `.bru` files
- Normalizes file paths for cross-platform compatibility
- Preserves relative path structure within collections

**Output Format**: Returns a structured array of entries containing:

- File entries with content, name, relative path, and absolute path
- Folder entries with children array and path information
- Normalized paths using forward slashes

### Panda 🚧 Planned

- Support for Panda HTTP client collections
- Implementation planned for future release

### Yaak 🚧 Planned

- Support for Yaak HTTP client collections
- Implementation planned for future release

## How It Works

The CLI tool recursively processes your collection directory:

1. **Scans** the specified collection path for supported file types
2. **Bundles** all requests and folders into a structured format
3. **Preserves** the original organization and hierarchy
4. **Outputs** a collection ready for Fuma Studio integration

### Bruno Collection Processing

The Bruno implementation (`bundleBrunoCollections`) works as follows:

1. **Path Resolution**: Resolves the collection path relative to the current working directory
2. **Recursive Scanning**: Walks through all directories and subdirectories
3. **File Filtering**: Only processes files with `.bru` extension
4. **Structure Preservation**: Maintains the original folder hierarchy
5. **Content Reading**: Reads file contents as UTF-8 text
6. **Path Normalization**: Converts Windows paths to forward slashes for consistency
7. **Output Generation**: Creates structured entries with:
   - `type`: "file" or "folder"
   - `name`: File/folder name
   - `relativePath`: Path relative to collection root (prefixed with `./`)
   - `absolutePath`: Normalized absolute path
   - `content`: File content (for files only)
   - `children`: Array of child entries (for folders only)

#### Bundle Options

The `bundleBrunoCollections` function accepts these options:

```typescript
type BundleOptions = {
  cwd: string; // Current working directory
  collectionPath: string; // Path to the collection directory
  extensions: string[]; // File extensions to process (e.g., [".bru"])
};
```

#### Entry Types

The function returns an array of entries with this structure:

```typescript
// File entry
type EntryFile = {
  type: "file";
  content: string; // UTF-8 file content
  name: string; // File name with extension
  relativePath: string; // Relative path from collection root
  absolutePath: string; // Normalized absolute path
};

// Folder entry
type EntryFolder = {
  type: "folder";
  children: Entry[]; // Array of child entries
  name: string; // Folder name
  relativePath: string; // Relative path from collection root
  absolutePath: string; // Normalized absolute path
};
```

### Current Output

When running with Bruno collections, the tool currently:

- Logs the parsed options to console using `console.log(options)`
- Processes and structures the collection using `bundleBrunoCollections()`
- Outputs the complete collection structure using `console.dir(collections, { depth: null })`
- **Note**: Integration with Fuma Studio API is not yet implemented

#### Debug Output Format

The CLI currently outputs debug information in this format:

```bash
# Options object showing parsed CLI arguments
{ apiKey: 'your-api-key', restClient: 'bruno' }

# Complete collection structure with full depth
[
  {
    type: 'file',
    content: '...',
    name: 'example.bru',
    relativePath: './example.bru',
    absolutePath: 'path/to/collection/example.bru'
  },
  {
    type: 'folder',
    children: [...],
    name: 'subfolder',
    relativePath: './subfolder',
    absolutePath: 'path/to/collection/subfolder'
  }
]
```

## Error Handling

The CLI provides comprehensive error handling with helpful messages and tips:

### Error Types and Messages

- **File not found (ENOENT)**:
  - Message: "Error: [original error message]"
  - Tip: "Check that the specified path exists and is accessible."
- **Permission denied (EACCES)**:

  - Message: "Error: [original error message]"
  - Tip: "Check file permissions for the specified path."

- **General errors**: Display the error message with optional verbose details

### Error Handling Function

The CLI uses a centralized error handler:

```typescript
function handleError(error: Error, verbose?: boolean): void {
  if (verbose) {
    console.error("Error details:", error);
  } else {
    console.error(`Error: ${error.message}`);
  }

  // Provides actionable guidance based on error type
  // Exits with code 1
}
```

### Verbose Mode

While the `verbose` option is defined in the types, it's not currently exposed as a CLI flag. When implemented, it will show full error details including stack traces.

## Development

This package is part of the Fuma Studio monorepo and uses:

- **TypeScript**: For type safety and modern JavaScript features
- **Commander.js**: For CLI argument parsing and command structure
- **Node.js File System APIs**: For collection processing and file operations
- **tsdown**: For TypeScript compilation and bundling

### Dependencies

**Runtime Dependencies:**

- `@usebruno/lang@^0.27.0`: Bruno language parser
- `arktype@^2.1.20`: Runtime type validation
- `axios@^1.11.0`: HTTP client for API requests
- `commander@14.0.0`: CLI framework
- `zod@4.0.16`: Schema validation

**Development Dependencies:**

- `tsdown@0.14.2`: TypeScript bundler
- `typescript@^5.8.3`: TypeScript compiler

### Build Process

```bash
# Build the package
pnpm run build

# The built CLI will be available at ./dist/bin/index.js
```

### Project Structure

```
packages/fuma-content/
├── src/
│   ├── index.ts              # Main CLI entry point
│   ├── types.ts              # TypeScript type definitions
│   └── commands/
│       └── bundle.ts         # Bruno collection bundling logic
├── package.json              # Package configuration
└── README.md                 # This file
```

### Known Issues

1. **Unused Variables**: The `ui` command has unused variables (`tenantUi`, `options`) that need cleanup
2. **Incomplete Implementation**: Panda and Yaak support is not implemented
3. **API Integration**: Fuma Studio API integration is not yet complete
4. **Error Handling**: Some error cases may need additional handling

### Signal Handling

The CLI gracefully handles process signals:

- **SIGINT (Ctrl+C)**: Displays "Operation cancelled by user." and exits cleanly
- **SIGTERM**: Displays "Operation terminated." and exits cleanly

### Exit Codes

- `0`: Success or graceful shutdown
- `1`: Error occurred (with detailed error message and tips)

## License

Part of the Fuma Studio platform.
