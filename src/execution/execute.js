import assert from 'assert';
import { getArgumentValues } from 'graphql/execution/values';
import { getOperationLocation } from '../utilities/directives';
import { FactoryEvent } from '../definition/definition';
import { promiseReduce, promiseMap, lodash as _ } from '../jsutils';
import {
  GraphQLSkipResolveInstruction,
  GraphQLOmitTraceInstruction
} from '../types';
import {
  Kind,
  getNamedType,
  getNullableType,
  GraphQLList,
  DirectiveLocation,
  defaultFieldResolver
} from 'graphql';
import {
  getDirectiveResolvers,
  buildDirectiveInfo,
  objectTypeLocation
} from './directives';
import {
  getSelection,
  isFirstSelection,
  isRootResolver,
  fieldPath
} from '../utilities/info';

export const ExecutionType = {
  RESOLVE: 'RESOLVE',
  DIRECTIVE: 'DIRECTIVE'
};

export const TRACING_VERSION = '1.0.0';

// create a wrapped default field resolver and add
// a property to identify that it is default
function defaultResolver(...args) {
  return defaultFieldResolver(...args);
}
defaultResolver.__defaultResolver = true;

/**
 * Builds a new field resolve args object by
 * cloning current values so that if they are
 * modified by the resolve functions they do not
 * impact any other resolvers with the exception
 * of the fieldNodes which point directly back to
 * the operation ast
 * @param {*} source 
 * @param {*} context 
 * @param {*} info 
 * @param {*} path 
 * @param {*} field 
 * @param {*} selection 
 */
export function buildFieldResolveArgs(
  source,
  context,
  info,
  path,
  field,
  selection,
  args,
  parentType
) {
  return [
    _.cloneDeep(source),
    _.cloneDeep(args),
    context,
    Object.assign(
      Object.create(null),
      info,
      {
        parentType,
        fieldName: selection.name.value,
        fieldNodes: [ selection ],
        returnType: field.type,
        path: _.cloneDeep(path)
      }
    )
  ];
}

/**
 * Completes an execution detail and adds it to the run stack
 * @param {*} stack 
 * @param {*} execution 
 * @param {*} result 
 */
export function calculateRun(stack, execution, result, isDefault) {
  execution.end = Date.now();
  execution.duration = execution.end - execution.start;
  if (result instanceof Error) {
    execution.error = result;
  }
  // do not trace default resolvers
  if (!isDefault) {
    stack.push(execution);
  }
}

/**
 * Creates and updates an object that contains run time details for
 * a specific resolver. Also catches any errors
 * @param {*} type 
 * @param {*} name 
 * @param {*} stack 
 * @param {*} resolve 
 */
export function instrumentResolver(
  type,
  name,
  resolverName,
  stack,
  info,
  resolver,
  args,
  resolveErrors
) {
  const execution = {
    type,
    name,
    resolverName,
    start: Date.now(),
    end: -1,
    duration: -1,
    info: _.pick(info, [ 'location', 'path' ]),
    error: null
  };

  const isDefault = resolver.__defaultResolver;

  try {
    return Promise.resolve(resolver(...args))
      .then(result => {
        // check for a trace omit instruction
        if (result instanceof GraphQLOmitTraceInstruction) {
          return result.source;
        }
        calculateRun(stack, execution, result, isDefault);
        return result;
      }, err => {
        calculateRun(stack, execution, err, isDefault);
        return resolveErrors ?
          Promise.resolve(err) :
          Promise.reject(err);
      });
  } catch (err) {
    calculateRun(stack, execution, err, isDefault);
    return resolveErrors ?
      Promise.resolve(err) :
      Promise.reject(err);
  }
}

/**
 * Resolves a subfield by building an execution context
 * and then passing that to resolveField along with the
 * current result object
 * @param {*} field 
 * @param {*} result 
 * @param {*} parentType 
 * @param {*} rargs 
 */
export function resolveSubField(field, result, parentType, rargs, isRoot) {
  // check that result is an object, if it is not then subfields
  // cannot be set on it so return a Promise that resolves to null
  if (typeof result !== 'object' || result === null) {
    return Promise.resolve(null);
  }
  const [ source, args, context, info ] = rargs;
  const path = isRoot ?
    { prev: undefined, key: field.name } :
    { prev: _.cloneDeep(info.path), key: field.name };

  const execContext = [
    _.cloneDeep(source),
    _.cloneDeep(args),
    context,
    Object.assign(
      Object.create(null),
      info,
      { path, parentType }
    )
  ];

  return resolveField(result, path, parentType, field.selection, execContext)
    .then(subResult => {
      result[field.name] = subResult;
      return result;
    })
    .catch(error => {
      result[field.name] = error;
      return Promise.resolve(result);
    });
}

/**
 * Resolves subfields either serially if a root
 * mutation field or in parallel if not
 * @param {*} fields 
 * @param {*} result 
 * @param {*} parentType 
 * @param {*} rargs
 * @param {*} serial 
 */
export function resolveSubFields(fields, result, parentType, rargs, serial) {
  const isRoot = typeof serial === 'boolean';
  return serial ?
    promiseReduce(fields, (res, field) => {
      return resolveSubField(field, result, parentType, rargs, isRoot);
    }) :
    promiseMap(fields, field => {
      return resolveSubField(field, result, parentType, rargs, isRoot);
    });
}

/**
 * Resolves directives on arguments. Arguments are resolved in parallel
 * but directives on each argument are resolved serially
 * @param {*} field 
 * @param {*} selection 
 * @param {*} context 
 * @param {*} info 
 */
export function resolveArgDirectives(
  field,
  selection,
  context,
  info,
  parentType
) {
  const execution = info.operation._factory.execution;
  const location = DirectiveLocation.INPUT_FIELD_DEFINITION;
  const args = getArgumentValues(field, selection, info.variableValues);
  return promiseMap(args, (value, key) => {
    const astNode = _.find(field.astNode.arguments, arg => {
      return arg.name.value === key;
    });

    assert(astNode, 'ExecuteError: Failed to find astNode for ' +
    'argument "' + key + '"');

    const { resolveRequest } = getDirectiveResolvers(info, [
      {
        location,
        astNode
      }
    ]);

    const attachInfo = {
      kind: Kind.INPUT_VALUE_DEFINITION,
      parentField: field,
      parentType,
      argName: key,
      astNode
    };

    // directives on args only resolve before the request is made
    // so any resolveResult middleware defined is not processed.
    // this is because an argument is an input value and should not
    // modify output. if output modification is needed, it should be
    // placed on the field definition or field where resolveResult 
    // middleware is processed
    return promiseReduce(resolveRequest, (prev, r) => {
      const directiveInfo = buildDirectiveInfo(info, r, { attachInfo });
      return instrumentResolver(
        ExecutionType.DIRECTIVE,
        r.directive.name,
        r.resolve.name || 'resolve',
        execution.resolvers,
        directiveInfo,
        r.resolve,
        [ prev, r.args, context, directiveInfo ]
      )
      .then(directiveResult => {
        return directiveResult === undefined ? prev : directiveResult;
      });
    }, value)
    .then(directiveResult => {
      if (directiveResult !== undefined) {
        args[key] = directiveResult;
      }
    });
  })
  .then(() => args);
}

/**
 * Resolve a field containing a resolver and
 * then resolve any sub fields
 * @param {*} source 
 * @param {*} path 
 * @param {*} parentType 
 * @param {*} selection 
 * @param {*} req 
 */
export function resolveField(source, path, parentType, selection, rargs) {
  const [ , , context, info ] = rargs;
  const execution = info.operation._factory.execution;
  const type = getNamedType(parentType);
  const key = selection.name.value;
  const field = typeof type.getFields === 'function' ?
    _.get(type.getFields(), [ key ]) :
    null;
  const resolver = _.get(field, [ 'resolve', '__resolver' ], defaultResolver);

  // if there is no resolver, return the source
  if (!field || typeof resolver !== 'function') {
    return Promise.resolve(_.cloneDeep(source));
  }

  const pathArr = fieldPath(info, true);
  const pathStr = Array.isArray(pathArr) ? pathArr.join('.') : key;
  const isList = getNullableType(field.type) instanceof GraphQLList;
  const fieldType = getNamedType(field.type);

  const { resolveRequest, resolveResult } = getDirectiveResolvers(info, [
    {
      location: objectTypeLocation(type),
      astNode: type.astNode
    },
    {
      location: DirectiveLocation.FIELD_DEFINITION,
      astNode: field.astNode
    },
    {
      location: DirectiveLocation.FIELD,
      astNode: selection
    }
  ]);

  return resolveArgDirectives(field, selection, context, info, parentType)
    .then(args => {
      // get field args and allow directives to modify them
      const attachInfo = {
        kind: Kind.FIELD_DEFINITION,
        args,
        parentType,
        fieldName: selection.name.value,
        fieldNodes: [ selection ],
        returnType: field.type,
        path: _.cloneDeep(path)
      };

      return promiseReduce(resolveRequest, (prev, r) => {
        const directiveInfo = buildDirectiveInfo(info, r, { attachInfo });
        return instrumentResolver(
          ExecutionType.DIRECTIVE,
          r.directive.name,
          r.resolve.name || 'resolve',
          execution.resolvers,
          directiveInfo,
          r.resolve,
          [ prev, r.args, context, directiveInfo ]
        )
        .then(directiveResult => {
          return directiveResult === undefined ? prev : directiveResult;
        });
      })
      .then(directiveResult => {
        // allow setting of source from directive result
        if (directiveResult !== undefined) {
          // if the result is a skip resolve instruction, use the
          // instruction's source value and return
          if (directiveResult instanceof GraphQLSkipResolveInstruction) {
            source[key] = directiveResult.source;
            return directiveResult.source;
          }
          source[key] = directiveResult;
        }

        return instrumentResolver(
          ExecutionType.RESOLVE,
          pathStr,
          resolver.name || 'resolve',
          info.operation._factory.execution.resolvers,
          info,
          resolver,
          buildFieldResolveArgs(
            source,
            context,
            info,
            path,
            field,
            selection,
            attachInfo.args,
            parentType
          ),
          true
        )
          .then(result => {
            const subFields = collectFields(fieldType, selection.selectionSet);

            // if there are no subfields to resolve, return the results
            if (!subFields.length) {
              return result;
            } else if (isList) {
              if (!Array.isArray(result)) {
                return;
              }

              return promiseMap(result, (res, idx) => {
                const listPath = { prev: _.cloneDeep(path), key: idx };
                return resolveSubFields(
                  subFields,
                  result[idx],
                  fieldType,
                  buildFieldResolveArgs(
                    source,
                    context,
                    info,
                    listPath,
                    field,
                    selection,
                    attachInfo.args,
                    parentType
                  )
                );
              })
              .then(() => result);
            }

            return resolveSubFields(
              subFields,
              result,
              fieldType,
              buildFieldResolveArgs(
                source,
                context,
                info,
                path,
                field,
                selection,
                attachInfo.args,
                parentType
              )
            )
            .then(() => result);
          });
      })
      .then(result => {
        return promiseReduce(resolveResult, (prev, r) => {
          const directiveInfo = buildDirectiveInfo(info, r, { attachInfo });
          return instrumentResolver(
            ExecutionType.DIRECTIVE,
            r.directive.name,
            r.resolve.name || 'resolveResult',
            execution.resolvers,
            directiveInfo,
            r.resolve,
            [ prev, r.args, context, directiveInfo ]
          );
        }, result)
        .then(directiveResult => {
          return directiveResult === undefined ? result : directiveResult;
        });
      });
    });
}

/**
 * Builds a map of fields with resolve functions to resolve
 * @param {*} parent 
 * @param {*} selectionSet 
 * @param {*} info 
 */
export function collectFields(parent, selectionSet) {
  if (!selectionSet || typeof parent.getFields !== 'function') {
    return [];
  }
  const fieldNames = Object.keys(parent.getFields());
  return selectionSet.selections.reduce((fields, selection) => {
    const name = selection.name.value;
    if (fieldNames.indexOf(name) !== -1) {
      fields.push({
        name: _.get(selection, [ 'alias', 'value' ]) || name,
        selection
      });
    }
    return fields;
  }, []);
}

/**
 * performs a custom execution and feeds the resulting data back to
 * the graphql execution. This allows injecting of custom directive
 * resolvers, trace instrumentation, and event logging
 * @param {*} source 
 * @param {*} args 
 * @param {*} context 
 * @param {*} info 
 */
export function factoryExecute(...rargs) {
  const [ source, , context, info ] = rargs;
  const selection = getSelection(info);
  const key = _.get(selection, [ 'alias', 'value' ], selection.name.value);

  // check for root resolver
  if (isRootResolver(info)) {
    if (isFirstSelection(info)) {
      // get the root fields to resolve
      const rootFields = collectFields(
        info.parentType,
        info.operation.selectionSet
      );
      const result = Object.create(null);
      const execution = {
        version: TRACING_VERSION,
        start: Date.now(),
        end: -1,
        duration: -1,
        resolvers: [],
        operation: Object.assign(
          Object.create(null),
          info.operation
        )
      };

      // get the directive middleware
      const { resolveRequest, resolveResult } = getDirectiveResolvers(info, [
        {
          location: DirectiveLocation.SCHEMA,
          astNode: info.schema.astNode
        },
        {
          location: getOperationLocation(info),
          astNode: info.operation
        }
      ]);

      // perform the entire execution from the first root resolver
      const request = promiseReduce(resolveRequest, (prev, r) => {
        const attachInfo = r.location === DirectiveLocation.SCHEMA ?
          {
            kind: Kind.SCHEMA_DEFINITION
          } :
          {
            kind: Kind.OBJECT_TYPE_DEFINITION
          };

        const directiveInfo = buildDirectiveInfo(info, r, { attachInfo });
        return instrumentResolver(
          ExecutionType.DIRECTIVE,
          r.directive.name,
          r.resolve.name || 'resolve',
          execution.resolvers,
          directiveInfo,
          r.resolve,
          [ undefined, r.args, context, directiveInfo ]
        );
      })
      .then(() => {
        return resolveSubFields(
          rootFields,
          result,
          info.parentType,
          rargs,
          info.operation.operation === 'mutation'
        );
      })
      .then(() => {
        return promiseReduce(resolveResult, (prev, r) => {
          const attachInfo = r.location === DirectiveLocation.SCHEMA ?
          {
            kind: Kind.SCHEMA_DEFINITION
          } :
          {
            kind: Kind.OBJECT_TYPE_DEFINITION
          };

          const directiveInfo = buildDirectiveInfo(info, r, { attachInfo });
          return instrumentResolver(
            ExecutionType.DIRECTIVE,
            r.directive.name,
            r.resolve.name || 'resolveResult',
            execution.resolvers,
            directiveInfo,
            r.resolve,
            [ result, r.args, context, directiveInfo ]
          );
        });
      })
      .then(() => {
        execution.end = Date.now();
        execution.duration = execution.end - execution.start;
        info.definition.emit(FactoryEvent.EXECUTION, execution);
      }, err => {
        execution.end = Date.now();
        execution.duration = execution.end - execution.start;
        info.definition.emit(FactoryEvent.EXECUTION, execution);
        return Promise.reject(err);
      });

      // set the factory custom key
      info.operation._factory = {
        // logger,
        execution,
        result,
        request
      };
    }

    // root field selections 1 to n should resolve the promise
    // set by the first field resolver before attempting to get
    // their value from the factory request final result
    return new Promise((resolve, reject) => {
      process.nextTick(() => {
        try {
          return info.operation._factory.request.then(() => {
            const result = _.get(info.operation, [ '_factory', 'result', key ]);
            if (result instanceof Error) {
              throw result;
            }
            return result;
          })
          .then(resolve, reject)
          .catch(reject);
        } catch (error) {
          return reject(error);
        }
      });
    });
  }

  // if not the root, check for errors as key values
  // this indicates that an error should be thrown so
  // that graphql can report it normally in the result
  const resultOrError = _.get(source, [ key ]);
    if (resultOrError instanceof Error) {
      throw resultOrError;
    }
    return resultOrError;
}

// runs as basic graphql execution
export function graphqlExecute(...rargs) {
  const [ source, , , info ] = rargs;
  const selection = getSelection(info);
  return resolveField(
    source,
    info.path,
    info.parentType,
    selection,
    rargs
  );
}