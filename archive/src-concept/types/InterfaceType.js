import _ from '../common/lodash.custom'
import { GraphQLInterfaceType } from 'graphql'
import FieldConfigMapThunk from './FieldConfigMapThunk'

export default function InterfaceType (definition) {
  try {
    const def = _.merge({}, definition)
    const { fields, resolveType } = definition

    def.fields = FieldConfigMapThunk.call(this, fields)

    if (_.isFunction(resolveType) || _.isString(resolveType)) {
      def.resolveType = this.bindFunction(resolveType, definition)
    }

    return new GraphQLInterfaceType(def)
  } catch (err) {
    this.emit('log', {
      source: 'types',
      level: 'error',
      error: new Error('InterfaceType: ' + err.message),
      stack: err.stack
    })
  }
}
