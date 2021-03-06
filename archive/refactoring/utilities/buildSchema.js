// @flow
import type { GraphQLSchema } from 'graphql';
import {
  buildSchema,
  GraphQLScalarType,
  GraphQLObjectType,
  GraphQLUnionType,
  GraphQLInterfaceType
} from 'graphql';
import { request } from '../utilities/request';
import { set, isObject } from '../jsutils';

import type {
  SchemaBackingConfig,
  SchemaBackingFieldConfig
} from '../backing/backing';
import { SchemaBacking } from '../backing/backing';

/**
 * Adds directive resolvers to a standard GraphQLDirective object
 * if resolvers are present in the backing
 * @param {*} schema 
 * @param {*} directiveName 
 * @param {*} backing 
 */
export function hydrateDirective(
  schema: GraphQLSchema,
  directiveName: string,
  backing: SchemaBackingFieldConfig
) {
  const name = directiveName.replace(/^@/, '');

  schema._directives.forEach(directive => {
    if (directive.name === name) {
      if (typeof backing.resolve === 'function') {
        set(directive, 'resolve', backing.resolve);
      }
      if (typeof backing.resolveResult === 'function') {
        set(directive, 'resolveResult', backing.resolveResult);
      }
    }
  });
}

/**
 * Applies backing functions and other potential extenssion data
 * to graphql types and fields that cannot be represented by 
 * Schema Definition Language using a SchemaBackingConfig
 * @param {*} schema 
 * @param {*} backing 
 */
export function hydrateSchema(
  schema: GraphQLSchema,
  backing: SchemaBackingConfig
) {
  Object.keys(backing).forEach(key => {
    const keyBacking = backing[key];

    // check for directive backing
    if (key.match(/^@/)) {
      hydrateDirective(schema, key, keyBacking);
      return;
    }

    // check for type
    if (schema._typeMap[key]) {
      const type = schema._typeMap[key];

      Object.keys(keyBacking).forEach(fieldName => {
        switch (fieldName) {
          case '_serialize':
            if (type instanceof GraphQLScalarType &&
              typeof keyBacking._serialize === 'function') {
              set(type, 'serialize', keyBacking._serialize);
            }
            break;
          case '_parseValue':
            if (type instanceof GraphQLScalarType &&
              typeof keyBacking._parseValue === 'function') {
              set(type, 'parseValue', keyBacking._parseValue);
            }
            break;
          case '_parseLiteral':
            if (type instanceof GraphQLScalarType &&
              typeof keyBacking._parseLiteral === 'function') {
              set(type, 'parseLiteral', keyBacking._parseLiteral);
            }
            break;
          case '_isTypeOf':
            if (type instanceof GraphQLObjectType &&
              typeof keyBacking._isTypeOf === 'function') {
              set(type, 'isTypeOf', keyBacking._isTypeOf);
            }
            break;
          case '_resolveType':
            if ((type instanceof GraphQLInterfaceType ||
              type instanceof GraphQLUnionType) &&
              typeof keyBacking._resolveType === 'function') {
              set(type, 'resolveType', keyBacking._resolveType);
            }
            break;
          default:
            if (
              (type instanceof GraphQLObjectType ||
              type instanceof GraphQLInterfaceType) &&
              typeof type._fields[fieldName] === 'object'
            ) {
              const back = keyBacking[fieldName];
              if (typeof back === 'function') {
                type._fields[fieldName].resolve = back;
              } else if (typeof back === 'object' && back !== null) {
                const { resolve, subscribe } = back;
                if (typeof resolve === 'function') {
                  type._fields[fieldName].resolve = resolve;
                }
                if (typeof subscribe === 'function') {
                  type._fields[fieldName].subscribe = subscribe;
                }
              }
            }
        }
      });
    }
  });
  return schema;
}

export default function buildFactorySchema(
  source: string,
  backing?: ?SchemaBackingConfig | ?SchemaBacking
) {
  const schema = buildSchema(source);

  // add a helper method to the schema so that requests
  // can be made with schema.request(source, ...)
  set(schema, 'request', (...args) => {
    if (args.length === 1 && isObject(args[0])) {
      args[0].schema = schema;
    } else {
      args.splice(0, 0, schema);
    }
    return request(...args);
  });

  // hydrate the schema if a backing is passed
  // also attempt to create a new SchemaBacking
  // which will run a validation on the backing
  return !backing ?
    schema :
    hydrateSchema(
      schema,
      new SchemaBacking(backing).config()
    );
}
