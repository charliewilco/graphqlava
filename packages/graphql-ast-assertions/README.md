# GraphQL AST Assertions

Type guards for narrowing GraphQL `ValueNode` variants without hand-written `kind` checks.

## Usage

```ts
import { Kind } from "graphql";
import {
	isBooleanTypeNode,
	isIntTypeNode,
	isVariableNode,
} from "@reubin/graphql-ast-assertions";

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

## API

- `isVariableNode(value: ValueNode): value is VariableNode`
- `isNullNode(value: ValueNode): value is NullValueNode`
- `isListTypeNode(value: ValueNode): value is ListValueNode`
- `isIntTypeNode(value: ValueNode): value is IntValueNode`
- `isFloatTypeNode(value: ValueNode): value is FloatValueNode`
- `isBooleanTypeNode(value: ValueNode): value is BooleanValueNode`
- `isEnumTypeNode(value: ValueNode): value is EnumValueNode`
- `isObjectTypeNode(value: ValueNode): value is ObjectValueNode`
