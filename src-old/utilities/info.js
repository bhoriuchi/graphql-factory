import { lodash as _ } from '../jsutils';

/**
 * Gets the fields path of the current resolver
 * optionally includes indexes
 * @param {*} info
 * @param {*} includeIndexes
 */
export function fieldPath(info, includeIndexes) {
  let current = info.path || _.get(info, ['fieldInfo', 'path']);
  if (!current) {
    return [];
  }
  const path = [current.key];
  while (current.prev) {
    current = current.prev;
    if (typeof current.key !== 'number' || includeIndexes) {
      path.push(current.key);
    }
  }
  return path.reverse();
}

export function pathToArray(path) {
  let current = path;
  if (!_.isObject(current) || !current.key) {
    return [];
  }
  const arrPath = [current.key];
  while (current.prev) {
    current = current.prev;
    arrPath.push(current.key);
  }
  return arrPath.reverse();
}

/**
 * Makes a path object from the current field info
 * @param {*} info
 * @param {*} options
 */
export function makePath(info, options) {
  const opts = Object.assign({}, options);
  const prepend = Array.isArray(opts.prepend) ? opts.prepend : [];
  const path = fieldPath(info, opts.includeIndexes);
  return prepend.concat(path).reduce((prev, key) => {
    return { prev, key };
  }, undefined);
}

/**
 * Returns true if the field is a root field
 * @param {*} info
 */
export function isRootResolver(info) {
  return !info.path.prev;
}

/**
 * Returns true if the resolver is a root field and the first
 * selection of the operation
 * @param {*} info
 */
export function isFirstSelection(info) {
  const firstSel = info.operation.selectionSet.selections[0];
  return getFieldEntryKey(firstSel) === info.path.key;
}

/**
 * Returns the operation type
 * @param {*} info
 */
export function operationType(info) {
  return info.operation.operation;
}

/**
 * gets the current operation selection based on the
 * resolver field path
 * @param {*} info
 */
export function getSelection(info) {
  const path = fieldPath(info);
  let key = null;
  let selections = info.operation.selectionSet.selections;

  while (path.length) {
    key = path.shift();
    const selection = selections.filter(s => {
      return s.name.value === key || (s.alias && s.alias.value === key);
    });

    if (!selection.length) {
      throw new Error('Unable to determine selection');
    }
    if (!path.length) {
      return selection[0];
    }
    selections = selection[0].selectionSet.selections;
  }
}

export function getFieldEntryKey(node) {
  return node.alias ? node.alias.value : node.name.value;
}

export function arrayPath(path, arrPath = []) {
  arrPath.push(path.key);
  return path.prev ? arrayPath(path.prev, arrPath) : arrPath.reverse();
}

export function dotPath(path) {
  return arrayPath(path).join('.');
}
