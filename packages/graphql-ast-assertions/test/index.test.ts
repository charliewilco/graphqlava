import { Kind } from "graphql";
import * as assertions from "../src";

describe("graphql-ast-assertions", () => {
	test("isVariableNode", () => {
		expect(
			assertions.isVariableNode({
				kind: Kind.VARIABLE,
				name: {
					kind: Kind.NAME,
					value: "foo",
				},
			})
		).toBe(true);
	});
});
