import {
	type ASTVisitor,
	GraphQLError,
	Kind,
	type DefinitionNode,
	type FragmentDefinitionNode,
	type OperationDefinitionNode,
	type SelectionNode,
	type ValidationContext,
	type ValidationRule,
} from "graphql";

type OperationDepths = Record<string, number>;
type IgnoreMatcher = string | RegExp | ((fieldName: string) => boolean);
type DepthCallback = (depths: OperationDepths) => void;

interface Options {
	ignore?: IgnoreMatcher[];
}

const noopDepthCallback: DepthCallback = () => {};

/**
 * Creates a validator for the GraphQL query depth
 * @param {Number} maxDepth - The maximum allowed depth for any operation in a GraphQL document.
 * @param {Object} [options]
 * @param {String|RegExp|Function} options.ignore - Stops recursive depth checking based on a field name. Either a string or regexp to match the name, or a function that reaturns a boolean.
 * @param {Function} [callback] - Called each time validation runs. Receives an Object which is a map of the depths for each operation.
 * @returns {Function} The validator function for GraphQL validation phase.
 */
export function depthLimit(
	maxDepth: number,
	options: Options = {},
	callback: DepthCallback = noopDepthCallback,
): ValidationRule {
	return (validationContext: ValidationContext): ASTVisitor => {
		const { definitions } = validationContext.getDocument();
		const fragments = getFragments(definitions);
		const operations = getOperations(definitions);
		const queryDepths: OperationDepths = {};

		for (const [name, operation] of Object.entries(operations)) {
			queryDepths[name] = determineDepth(
				operation,
				fragments,
				0,
				maxDepth,
				validationContext,
				name,
				options,
			);
		}

		callback(queryDepths);
		return {};
	};
}

function getFragments(
	definitions: readonly DefinitionNode[],
): Record<string, FragmentDefinitionNode> {
	return definitions.reduce(
		(map: Record<string, FragmentDefinitionNode>, definition) => {
			if (definition.kind === Kind.FRAGMENT_DEFINITION) {
				map[definition.name.value] = definition;
			}
			return map;
		},
		{},
	);
}

function getOperations(
	definitions: readonly DefinitionNode[],
): Record<string, OperationDefinitionNode> {
	return definitions.reduce(
		(map: Record<string, OperationDefinitionNode>, definition) => {
			if (definition.kind === Kind.OPERATION_DEFINITION) {
				map[definition.name ? definition.name.value : ""] = definition;
			}
			return map;
		},
		{},
	);
}

function determineDepth(
	node: OperationDefinitionNode | SelectionNode | FragmentDefinitionNode,
	fragments: Record<string, FragmentDefinitionNode>,
	depthSoFar: number,
	maxDepth: number,
	context: ValidationContext,
	operationName: string,
	options: Options,
): number {
	if (depthSoFar > maxDepth) {
		context.reportError(
			new GraphQLError(
				`'${operationName}' exceeds maximum operation depth of ${maxDepth}`,
				[node],
			),
		);
		return depthSoFar;
	}

	switch (node.kind) {
		case Kind.FIELD:
			// by default, ignore the introspection fields which begin with double underscores
			const shouldIgnore =
				/^__/.test(node.name.value) || seeIfIgnored(node, options.ignore);

			if (shouldIgnore || !node.selectionSet) {
				return 0;
			}
			return (
				1 +
				Math.max(
					...node.selectionSet.selections.map((selection) =>
						determineDepth(
							selection,
							fragments,
							depthSoFar + 1,
							maxDepth,
							context,
							operationName,
							options,
						),
					),
				)
			);
		case Kind.FRAGMENT_SPREAD:
			return determineDepth(
				fragments[node.name.value],
				fragments,
				depthSoFar,
				maxDepth,
				context,
				operationName,
				options,
			);
		case Kind.INLINE_FRAGMENT:
		case Kind.FRAGMENT_DEFINITION:
		case Kind.OPERATION_DEFINITION:
			return Math.max(
				...node.selectionSet.selections.map((selection) =>
					determineDepth(
						selection,
						fragments,
						depthSoFar,
						maxDepth,
						context,
						operationName,
						options,
					),
				),
			);
		default:
			return assertNever(node);
	}
}

function getFieldName(
	node: OperationDefinitionNode | SelectionNode | FragmentDefinitionNode,
): string {
	let fieldName = "";

	if (node.kind === Kind.FIELD) {
		fieldName = node.name.value;
	}

	if (node.kind === Kind.FRAGMENT_SPREAD) {
		fieldName = node.name.value;
	}

	if (node.kind === Kind.INLINE_FRAGMENT) {
		fieldName = "inlineFragment";
	}

	if (node.kind === Kind.FRAGMENT_DEFINITION) {
		fieldName = node.name.value;
	}

	if (node.kind === Kind.OPERATION_DEFINITION) {
		fieldName = node.name ? node.name.value : "";
	}

	return fieldName;
}

function isIgnoreMatcher(rule: unknown): rule is IgnoreMatcher {
	return (
		typeof rule === "string" ||
		rule instanceof RegExp ||
		typeof rule === "function"
	);
}

function seeIfIgnored(
	node: OperationDefinitionNode | SelectionNode | FragmentDefinitionNode,
	ignore: IgnoreMatcher[] = [],
): boolean {
	for (const rule of ignore) {
		const fieldName = getFieldName(node);

		if (!isIgnoreMatcher(rule)) {
			throw new Error(`Invalid ignore option: ${rule}`);
		}

		if (typeof rule === "function") {
			if (rule(fieldName)) {
				return true;
			}
			continue;
		}

		if (typeof rule === "string") {
			if (fieldName === rule) {
				return true;
			}
			continue;
		}

		if (rule.test(fieldName)) {
			return true;
		}
	}
	return false;
}

function assertNever(value: never): never {
	throw new Error("uh oh! depth crawler cannot handle: " + String(value));
}
