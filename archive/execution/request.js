/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found at
 * https://github.com/graphql/graphql-js/blob/master/README.md
 *
 * Modified for graphql-factory to run custom execution
 */

import {
  parse,
  validate
} from './types/graphql';
import type {
  ObjMap,
  Source,
  GraphQLFieldResolver,
  GraphQLSchema,
  ExecutionResult
} from './types/graphql';
import {
  execute
} from './execution/execute'; // custom execution
import type {
  ExecutionLogger
} from './types';

/**
 * This is the primary entry point function for fulfilling GraphQL operations
 * by parsing, validating, and executing a GraphQL document along side a
 * GraphQL schema.
 *
 * More sophisticated GraphQL servers, such as those which persist queries,
 * may wish to separate the validation and execution phases to a static time
 * tooling step, and a server runtime step.
 *
 * Accepts either an object with named arguments, or individual arguments:
 *
 * schema:
 *    The GraphQL type system to use when validating and executing a query.
 * source:
 *    A GraphQL language formatted string representing the requested operation.
 * rootValue:
 *    The value provided as the first argument to resolver functions on the top
 *    level type (e.g. the query object type).
 * variableValues:
 *    A mapping of variable name to runtime value to use for all variables
 *    defined in the requestString.
 * operationName:
 *    The name of the operation to use if requestString contains multiple
 *    possible operations. Can be omitted if requestString contains only
 *    one operation.
 * fieldResolver:
 *    A resolver function to use when one is not provided by the schema.
 *    If not provided, the default field resolver is used (which looks for a
 *    value or method on the source value with the field's name).
 */
declare function request({|
  schema: GraphQLSchema,
  source: string | Source,
  rootValue?: mixed,
  contextValue?: mixed,
  variableValues?: ?ObjMap<mixed>,
  operationName?: ?string,
  fieldResolver?: ?GraphQLFieldResolver<any, any>,
  logger?: ?ExecutionLogger
|}, ..._: []): Promise<ExecutionResult>;
/* eslint-disable no-redeclare */
declare function request(
  schema: GraphQLSchema,
  source: Source | string,
  rootValue?: mixed,
  contextValue?: mixed,
  variableValues?: ?ObjMap<mixed>,
  operationName?: ?string,
  fieldResolver?: ?GraphQLFieldResolver<any, any>,
  logger?: ?ExecutionLogger
): Promise<ExecutionResult>;
export function request(
  argsOrSchema,
  source,
  rootValue,
  contextValue,
  variableValues,
  operationName,
  fieldResolver,
  logger
) {
  // Extract arguments from object args if provided.
  return arguments.length === 1 ?
    graphqlImpl(
      argsOrSchema.schema,
      argsOrSchema.source,
      argsOrSchema.rootValue,
      argsOrSchema.contextValue,
      argsOrSchema.variableValues,
      argsOrSchema.operationName,
      argsOrSchema.fieldResolver,
      argsOrSchema.logger
    ) :
    graphqlImpl(
      argsOrSchema,
      source,
      rootValue,
      contextValue,
      variableValues,
      operationName,
      fieldResolver,
      logger
    );
}

function graphqlImpl(
  schema,
  source,
  rootValue,
  contextValue,
  variableValues,
  operationName,
  fieldResolver,
  logger
) {
  return new Promise(resolve => {
    // Parse
    let document;
    try {
      document = parse(source);
    } catch (syntaxError) {
      return resolve({ errors: [ syntaxError ]});
    }

    // Validate
    const validationErrors = validate(schema, document);
    if (validationErrors.length > 0) {
      return resolve({ errors: validationErrors });
    }

    // Execute
    resolve(
      execute(
        schema,
        document,
        rootValue,
        contextValue,
        variableValues,
        operationName,
        fieldResolver,
        logger
      )
    );
  });
}