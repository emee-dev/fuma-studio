# Technology Stack

## Build System & Package Management
- **pnpm**: Package manager with workspace support
- **Turbo**: Build system for monorepo optimization
- **Next.js 15**: React framework with App Router
- **TypeScript**: Primary language across all packages

## Frontend Stack
- **React 19**: Latest React with concurrent features
- **Plate.js**: Rich text editor framework
- **Tailwind CSS 4**: Utility-first CSS framework
- **Radix UI**: Headless component primitives
- **Lucide React**: Icon library
- **Shadcn/ui**: Component system built on Radix

## Key Libraries
- **AI SDK**: AI integration for content assistance
- **Zod**: Schema validation
- **Commander**: CLI argument parsing
- **Shiki**: Syntax highlighting
- **React DnD**: Drag and drop functionality

## Common Commands

### Development
```bash
# Start tenant app in development
pnpm tenant:dev

# Start web app in development  
pnpm web:dev

# Build all Fuma packages
pnpm fuma:build
```

### Building
```bash
# Build tenant app
pnpm tenant:build

# Build web app
pnpm web:build
```

### Package-specific commands
```bash
# Run commands in specific workspace
pnpm run --filter=tenant [command]
pnpm run --filter=web [command]
```

## Code Quality
- ESLint for linting
- Knip for unused code detection
- TypeScript strict mode enabled