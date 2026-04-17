# graphqlava

`graphqlava` is a small npm workspace of GraphQL utilities for schema validation, AST narrowing, and RFC 3339 scalar handling. The repository targets Node.js 24+ and uses npm workspaces for installs and task orchestration.

## Packages

- `@reubin/graphql-depth-limit`: GraphQL validation rule for maximum operation depth.
- `@reubin/graphql-ast-assertions`: Type guards for GraphQL AST value nodes.
- `@reubin/graphql-date-ts`: RFC 3339 date, time, and date-time scalars for GraphQL.

## Getting Started

```sh
npm install
```

## Workspace Commands

```sh
npm run typecheck
npm run build
npm run test
npm run format
npm run check
```

Use `npm run format:write` to apply formatting changes. The workspace scripts run across all packages via npm workspaces, and CI uses the same commands on Node.js 24.

## Requirements

- Node.js `24+`
- npm `11+`

## Continuous Integration

GitHub Actions runs the full verification pass on pushes to `main` and on pull requests:

- `npm ci`
- `npm run format`
- `npm run typecheck`
- `npm run build`
- `npm run test`

## Package Layout

- [`packages/graphql-depth-limit`](./packages/graphql-depth-limit/README.md)
- [`packages/graphql-ast-assertions`](./packages/graphql-ast-assertions/README.md)
- [`packages/graphql-date-ts`](./packages/graphql-date-ts/README.md)
