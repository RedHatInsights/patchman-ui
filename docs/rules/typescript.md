# TypeScript Rules

Apply these rules when migrating files from JavaScript to TypeScript

## General Guidelines

- Do not introduce unrelated logic changes while adding types
- Favor type safety over convenience (`any` is a last resort)
- Use existing project patterns and types when available
- Prefer inference when it is clear and sufficient

## Typing Strategy

- Use existing types/interfaces from the codebase
- Define minimal types/interfaces when needed
- Use `unknown` over `any` when type is unclear
- Use `any` only as a temporary fallback
- Organize types in dedicated files (`types.ts`) or alongside implementations
- Create a central `types.ts` file or a `src/types` directory for shared types

## React & Redux

- Type props explicitly using `type` or `interface`
- Use typed hooks (`useAppDispatch`, `useAppSelector`) instead of raw Redux hooks
- Type event handlers (`React.ChangeEvent`, etc.)

## State & Data

- Avoid initializing empty arrays/objects without types (`useState<Type[]>([])`)
- Prevent `never[]` by explicitly typing initial state
- Use union types for nullable/optional values (`string | null`)

## API

- Type all API requests and responses
- If API request/response types are unclear, ask for the API spec instead of guessing