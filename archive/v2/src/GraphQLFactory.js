import EventEmitter from 'events'
import GraphQLFactoryCompiler from './GraphQLFactoryCompiler'
import GraphQLFactoryDefinition from './GraphQLFactoryDefinition'
import GraphQLFactoryLibrary from './GraphQLFactoryLibrary'
import GraphQLFactoryTypeGenerator from './types/GraphQLFactoryTypeGenerator'
import GraphQLFactoryDecomposer from './GraphQLFactoryDecomposer'
import utils from './utils/index'
import constants from './types/constants'

// standalone definition builder
function define (definition = {}, options = {}) {
  return new GraphQLFactoryDefinition(definition, options)
}

// standalone definition decompiler
function unmake (graphqlType, name) {
  return new GraphQLFactoryDecomposer(graphqlType, name)
}

// standalone compiler
function compile (definition = {}, options = {}) {
  const { plugin } = options
  if (definition instanceof GraphQLFactoryDefinition) {
    return definition.registerPlugin(plugin).compile()
  }
  return define(definition, options).compile()
}

/**
 * graphql-factory instance
 * @property {GraphQL} graphql - instance of graphql
 * @property {ConstantsEnum} constants
 * @property {FactoryUtils} utils - Util functions
 */
export class GraphQLFactory extends EventEmitter {
  constructor (graphql) {
    super()
    /**
     * Compiles a {@link FactoryDefinition}
     * @function compile
     * @param {FactoryDefinition} definition
     * @param {Object} [options]
     * @param {String|Array} options.plugin - Plugin or array of plugins
     * @returns {GraphQLFactoryDefinition}
     */
    this.compile = compile
    this.constants = constants
    this.errors = []
    this.middleware = []

    /**
     * Creates an un-compiled {@link FactoryDefinition}
     * @function define
     * @param {FactoryDefinition} definition
     * @param {Object} [options]
     * @param {String|Array} options.plugin - Plugin or array of plugins
     * @returns {GraphQLFactoryDefinition}
     */
    this.define = define
    this.graphql = graphql
    this.utils = utils
  }

  /**
   * Middleware/plugin registration function that can be called on the factory
   * itself to use the same pattern as express, and other frameworks that support
   * middleware
   * @param plugin
   */
  use (plugin) {
    this.middleware.push(plugin)
  }

  /**
   * Creates a new GraphQLFactoryLibrary
   * @param {FactoryDefinition} definition
   * @param {Object} options
   * @param {String|Array} options.plugin - Plugin or array of plugins
   * @returns {GraphQLFactoryLibrary}
   */
  make (definition = {}, options = {}) {
    const {
      plugin,
      beforeResolve,
      afterResolve,
      beforeTimeout,
      afterTimeout,
      logger
    } = options

    // ensure that the factory def is an instance of the class
    const factoryDef = definition instanceof GraphQLFactoryDefinition
      ? definition
      : new GraphQLFactoryDefinition(definition)

    // setup a logger
    const _logger = typeof logger === 'object'
      ? logger
      : {}

    // emit an error event when log-level is error which throws an error
    this.on('log', log => {
      if (typeof _logger[log.level] === 'function') _logger[log.level](log)
      if (log.level === 'error') this.errors.push(log.error.message)
    })

    // forward definition logs to the main factory emitter
    factoryDef.on('log', payload => {
      this.emit('log', payload)
    })

    // build the definition
    factoryDef
      .registerPlugin(this.middleware)
      .registerPlugin(plugin)
      .beforeResolve(beforeResolve)
      .beforeTimeout(beforeTimeout)
      .afterResolve(afterResolve)
      .afterTimeout(afterTimeout)
      .compile()

    // create a new lib
    const lib = new GraphQLFactoryLibrary(this.graphql, factoryDef, this)

    // check for error and throw
    if (this.errors.length) {
      const errorMessage = 'GraphQLFactoryMakeError: ' + this.errors.join(', ')
      throw new Error(errorMessage)
    }

    // otherwise return the lib
    return lib
  }

  /**
   * Creates a graphql-factory definition from a graphqlType
   * @param graphqlType
   * @param name
   * @returns {GraphQLFactoryDecomposer}
   */
  unmake (graphqlType, name) {
    return new GraphQLFactoryDecomposer(graphqlType, name)
  }

  /**
   * Merges definitions and schemas into a single factory definition
   */
  merge () {
    const args = [...arguments]
    const definition = new GraphQLFactoryDefinition({})

    // loop through all of the arguments and merge the definitions
    args.forEach(obj => {
      const constructorName = utils.constructorName(obj)
      definition.merge(
        utils.includes(constants.DECOMPOSABLE, constructorName)
          ? unmake(obj)
          : obj
      )
    })

    return definition
  }
}

/**
 * Create a new instance of graphql-factory
 * @module graphql-factory
 *
 * @param {GraphQL} graphql - Instance of graphql
 * @returns {GraphQLFactory} instance of graphql-factory
 * @example <caption>ES5</caption>
 * var graphql = require('graphql')
 * var GraphQLFactory = require('graphql-factory')
 * var factory = GraphQLFactory(graphql)
 * @example <caption>ES6</caption>
 * import * as graphql from 'graphql'
 * import GraphQLFactory from 'graphql-factory'
 * let factory = GraphQLFactory(graphql)
 */
const factory = function (graphql) {
  return new GraphQLFactory(graphql)
}

// add tools to main module
factory.compile = compile
factory.constants = constants
factory.define = define
factory.unmake = unmake
factory.utils = utils

// add classes to main module
factory.GraphQLFactory = GraphQLFactory
factory.GraphQLFactoryCompiler = GraphQLFactoryCompiler
factory.GraphQLFactoryDefinition = GraphQLFactoryDefinition
factory.GraphQLFactoryLibrary = GraphQLFactoryLibrary
factory.GraphQLFactoryTypeGenerator = GraphQLFactoryTypeGenerator

// export main factory methods
export default factory
