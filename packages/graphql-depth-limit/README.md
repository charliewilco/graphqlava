# GraphQL Depth Limit

Validation rule for rejecting GraphQL operations that exceed a maximum depth.

## Install

```sh
bun add @reubin/graphql-depth-limit graphql
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

## Options

- `ignore`: Skip depth counting for fields matched by string, `RegExp`, or predicate.
- `callback`: Receive a `{ [operationName]: depth }` map after validation.
