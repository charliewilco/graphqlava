# GraphQL AST Assertions

Type guards for narrowing GraphQL `ValueNode` variants without hand-written `kind` checks.

## Install

```sh
npm install @graphqlava/graphql-ast-assertions graphql
```

## Usage

```ts
import { Kind } from "graphql";
import {
	isBooleanTypeNode,
	isIntTypeNode,
	isVariableNode,
} from "@graphqlava/graphql-ast-assertions";

const valueNode = {
	kind: Kind.VARIABLE,
	name: {
		kind: Kind.NAME,
		value: "foo",
	},
};

if (isVariableNode(valueNode)) {
	console.log(valueNode.name.value);
}

if (isIntTypeNode(valueNode)) {
	console.log("integer");
}

if (isBooleanTypeNode(valueNode)) {
	console.log("boolean");
}
```

These helpers are intentionally tiny: they do not transform nodes or walk the AST, they just provide typed guards for GraphQL value-node branches.

## API

- `isVariableNode(value: ValueNode): value is VariableNode`
- `isNullNode(value: ValueNode): value is NullValueNode`
- `isListTypeNode(value: ValueNode): value is ListValueNode`
- `isIntTypeNode(value: ValueNode): value is IntValueNode`
- `isFloatTypeNode(value: ValueNode): value is FloatValueNode`
- `isBooleanTypeNode(value: ValueNode): value is BooleanValueNode`
- `isEnumTypeNode(value: ValueNode): value is EnumValueNode`
- `isObjectTypeNode(value: ValueNode): value is ObjectValueNode`

## Requirements

- Node.js `24+`
- `graphql` `^16.13.2`
