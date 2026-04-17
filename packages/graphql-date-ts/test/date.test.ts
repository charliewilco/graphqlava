import assert from "node:assert/strict";
import { inspect } from "node:util";
import { describe, test } from "node:test";
import { Kind, type ValueNode } from "graphql";
import { GraphQLDate } from "../src";

const stringify = (value: unknown): string => inspect(value, { depth: null });

const expectTypeErrorMessage = (callback: () => unknown, message: string) => {
	assert.throws(callback, (error: unknown) => {
		assert.ok(error instanceof TypeError);
		assert.equal(error.message, message);
		return true;
	});
};

const validDates: [string, Date][] = [
	["2016-12-17", new Date(Date.UTC(2016, 11, 17))],
	["2016-02-01", new Date(Date.UTC(2016, 1, 1))],
];

const invalidDates = [
	"invalid date",
	"2016",
	"2016-01",
	"2016-02-01T00Z",
	"2015-02-29",
];

describe("GraphQLDate", () => {
	test("serializes valid values", () => {
		assert.equal(
			GraphQLDate.serialize(new Date(Date.UTC(2016, 11, 17))),
			"2016-12-17",
		);
		assert.equal(GraphQLDate.serialize("2016-02-01"), "2016-02-01");
	});

	test("throws for invalid serialized values", () => {
		expectTypeErrorMessage(
			() => GraphQLDate.serialize(new Date("invalid")),
			"Date cannot represent an invalid Date instance",
		);
		expectTypeErrorMessage(
			() => GraphQLDate.serialize("2015-02-29"),
			"Date cannot represent an invalid date-string 2015-02-29.",
		);
		expectTypeErrorMessage(
			() => GraphQLDate.serialize(123),
			"Date cannot represent a non string, or non Date type 123",
		);
	});

	test("parseValue accepts valid RFC 3339 dates", () => {
		validDates.forEach(([value, expected]) => {
			assert.deepEqual(GraphQLDate.parseValue(value), expected);
		});
	});

	test("parseValue rejects invalid inputs", () => {
		[123, {}, [], true, null].forEach((invalidInput) => {
			expectTypeErrorMessage(
				() => GraphQLDate.parseValue(invalidInput),
				`Date cannot represent non string type ${JSON.stringify(invalidInput)}`,
			);
		});

		invalidDates.forEach((dateString) => {
			expectTypeErrorMessage(
				() => GraphQLDate.parseValue(dateString),
				`Date cannot represent an invalid date-string ${dateString}.`,
			);
		});
	});

	test("parseLiteral accepts string literals", () => {
		validDates.forEach(([value, expected]) => {
			const literal: ValueNode = {
				kind: Kind.STRING,
				value,
			};
			assert.deepEqual(GraphQLDate.parseLiteral(literal), expected);
		});
	});

	test("parseLiteral reports helpful type errors", () => {
		const variableLiteral: ValueNode = {
			kind: Kind.VARIABLE,
			name: {
				kind: Kind.NAME,
				value: "foo",
			},
		};
		const nullLiteral: ValueNode = {
			kind: Kind.NULL,
		};
		const listLiteral: ValueNode = {
			kind: Kind.LIST,
			values: [],
		};
		const objectLiteral: ValueNode = {
			kind: Kind.OBJECT,
			fields: [],
		};
		const intLiteral: ValueNode = {
			kind: Kind.INT,
			value: "5",
		};

		expectTypeErrorMessage(
			() => GraphQLDate.parseLiteral(variableLiteral),
			"Date cannot represent variable foo",
		);
		expectTypeErrorMessage(
			() => GraphQLDate.parseLiteral(nullLiteral),
			"Date cannot represent null",
		);
		expectTypeErrorMessage(
			() => GraphQLDate.parseLiteral(listLiteral),
			"Date cannot represent an array",
		);
		expectTypeErrorMessage(
			() => GraphQLDate.parseLiteral(objectLiteral),
			"Date cannot represent an object",
		);
		expectTypeErrorMessage(
			() => GraphQLDate.parseLiteral(intLiteral),
			"Date cannot represent non string type 5",
		);
	});

	test("parseLiteral rejects invalid date strings", () => {
		invalidDates.forEach((value) => {
			const literal: ValueNode = {
				kind: Kind.STRING,
				value,
			};
			expectTypeErrorMessage(
				() => GraphQLDate.parseLiteral(literal),
				`Date cannot represent an invalid date-string ${String(value)}.`,
			);
		});
	});
});
