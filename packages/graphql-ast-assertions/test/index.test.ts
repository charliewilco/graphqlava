import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { Kind } from "graphql";
import * as assertions from "../src";

const variableNode = {
	kind: Kind.VARIABLE,
	name: {
		kind: Kind.NAME,
		value: "foo",
	},
};

const nullNode = {
	kind: Kind.NULL,
};

const listNode = {
	kind: Kind.LIST,
	values: [],
};

const intNode = {
	kind: Kind.INT,
	value: "1",
};

const floatNode = {
	kind: Kind.FLOAT,
	value: "1.5",
};

const booleanNode = {
	kind: Kind.BOOLEAN,
	value: true,
};

const enumNode = {
	kind: Kind.ENUM,
	value: "VALUE",
};

const objectNode = {
	kind: Kind.OBJECT,
	fields: [],
};

describe("graphql-ast-assertions", () => {
	test("isVariableNode", () => {
		assert.equal(assertions.isVariableNode(variableNode), true);
		assert.equal(assertions.isVariableNode(nullNode), false);
	});

	test("isNullNode", () => {
		assert.equal(assertions.isNullNode(nullNode), true);
		assert.equal(assertions.isNullNode(variableNode), false);
	});

	test("value-node predicates expose accurate aliases", () => {
		assert.equal(assertions.isListValueNode(listNode), true);
		assert.equal(assertions.isListTypeNode(listNode), true);
		assert.equal(assertions.isListValueNode(intNode), false);

		assert.equal(assertions.isIntValueNode(intNode), true);
		assert.equal(assertions.isIntTypeNode(intNode), true);
		assert.equal(assertions.isIntValueNode(floatNode), false);

		assert.equal(assertions.isFloatValueNode(floatNode), true);
		assert.equal(assertions.isFloatTypeNode(floatNode), true);
		assert.equal(assertions.isFloatValueNode(booleanNode), false);

		assert.equal(assertions.isBooleanValueNode(booleanNode), true);
		assert.equal(assertions.isBooleanTypeNode(booleanNode), true);
		assert.equal(assertions.isBooleanValueNode(enumNode), false);

		assert.equal(assertions.isEnumValueNode(enumNode), true);
		assert.equal(assertions.isEnumTypeNode(enumNode), true);
		assert.equal(assertions.isEnumValueNode(objectNode), false);

		assert.equal(assertions.isObjectValueNode(objectNode), true);
		assert.equal(assertions.isObjectTypeNode(objectNode), true);
		assert.equal(assertions.isObjectValueNode(variableNode), false);
	});
});
