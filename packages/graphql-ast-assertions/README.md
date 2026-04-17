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
	isBooleanValueNode,
	isIntValueNode,
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

if (isIntValueNode(valueNode)) {
	console.log("integer");
}

if (isBooleanValueNode(valueNode)) {
	console.log("boolean");
}
```

These helpers are intentionally tiny: they do not transform nodes or walk the AST, they just provide typed guards for GraphQL value-node branches. The older `*TypeNode` names are still exported as compatibility aliases, but the `*ValueNode` names are the accurate API going forward.

## API

- `isVariableNode(value: ValueNode): value is VariableNode`
- `isNullNode(value: ValueNode): value is NullValueNode`
- `isListValueNode(value: ValueNode): value is ListValueNode`
- `isIntValueNode(value: ValueNode): value is IntValueNode`
- `isFloatValueNode(value: ValueNode): value is FloatValueNode`
- `isBooleanValueNode(value: ValueNode): value is BooleanValueNode`
- `isEnumValueNode(value: ValueNode): value is EnumValueNode`
- `isObjectValueNode(value: ValueNode): value is ObjectValueNode`
- `isListTypeNode(value: ValueNode): value is ListValueNode`
- `isIntTypeNode(value: ValueNode): value is IntValueNode`
- `isFloatTypeNode(value: ValueNode): value is FloatValueNode`
- `isBooleanTypeNode(value: ValueNode): value is BooleanValueNode`
- `isEnumTypeNode(value: ValueNode): value is EnumValueNode`
- `isObjectTypeNode(value: ValueNode): value is ObjectValueNode`

## Requirements

- Node.js `24+`
- `graphql` `^16.13.2`
