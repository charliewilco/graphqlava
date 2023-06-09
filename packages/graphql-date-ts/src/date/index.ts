import { GraphQLScalarType, Kind } from "graphql";
import type { GraphQLScalarTypeConfig } from "graphql";
import {
	isVariableNode,
	isNullNode,
	isListTypeNode,
	isObjectTypeNode,
} from "@reubin/graphql-ast-assertions";
import { validateDate, validateJSDate, serializeDate, parseDate } from "../utils";

/**
 * An RFC 3339 compliant date scalar.
 *
 * Input:
 *    This scalar takes an RFC 3339 date string as input and
 *    parses it to a javascript Date.
 *
 * Output:
 *    This scalar serializes javascript Dates and
 *    RFC 3339 date strings to RFC 3339 date strings.
 */
const config: GraphQLScalarTypeConfig<Date, string> = {
	name: "Date",
	description:
		"A date string, such as 2007-12-03, compliant with the `full-date` " +
		"format outlined in section 5.6 of the RFC 3339 profile of the " +
		"ISO 8601 standard for representation of dates and times using " +
		"the Gregorian calendar.",
	serialize(value) {
		if (value instanceof Date) {
			if (validateJSDate(value)) {
				return serializeDate(value);
			}
			throw new TypeError("Date cannot represent an invalid Date instance");
		} else if (typeof value === "string") {
			if (validateDate(value)) {
				return String(value);
			}
			throw new TypeError(`Date cannot represent an invalid date-string ${value}.`);
		} else {
			throw new TypeError(
				"Date cannot represent a non string, or non Date type " + JSON.stringify(value)
			);
		}
	},
	parseValue(value) {
		if (typeof value !== "string") {
			throw new TypeError(`Date cannot represent non string type ${JSON.stringify(value)}`);
		}

		if (validateDate(value)) {
			return parseDate(value);
		}
		throw new TypeError(`Date cannot represent an invalid date-string ${value}.`);
	},
	parseLiteral(ast) {
		if (ast.kind !== Kind.STRING) {
			let errorMessage;
			if (isVariableNode(ast)) {
				errorMessage = `Date cannot represent variable ${ast.name.value}`;
			} else if (isNullNode(ast)) {
				errorMessage = `Date cannot represent null`;
			} else if (isListTypeNode(ast)) {
				errorMessage = `Date cannot represent an array`;
			} else if (isObjectTypeNode(ast)) {
				errorMessage = `Date cannot represent an object`;
			} else {
				errorMessage = `Date cannot represent non string type ${String(
					ast.value !== null ? ast.value : null
				)}`;
			}
			throw new TypeError(errorMessage);
		}
		const { value } = ast;
		if (validateDate(value)) {
			return parseDate(value);
		}
		throw new TypeError(`Date cannot represent an invalid date-string ${String(value)}.`);
	},
};

export const GraphQLDate = new GraphQLScalarType(config);
