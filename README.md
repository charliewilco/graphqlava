# graphqlava

`graphqlava` is a small monorepo of GraphQL utilities for schema validation and scalar handling. The repo now uses Bun workspaces for installs, scripts, and tests, while package builds still go through `tsup`.

## Packages

- `@reubin/graphql-depth-limit`: GraphQL validation rule for maximum operation depth.
- `@reubin/graphql-ast-assertions`: Type guards for GraphQL AST value nodes.
- `@reubin/graphql-date-ts`: RFC 3339 date, time, and date-time scalars for GraphQL.

## Getting Started

```sh
bun install
```

## Workspace Commands

```sh
bun run typecheck
bun run build
bun run test
bun run format
```

`build`, `typecheck`, and `test` run across every workspace package in sequence. Use `bun run format:write` to apply formatting changes.

## Package Layout

- [`packages/graphql-depth-limit`](./packages/graphql-depth-limit/README.md)
- [`packages/graphql-ast-assertions`](./packages/graphql-ast-assertions/README.md)
- [`packages/graphql-date-ts`](./packages/graphql-date-ts/README.md)
