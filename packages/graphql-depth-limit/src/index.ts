import {
	GraphQLError,
	Kind,
	type ValidationContext,
	type DefinitionNode,
	type OperationDefinitionNode,
	type FragmentDefinitionNode,
	type SelectionNode,
} from "graphql";

interface DepthCallback {
	(depths: Record<string, number>): void;
}

interface Options {
	ignore?: Array<string | RegExp | ((queryDepths: any) => boolean)>;
}

/**
 * Creates a validator for the GraphQL query depth
 * @param {Number} maxDepth - The maximum allowed depth for any operation in a GraphQL document.
 * @param {Object} [options]
 * @param {String|RegExp|Function} options.ignore - Stops recursive depth checking based on a field name. Either a string or regexp to match the name, or a function that reaturns a boolean.
 * @param {Function} [callback] - Called each time validation runs. Receives an Object which is a map of the depths for each operation.
 * @returns {Function} The validator function for GraphQL validation phase.
 */
export const depthLimit =
	(maxDepth: number, options: Options = {}, callback: DepthCallback = (value: any) => {}) =>
	(validationContext: ValidationContext) => {
		try {
			const { definitions } = validationContext.getDocument();
			const fragments = getFragments(definitions);
			const queries = getQueriesAndMutations(definitions);
			const queryDepths: Record<string, number> = {};
			for (let name in queries) {
				queryDepths[name] = determineDepth(
					queries[name],
					fragments,
					0,
					maxDepth,
					validationContext,
					name,
					options
				) as number;
			}
			callback(queryDepths);
			return validationContext;
		} catch (err) {
			console.error(err);
			throw err;
		}
	};

function getFragments(
	definitions: readonly DefinitionNode[]
): Record<string, FragmentDefinitionNode> {
	return definitions.reduce((map: Record<string, FragmentDefinitionNode>, definition) => {
		if (definition.kind === Kind.FRAGMENT_DEFINITION) {
			map[definition.name.value] = definition;
		}
		return map;
	}, {});
}

// this will actually get both queries and mutations. we can basically treat those the same
function getQueriesAndMutations(
	definitions: readonly DefinitionNode[]
): Record<string, OperationDefinitionNode> {
	return definitions.reduce((map: Record<string, OperationDefinitionNode>, definition) => {
		if (definition.kind === Kind.OPERATION_DEFINITION) {
			map[definition.name ? definition.name.value : ""] = definition;
		}
		return map;
	}, {});
}

function determineDepth(
	node: OperationDefinitionNode | SelectionNode | FragmentDefinitionNode,
	fragments: Record<string, FragmentDefinitionNode>,
	depthSoFar: number,
	maxDepth: number,
	context: ValidationContext,
	operationName: string,
	options: Options
): number {
	if (depthSoFar > maxDepth) {
		// @ts-expect-error
		// this should bubble up the error
		return context.reportError(
			new GraphQLError(`'${operationName}' exceeds maximum operation depth of ${maxDepth}`, [
				node,
			])
		);
	}

	switch (node.kind) {
		case Kind.FIELD:
			// by default, ignore the introspection fields which begin with double underscores
			const shouldIgnore = /^__/.test(node.name.value) || seeIfIgnored(node, options.ignore);

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
							options
						)
					)
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
				options
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
						options
					)
				)
			);
		default:
			// @ts-expect-error
			throw new Error("uh oh! depth crawler cannot handle: " + node.kind);
	}
}

function getFieldName(
	node: OperationDefinitionNode | SelectionNode | FragmentDefinitionNode
): string {
	let fieldName = "";

	if (node.kind === Kind.FIELD) {
		fieldName = node.name.value;
	}

	if (node.kind === Kind.FRAGMENT_SPREAD) {
		fieldName = node.name.value;
	}

	if (node.kind === Kind.INLINE_FRAGMENT) {
		fieldName = node.loc + "inlineFragment";
	}

	if (node.kind === Kind.FRAGMENT_DEFINITION) {
		fieldName = node.name.value;
	}

	if (node.kind === Kind.OPERATION_DEFINITION) {
		fieldName = node.name ? node.name.value : "";
	}

	return fieldName;
}

function typeCheckRule(rule: any): rule is string | RegExp | ((queryDepths: any) => boolean) {
	if (typeof rule === "string" || rule instanceof RegExp) {
		return true;
	}

	if (typeof rule === "function") {
		return true;
	}

	return false;
}

function seeIfIgnored(
	node: OperationDefinitionNode | SelectionNode | FragmentDefinitionNode,
	ignore: Array<string | RegExp | ((queryDepths: any) => boolean)> = []
) {
	for (let rule of Array.from(ignore)) {
		const fieldName = getFieldName(node);

		if (!typeCheckRule(rule)) {
			throw new Error(`Invalid ignore option: ${rule}`);
		}

		if (typeof rule === "function") {
			if (rule(fieldName)) {
				return true;
			}
		} else {
			if (fieldName.match(rule)) {
				return true;
			}
		}
	}
	return false;
}
