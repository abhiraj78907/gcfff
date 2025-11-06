# Vite Import Resolution for @shared Aliases

## Overview
This document describes the import resolution setup for accessing shared code from the root `src` directory across all apps in the Medichain project.

## Configuration Summary

### Alias Configuration
All apps use the `@shared` alias to access shared contexts and utilities from the root `src` directory.

**Path Resolution:**
- From any app directory (e.g., `apps/medichain-nexus-suite/`)
- `@shared` resolves to `../../src` → `src/` (root level)

### Files Using @shared

1. **Admin Dashboard** (`apps/medichain-nexus-suite/`)
   - `src/components/layout/DashboardHeader.tsx`
   - Imports: `@shared/contexts/AuthContext`, `@shared/contexts/SubEntryContext`

2. **Doctor Dashboard** (`apps/doclens-ai-assist/`)
   - `src/components/DoctorHeader.tsx`
   - Imports: `@shared/contexts/AuthContext`, `@shared/contexts/SubEntryContext`

3. **Lab Technician** (`apps/bloodwatch-suite/`)
   - `src/components/LabHeader.tsx`
   - Imports: `@shared/contexts/AuthContext`, `@shared/contexts/SubEntryContext`

4. **Receptionist** (`apps/health-chain-gate/`, `apps/seva-gate-dash/`)
   - Various header components
   - Imports: `@shared/contexts/AuthContext`, `@shared/contexts/SubEntryContext`

## Vite Configuration

Each app's `vite.config.ts` includes:

```typescript
resolve: {
  alias: {
    "@": path.resolve(__dirname, "./src"),
    "@shared": path.resolve(__dirname, "../../src"),
    // ... other app-specific aliases
  },
}
```

## TypeScript Configuration

Each app's `tsconfig.app.json` includes:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@shared/*": ["../../src/*"]
    }
  }
}
```

## Shared Contexts Location

- `src/contexts/AuthContext.tsx` ✅ Verified
- `src/contexts/SubEntryContext.tsx` ✅ Verified

## Usage Example

```typescript
// ✅ Correct
import { useAuth } from "@shared/contexts/AuthContext";
import { useSubEntry } from "@shared/contexts/SubEntryContext";

// ❌ Incorrect (relative paths)
import { useAuth } from "../../../../src/contexts/AuthContext";
```

## Troubleshooting

### If imports fail to resolve:

1. **Restart Vite dev server** - Aliases are resolved at server start
   ```bash
   # Stop the server (Ctrl+C) and restart
   npm run dev
   ```

2. **Verify file existence:**
   ```bash
   # From project root
   Test-Path "src\contexts\AuthContext.tsx"  # Should return True
   ```

3. **Check alias configuration:**
   - Verify `vite.config.ts` has `@shared` alias
   - Verify `tsconfig.app.json` has `@shared/*` path mapping
   - Ensure path resolution is correct: `../../src` from app directory

4. **Clear cache:**
   ```bash
   # Delete node_modules/.vite cache if issues persist
   rm -rf node_modules/.vite
   ```

## Apps Configured

- ✅ `apps/medichain-nexus-suite/`
- ✅ `apps/doclens-ai-assist/`
- ✅ `apps/bloodwatch-suite/`
- ✅ `apps/health-chain-gate/`
- ✅ `apps/seva-gate-dash/`

## HMR Settings

All apps include HMR overlay settings in `vite.config.ts`:

```typescript
server: {
  hmr: {
    overlay: true,  // Set to false to disable error overlay
  },
}
```

## Best Practices

1. Always use `@shared` alias for root `src` imports
2. Keep relative paths only for same-directory or sibling imports
3. Restart dev server after changing alias configurations
4. Verify TypeScript path mappings match Vite aliases

