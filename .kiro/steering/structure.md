# Project Structure

## Monorepo Organization
This is a pnpm workspace monorepo with the following structure:

```
├── packages/           # Shared packages
│   ├── fuma-content/   # CLI tool for HTTP collections
│   └── fuma-react/     # React component library
├── tenant/             # Main documentation platform
├── web/                # Multi-tenant webapp
└── package.json        # Root workspace configuration
```

## Application Structure

### Tenant App (`/tenant`)
- **Next.js App Router** with TypeScript
- **Route Structure**:
  - `/app/docs/[[...slug]]/` - Reference documentation pages
  - `/app/rest/[[...slug]]/` - REST API documentation
  - `/app/plate/` - Rich text editor interface
  - `/app/api/` - API routes (search, proxy)
- **Key Directories**:
  - `/components/` - React components
  - `/hooks/` - Custom React hooks
  - `/lib/` - Utility functions and configurations

### Web App (`/web`)
- **Next.js marketing site** with Tailwind CSS
- Standard Next.js App Router structure

### Packages
- **fuma-content**: CLI tool with TypeScript, exports as `@trythis/fuma-content`
- **fuma-react**: Component library with TypeScript declarations

## Conventions

### File Naming
- Use kebab-case for directories and files
- React components use PascalCase
- API routes follow Next.js conventions (`route.ts`)

### Import Paths
- Use `@/` alias for relative imports within each app
- Packages use scoped names (`@trythis/`)

### Configuration Files
- Each app has its own `tsconfig.json`, `package.json`
- Shared workspace configuration in root
- Tailwind and PostCSS configs per app