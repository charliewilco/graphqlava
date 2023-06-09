import { GraphQLScalarType, Kind, isValueNode } from "graphql";
import type { GraphQLScalarTypeConfig } from "graphql";
import {
	isListTypeNode,
	isNullNode,
	isObjectTypeNode,
	isVariableNode,
} from "@reubin/graphql-ast-assertions";

import {
	validateTime,
	validateJSDate,
	serializeTime,
	serializeTimeString,
	parseTime,
} from "../utils";

/**
 * An RFC 3339 compliant time scalar.
 *
 * Input:
 *    This scalar takes an RFC 3339 time string as input and
 *    parses it to a javascript Date (with a year-month-day relative
 *    to the current day).
 *
 * Output:
 *    This scalar serializes javascript Dates and
 *    RFC 3339 time strings to RFC 3339 UTC time strings.
 */
const config: GraphQLScalarTypeConfig<Date, string> = {
	name: "Time",
	description:
		"A time string at UTC, such as 10:15:30Z, compliant with " +
		"the `full-time` format outlined in section 5.6 of the RFC 3339" +
		"profile of the ISO 8601 standard for representation of dates and " +
		"times using the Gregorian calendar.",
	serialize(value): string {
		if (value instanceof Date) {
			if (validateJSDate(value)) {
				return serializeTime(value);
			}
			throw new TypeError("Time cannot represent an invalid Date instance");
		} else if (typeof value === "string") {
			if (validateTime(value)) {
				return serializeTimeString(value);
			}
			throw new TypeError(`Time cannot represent an invalid time-string ${value}.`);
		} else {
			throw new TypeError(
				"Time cannot be serialized from a non string, " +
					"or non Date type " +
					JSON.stringify(value)
			);
		}
	},
	parseValue(value): Date {
		if (typeof value !== "string") {
			throw new TypeError(`Time cannot represent non string type ${JSON.stringify(value)}`);
		}

		if (validateTime(value)) {
			return parseTime(value);
		}
		throw new TypeError(`Time cannot represent an invalid time-string ${value}.`);
	},
	parseLiteral(ast): Date {
		if (ast.kind !== Kind.STRING) {
			let errorMessage;
			if (isVariableNode(ast)) {
				errorMessage = `Time cannot represent non string type ${ast.name.value}.`;
			} else if (isNullNode(ast)) {
				errorMessage = `Time cannot represent non string type null.`;
			} else if (isListTypeNode(ast)) {
				errorMessage = `Time cannot represent non string type array.`;
			} else if (isObjectTypeNode(ast)) {
				errorMessage = `Time cannot represent non string type object.`;
			} else {
				errorMessage = `Time cannot represent non string type ${String(
					ast.value != null ? ast.value : null
				)}`;
			}

			throw new TypeError(errorMessage);
		}
		const value = ast.value;
		if (validateTime(value)) {
			return parseTime(value);
		}
		throw new TypeError(`Time cannot represent an invalid time-string ${String(value)}.`);
	},
};

export const GraphQLTime = new GraphQLScalarType(config);
