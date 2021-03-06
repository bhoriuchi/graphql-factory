import { GraphQLSkipResolveInstruction } from '../types';
import { DirectiveLocation, GraphQLError } from 'graphql';
import { lodash as _ } from '../jsutils';

function validateResolver(args, path, info) {
  const resolver = _.get(info, path);
  if (!_.isFunction(resolver)) {
    throw new Error(
      '@resolve directive was unable to find the ' +
        'function ' +
        args.resolver +
        ' in the SchemaDefinition.functions ' +
        'store',
    );
  }
  return resolver;
}

export default {
  name: 'resolve',
  description:
    'Assigns a resolver function from the function store to ' +
    'a field at execution and skips the defined resolver on the field. ' +
    'This can be used to assign resolvers to a field using only schema ' +
    'language.',
  locations: [DirectiveLocation.FIELD_DEFINITION],
  args: {
    resolver: {
      type: 'String!',
      description:
        'A reference to the resolver function stored in the ' +
        'SchemaDefinition.functions store',
    },
  },
  before(source, args, context, info) {
    try {
      const path = ['schema', 'definition', 'functions', args.resolver];
      const resolver = validateResolver(args, path, info);
      return new GraphQLSkipResolveInstruction(
        resolver(
          info.attachInfo.fieldSource,
          info.attachInfo.fieldArgs,
          context,
          info.attachInfo.fieldInfo,
        ),
      );
    } catch (error) {
      throw new GraphQLError(error.message);
    }
  },
  build(source, args, context, info) {
    try {
      const path = ['definition', 'functions', args.resolver];
      validateResolver(args, path, info);
    } catch (error) {
      throw new GraphQLError(error.message);
    }
  },
};
