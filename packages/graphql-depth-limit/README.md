# GraphQL Depth Limit

Validation rule for rejecting GraphQL operations that exceed a maximum depth.

## Workspace Usage

```sh
npm install
```

## Usage

```ts
import { depthLimit } from "@reubin/graphql-depth-limit";
import { parse, specifiedRules, validate } from "graphql";

const document = parse(`
	query Viewer {
		viewer {
			team {
				name
			}
		}
	}
`);

const errors = validate(schema, document, [...specifiedRules, depthLimit(2)]);
```

The validator measures depth per operation, supports fragment traversal, and ignores GraphQL introspection fields by default.

## Options

- `ignore`: Skip depth counting for fields matched by string, `RegExp`, or predicate.
- `callback`: Receive a `{ [operationName]: depth }` map after validation.

## API

```ts
depthLimit(
	maxDepth: number,
	options?: {
		ignore?: Array<string | RegExp | ((fieldName: string) => boolean)>;
	},
	callback?: (depths: Record<string, number>) => void,
)
```

## Requirements

- Node.js `24+`
- `graphql` `^16.13.2`
