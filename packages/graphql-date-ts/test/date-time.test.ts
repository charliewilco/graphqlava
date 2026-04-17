import assert from "node:assert/strict";
import { inspect } from "node:util";
import { describe, test } from "node:test";
import { Kind, ValueNode } from "graphql";
import { GraphQLDateTime } from "../src";

const stringify = (value: unknown): string => inspect(value, { depth: null });

const expectTypeErrorMessage = (callback: () => unknown, message: string) => {
	assert.throws(callback, (error: unknown) => {
		assert.ok(error instanceof TypeError);
		assert.equal(error.message, message);
		return true;
	});
};

const invalidDates = [
	// General
	"Invalid date",
	// Datetime with hours
	"2016-02-01T00Z",
	// Datetime with hours and minutes
	"2016-02-01T00:00Z",
	// Datetime with hours, minutes and seconds
	"2016-02-01T000059Z",
	// Datetime with hours, minutes, seconds and fractional seconds
	"2016-02-01T00:00:00.Z",
	// Datetime with hours, minutes, seconds, fractional seconds and timezone.
	"2015-02-24T00:00:00.000+0100",
];

const validDates: [string, Date][] = [
	// Datetime with hours, minutes and seconds
	["2016-02-01T00:00:15Z", new Date(Date.UTC(2016, 1, 1, 0, 0, 15))],
	["2016-02-01T00:00:00-11:00", new Date(Date.UTC(2016, 1, 1, 11))],
	["2017-01-07T11:25:00+01:00", new Date(Date.UTC(2017, 0, 7, 10, 25))],
	["2017-01-07T00:00:00+01:20", new Date(Date.UTC(2017, 0, 6, 22, 40))],
	// Datetime with hours, minutes, seconds and fractional seconds
	["2016-02-01T00:00:00.1Z", new Date(Date.UTC(2016, 1, 1, 0, 0, 0, 100))],
	["2016-02-01T00:00:00.000Z", new Date(Date.UTC(2016, 1, 1, 0, 0, 0, 0))],
	["2016-02-01T00:00:00.990Z", new Date(Date.UTC(2016, 1, 1, 0, 0, 0, 990))],
	["2016-02-01T00:00:00.23498Z", new Date(Date.UTC(2016, 1, 1, 0, 0, 0, 234))],
	[
		"2017-01-07T11:25:00.450+01:00",
		new Date(Date.UTC(2017, 0, 7, 10, 25, 0, 450)),
	],
];

describe("GraphQLDateTime", () => {
	test("has a description", () => {
		assert.equal(
			GraphQLDateTime.description,
			"A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.",
		);
	});

	describe("serialization", () => {
		[{}, [], null, undefined, true].forEach((invalidInput) => {
			test(`throws error when serializing ${stringify(invalidInput)}`, () => {
				expectTypeErrorMessage(
					() => GraphQLDateTime.serialize(invalidInput),
					`DateTime cannot be serialized from a non string, non numeric or non Date type ${JSON.stringify(invalidInput)}`,
				);
			});
		});

		[
			[new Date(Date.UTC(2016, 0, 1)), "2016-01-01T00:00:00.000Z"],
			[
				new Date(Date.UTC(2016, 0, 1, 14, 48, 10, 30)),
				"2016-01-01T14:48:10.030Z",
			],
		].forEach(([value, expected]) => {
			test(`serializes javascript Date ${stringify(value)} into ${stringify(
				expected,
			)}`, () => {
				assert.deepEqual(GraphQLDateTime.serialize(value), expected);
			});
		});

		test(`throws error when serializing invalid date`, () => {
			expectTypeErrorMessage(
				() => GraphQLDateTime.serialize(new Date("invalid date")),
				"DateTime cannot represent an invalid Date instance",
			);
		});

		[
			["2016-02-01T00:00:15Z", "2016-02-01T00:00:15Z"],
			["2016-02-01T00:00:00.23498Z", "2016-02-01T00:00:00.23498Z"],
			["2016-02-01T00:00:00-11:00", "2016-02-01T11:00:00Z"],
			["2017-01-07T00:00:00.1+01:20", "2017-01-06T22:40:00.1Z"],
		].forEach(([input, output]) => {
			test(`serializes date-time-string ${input} into UTC date-time-string ${output}`, () => {
				assert.deepEqual(GraphQLDateTime.serialize(input), output);
			});
		});

		invalidDates.forEach((dateString) => {
			test(`throws an error when serializing an invalid date-string ${stringify(
				dateString,
			)}`, () => {
				expectTypeErrorMessage(
					() => GraphQLDateTime.serialize(dateString),
					`DateTime cannot represent an invalid date-time-string ${dateString}.`,
				);
			});
		});

		// Serializes Unix timestamp
		[
			[854325678, "1997-01-27T00:41:18.000Z"],
			[876535, "1970-01-11T03:28:55.000Z"],
			// The maximum representable unix timestamp
			[2147483647, "2038-01-19T03:14:07.000Z"],
			// The minimum representable unit timestamp
			[-2147483648, "1901-12-13T20:45:52.000Z"],
		].forEach(([value, expected]) => {
			test(`serializes unix timestamp ${stringify(
				value,
			)} into date-string ${expected}`, () => {
				assert.deepEqual(GraphQLDateTime.serialize(value), expected);
			});
		});

		[
			Number.NaN,
			Number.POSITIVE_INFINITY,
			Number.POSITIVE_INFINITY,
			// assume Unix timestamp are 32-bit
			2147483648,
			-2147483649,
		].forEach((value) => {
			test(`throws an error serializing the invalid unix timestamp ${stringify(
				value,
			)}`, () => {
				expectTypeErrorMessage(
					() => GraphQLDateTime.serialize(value),
					`DateTime cannot represent an invalid Unix timestamp ${value}`,
				);
			});
		});
	});

	describe("value parsing", () => {
		validDates.forEach(([value, expected]) => {
			test(`parses date-string ${stringify(value)} into javascript Date ${stringify(
				expected,
			)}`, () => {
				assert.deepEqual(GraphQLDateTime.parseValue(value), expected);
			});
		});

		[4566, {}, [], true, null].forEach((invalidInput) => {
			test(`throws an error when parsing ${stringify(invalidInput)}`, () => {
				expectTypeErrorMessage(
					() => GraphQLDateTime.parseValue(invalidInput),
					`DateTime cannot represent non string type ${JSON.stringify(invalidInput)}`,
				);
			});
		});

		invalidDates.forEach((dateString) => {
			test(`throws an error parsing an invalid date-string ${stringify(dateString)}`, () => {
				expectTypeErrorMessage(
					() => GraphQLDateTime.parseValue(dateString),
					`DateTime cannot represent an invalid date-time-string ${dateString}.`,
				);
			});
		});
	});

	describe("literal parsing", () => {
		validDates.forEach(([value, expected]) => {
			const literal: ValueNode = {
				kind: Kind.STRING,
				value,
			};

			test(`parses literal ${stringify(literal)} into javascript Date ${stringify(
				expected,
			)}`, () => {
				assert.deepEqual(GraphQLDateTime.parseLiteral(literal), expected);
			});
		});

		invalidDates.forEach((value) => {
			const invalidLiteral = {
				kind: Kind.STRING,
				value,
			};
			test(`errors when parsing invalid literal ${stringify(invalidLiteral)}`, () => {
				expectTypeErrorMessage(
					() =>
						// @ts-expect-error
						GraphQLDateTime.parseLiteral(invalidLiteral),
					`DateTime cannot represent an invalid date-time-string ${value}.`,
				);
			});
		});

		[
			{
				kind: Kind.FLOAT,
				value: "5",
			},
			{
				kind: Kind.DOCUMENT,
			},
		].forEach((literal) => {
			test(`errors when parsing invalid literal ${stringify(literal)}`, () => {
				expectTypeErrorMessage(
					() =>
						// @ts-expect-error
						GraphQLDateTime.parseLiteral(literal),
					literal.kind === Kind.FLOAT
						? "DateTime cannot represent non string type 5"
						: "DateTime cannot represent non string type null",
				);
			});
		});
	});
});
