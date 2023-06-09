# GraphQL AST Assertions

A collection of utility functions that can be used to determine the type of a GraphQL value node. It can be used to inspect a GraphQL AST (Abstract Syntax Tree) and determine the type of value represented by a given node.

## Install

```sh
npm install @reubin/graphql-ast-assertions
```

## Usage

```ts
import { isIntTypeNode, isBooleanTypeNode } from '@reubin/graphql-ast-assertions';

const valueNode = /* value node from a GraphQL AST */;

if (isIntTypeNode(valueNode)) {
  console.log('Value is an integer');
} else if (isBooleanTypeNode(valueNode)) {
  console.log('Value is a boolean');
}
```

## API

The following utility functions are exported by this module:

- `isVariableNode(value: ValueNode): value is VariableNode`: returns true if the value is a GraphQL variable node, false otherwise.
- `isNullNode(value: ValueNode): value is NullValueNode`: returns true if the value is a GraphQL null value node, false otherwise.
- `isListTypeNode(value: ValueNode): value is ListValueNode`: returns true if the value is a GraphQL list value node, false otherwise.
- `isIntTypeNode(value: ValueNode): value is IntValueNode`: returns true if the value is a GraphQL integer value node, false otherwise.
- `isFloatTypeNode(value: ValueNode): value is FloatValueNode`: returns true if the value is a GraphQL float value node, false otherwise.
- `isBooleanTypeNode(value: ValueNode): value is BooleanValueNode`: returns true if the value is a GraphQL boolean value node, false otherwise.
- `isEnumTypeNode(value: ValueNode): value is EnumValueNode`: returns true if the value is a GraphQL enum value node, false otherwise.
- `isObjectTypeNode(value: ValueNode): value is ObjectValueNode`: returns true if the value is a GraphQL object value node, false otherwise.

## Requirements

This module requires the following dependencies:

`graphql`: a GraphQL library for building and executing GraphQL queries.
