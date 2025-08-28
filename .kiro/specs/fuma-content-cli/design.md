# Design Document

## Overview

The fuma-content CLI will be restructured to use Commander.js for robust command-line interface management. The design follows a modular architecture where each command is implemented as a separate module, with shared utilities for common operations like file handling, validation, and logging.

## Architecture

### High-Level Structure
```
packages/fuma-content/
├── src/
│   ├── commands/           # Command implementations
│   │   ├── bundle.ts       # Bundle command with subcommands
│   │   ├── validate.ts     # Validation command
│   │   └── info.ts         # Info command
│   ├── core/              # Core business logic
│   │   ├── bundlers/      # Collection bundling logic
│   │   ├── validators/    # Collection validation logic
│   │   └── parsers/       # Collection parsing logic
│   ├── utils/             # Shared utilities
│   │   ├── logger.ts      # Logging utilities
│   │   ├── file-system.ts # File system operations
│   │   └── error-handler.ts # Error handling
│   └── index.ts           # Main CLI setup
├── bin/
│   └── index.ts           # Entry point
└── package.json
```

### Command Structure
The CLI will use Commander.js with the following command hierarchy:

```
fuma-content
├── bundle <type> <source>     # Bundle collections
│   ├── bruno <source>         # Bundle Bruno collections
│   └── panda <source>         # Bundle Panda collections
├── validate <source>          # Validate collections
└── info <source>              # Display collection info
```

## Components and Interfaces

### CLI Entry Point (`src/index.ts`)
```typescript
interface CLIOptions {
  verbose?: boolean;
  output?: string;
  type?: 'bruno' | 'panda';
}

interface Command {
  name: string;
  description: string;
  execute(args: string[], options: CLIOptions): Promise<void>;
}
```

### Bundle Command (`src/commands/bundle.ts`)
```typescript
interface BundleOptions extends CLIOptions {
  output: string; // Required for bundle command
}

interface BundleResult {
  success: boolean;
  outputPath: string;
  collectionCount: number;
  requestCount: number;
}
```

### Validation Command (`src/commands/validate.ts`)
```typescript
interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

interface ValidationError {
  file: string;
  line?: number;
  message: string;
  severity: 'error' | 'warning';
}
```

### Info Command (`src/commands/info.ts`)
```typescript
interface CollectionInfo {
  type: 'bruno' | 'panda';
  path: string;
  collections: CollectionMetadata[];
  totalRequests: number;
  totalEndpoints: number;
}

interface CollectionMetadata {
  name: string;
  requestCount: number;
  endpoints: string[];
  variables: Record<string, string>;
}
```

### Core Bundlers (`src/core/bundlers/`)
```typescript
interface Bundler {
  type: 'bruno' | 'panda';
  bundle(sourcePath: string, outputPath: string): Promise<BundleResult>;
  validate(sourcePath: string): Promise<ValidationResult>;
  getInfo(sourcePath: string): Promise<CollectionInfo>;
}

class BrunoBundler implements Bundler {
  type = 'bruno' as const;
  // Implementation using @usebruno/lang
}

class PandaBundler implements Bundler {
  type = 'panda' as const;
  // Implementation for Panda collections
}
```

## Data Models

### Collection Structure
```typescript
interface Collection {
  name: string;
  version: string;
  requests: Request[];
  environments: Environment[];
  variables: Variable[];
}

interface Request {
  id: string;
  name?: string;
  method: string;
  url: string;
  headers?: Record<string, string>;
  body?: RequestBody;
  tests?: Test[];
}

interface Environment {
  name: string;
  variables: Record<string, string>;
}
```

### Configuration
```typescript
interface CLIConfig {
  defaultOutputPath: string;
  logLevel: 'error' | 'warn' | 'info' | 'debug';
  supportedTypes: ('bruno' | 'panda')[];
}
```

## Error Handling

### Error Types
```typescript
class CLIError extends Error {
  constructor(
    message: string,
    public code: string,
    public exitCode: number = 1
  ) {
    super(message);
  }
}

class FileSystemError extends CLIError {
  constructor(path: string, operation: string) {
    super(`Failed to ${operation} file: ${path}`, 'FS_ERROR');
  }
}

class ValidationError extends CLIError {
  constructor(message: string, public file?: string, public line?: number) {
    super(message, 'VALIDATION_ERROR');
  }
}
```

### Error Handling Strategy
1. **Graceful Degradation**: Commands should handle partial failures and continue processing when possible
2. **Clear Messages**: All errors should provide actionable guidance to users
3. **Exit Codes**: Different error types should use appropriate exit codes for scripting
4. **Cleanup**: Temporary files should be cleaned up on error or interruption

## Testing Strategy

### Unit Tests
- Test each command module independently
- Mock file system operations for consistent testing
- Test error conditions and edge cases
- Validate command parsing and option handling

### Integration Tests
- Test complete command workflows with real collection files
- Test file system operations with temporary directories
- Validate output formats and file generation
- Test error scenarios with invalid inputs

### Test Structure
```
packages/fuma-content/
├── tests/
│   ├── unit/
│   │   ├── commands/
│   │   ├── core/
│   │   └── utils/
│   ├── integration/
│   │   ├── fixtures/      # Sample collection files
│   │   └── scenarios/     # End-to-end test scenarios
│   └── helpers/           # Test utilities
```

### Testing Tools
- **Vitest**: Test runner and assertion library
- **Mock File System**: For testing file operations without real I/O
- **Temporary Directories**: For integration tests requiring real files

## Implementation Notes

### Commander.js Integration
- Use Commander.js v14 features for modern CLI patterns
- Implement proper help text and examples for each command
- Use subcommands for bundle operations (bruno/panda)
- Implement global options (--verbose, --help, --version)

### File System Operations
- Use async/await for all file operations
- Implement proper error handling for missing files/directories
- Support both relative and absolute paths
- Validate file permissions before operations

### Logging and Output
- Implement structured logging with different levels
- Use colors and formatting for better UX (when TTY is available)
- Provide progress indicators for long-running operations
- Support JSON output format for scripting scenarios

### Performance Considerations
- Stream large files instead of loading entirely into memory
- Implement concurrent processing for multiple collections
- Cache parsed results when processing multiple commands
- Use efficient data structures for collection metad