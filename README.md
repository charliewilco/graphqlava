# GraphQLava 🌋

`graphqlava` is a small npm workspace of GraphQL utilities for schema validation, AST narrowing, and RFC 3339 scalar handling. The repository targets Node.js 24+ and uses npm workspaces for installs, package builds, and release automation.

## Packages

| Package                              | Use it when you need                                          | Install                                                  |
| ------------------------------------ | ------------------------------------------------------------- | -------------------------------------------------------- |
| `@graphqlava/graphql-depth-limit`    | a GraphQL validation rule that rejects overly deep operations | `npm install @graphqlava/graphql-depth-limit graphql`    |
| `@graphqlava/graphql-ast-assertions` | small type guards for narrowing GraphQL `ValueNode` variants  | `npm install @graphqlava/graphql-ast-assertions graphql` |
| `@graphqlava/graphql-date-ts`        | RFC 3339 `Date`, `Time`, and `DateTime` GraphQL scalars       | `npm install @graphqlava/graphql-date-ts graphql`        |

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
npm run changeset
npm run version-packages
```

Use `npm run format:write` to apply formatting changes. The workspace scripts run across all packages via npm workspaces. `npm run changeset` creates release notes for the next versioned change, and `npm run version-packages` applies queued Changesets locally.

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

The repo also includes a Changesets release workflow that prepares version PRs on `main` and can publish public packages to npm with provenance when `NPM_TOKEN` is configured.

## Package Layout

- [`packages/graphql-depth-limit`](./packages/graphql-depth-limit/README.md)
- [`packages/graphql-ast-assertions`](./packages/graphql-ast-assertions/README.md)
- [`packages/graphql-date-ts`](./packages/graphql-date-ts/README.md)
