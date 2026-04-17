# GraphQL Depth Limit

Validation rule for rejecting GraphQL operations that exceed a maximum depth.

## Install

```sh
npm install @graphqlava/graphql-depth-limit graphql
```

## Usage

```ts
import { depthLimit } from "@graphqlava/graphql-depth-limit";
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

## Behavior Notes

- Fragment spreads and inline fragments contribute to the final depth calculation.
- Introspection fields such as `__typename` are ignored by default.
- `ignore` lets you skip fields by exact name, `RegExp`, or a predicate function that receives the field name.

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

- Node.js `18.18+`
- `graphql` `^16.13.2`
