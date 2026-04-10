# Repository Guidelines

## Project Structure & Module Organization

This repository is a Bun workspace with three packages under `packages/`:

- `packages/graphql-ast-assertions`: GraphQL AST type guards
- `packages/graphql-date-ts`: RFC 3339 GraphQL date/time scalars
- `packages/graphql-depth-limit`: GraphQL validation rule for query depth

Each package follows the same layout:

- `src/`: library source
- `test/`: Bun test files such as `index.test.ts`
- `dist/`: generated build output from `tsup`

Root-level files coordinate the workspace: [`package.json`](/Users/charliewilco/Developer/graphqlava/package.json), [`bun.lock`](/Users/charliewilco/Developer/graphqlava/bun.lock), [`README.md`](/Users/charliewilco/Developer/graphqlava/README.md), and this guide.

## Build, Test, and Development Commands

Run all commands from the repository root.

- `bun install`: install workspace dependencies
- `bun run typecheck`: run `tsc --noEmit` in every package
- `bun run build`: build all packages with `tsup`
- `bun run test`: run the full Bun test suite across workspaces
- `bun run format`: check formatting with Prettier
- `bun run format:write`: apply Prettier formatting
- `bun run check`: full local verification pass

## Coding Style & Naming Conventions

- Use TypeScript with tabs for indentation.
- Keep imports at the top of the file.
- Prefer small, package-local modules over cross-package shortcuts.
- Use clear export names like `GraphQLDateTime`, `depthLimit`, and `isVariableNode`.
- Test files should use the `*.test.ts` pattern.

Formatting is enforced with Prettier 3. Keep generated output out of manual edits unless a build step requires regeneration.

## Testing Guidelines

Tests use Bun’s built-in runner via `bun:test`. Prefer explicit assertions over snapshots; this repo recently removed Jest snapshots in favor of direct message and value checks.

Place tests in each package’s `test/` directory and keep them close to the public API they verify. Run `bun run test` before opening a PR, and use `bun run check` for full validation.

## Commit & Pull Request Guidelines

Current history favors short, imperative commit messages, for example:

- `Migrate workspace to Bun`
- `adding initial commit`

Use concise subject lines that describe the repo-level change. For pull requests, include:

- a short summary of the change
- affected package(s)
- verification performed, for example `bun run check`
- linked issue or context if the change is not self-explanatory
