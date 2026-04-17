# GraphQL Date TS

RFC 3339 GraphQL scalars for dates, times, and UTC date-times.

## Workspace Usage

```sh
npm install
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

`GraphQLDate` accepts `YYYY-MM-DD` strings and serializes back to a canonical RFC 3339 date string. `GraphQLTime` accepts RFC 3339 time strings and normalizes serialized output to UTC. `GraphQLDateTime` accepts RFC 3339 date-time strings, and on serialization also accepts JavaScript `Date` objects and 32-bit Unix timestamps.

## Exports

- `GraphQLDate`
- `GraphQLTime`
- `GraphQLDateTime`

## Behavior Notes

- `GraphQLDate.parseValue()` returns a JavaScript `Date` at midnight UTC for the provided date.
- `GraphQLTime.parseValue()` returns a JavaScript `Date` whose date portion is based on the current UTC day.
- `GraphQLDateTime.serialize()` accepts `Date`, RFC 3339 date-time strings, and 32-bit Unix timestamps in seconds.
- All serialization paths normalize timezone offsets to UTC output.

## Requirements

- Node.js `24+`
- `graphql` `^16.13.2`
