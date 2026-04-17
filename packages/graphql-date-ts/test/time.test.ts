import assert from "node:assert/strict";
import { inspect } from "node:util";
import { after, before, describe, test } from "node:test";
import MockDate from "mockdate";
import { Kind, type ValueNode } from "graphql";
import { GraphQLTime } from "../src";

const stringify = (value: unknown): string => inspect(value, { depth: null });

const expectTypeErrorMessage = (callback: () => unknown, message: string) => {
	assert.throws(callback, (error: unknown) => {
		assert.ok(error instanceof TypeError);
		assert.equal(error.message, message);
		return true;
	});
};

const validTimes: [string, Date][] = [
	["00:00:59Z", new Date(Date.UTC(2017, 0, 1, 0, 0, 59))],
	["00:00:00+01:30", new Date(Date.UTC(2016, 11, 31, 22, 30))],
	["00:00:00.450-01:30", new Date(Date.UTC(2017, 0, 1, 1, 30, 0, 450))],
];

const invalidTimes = [
	"Invalid date",
	"00Z",
	"00:00:00",
	"24:00:00Z",
	"00:00:00+0100",
];

before(() => {
	MockDate.set(new Date(Date.UTC(2017, 0, 1)));
});

after(() => {
	MockDate.reset();
});

describe("GraphQLTime", () => {
	test("serializes valid values", () => {
		assert.equal(
			GraphQLTime.serialize(new Date(Date.UTC(2016, 1, 1))),
			"00:00:00.000Z",
		);
		assert.equal(GraphQLTime.serialize("14:38:12+01:00"), "13:38:12Z");
	});

	test("throws for invalid serialized values", () => {
		expectTypeErrorMessage(
			() => GraphQLTime.serialize(new Date("invalid")),
			"Time cannot represent an invalid Date instance",
		);
		expectTypeErrorMessage(
			() => GraphQLTime.serialize("00:00:00"),
			"Time cannot represent an invalid time-string 00:00:00.",
		);
		expectTypeErrorMessage(
			() => GraphQLTime.serialize(123),
			"Time cannot be serialized from a non string, or non Date type 123",
		);
	});

	test("parseValue accepts valid RFC 3339 times", () => {
		validTimes.forEach(([value, expected]) => {
			assert.deepEqual(GraphQLTime.parseValue(value), expected);
		});
	});

	test("parseValue rejects invalid inputs", () => {
		[123, {}, [], true, null].forEach((invalidInput) => {
			expectTypeErrorMessage(
				() => GraphQLTime.parseValue(invalidInput),
				`Time cannot represent non string type ${JSON.stringify(invalidInput)}`,
			);
		});

		invalidTimes.forEach((timeString) => {
			expectTypeErrorMessage(
				() => GraphQLTime.parseValue(timeString),
				`Time cannot represent an invalid time-string ${timeString}.`,
			);
		});
	});

	test("parseLiteral accepts string literals", () => {
		validTimes.forEach(([value, expected]) => {
			const literal: ValueNode = {
				kind: Kind.STRING,
				value,
			};
			assert.deepEqual(GraphQLTime.parseLiteral(literal), expected);
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
			() => GraphQLTime.parseLiteral(variableLiteral),
			"Time cannot represent non string type foo.",
		);
		expectTypeErrorMessage(
			() => GraphQLTime.parseLiteral(nullLiteral),
			"Time cannot represent non string type null.",
		);
		expectTypeErrorMessage(
			() => GraphQLTime.parseLiteral(listLiteral),
			"Time cannot represent non string type array.",
		);
		expectTypeErrorMessage(
			() => GraphQLTime.parseLiteral(objectLiteral),
			"Time cannot represent non string type object.",
		);
		expectTypeErrorMessage(
			() => GraphQLTime.parseLiteral(intLiteral),
			"Time cannot represent non string type 5",
		);
	});

	test("parseLiteral rejects invalid time strings", () => {
		invalidTimes.forEach((value) => {
			const literal: ValueNode = {
				kind: Kind.STRING,
				value,
			};
			expectTypeErrorMessage(
				() => GraphQLTime.parseLiteral(literal),
				`Time cannot represent an invalid time-string ${String(value)}.`,
			);
		});
	});

	test("parseValue stays anchored to the current UTC day", () => {
		const parsed = GraphQLTime.parseValue("23:59:59Z");
		assert.equal(parsed.toISOString(), "2017-01-01T23:59:59.000Z");
		assert.equal(
			stringify(parsed),
			stringify(new Date(Date.UTC(2017, 0, 1, 23, 59, 59))),
		);
	});
});
