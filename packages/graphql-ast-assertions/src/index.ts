import { Kind } from "graphql";
import type {
	BooleanValueNode,
	EnumValueNode,
	FloatValueNode,
	IntValueNode,
	ListValueNode,
	NullValueNode,
	ObjectValueNode,
	ValueNode,
	VariableNode,
} from "graphql";

export function isVariableNode(value: ValueNode): value is VariableNode {
	return value.kind === Kind.VARIABLE;
}

export function isNullNode(value: ValueNode): value is NullValueNode {
	return value.kind === Kind.NULL;
}

export function isListValueNode(value: ValueNode): value is ListValueNode {
	return value.kind === Kind.LIST;
}

export function isIntValueNode(value: ValueNode): value is IntValueNode {
	return value.kind === Kind.INT;
}

export function isFloatValueNode(value: ValueNode): value is FloatValueNode {
	return value.kind === Kind.FLOAT;
}

export function isBooleanValueNode(
	value: ValueNode,
): value is BooleanValueNode {
	return value.kind === Kind.BOOLEAN;
}

export function isEnumValueNode(value: ValueNode): value is EnumValueNode {
	return value.kind === Kind.ENUM;
}

export function isObjectValueNode(value: ValueNode): value is ObjectValueNode {
	return value.kind === Kind.OBJECT;
}

export const isListTypeNode = isListValueNode;
export const isIntTypeNode = isIntValueNode;
export const isFloatTypeNode = isFloatValueNode;
export const isBooleanTypeNode = isBooleanValueNode;
export const isEnumTypeNode = isEnumValueNode;
export const isObjectTypeNode = isObjectValueNode;
