import { depthLimit } from "../src";
import { buildSchema, Source, parse, validate, specifiedRules } from "graphql";

function createDocument(query: any) {
	const source = new Source(query, "GraphQL request");
	return parse(source);
}

const petMixin = `
  name: String!
  owner: Human!
`;

const schema = buildSchema(`#graphql
  type Query {
    user(name: String): Human
    version: String
    user1: Human
    user2: Human
    user3: Human
  }
  type Human {
    name: String!
    email: String!
    address: Address
    pets: [Pet]
  }
  interface Pet {
    ${petMixin}
  }
  type Cat {
    ${petMixin}
  }
  type Dog {
    ${petMixin}
  }
  type Address {
    street: String
    number: Int
    city: String
    country: String
  }
`);

describe("graphql-depth-limit", () => {
	test("should count depth without fragment", () => {
		const query = `#graphql
    query read0 {
      version
    }
    query read1 {
      version
      user {
        name
      }
    }
    query read2 {
      matt: user(name: "matt") {
        email
      }
      andy: user(name: "andy") {
        email
        address {
          city
        }
      }
    }
    query read3 {
      matt: user(name: "matt") {
        email
      }
      andy: user(name: "andy") {
        email
        address {
          city
        }
        pets {
          name
          owner {
            name
          }
        }
      }
    }
  `;
		const document = createDocument(query);
		const values = {
			read0: 0,
			read1: 1,
			read2: 2,
			read3: 3,
		};
		const spec = (depths: any) => Object.is(values, depths);
		// @ts-ignore
		const errors = validate(schema, document, [...specifiedRules, depthLimit(10, {}, spec)]);
		expect(errors).toEqual([]);
	});

	test("should count with fragments", () => {
		const query = `#graphql
    query read0 {
      ... on Query {
        version
      }
    }
    query read1 {
      version
      user {
        ... on Human {
          name
        }
      }
    }
    fragment humanInfo on Human {
      email
    }
    fragment petInfo on Pet {
      name
      owner {
        name
      }
    }
    query read2 {
      matt: user(name: "matt") {
        ...humanInfo
      }
      andy: user(name: "andy") {
        ...humanInfo
        address {
          city
        }
      }
    }
    query read3 {
      matt: user(name: "matt") {
        ...humanInfo
      }
      andy: user(name: "andy") {
        ... on Human {
          email
        }
        address {
          city
        }
        pets {
          ...petInfo
        }
      }
    }
  `;
		const document = createDocument(query);
		const values = {
			read0: 0,
			read1: 1,
			read2: 2,
			read3: 3,
		};

		const spec = (depths: any) => Object.is(values, depths);
		// @ts-ignore
		const errors = validate(schema, document, [...specifiedRules, depthLimit(10, {}, spec)]);

		expect(errors).toEqual([]);
	});

	test("should ignore the introspection query", () => {
		const document = createDocument(introQuery);
		// @ts-ignore
		const errors = validate(schema, document, [...specifiedRules, depthLimit(5)]);

		expect(errors).toEqual([]);
	});

	test("should catch a query thats too deep", () => {
		const query = `{
    user {
      pets {
        owner {
          pets {
            owner {
              pets {
                name
              }
            }
          }
        }
      }
    }
  }`;
		const document = createDocument(query);
		// @ts-ignore
		const errors = validate(schema, document, [...specifiedRules, depthLimit(4)]);

		expect(errors.length).toEqual(1);
		// What would the next line look like if we were using Jest?
		expect(errors[0].message).toEqual("'' exceeds maximum operation depth of 4");
	});

	test("should ignore a field", () => {
		const query = `
    query read1 {
      user { address { city } }
    }
    query read2 {
      user1 { address { city } }
      user2 { address { city } }
      user3 { address { city } }
    }
  `;
		const document = createDocument(query);
		const options = {
			ignore: ["user1", /user2/, (fieldName: any) => fieldName === "user3"],
		};
		const values = {
			read1: 2,
			read2: 0,
		};
		const spec = (depths: any) => Object.is(values, depths);
		// @ts-ignore
		const errors = validate(schema, document, [
			// @ts-ignore
			...specifiedRules,
			// @ts-ignore
			depthLimit(10, options, spec),
		]);

		expect(errors).toEqual([]);
	});

	const introQuery = `
  query IntrospectionQuery {
    __schema {
      queryType { name }
      mutationType { name }
      subscriptionType { name }
      types {
        ...FullType
      }
      directives {
        name
        description
        locations
        args {
          ...InputValue
        }
      }
    }
  }
  fragment FullType on __Type {
    kind
    name
    description
    fields(includeDeprecated: true) {
      name
      description
      args {
        ...InputValue
      }
      type {
        ...TypeRef
      }
      isDeprecated
      deprecationReason
    }
    inputFields {
      ...InputValue
    }
    interfaces {
      ...TypeRef
    }
    enumValues(includeDeprecated: true) {
      name
      description
      isDeprecated
      deprecationReason
    }
    possibleTypes {
      ...TypeRef
    }
  }
  fragment InputValue on __InputValue {
    name
    description
    type { ...TypeRef }
    defaultValue
  }
  fragment TypeRef on __Type {
    kind
    name
    ofType {
      kind
      name
      ofType {
        kind
        name
        ofType {
          kind
          name
          ofType {
            kind
            name
            ofType {
              kind
              name
              ofType {
                kind
                name
                ofType {
                  kind
                  name
                }
              }
            }
          }
        }
      }
    }
  }
`;
});
