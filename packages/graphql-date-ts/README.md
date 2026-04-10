# GraphQL Date TS

RFC 3339 GraphQL scalars for dates, times, and UTC date-times.

## Install

```sh
bun add @reubin/graphql-date-ts graphql
```

## Usage

```ts
import {
	GraphQLDate,
	GraphQLDateTime,
	GraphQLTime,
} from "@reubin/graphql-date-ts";

export const resolvers = {
	Date: GraphQLDate,
	DateTime: GraphQLDateTime,
	Time: GraphQLTime,
};
```

## Exports

- `GraphQLDate`
- `GraphQLTime`
- `GraphQLDateTime`
