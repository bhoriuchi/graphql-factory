# graphql-factory

Tools for building `graphql`

## Announcement

This project is currently undergoing a major re-write for `v3.0.0`. 
This will include

* a more graphql-like api
* updated GraphQL Factory Definition Format 
* custom execution which will allow
  * custom directive middleware support
  * tracing data for all resolves/middleware
* Schema building tools
* Schema language support
* better code testing
* and more...

`v2.1.0` code is available in the `v2.1.0` branch. The master branch will
be used for `v3.0.0` development

### Schema Language Example

Create a schema from schema language and a `SchemaBacking`

```js
import { graphql } from 'graphql'
import {
  SchemaDefinition,
  SchemaBacking
} from 'graphql-factory'

// create a schema language definition
const definition = `
  type Item {
    id: String!
    name: String!
  }

  type List {
    id: String!
    name: String!
    items: [Item]!
  }

  type Query {
    listLists (search: String): [List]
  }

  directive @test(value: String) on SCHEMA | OBJECT | QUERY | FIELD

  schema @test(value: "I am a schema directive") {
    query: Query
  }`

// create a schema backing that contains resolvers
const backing = new SchemaBacking()
  .Directive('test')
    .resolve((source, args, context, info) => {
      console.log('Testing', args)
    })
  .Object('Query')
    .resolve('listLists', (source, args, context, info) => {
      // resolve code
    })
  .Object('List')
    .resolve('items', (source, args, context, info) => {
      // resolve code
    })
  .backing()

// create an async function so we can use await
async function main() {
  // build a schema from the definition and backing
  const schema = await new SchemaDefinition()
    .use(definition, backing)
    .buildSchema()

  // make a request with the attached request method
  // you can also use the standard graphql execution
  // but extensions will not be returned in the result
  const result = await schema.request({
    source: `
      query MyQuery {
        listLists {
          name
          items {
            name
          }
        }
      }
    `
  });

  console.log(result);
}

// call async function to execute query
main();
```

### Factory Definition Example

Create the same schema using GraphQL Factory Definition Format

```js
import { graphql } from 'graphql'
import { SchemaDefinition } from 'graphql-factory'

// graphql factory definition which includes
// definitions and resolvers
const definition = {
  directives: {
    test: {
      locations: [ 'SCHEMA', 'OBJECT', 'QUERY', 'FIELD' ],
      args: {
        value: { type: 'String' }
      },
      resolve (source, args, context, info) {
        console.log('Testing', args)
      }
    }
  },
  types: {
    Item: {
      type: 'Object',
      fields: {
        id: { type: 'String!' },
        name: { type: 'String!' }
      }
    },
    List: {
      type: 'Object',
      fields: {
        id: { type: 'String!' },
        name: { type: 'String!' },
        items: {
          type: '[Item]!',
          resolve(source, args, context, info) {
            // resolve code
          }
        }
      }
    },
    Query: {
      type: 'Object',
      fields: {
        listLists: {
          type: '[List]',
          args: {
            search: { type: 'String' }
          },
          resolve(source, args, context, info) {
            // resolve code
          }
        }
      }
    }
  },
  schema: {
    directives: [ 'test' ],
    query: 'Query',
    '@directives': {
      test: {
        value: 'I am a schema directive'
      }
    }
  }
}

// create an async function so we can use await
async function main() {
  // build a schema from the definition and backing
  const schema = await new SchemaDefinition()
    .use(definition)
    .buildSchema()

  // make a request with the attached request method
  // you can also use the standard graphql execution
  // but extensions will not be returned in the result
  const result = await schema.request({
    source: `
      query MyQuery {
        listLists {
          name
          items {
            name
          }
        }
      }
    `
  });

  console.log(result);
}

// call async function to execute query
main();
```
