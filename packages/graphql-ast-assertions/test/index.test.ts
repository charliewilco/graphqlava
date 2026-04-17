import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { Kind } from "graphql";
import * as assertions from "../src";

describe("graphql-ast-assertions", () => {
	test("isVariableNode", () => {
		assert.equal(
			assertions.isVariableNode({
				kind: Kind.VARIABLE,
				name: {
					kind: Kind.NAME,
					value: "foo",
				},
			}),
			true,
		);
	});
});
