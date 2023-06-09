import { Kind } from "graphql";
import type {
	VariableNode,
	NullValueNode,
	ValueNode,
	ListValueNode,
	IntValueNode,
	FloatValueNode,
	BooleanValueNode,
	EnumValueNode,
	ObjectValueNode,
} from "graphql";

export function isVariableNode(value: ValueNode): value is VariableNode {
	return value.kind === Kind.VARIABLE;
}

export function isNullNode(value: ValueNode): value is NullValueNode {
	return value.kind === Kind.NULL;
}

export function isListTypeNode(value: ValueNode): value is ListValueNode {
	return value.kind === Kind.LIST;
}

export function isIntTypeNode(value: ValueNode): value is IntValueNode {
	return value.kind === Kind.INT;
}

export function isFloatTypeNode(value: ValueNode): value is FloatValueNode {
	return value.kind === Kind.FLOAT;
}

export function isBooleanTypeNode(value: ValueNode): value is BooleanValueNode {
	return value.kind === Kind.BOOLEAN;
}

export function isEnumTypeNode(value: ValueNode): value is EnumValueNode {
	return value.kind === Kind.ENUM;
}

export function isObjectTypeNode(value: ValueNode): value is ObjectValueNode {
	return value.kind === Kind.OBJECT;
}
