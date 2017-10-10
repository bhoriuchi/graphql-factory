'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var EventEmitter = _interopDefault(require('events'));

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};





var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();





var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();





var defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};



var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};



















var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

/* eslint-disable */
var LARGE_ARRAY_SIZE = 200;var HASH_UNDEFINED = "__lodash_hash_undefined__";var MAX_SAFE_INTEGER = 9007199254740991;var argsTag = "[object Arguments]"; var arrayTag = "[object Array]"; var boolTag = "[object Boolean]"; var dateTag = "[object Date]"; var errorTag = "[object Error]"; var funcTag = "[object Function]"; var genTag = "[object GeneratorFunction]"; var mapTag = "[object Map]"; var numberTag = "[object Number]"; var objectTag = "[object Object]"; var promiseTag = "[object Promise]"; var regexpTag = "[object RegExp]"; var setTag = "[object Set]"; var stringTag = "[object String]"; var symbolTag = "[object Symbol]"; var weakMapTag = "[object WeakMap]";var arrayBufferTag = "[object ArrayBuffer]"; var dataViewTag = "[object DataView]"; var float32Tag = "[object Float32Array]"; var float64Tag = "[object Float64Array]"; var int8Tag = "[object Int8Array]"; var int16Tag = "[object Int16Array]"; var int32Tag = "[object Int32Array]"; var uint8Tag = "[object Uint8Array]"; var uint8ClampedTag = "[object Uint8ClampedArray]"; var uint16Tag = "[object Uint16Array]"; var uint32Tag = "[object Uint32Array]";var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;var reFlags = /\w*$/;var reIsHostCtor = /^\[object .+?Constructor\]$/;var reIsUint = /^(?:0|[1-9]\d*)$/;var typedArrayTags = {};typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;typedArrayTags[argsTag] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;var cloneableTags = {};cloneableTags[argsTag] = cloneableTags[arrayTag] = cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] = cloneableTags[boolTag] = cloneableTags[dateTag] = cloneableTags[float32Tag] = cloneableTags[float64Tag] = cloneableTags[int8Tag] = cloneableTags[int16Tag] = cloneableTags[int32Tag] = cloneableTags[mapTag] = cloneableTags[numberTag] = cloneableTags[objectTag] = cloneableTags[regexpTag] = cloneableTags[setTag] = cloneableTags[stringTag] = cloneableTags[symbolTag] = cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] = cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;cloneableTags[errorTag] = cloneableTags[funcTag] = cloneableTags[weakMapTag] = false;var freeGlobal = (typeof global === "undefined" ? "undefined" : _typeof(global)) == "object" && global && global.Object === Object && global;var freeSelf = (typeof self === "undefined" ? "undefined" : _typeof(self)) == "object" && self && self.Object === Object && self;var root = freeGlobal || freeSelf || Function("return this")();var freeExports = (typeof exports === "undefined" ? "undefined" : _typeof(exports)) == "object" && exports && !exports.nodeType && exports;var freeModule = freeExports && (typeof module === "undefined" ? "undefined" : _typeof(module)) == "object" && module && !module.nodeType && module;var moduleExports = freeModule && freeModule.exports === freeExports;var freeProcess = moduleExports && freeGlobal.process;var nodeUtil = function () {
  try {
    return freeProcess && freeProcess.binding("util");
  } catch (e) {}
}();var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;function addMapEntry(map, pair) {
  map.set(pair[0], pair[1]);return map;
}function addSetEntry(set, value) {
  set.add(value);return set;
}function apply(func, thisArg, args) {
  switch (args.length) {case 0:
      return func.call(thisArg);case 1:
      return func.call(thisArg, args[0]);case 2:
      return func.call(thisArg, args[0], args[1]);case 3:
      return func.call(thisArg, args[0], args[1], args[2]);}return func.apply(thisArg, args);
}function arrayEach(array, iteratee) {
  var index = -1,
      length = array ? array.length : 0;while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }return array;
}function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;while (++index < length) {
    array[offset + index] = values[index];
  }return array;
}function arrayReduce(array, iteratee, accumulator, initAccum) {
  var index = -1,
      length = array ? array.length : 0;if (initAccum && length) {
    accumulator = array[++index];
  }while (++index < length) {
    accumulator = iteratee(accumulator, array[index], index, array);
  }return accumulator;
}function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);while (++index < n) {
    result[index] = iteratee(index);
  }return result;
}function baseUnary(func) {
  return function (value) {
    return func(value);
  };
}function getValue(object, key) {
  return object == null ? undefined : object[key];
}function isHostObject(value) {
  var result = false;if (value != null && typeof value.toString != "function") {
    try {
      result = !!(value + "");
    } catch (e) {}
  }return result;
}function mapToArray(map) {
  var index = -1,
      result = Array(map.size);map.forEach(function (value, key) {
    result[++index] = [key, value];
  });return result;
}function overArg(func, transform) {
  return function (arg) {
    return func(transform(arg));
  };
}function setToArray(set) {
  var index = -1,
      result = Array(set.size);set.forEach(function (value) {
    result[++index] = value;
  });return result;
}var arrayProto = Array.prototype;
var funcProto = Function.prototype;
var objectProto = Object.prototype;var coreJsData = root["__core-js_shared__"];var maskSrcKey = function () {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");return uid ? "Symbol(src)_1." + uid : "";
}();var funcToString = funcProto.toString;var hasOwnProperty = objectProto.hasOwnProperty;var objectCtorString = funcToString.call(Object);var objectToString = objectProto.toString;var reIsNative = RegExp("^" + funcToString.call(hasOwnProperty).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$");var Buffer$1 = moduleExports ? root.Buffer : undefined; var _Symbol = root.Symbol; var Uint8Array = root.Uint8Array; var getPrototype = overArg(Object.getPrototypeOf, Object); var objectCreate = Object.create; var propertyIsEnumerable = objectProto.propertyIsEnumerable; var splice = arrayProto.splice;var nativeGetSymbols = Object.getOwnPropertySymbols; var nativeIsBuffer = Buffer$1 ? Buffer$1.isBuffer : undefined; var nativeKeys = overArg(Object.keys, Object); var nativeMax = Math.max;var DataView = getNative(root, "DataView"); var Map = getNative(root, "Map"); var Promise$1 = getNative(root, "Promise"); var Set$1 = getNative(root, "Set"); var WeakMap = getNative(root, "WeakMap"); var nativeCreate = getNative(Object, "create");var dataViewCtorString = toSource(DataView); var mapCtorString = toSource(Map); var promiseCtorString = toSource(Promise$1); var setCtorString = toSource(Set$1); var weakMapCtorString = toSource(WeakMap);var symbolProto = _Symbol ? _Symbol.prototype : undefined; var symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;function Hash(entries) {
  var index = -1,
      length = entries ? entries.length : 0;this.clear();while (++index < length) {
    var entry = entries[index];this.set(entry[0], entry[1]);
  }
}function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
}function hashDelete(key) {
  return this.has(key) && delete this.__data__[key];
}function hashGet(key) {
  var data = this.__data__;if (nativeCreate) {
    var result = data[key];return result === HASH_UNDEFINED ? undefined : result;
  }return hasOwnProperty.call(data, key) ? data[key] : undefined;
}function hashHas(key) {
  var data = this.__data__;return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
}function hashSet(key, value) {
  var data = this.__data__;data[key] = nativeCreate && value === undefined ? HASH_UNDEFINED : value;return this;
}Hash.prototype.clear = hashClear;Hash.prototype["delete"] = hashDelete;Hash.prototype.get = hashGet;Hash.prototype.has = hashHas;Hash.prototype.set = hashSet;function ListCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;this.clear();while (++index < length) {
    var entry = entries[index];this.set(entry[0], entry[1]);
  }
}function listCacheClear() {
  this.__data__ = [];
}function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);if (index < 0) {
    return false;
  }var lastIndex = data.length - 1;if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }return true;
}function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);return index < 0 ? undefined : data[index][1];
}function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);if (index < 0) {
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }return this;
}ListCache.prototype.clear = listCacheClear;ListCache.prototype["delete"] = listCacheDelete;ListCache.prototype.get = listCacheGet;ListCache.prototype.has = listCacheHas;ListCache.prototype.set = listCacheSet;function MapCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;this.clear();while (++index < length) {
    var entry = entries[index];this.set(entry[0], entry[1]);
  }
}function mapCacheClear() {
  this.__data__ = { hash: new Hash(), map: new (Map || ListCache)(), string: new Hash() };
}function mapCacheDelete(key) {
  return getMapData(this, key)["delete"](key);
}function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}function mapCacheSet(key, value) {
  getMapData(this, key).set(key, value);return this;
}MapCache.prototype.clear = mapCacheClear;MapCache.prototype["delete"] = mapCacheDelete;MapCache.prototype.get = mapCacheGet;MapCache.prototype.has = mapCacheHas;MapCache.prototype.set = mapCacheSet;function Stack(entries) {
  this.__data__ = new ListCache(entries);
}function stackClear() {
  this.__data__ = new ListCache();
}function stackDelete(key) {
  return this.__data__["delete"](key);
}function stackGet(key) {
  return this.__data__.get(key);
}function stackHas(key) {
  return this.__data__.has(key);
}function stackSet(key, value) {
  var cache = this.__data__;if (cache instanceof ListCache) {
    var pairs = cache.__data__;if (!Map || pairs.length < LARGE_ARRAY_SIZE - 1) {
      pairs.push([key, value]);return this;
    }cache = this.__data__ = new MapCache(pairs);
  }cache.set(key, value);return this;
}Stack.prototype.clear = stackClear;Stack.prototype["delete"] = stackDelete;Stack.prototype.get = stackGet;Stack.prototype.has = stackHas;Stack.prototype.set = stackSet;function arrayLikeKeys(value, inherited) {
  var result = isArray$1(value) || isArguments(value) ? baseTimes(value.length, String) : [];var length = result.length,
      skipIndexes = !!length;for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) && !(skipIndexes && (key == "length" || isIndex(key, length)))) {
      result.push(key);
    }
  }return result;
}function assignMergeValue(object, key, value) {
  if (value !== undefined && !eq(object[key], value) || typeof key == "number" && value === undefined && !(key in object)) {
    object[key] = value;
  }
}function assignValue(object, key, value) {
  var objValue = object[key];if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) || value === undefined && !(key in object)) {
    object[key] = value;
  }
}function assocIndexOf(array, key) {
  var length = array.length;while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }return -1;
}function baseAssign(object, source) {
  return object && copyObject(source, keys$1(source), object);
}function baseClone(value, isDeep, isFull, customizer, key, object, stack) {
  var result;if (customizer) {
    result = object ? customizer(value, key, object, stack) : customizer(value);
  }if (result !== undefined) {
    return result;
  }if (!isObject$1(value)) {
    return value;
  }var isArr = isArray$1(value);if (isArr) {
    result = initCloneArray(value);if (!isDeep) {
      return copyArray(value, result);
    }
  } else {
    var tag = getTag(value),
        isFunc = tag == funcTag || tag == genTag;if (isBuffer(value)) {
      return cloneBuffer(value, isDeep);
    }if (tag == objectTag || tag == argsTag || isFunc && !object) {
      if (isHostObject(value)) {
        return object ? value : {};
      }result = initCloneObject(isFunc ? {} : value);if (!isDeep) {
        return copySymbols(value, baseAssign(result, value));
      }
    } else {
      if (!cloneableTags[tag]) {
        return object ? value : {};
      }result = initCloneByTag(value, tag, baseClone, isDeep);
    }
  }stack || (stack = new Stack());var stacked = stack.get(value);if (stacked) {
    return stacked;
  }stack.set(value, result);if (!isArr) {
    var props = isFull ? getAllKeys(value) : keys$1(value);
  }arrayEach(props || value, function (subValue, key) {
    if (props) {
      key = subValue;subValue = value[key];
    }assignValue(result, key, baseClone(subValue, isDeep, isFull, customizer, key, value, stack));
  });return result;
}function baseCreate(proto) {
  return isObject$1(proto) ? objectCreate(proto) : {};
}function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);return isArray$1(object) ? result : arrayPush(result, symbolsFunc(object));
}function baseGetTag(value) {
  return objectToString.call(value);
}function baseIsNative(value) {
  if (!isObject$1(value) || isMasked(value)) {
    return false;
  }var pattern = isFunction$1(value) || isHostObject(value) ? reIsNative : reIsHostCtor;return pattern.test(toSource(value));
}function baseIsTypedArray(value) {
  return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[objectToString.call(value)];
}function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }var result = [];for (var key in Object(object)) {
    if (hasOwnProperty.call(object, key) && key != "constructor") {
      result.push(key);
    }
  }return result;
}function baseKeysIn(object) {
  if (!isObject$1(object)) {
    return nativeKeysIn(object);
  }var isProto = isPrototype(object),
      result = [];for (var key in object) {
    if (!(key == "constructor" && (isProto || !hasOwnProperty.call(object, key)))) {
      result.push(key);
    }
  }return result;
}function baseMerge(object, source, srcIndex, customizer, stack) {
  if (object === source) {
    return;
  }if (!(isArray$1(source) || isTypedArray(source))) {
    var props = baseKeysIn(source);
  }arrayEach(props || source, function (srcValue, key) {
    if (props) {
      key = srcValue;srcValue = source[key];
    }if (isObject$1(srcValue)) {
      stack || (stack = new Stack());baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
    } else {
      var newValue = customizer ? customizer(object[key], srcValue, key + "", object, source, stack) : undefined;if (newValue === undefined) {
        newValue = srcValue;
      }assignMergeValue(object, key, newValue);
    }
  });
}function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
  var objValue = object[key],
      srcValue = source[key],
      stacked = stack.get(srcValue);if (stacked) {
    assignMergeValue(object, key, stacked);return;
  }var newValue = customizer ? customizer(objValue, srcValue, key + "", object, source, stack) : undefined;var isCommon = newValue === undefined;if (isCommon) {
    newValue = srcValue;if (isArray$1(srcValue) || isTypedArray(srcValue)) {
      if (isArray$1(objValue)) {
        newValue = objValue;
      } else if (isArrayLikeObject(objValue)) {
        newValue = copyArray(objValue);
      } else {
        isCommon = false;newValue = baseClone(srcValue, true);
      }
    } else if (isPlainObject(srcValue) || isArguments(srcValue)) {
      if (isArguments(objValue)) {
        newValue = toPlainObject(objValue);
      } else if (!isObject$1(objValue) || srcIndex && isFunction$1(objValue)) {
        isCommon = false;newValue = baseClone(srcValue, true);
      } else {
        newValue = objValue;
      }
    } else {
      isCommon = false;
    }
  }if (isCommon) {
    stack.set(srcValue, newValue);mergeFunc(newValue, srcValue, srcIndex, customizer, stack);stack["delete"](srcValue);
  }assignMergeValue(object, key, newValue);
}function baseRest(func, start) {
  start = nativeMax(start === undefined ? func.length - 1 : start, 0);return function () {
    var args = arguments,
        index = -1,
        length = nativeMax(args.length - start, 0),
        array = Array(length);while (++index < length) {
      array[index] = args[start + index];
    }index = -1;var otherArgs = Array(start + 1);while (++index < start) {
      otherArgs[index] = args[index];
    }otherArgs[start] = array;return apply(func, this, otherArgs);
  };
}function cloneBuffer(buffer, isDeep) {
  if (isDeep) {
    return buffer.slice();
  }var result = new buffer.constructor(buffer.length);buffer.copy(result);return result;
}function cloneArrayBuffer(arrayBuffer) {
  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);new Uint8Array(result).set(new Uint8Array(arrayBuffer));return result;
}function cloneDataView(dataView, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
}function cloneMap(map, isDeep, cloneFunc) {
  var array = isDeep ? cloneFunc(mapToArray(map), true) : mapToArray(map);return arrayReduce(array, addMapEntry, new map.constructor());
}function cloneRegExp(regexp) {
  var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));result.lastIndex = regexp.lastIndex;return result;
}function cloneSet(set, isDeep, cloneFunc) {
  var array = isDeep ? cloneFunc(setToArray(set), true) : setToArray(set);return arrayReduce(array, addSetEntry, new set.constructor());
}function cloneSymbol(symbol) {
  return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
}function cloneTypedArray(typedArray, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}function copyArray(source, array) {
  var index = -1,
      length = source.length;array || (array = Array(length));while (++index < length) {
    array[index] = source[index];
  }return array;
}function copyObject(source, props, object, customizer) {
  object || (object = {});var index = -1,
      length = props.length;while (++index < length) {
    var key = props[index];var newValue = customizer ? customizer(object[key], source[key], key, object, source) : undefined;assignValue(object, key, newValue === undefined ? source[key] : newValue);
  }return object;
}function copySymbols(source, object) {
  return copyObject(source, getSymbols(source), object);
}function createAssigner(assigner) {
  return baseRest(function (object, sources) {
    var index = -1,
        length = sources.length,
        customizer = length > 1 ? sources[length - 1] : undefined,
        guard = length > 2 ? sources[2] : undefined;customizer = assigner.length > 3 && typeof customizer == "function" ? (length--, customizer) : undefined;if (guard && isIterateeCall(sources[0], sources[1], guard)) {
      customizer = length < 3 ? undefined : customizer;length = 1;
    }object = Object(object);while (++index < length) {
      var source = sources[index];if (source) {
        assigner(object, source, index, customizer);
      }
    }return object;
  });
}function getAllKeys(object) {
  return baseGetAllKeys(object, keys$1, getSymbols);
}function getMapData(map, key) {
  var data = map.__data__;return isKeyable(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
}function getNative(object, key) {
  var value = getValue(object, key);return baseIsNative(value) ? value : undefined;
}var getSymbols = nativeGetSymbols ? overArg(nativeGetSymbols, Object) : stubArray;var getTag = baseGetTag;if (DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag || Map && getTag(new Map()) != mapTag || Promise$1 && getTag(Promise$1.resolve()) != promiseTag || Set$1 && getTag(new Set$1()) != setTag || WeakMap && getTag(new WeakMap()) != weakMapTag) {
  getTag = function getTag(value) {
    var result = objectToString.call(value),
        Ctor = result == objectTag ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : undefined;if (ctorString) {
      switch (ctorString) {case dataViewCtorString:
          return dataViewTag;case mapCtorString:
          return mapTag;case promiseCtorString:
          return promiseTag;case setCtorString:
          return setTag;case weakMapCtorString:
          return weakMapTag;}
    }return result;
  };
}function initCloneArray(array) {
  var length = array.length,
      result = array.constructor(length);if (length && typeof array[0] == "string" && hasOwnProperty.call(array, "index")) {
    result.index = array.index;result.input = array.input;
  }return result;
}function initCloneObject(object) {
  return typeof object.constructor == "function" && !isPrototype(object) ? baseCreate(getPrototype(object)) : {};
}function initCloneByTag(object, tag, cloneFunc, isDeep) {
  var Ctor = object.constructor;switch (tag) {case arrayBufferTag:
      return cloneArrayBuffer(object);case boolTag:case dateTag:
      return new Ctor(+object);case dataViewTag:
      return cloneDataView(object, isDeep);case float32Tag:case float64Tag:case int8Tag:case int16Tag:case int32Tag:case uint8Tag:case uint8ClampedTag:case uint16Tag:case uint32Tag:
      return cloneTypedArray(object, isDeep);case mapTag:
      return cloneMap(object, isDeep, cloneFunc);case numberTag:case stringTag:
      return new Ctor(object);case regexpTag:
      return cloneRegExp(object);case setTag:
      return cloneSet(object, isDeep, cloneFunc);case symbolTag:
      return cloneSymbol(object);}
}function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;return !!length && (typeof value == "number" || reIsUint.test(value)) && value > -1 && value % 1 == 0 && value < length;
}function isIterateeCall(value, index, object) {
  if (!isObject$1(object)) {
    return false;
  }var type = typeof index === "undefined" ? "undefined" : _typeof(index);if (type == "number" ? isArrayLike(object) && isIndex(index, object.length) : type == "string" && index in object) {
    return eq(object[index], value);
  }return false;
}function isKeyable(value) {
  var type = typeof value === "undefined" ? "undefined" : _typeof(value);return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
}function isMasked(func) {
  return !!maskSrcKey && maskSrcKey in func;
}function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = typeof Ctor == "function" && Ctor.prototype || objectProto;return value === proto;
}function nativeKeysIn(object) {
  var result = [];if (object != null) {
    for (var key in Object(object)) {
      result.push(key);
    }
  }return result;
}function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}try {
      return func + "";
    } catch (e) {}
  }return "";
}function eq(value, other) {
  return value === other || value !== value && other !== other;
}function isArguments(value) {
  return isArrayLikeObject(value) && hasOwnProperty.call(value, "callee") && (!propertyIsEnumerable.call(value, "callee") || objectToString.call(value) == argsTag);
}var isArray$1 = Array.isArray;function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction$1(value);
}function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value);
}var isBuffer = nativeIsBuffer || stubFalse;function isFunction$1(value) {
  var tag = isObject$1(value) ? objectToString.call(value) : "";return tag == funcTag || tag == genTag;
}function isLength(value) {
  return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}function isObject$1(value) {
  var type = typeof value === "undefined" ? "undefined" : _typeof(value);return !!value && (type == "object" || type == "function");
}function isObjectLike(value) {
  return !!value && (typeof value === "undefined" ? "undefined" : _typeof(value)) == "object";
}function isPlainObject(value) {
  if (!isObjectLike(value) || objectToString.call(value) != objectTag || isHostObject(value)) {
    return false;
  }var proto = getPrototype(value);if (proto === null) {
    return true;
  }var Ctor = hasOwnProperty.call(proto, "constructor") && proto.constructor;return typeof Ctor == "function" && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
}var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;function toPlainObject(value) {
  return copyObject(value, keysIn(value));
}function keys$1(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}function keysIn(object) {
  return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
}var merge = createAssigner(function (object, source, srcIndex) {
  baseMerge(object, source, srcIndex);
});function stubArray() {
  return [];
}function stubFalse() {
  return false;
}

/*
 * @name - graphql-obj2arg
 * @description - Convert JavaScript a object into a GraphQL argument string
 * @author - Branden Horiuchi <bhoriuchi@gmail.com>
 *
 */
var ARRAY = 'array';
var BOOLEAN = 'boolean';
var DATE = 'date';
var ENUM = 'enum';
var FLOAT = 'float';
var INT = 'int';
var NULL = 'null';
var NUMBER = 'number';
var OBJECT = 'object';
var STRING = 'string';
var UNDEFINED = 'undefined';
var RX_BOOLEAN = /^Boolean::/;
var RX_DATE = /^Date::/;
var RX_ENUM = /^Enum::/;
var RX_FLOAT = /^Float::/;
var RX_INT = /^Int::/;
var RX_OUTER_BRACES = /^{|^\[|\]$|}$/g;

function getType(obj) {
  if (obj === null) {
    return { obj: obj, type: NULL };
  } else if (obj === undefined) {
    return { obj: obj, type: UNDEFINED };
  } else if (obj instanceof Enum) {
    return { obj: obj.value, type: ENUM };
  } else if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === STRING) {
    if (obj.match(RX_BOOLEAN)) {
      return { obj: Boolean(obj.replace(RX_BOOLEAN, '')), type: BOOLEAN };
    } else if (obj.match(RX_DATE)) {
      return { obj: new Date(obj.replace(RX_DATE, '')), type: DATE };
    } else if (obj.match(RX_ENUM)) {
      return { obj: obj.replace(RX_ENUM, ''), type: ENUM };
    } else if (obj.match(RX_FLOAT)) {
      return { obj: obj.replace(RX_FLOAT, ''), type: FLOAT };
    } else if (obj.match(RX_INT)) {
      return { obj: obj.replace(RX_INT, ''), type: INT };
    }
    return { obj: obj, type: STRING };
  } else if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === BOOLEAN) {
    return { obj: obj, type: BOOLEAN };
  } else if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === NUMBER) {
    return obj % 1 === 0 ? { obj: obj, type: INT } : { obj: obj, type: FLOAT };
  } else if (Array.isArray(obj)) {
    return { obj: obj, type: ARRAY };
  } else if (obj instanceof Date) {
    return { obj: obj, type: DATE };
  } else if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === OBJECT) {
    return { obj: obj, type: OBJECT };
  }
  return { obj: obj, type: UNDEFINED };
}

var toArguments = function toArguments(object) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var keepNulls = options.keepNulls === true;
  var noOuterBraces = options.noOuterBraces === true;

  var toLiteral = function toLiteral(o) {
    var _getType = getType(o),
        obj = _getType.obj,
        type = _getType.type;

    switch (type) {
      case ARRAY:
        var arrList = [];
        forEach(obj, function (v) {
          var arrVal = toLiteral(v);
          if (arrVal === NULL && keepNulls || arrVal && arrVal !== NULL) {
            arrList.push(arrVal);
          }
        });
        return '[' + arrList.join(',') + ']';
      case OBJECT:
        var objList = [];
        forEach(obj, function (v, k) {
          var objVal = toLiteral(v);
          if (objVal === NULL && keepNulls || objVal && objVal !== NULL) {
            objList.push(k + ':' + objVal);
          }
        });
        return '{' + objList.join(',') + '}';
      case DATE:
        return '"' + obj.toISOString() + '"';
      case FLOAT:
        var s = String(obj);
        return s.indexOf('.') === -1 ? s + '.0' : s;
      case NULL:
        return NULL;
      case STRING:
        return '"' + escapeString(obj) + '"';
      case UNDEFINED:
        return undefined;
      default:
        return String(obj);
    }
  };

  var objStr = toLiteral(circular(object));
  return noOuterBraces ? objStr.replace(RX_OUTER_BRACES, '') : objStr;
};

toArguments.Enum = Enum;
toArguments.escapeString = escapeString;

/* lodash like functions to remove dependency on lodash accept lodash.merge */
function noop() {}

// enum type for use with toObjectString function
function Enum(value) {
  if (!(this instanceof Enum)) return new Enum(value);
  this.value = value;
}

function isBoolean(obj) {
  return obj === true || obj === false;
}

function isEnum(obj) {
  return obj instanceof Enum;
}

function isFunction(obj) {
  return typeof obj === 'function';
}

function isString(obj) {
  return typeof obj === 'string';
}

function isArray(obj) {
  return Array.isArray(obj);
}

function isDate(obj) {
  return obj instanceof Date;
}

function isObject(obj) {
  return (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && obj !== null;
}

function isNumber(obj) {
  return typeof obj === 'number';
}

function isHash(obj) {
  return isObject(obj) && !isArray(obj) && !isDate(obj) && obj !== null;
}

function range(start, end, step) {
  var _end = end;
  var _start = start;
  var _step = step;
  if (end === undefined && step === undefined) {
    _end = start;
    _start = 0;
    _step = 1;
  } else if (step === undefined) {
    _step = 1;
  }

  // non numbers return empty array
  if (!isNumber(_start) || !isNumber(_end) || !isNumber(_step) || !_step) return [];
  if (_start === _end) return [_start];

  var count = _start;
  var _range = [];

  if (_start < _end) {
    while (count < _end) {
      _range.push(count);
      count += Math.abs(_step);
    }
  } else {
    while (count > _end) {
      _range.push(count);
      count -= Math.abs(_step);
    }
  }

  return _range;
}

function includes(obj, key) {
  try {
    return isArray(obj) && obj.indexOf(key) !== -1;
  } catch (err) {
    return false;
  }
}

function toLower(str) {
  if (typeof str === 'string') return str.toLocaleLowerCase();
  return '';
}

function toUpper(str) {
  if (typeof str === 'string') return str.toUpperCase();
  return '';
}

function ensureArray() {
  var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

  return isArray(obj) ? obj : [obj];
}

function castArray(obj) {
  return ensureArray(obj);
}

function isEmpty(obj) {
  if (!obj) return true;else if (isArray(obj) && !obj.length) return true;else if (isHash(obj) && !keys(obj).length) return true;
  return false;
}

function keys(obj) {
  try {
    return isArray(obj) ? range(obj.length) : Object.keys(obj);
  } catch (err) {
    return [];
  }
}

function capitalize(str) {
  return isString(str) && str.length ? '' + str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : str;
}

function stringToPathArray(pathString) {
  // taken from lodash - https://github.com/lodash/lodash
  var pathRx = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(\.|\[\])(?:\4|$))/g;
  var pathArray = [];

  if (isString(pathString)) {
    pathString.replace(pathRx, function (match, number, quote, string) {
      var part = quote ? string : number !== undefined ? Number(number) : match;
      pathArray.push(part);
      return pathArray[pathArray.length - 1];
    });
  }
  return pathArray;
}

function toPath(pathString) {
  return stringToPathArray(pathString);
}

function has(obj, path) {
  var o = obj;
  var p = toPath(path);

  var index = -1;
  var length = p.length;

  var result = false;
  var key = void 0;

  while (++index < length) {
    key = p[index];
    if (!(result = o != null && Object.prototype.hasOwnProperty.call(o, key))) {
      break;
    }
    o = o[key];
  }

  return result;
}

function forEach(obj, fn) {
  try {
    if (Array.isArray(obj)) {
      var idx = 0;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = obj[Symbol.iterator](), _step2; !(_iteratorNormalCompletion = (_step2 = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var val = _step2.value;

          if (fn(val, idx) === false) break;
          idx++;
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    } else {
      for (var key in obj) {
        if (fn(obj[key], key) === false) break;
      }
    }
  } catch (err) {
    
  }
}

function without() {
  var output = [];
  var args = [].concat(Array.prototype.slice.call(arguments));
  if (args.length < 2) return args.length ? args[0] : [];
  var search = args.slice(1);

  forEach(args[0], function (val) {
    if (!includes(search, val)) output.push(val);
  });
  return output;
}

function map(obj, fn) {
  var output = [];
  forEach(obj, function (v, k) {
    return output.push(fn(v, k));
  });
  return output;
}

function mapValues(obj, fn) {
  var newObj = {};
  try {
    forEach(obj, function (v, k) {
      newObj[k] = fn(v, k);
    });
  } catch (err) {
    return obj;
  }
  return newObj;
}

function remap(obj, fn) {
  var newObj = {};
  forEach(obj, function (v, k) {
    var newMap = fn(v, k);
    if (has(newMap, 'key') && has(newMap, 'value')) {
      newObj[newMap.key] = newMap.value;
    } else {
      newMap[k] = v;
    }
  });
  return newObj;
}

function filter(obj, fn) {
  var newObj = [];
  if (!isArray(obj)) return newObj;
  forEach(obj, function (v, k) {
    if (fn(v, k)) newObj.push(v);
  });
  return newObj;
}

function omitBy(obj, fn) {
  var newObj = {};
  if (!isHash(obj)) return newObj;
  forEach(obj, function (v, k) {
    if (!fn(v, k)) newObj[k] = v;
  });
  return newObj;
}

function omit(obj) {
  var omits = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  var newObj = {};
  forEach(obj, function (v, k) {
    if (!includes(ensureArray(omits), k)) newObj[k] = v;
  });
  return newObj;
}

function pickBy(obj, fn) {
  var newObj = {};
  if (!isHash(obj)) return newObj;
  forEach(obj, function (v, k) {
    if (fn(v, k)) newObj[k] = v;
  });
  return newObj;
}

function pick(obj) {
  var picks = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  var newObj = {};
  forEach(obj, function (v, k) {
    if (includes(ensureArray(picks), k)) newObj[k] = v;
  });
  return newObj;
}

function get(obj, path, defaultValue) {
  var value = obj;
  var fields = isArray(path) ? path : toPath(path);
  if (fields.length === 0) return defaultValue;

  try {
    for (var f in fields) {
      if (value[fields[f]] === undefined) return defaultValue;
      value = value[fields[f]];
    }
  } catch (err) {
    return defaultValue;
  }
  return value;
}

function intersection() {
  var args = [].concat(Array.prototype.slice.call(arguments));
  if (!args.length) return [];

  return args.reduce(function (prev, cur) {
    if (!Array.isArray(prev) || !Array.isArray(cur)) return [];
    var left = new Set(prev);
    var right = new Set(cur);
    var i = [].concat(toConsumableArray(left)).filter(function (item) {
      return right.has(item);
    });
    return [].concat(toConsumableArray(i));
  }, args[0]);
}

function union() {
  var args = [].concat(Array.prototype.slice.call(arguments));
  if (!args.length) return [];

  try {
    var u = args.reduce(function (prev, cur) {
      if (!isArray(prev) || !isArray(cur)) return [];
      return prev.concat(cur);
    }, []);

    return [].concat(toConsumableArray(new Set(u)));
  } catch (err) {
    return [];
  }
}

function set(obj, path, val) {
  var value = obj;
  var fields = isArray(path) ? path : toPath(path);
  forEach(fields, function (p, idx) {
    if (idx === fields.length - 1) value[p] = val;else if (value[p] === undefined) value[p] = isNumber(p) ? [] : {};
    value = value[p];
  });
}

function clone(obj) {
  return merge({}, obj);
}

function typeOf(obj) {
  if (obj === undefined) return 'UNDEFINED';
  if (obj === null) return 'NULL';
  if (isBoolean(obj)) return 'BOOLEAN';
  if (isArray(obj)) return 'ARRAY';
  if (isString(obj)) return 'STRING';
  if (isNumber(obj)) return 'NUMBER';
  if (isDate(obj)) return 'DATE';
  if (isHash(obj)) return 'HASH';
  if (isObject(obj)) return 'OBJECT';
}

/*
 * Gets the path of a value by getting the location
 * of the field and traversing the selectionSet
 */
function getFieldPath(info) {
  var maxDepth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 50;

  var loc = get(info, 'fieldNodes[0].loc') || get(info, 'fieldASTs[0].loc');
  var stackCount = 0;

  var traverseFieldPath = function traverseFieldPath(selections, start, end, fieldPath) {
    var fPath = fieldPath || [];

    var sel = get(filter(selections, function (s) {
      return s.loc.start <= start && s.loc.end >= end;
    }), '[0]');

    if (sel) {
      var l = sel.name.loc;
      fPath.push(sel.name.value);
      if (l.start !== start && l.end !== end && stackCount < maxDepth) {
        stackCount++;
        traverseFieldPath(sel.selectionSet.selections, start, end, fPath);
      }
    }
    return fPath;
  };
  var selections = info.operation.selectionSet.selections;
  if (!selections || isNaN(loc.start) || isNaN(loc.end)) return;
  return traverseFieldPath(selections, loc.start, loc.end);
}

function getSchemaOperation(info) {
  var _type = ['_', get(info, 'operation.operation'), 'Type'].join('');
  return get(info, ['schema', _type].join('.'), {});
}

/*
 * Gets the return type name of a query
 * (returns shortened GraphQL primitive type names)
 */
function getReturnTypeName(info) {
  try {
    var p = '_fields["' + info.fieldName + '"].type';
    var typeObj = get(getSchemaOperation(info), p, {});

    while (!typeObj.name) {
      typeObj = typeObj.ofType;
      if (!typeObj) break;
    }
    return typeObj.name;
  } catch (err) {
    return null;
  }
}

/*
 * Gets the field definition
 */
function getRootFieldDef(info, path) {
  var fldPath = get(getFieldPath(info), '[0]');
  var queryType = info.operation.operation;
  var opDef = get(info, 'schema._factory.' + queryType, {});
  var fieldDef = get(opDef, 'fields["' + fldPath + '"]', undefined);

  //  if a field def cannot be found, try to find it in the extendFields
  if (!fieldDef && has(opDef, 'extendFields')) {
    forEach(opDef.extendFields, function (v) {
      if (has(v, fldPath)) fieldDef = get(v, '["' + fldPath + '"]', {});
    });
  }

  return path ? get(fieldDef, path, {}) : fieldDef;
}

/*
 * Returns the _typeConfig object of the schema operation (query/mutation)
 * Can be used to pass variables to resolve functions which use this function
 * to access those variables
 */
function getTypeConfig(info, path) {
  var p = path ? '_typeConfig.'.concat(path) : '_typeConfig';
  return get(getSchemaOperation(info), p, {});
}

// removes circular references
function circular(obj) {
  var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '[Circular]';

  var circularEx = function circularEx(_obj) {
    var key = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var seen = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

    seen.push(_obj);
    if (isObject(_obj)) {
      forEach(_obj, function (o, i) {
        if (includes(seen, o)) {
          _obj[i] = isFunction(value) ? value(_obj, key, seen.slice(0)) : value;
        } else {
          circularEx(o, i, seen.slice(0));
        }
      });
    }
    return _obj;
  };

  if (!obj) throw new Error('circular requires an object to examine');
  return circularEx(obj, value);
}

function stringify() {
  try {
    return JSON.stringify.apply(null, [].concat(Array.prototype.slice.call(arguments)));
  } catch (error) {
    return '';
  }
}

function escapeString(str) {
  if (!isString(str)) return '';
  return String(str).replace(/\\/gm, '\\\\').replace(/\//gm, '\\/').replace(/\b/gm, '').replace(/\f/gm, '\\f').replace(/\n/gm, '\\n').replace(/\r/gm, '\\r').replace(/\t/gm, '\\t').replace(/"/gm, '\\"');
}

var utils = {};



var _$1 = Object.freeze({
	toObjectString: toArguments,
	merge: merge,
	noop: noop,
	Enum: Enum,
	isBoolean: isBoolean,
	isEnum: isEnum,
	isFunction: isFunction,
	isString: isString,
	isArray: isArray,
	isDate: isDate,
	isObject: isObject,
	isNumber: isNumber,
	isHash: isHash,
	range: range,
	includes: includes,
	toLower: toLower,
	toUpper: toUpper,
	ensureArray: ensureArray,
	castArray: castArray,
	isEmpty: isEmpty,
	keys: keys,
	capitalize: capitalize,
	stringToPathArray: stringToPathArray,
	toPath: toPath,
	has: has,
	forEach: forEach,
	without: without,
	map: map,
	mapValues: mapValues,
	remap: remap,
	filter: filter,
	omitBy: omitBy,
	omit: omit,
	pickBy: pickBy,
	pick: pick,
	get: get,
	intersection: intersection,
	union: union,
	set: set,
	clone: clone,
	typeOf: typeOf,
	getFieldPath: getFieldPath,
	getSchemaOperation: getSchemaOperation,
	getReturnTypeName: getReturnTypeName,
	getRootFieldDef: getRootFieldDef,
	getTypeConfig: getTypeConfig,
	circular: circular,
	stringify: stringify,
	escapeString: escapeString,
	default: utils
});

// built in type name constants
var BOOLEAN$1 = 'Boolean';
var ENUM$1 = 'Enum';
var FLOAT$1 = 'Float';
var ID = 'ID';
var INPUT = 'Input';
var INT$1 = 'Int';
var INTERFACE = 'Interface';
var LIST = 'List';
var NONNULL = 'NonNull';
var OBJECT$1 = 'Object';
var SCALAR = 'Scalar';
var SCHEMA = 'Schema';
var STRING$1 = 'String';
var UNION = 'Union';

// build a type alias
var TYPE_ALIAS = {
  Enum: ENUM$1,
  Input: INPUT,
  Interface: INTERFACE,
  List: LIST,
  NonNull: NONNULL,
  Object: OBJECT$1,
  Scalar: SCALAR,
  Schema: SCHEMA,
  Union: UNION,
  GraphQLEnumType: ENUM$1,
  GraphQLInputObjectType: INPUT,
  GraphQLInterfaceType: INTERFACE,
  GraphQLList: LIST,
  GraphQLNonNull: NONNULL,
  GraphQLObjectType: OBJECT$1,
  GraphQLScalarType: SCALAR,
  GraphQLSchema: SCHEMA,
  GraphQLUnionType: UNION

  // types with fields
};var HAS_FIELDS = [OBJECT$1, INPUT, INTERFACE];

var constants = {
  BOOLEAN: BOOLEAN$1,
  ENUM: ENUM$1,
  FLOAT: FLOAT$1,
  ID: ID,
  INPUT: INPUT,
  INT: INT$1,
  INTERFACE: INTERFACE,
  LIST: LIST,
  NONNULL: NONNULL,
  OBJECT: OBJECT$1,
  SCALAR: SCALAR,
  SCHEMA: SCHEMA,
  STRING: STRING$1,
  UNION: UNION,
  TYPE_ALIAS: TYPE_ALIAS,
  HAS_FIELDS: HAS_FIELDS
};

function getShortType(type) {
  return _$1.get(TYPE_ALIAS, type, null);
}

function hasFields(type) {
  return _$1.includes(HAS_FIELDS, getShortType(type));
}

function toTypeDef(obj) {
  return _$1.isHash(obj) ? obj : { type: obj };
}

function normalizeArgs(field) {
  _$1.forEach(field.args, function (arg, argName) {
    field.args[argName] = toTypeDef(arg);
  });
  return field;
}

function normalizeType(type) {
  return normalizeArgs(toTypeDef(type));
}

var GraphQLFactoryCompiler = function () {
  function GraphQLFactoryCompiler(definition) {
    classCallCheck(this, GraphQLFactoryCompiler);

    this._definition = definition;
    this.definition = definition.clone();
    this.compiled = {
      fields: this.definition.fields || {},
      types: {},
      schemas: {}
    };
  }

  createClass(GraphQLFactoryCompiler, [{
    key: 'compile',
    value: function compile() {
      return this.moveSchema().normalizeTypes().mergeBase().extendTemplates().conditionalTypes().validate().value();
    }
  }, {
    key: 'validateTypeFields',
    value: function validateTypeFields(msg, typeDef, typeName) {
      var _this = this;

      var foundErrors = false;

      if (_$1.get(typeDef, 'type') !== 'Object') return false;

      if (!_$1.isHash(_$1.get(typeDef, 'fields'))) {
        foundErrors = true;
        var err = new Error('CompileError: ' + msg + ' type "' + typeName + '" has no definition');
        this._definition.log('error', 'compiler', err.message, err);
        return true;
      }

      _$1.forEach(typeDef.fields, function (fieldDef, fieldName) {
        if (!_$1.get(fieldDef, 'type')) {
          foundErrors = true;
          var _err = new Error('CompileError: ' + msg + '" type "' + typeName + '" field "' + fieldName + '" has no type');
          _this._definition.log('error', 'compiler', _err.message, _err);
          return true;
        } else if (_$1.get(fieldDef, 'args')) {
          // attempt to normalize the args first, this will be the only
          // mutation to the definition during validation
          normalizeArgs(fieldDef);
          _$1.forEach(fieldDef.args, function (argDef, argName) {

            if (!_$1.get(argDef, 'type')) {
              foundErrors = true;
              var _err2 = new Error('CompileError: ' + msg + '" type "' + typeName + '" field "' + fieldName + '" argument "' + argName + '" has no type');
              _this._definition.log('error', 'compiler', _err2.message, _err2);
              return true;
            }
          });
        }
      });

      return foundErrors;
    }

    /**
     * method to validate the definition
     */

  }, {
    key: 'validate',
    value: function validate() {
      var _this2 = this;

      var foundErrors = false;

      // first evaluate types
      _$1.forEach(this.compiled.types, function (typeDef, typeName) {
        if (_this2.validateTypeFields('', typeDef, typeName)) foundErrors = true;
      });

      // if no type errors evaluate the schema
      if (!foundErrors) {
        _$1.forEach(this.compiled.schemas, function (schemaDef, schemaName) {
          _$1.forEach(schemaDef, function (opDef, opName) {
            var typeName = typeof opDef === 'string' ? opDef : opDef.name;

            // only validate operation fields
            if (['query', 'mutation', 'subscription'].indexOf(opName) === -1) return true;

            // check for type name
            if (!typeName) {
              var err = new Error('CompileError: schema "' + schemaName + '" ' + opName + ' has no definition');
              _this2._definition.log('error', 'compiler', err.message, err);
            } else {
              var typeDef = _$1.get(_this2.compiled, 'types["' + typeName + '"]');
              _this2.validateTypeFields('schema "' + schemaName + '"', typeDef, typeName);
            }
          });
        });
      }
      return this;
    }
  }, {
    key: 'value',
    value: function value() {
      return this.compiled;
    }
  }, {
    key: 'moveSchema',
    value: function moveSchema() {
      var _this3 = this;

      _$1.forEach(this.definition.schemas, function (schema, schemaName) {
        _this3.compiled.schemas[schemaName] = _$1.mapValues(schema, function (definition, operation) {
          if (_$1.isString(definition)) return definition;
          var opName = definition.name || '' + schemaName + _$1.capitalize(operation);
          _$1.set(_this3.definition, 'types["' + opName + '"]', definition);
          return opName;
        });
      });
      return this;
    }
  }, {
    key: 'normalizeTypes',
    value: function normalizeTypes() {
      var _this4 = this;

      var types = this.compiled.types;

      _$1.forEach(this.definition.types, function (_typeDef, name) {
        if (!_$1.isHash(_typeDef)) {
          var err = new Error('CompileError: ' + name + ' type definition is not an object');
          _this4._definition.log('error', 'compiler', err.message, err);
        }
        var type = _typeDef.type;


        switch (_$1.typeOf(type)) {
          case 'UNDEFINED':
            types[name] = { type: OBJECT$1, _typeDef: _typeDef };
            break;

          case 'STRING':
            types[name] = { type: type, _typeDef: _typeDef };
            break;

          case 'ARRAY':
            _$1.forEach(type, function (multi) {
              if (_$1.isString(multi)) {
                types[multi === OBJECT$1 ? name : '' + name + multi] = { type: multi, _typeDef: _typeDef };
              } else {
                _$1.forEach(multi, function (v, k) {
                  if (k === OBJECT$1 && !v) types[name] = { type: OBJECT$1, _typeDef: _typeDef };else if (k !== OBJECT$1 && !v) types[name] = { type: k, _typeDef: _typeDef };else types[v] = { type: k, _typeDef: _typeDef };
                });
              }
            });
            break;

          default:
            _$1.forEach(type, function (multi, mName) {
              if (mName === OBJECT$1 && !multi) {
                types[name] = { type: mName, _typeDef: _typeDef };
              } else if (mName !== OBJECT$1 && !multi) {
                types['' + name + mName] = { type: mName, _typeDef: _typeDef };
              } else {
                types[multi] = { type: mName, _typeDef: _typeDef };
              }
            });
            break;
        }
      });

      return this;
    }
  }, {
    key: 'mergeBase',
    value: function mergeBase() {
      var fields = this.compiled.fields;
      _$1.forEach(this.compiled.types, function (definition) {
        var type = definition.type,
            _typeDef = definition._typeDef;
        var extendFields = _typeDef.extendFields;


        _$1.merge(definition, _$1.omit(_typeDef, ['type', 'extendFields']));
        delete definition._typeDef;

        // no type fields
        if (!hasFields(type)) {
          if (getShortType(type) === ENUM$1) {
            var values = definition.values;

            _$1.forEach(values, function (v, k) {
              if (!_$1.isHash(v)) values[k] = { value: v };
            });
          }
          return true;
        }

        // ensure there is a fields hash
        definition.fields = _$1.isHash(definition.fields) ? definition.fields : {};

        // type fields
        switch (_$1.typeOf(extendFields)) {
          case 'STRING':
            _$1.merge(definition.fields, _$1.get(fields, '["' + extendFields + '"]', {}));
            break;

          case 'ARRAY':
            _$1.forEach(extendFields, function (typeName) {
              _$1.merge(definition.fields, _$1.get(fields, '["' + typeName + '"]', {}));
            });
            break;

          case 'HASH':
            _$1.forEach(extendFields, function (extendDef, name) {
              var ext = _$1.get(fields, '["' + name + '"]', {});
              _$1.forEach(extendDef, function (field, fieldName) {
                var config = _$1.get(ext, fieldName);
                if (!config) return true;
                config = normalizeType(config);
                if (_$1.isArray(field) && field.length > 1) {
                  _$1.forEach(field, function (v, i) {
                    field[i] = _$1.merge({}, config, normalizeType(v));
                  });
                  return true;
                }
                extendDef[fieldName] = _$1.merge({}, config, normalizeType(field));
              });
              _$1.merge(definition.fields, ext, extendDef);
            });
            break;

          default:
            break;
        }
      });
      return this;
    }
  }, {
    key: 'extendTemplates',
    value: function extendTemplates() {
      _$1.forEach(this.compiled.types, function (definition) {
        var fieldBase = null;
        var omits = [];
        var fields = definition.fields;

        if (!fields) return true;
        _$1.forEach(fields, function (field, name) {
          if (_$1.isArray(field) && field.length > 1) {
            omits.push(name);
            _$1.forEach(field, function (type, idx) {
              normalizeArgs(type);

              if (type.name) {
                fieldBase = _$1.get(definition, 'fields["' + type.name + '"]', {});
                normalizeArgs(fieldBase);
                definition.fields[type.name] = _$1.merge({}, fieldBase, _$1.omit(type, 'name'));
                return true;
              }

              fieldBase = _$1.get(definition, 'fields["' + idx + '"]', {});
              normalizeArgs(fieldBase);
              definition.fields['' + name + idx] = _$1.merge({}, fieldBase, type);
            });
          }
        });
        definition.fields = _$1.omit(definition.fields, omits);
      });
      return this;
    }
  }, {
    key: 'conditionalTypes',
    value: function conditionalTypes() {
      var _this5 = this;

      _$1.forEach(this.compiled.types, function (definition, typeName) {
        var omits = [];
        var fields = definition.fields;

        if (!fields) return true;

        _$1.forEach(fields, function (field, name) {
          switch (_$1.typeOf(field)) {
            case 'HASH':
              var type = field.type,
                  omitFrom = field.omitFrom;

              if (!type) {
                if (field[definition.type]) {
                  definition.fields[name] = normalizeType(field[definition.type]);
                } else if (!_$1.intersection(_$1.keys(field), ['Object', 'Input']).length) {
                  var err = new Error('CompileError: Definition of type "' + typeName + '" field "' + name + '" has no type defined');
                  _this5._definition.log('error', 'compiler', err.message, err);
                  omits.push(name);
                } else {
                  omits.push(name);
                }
              } else if (omitFrom) {
                var omit = _$1.isArray(omitFrom) ? omitFrom : [omitFrom];
                if (_$1.includes(omit, definition.type)) {
                  omits.push(name);
                } else {
                  fields[name] = normalizeArgs(_$1.omit(fields[name], 'omitFrom'));
                }
              }
              break;

            default:
              definition.fields[name] = { type: field };
              break;
          }
        });
        definition.fields = _$1.omit(definition.fields, omits);
      });

      return this;
    }
  }]);
  return GraphQLFactoryCompiler;
}();

var FactoryBase64 = {
  type: 'Scalar',
  name: 'Base64',
  description: 'Converts value to and from base64',
  serialize: function serialize(value) {
    return new Buffer(value, 'base64').toString();
  },
  parseValue: function parseValue(value) {
    return new Buffer(value).toString('base64');
  },
  parseLiteral: function parseLiteral(ast) {
    var _graphql = this.graphql,
        GraphQLError = _graphql.GraphQLError,
        Kind = _graphql.Kind;


    if (ast.kind !== Kind.STRING) {
      throw new GraphQLError('Query error: expected Base64 ' + 'to be a string but got a: ' + ast.kind, [ast]);
    }

    return new Buffer(ast.value).toString('base64');
  }
};

/*
 * Ported type from https://github.com/soundtrackyourbrand/graphql-custom-datetype
 */

function coerceDate(value) {
  if (!(value instanceof Date)) {
    // Is this how you raise a 'field error'?
    throw new Error('Field error: value is not an instance of Date');
  }
  if (isNaN(value.getTime())) {
    throw new Error('Field error: value is an invalid Date');
  }
  return value.toJSON();
}

var FactoryDateTime = {
  type: 'Scalar',
  name: 'DateTime',
  description: 'Represents a Date object',
  serialize: coerceDate,
  parseValue: coerceDate,
  parseLiteral: function parseLiteral(ast) {
    var _graphql = this.graphql,
        GraphQLError = _graphql.GraphQLError,
        Kind = _graphql.Kind;


    if (ast.kind !== Kind.STRING) {
      throw new GraphQLError('Query error: Can only parse strings ' + 'to dates but got a: ' + ast.kind, [ast]);
    }
    var result = new Date(ast.value);
    if (isNaN(result.getTime())) {
      throw new GraphQLError('Query error: Invalid date', [ast]);
    }
    if (ast.value !== result.toJSON()) {
      throw new GraphQLError('Query error: Invalid date format, only ' + 'accepts: YYYY-MM-DDTHH:MM:SS.SSSZ', [ast]);
    }
    return result;
  }
};

var FactoryEmail = {
  type: 'Scalar',
  name: 'Email',
  description: 'The Email scalar type represents E-Mail addresses compliant to RFC 822.',
  serialize: function serialize(value) {
    return value;
  },
  parseValue: function parseValue(value) {
    return value;
  },
  parseLiteral: function parseLiteral(ast) {
    var _graphql = this.graphql,
        GraphQLError = _graphql.GraphQLError,
        Kind = _graphql.Kind;

    // regex taken from https://github.com/stylesuxx/graphql-custom-types

    var rx = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;

    if (ast.kind !== Kind.STRING) {
      throw new GraphQLError('Query error: expected Email to be a ' + 'string but got a: ' + ast.kind, [ast]);
    }

    if (!ast.value.match(rx)) {
      throw new GraphQLError('Query error: invalid Email', [ast]);
    }

    return ast.value;
  }
};

/*
 * Ported type from https://github.com/taion/graphql-type-json
 */

function identity(value) {
  return value;
}

function parseLiteral(ast) {
  var boundParseLiteral = parseLiteral.bind(this);
  var Kind = this.graphql.Kind;

  switch (ast.kind) {
    case Kind.STRING:
    case Kind.BOOLEAN:
      return ast.value;
    case Kind.INT:
    case Kind.FLOAT:
      return parseFloat(ast.value);
    case Kind.OBJECT:
      {
        var value = Object.create(null);
        ast.fields.forEach(function (field) {
          value[field.name.value] = boundParseLiteral(field.value);
        });
        return value;
      }
    case Kind.LIST:
      return ast.values.map(boundParseLiteral);
    default:
      return null;
  }
}

var FactoryJSON = {
  type: 'Scalar',
  name: 'JSON',
  description: 'The `JSON` scalar type represents JSON values as specified by ' + '[ECMA-404](http://www.ecma-international.org/ publications/files/ECMA-ST/ECMA-404.pdf).',
  serialize: identity,
  parseValue: identity,
  parseLiteral: parseLiteral
};

var FactoryURL = {
  type: 'Scalar',
  name: 'URL',
  description: 'The URL scalar type represents URL addresses.',
  serialize: function serialize(value) {
    return value;
  },
  parseValue: function parseValue(value) {
    return value;
  },
  parseLiteral: function parseLiteral(ast) {
    var _graphql = this.graphql,
        GraphQLError = _graphql.GraphQLError,
        Kind = _graphql.Kind;

    // regex taken from https://github.com/stylesuxx/graphql-custom-types

    var rx = new RegExp('^(?:(?:https?|ftp)://)(?:\\S+(?::\\S*)?@)?' + '(?:(?!(?:10|127)(?:\\.\\d{1,3}){3})(?!(?:169\\.254|192\\.168)' + '(?:\\.\\d{1,3}){2})(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3})' + '{2})(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|' + '2[0-4]\\d|25[0-5])){2}(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25' + '[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)' + '(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*' + '(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))\\.?)(?::\\d{2,5})?(?:[/?#]\\S*)' + '?$', 'i');

    if (ast.kind !== Kind.STRING) {
      throw new GraphQLError('Query error: expected URL to be a ' + 'string but got a: ' + ast.kind, [ast]);
    }

    if (!ast.value.match(rx)) {
      throw new GraphQLError('Query error: invalid URL', [ast]);
    }

    return ast.value;
  }
};

var types = {
  name: 'FactoryTypes',
  types: {
    Base64: FactoryBase64,
    DateTime: FactoryDateTime,
    Email: FactoryEmail,
    JSON: FactoryJSON,
    URL: FactoryURL
  }
};

var factoryPlugins = {
  types: types
};

var DEFAULT_MIDDLEWARE_TIMEOUT = 5000;

var GraphQLFactoryDefinition = function (_EventEmitter) {
  inherits(GraphQLFactoryDefinition, _EventEmitter);

  function GraphQLFactoryDefinition() {
    var definition = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    classCallCheck(this, GraphQLFactoryDefinition);

    var _this = possibleConstructorReturn(this, (GraphQLFactoryDefinition.__proto__ || Object.getPrototypeOf(GraphQLFactoryDefinition)).call(this));

    var plugin = options.plugin;
    var globals = definition.globals,
        fields = definition.fields,
        functions = definition.functions,
        types = definition.types,
        schemas = definition.schemas,
        externalTypes = definition.externalTypes;

    _this.globals = globals || {};
    _this.fields = fields || {};
    _this.functions = functions || {};
    _this.types = types || {};
    _this.schemas = schemas || {};
    _this.externalTypes = externalTypes || {};
    _this.pluginRegistry = {};
    _this._middleware = {
      before: [],
      after: [],
      beforeTimeout: DEFAULT_MIDDLEWARE_TIMEOUT,
      afterTimeout: DEFAULT_MIDDLEWARE_TIMEOUT
    };
    _this.registerPlugin(plugin);
    return _this;
  }

  createClass(GraphQLFactoryDefinition, [{
    key: 'merge',
    value: function merge() {
      var definition = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var globals = definition.globals,
          fields = definition.fields,
          functions = definition.functions,
          types = definition.types,
          schemas = definition.schemas,
          externalTypes = definition.externalTypes;

      // assign is used to prevent overwriting instantiated classes

      Object.assign(this.globals, globals || {});
      _$1.merge(this.fields, fields || {});
      _$1.merge(this.functions, functions || {});
      _$1.merge(this.types, types || {});
      _$1.merge(this.schemas, schemas || {});
      _$1.merge(this.externalTypes, externalTypes || {});
      return this;
    }
  }, {
    key: 'registerPlugin',
    value: function registerPlugin() {
      var _this2 = this;

      var plugins = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      _$1.forEach(_$1.ensureArray(plugins), function (plugin) {
        var p = plugin;
        // first check for included plugins that can be specified by their string name
        if (_$1.isString(plugin) && plugin) {
          if (factoryPlugins[plugin]) {
            p = factoryPlugins[plugin];
          } else {
            var err = new Error('DefinitionError: Plugin "' + p + '" not found');
            _this2.log('error', 'types', err.message, err);
            return true;
          }
        }

        var name = _$1.get(p, 'name', 'unnamedPlugin' + _$1.keys(_this2.pluginRegistry).length);
        _this2.pluginRegistry[name] = p;
        _this2.merge(p);
        if (_$1.isFunction(p.install)) p.install(_this2);
      });
      return this;
    }
  }, {
    key: 'log',
    value: function log(level, source, message, error) {
      var payload = { level: level, source: source, message: message };

      if (error instanceof Error) {
        payload.error = error;
        payload.stack = error.stack;
      }
      this.emit('log', payload);
    }
  }, {
    key: 'beforeResolve',
    value: function beforeResolve(middleware) {
      var _this3 = this;

      _$1.forEach(_$1.ensureArray(middleware), function (mw) {
        if (_$1.isFunction(mw)) {
          _this3._middleware.before = _$1.union(_this3._middleware.before, [mw]);
        }
      });
      return this;
    }
  }, {
    key: 'afterResolve',
    value: function afterResolve(middleware) {
      var _this4 = this;

      _$1.forEach(_$1.ensureArray(middleware), function (mw) {
        if (_$1.isFunction(mw)) {
          _this4._middleware.after = _$1.union(_this4._middleware.after, [mw]);
        }
      });
      return this;
    }
  }, {
    key: 'beforeTimeout',
    value: function beforeTimeout(timeout) {
      if (_$1.isNumber(timeout)) {
        this._middleware.beforeTimeout = Math.ceil(timeout);
      }
      return this;
    }
  }, {
    key: 'afterTimeout',
    value: function afterTimeout(timeout) {
      if (_$1.isNumber(timeout)) {
        this._middleware.afterTimeout = Math.ceil(timeout);
      }
      return this;
    }
  }, {
    key: 'processDefinitionHooks',
    value: function processDefinitionHooks() {
      var _this5 = this;

      _$1.forEach(this.pluginRegistry, function (plugin) {
        var hook = _$1.get(plugin, 'hooks.definition');
        if (_$1.isFunction(hook)) hook(_this5);
      });
      return this;
    }
  }, {
    key: 'compile',
    value: function compile() {
      this.processDefinitionHooks();
      var compiler = new GraphQLFactoryCompiler(this);
      var compiled = compiler.compile();
      var fields = compiled.fields,
          types = compiled.types,
          schemas = compiled.schemas;

      this.fields = fields || {};
      this.types = types || {};
      this.schemas = schemas || {};
      return compiled;
    }
  }, {
    key: 'clone',
    value: function clone() {
      return _$1.merge({}, this.plugin);
    }
  }, {
    key: 'has',
    value: function has(keyPath) {
      return _$1.has(this, keyPath);
    }
  }, {
    key: 'get',
    value: function get(keyPath) {
      return _$1.get(this, keyPath);
    }
  }, {
    key: 'set',
    value: function set(keyPath, value) {
      _$1.set(this, keyPath, value);
    }
  }, {
    key: 'hasPlugin',
    value: function hasPlugin(name) {
      return this.has('pluginRegistry["' + name + '"]');
    }
  }, {
    key: 'hasType',
    value: function hasType(typeName) {
      return this.has('types["' + typeName + '"]');
    }
  }, {
    key: 'getType',
    value: function getType(typeName) {
      return this.get('types["' + typeName + '"]');
    }
  }, {
    key: 'hasExtType',
    value: function hasExtType(typeName) {
      return this.has('externalTypes["' + typeName + '"]');
    }
  }, {
    key: 'getExtType',
    value: function getExtType(typeName) {
      return this.get('externalTypes["' + typeName + '"]');
    }
  }, {
    key: 'definition',
    get: function get() {
      return {
        fields: this.fields,
        functions: this.functions,
        types: this.types,
        schemas: this.schemas,
        externalType: this.externalTypes
      };
    }
  }, {
    key: 'plugin',
    get: function get() {
      return {
        globals: this.globals,
        fields: this.fields,
        functions: this.functions,
        types: this.types,
        schemas: this.schemas,
        externalType: this.externalTypes
      };
    }
  }]);
  return GraphQLFactoryDefinition;
}(EventEmitter);

function FactoryEnumValueConfig(_this, val) {
  try {
    var _ref = _$1.isObject(val) ? val : { value: val },
        value = _ref.value,
        deprecationReason = _ref.deprecationReason,
        description = _ref.description;

    return {
      value: value,
      deprecationReason: deprecationReason,
      description: description
    };
  } catch (err) {
    _this.factory.emit('log', {
      source: 'types',
      level: 'error',
      error: new Error('FactoryEnumValueConfig: ' + err.message),
      stack: err.stack
    });
  }
}

function FactoryEnumValueConfigMap(_this, values) {
  try {
    return _$1.mapValues(values, function (value) {
      return FactoryEnumValueConfig(_this, value);
    });
  } catch (err) {
    _this.factory.emit('log', {
      source: 'types',
      level: 'error',
      error: new Error('FactoryEnumValueConfigMap: ' + err.message),
      stack: err.stack
    });
  }
}

function FactoryGQLEnumType(_this, definition, nameDefault) {
  try {
    var name = definition.name,
        values = definition.values,
        description = definition.description;


    return new _this.graphql.GraphQLEnumType({
      name: name || nameDefault,
      values: FactoryEnumValueConfigMap(_this, values),
      description: description
    });
  } catch (err) {
    _this.factory.emit('log', {
      source: 'types',
      level: 'error',
      error: new Error('FactoryGQLEnumType: ' + err.message),
      stack: err.stack
    });
  }
}

function FactoryInputObjectFieldConfig(_this, field, rootType) {
  try {
    var defaultValue = field.defaultValue,
        description = field.description;

    var type = _this.resolveType(field, rootType);

    return {
      type: type,
      defaultValue: defaultValue,
      description: description
    };
  } catch (err) {
    _this.factory.emit('log', {
      source: 'types',
      level: 'error',
      error: new Error('FactoryInputObjectFieldConfig: ' + err.message),
      stack: err.stack
    });
  }
}

function FactoryInputObjectFieldConfigMapThunk(_this, fields, rootType) {
  try {
    var f = _$1.omitBy(fields, function (field) {
      var omitFrom = field.omitFrom;

      return omitFrom && (_$1.includes(omitFrom, rootType) || omitFrom === rootType);
    });

    if (!_$1.keys(f).length) return;

    return function () {
      return _$1.mapValues(f, function (field) {
        return FactoryInputObjectFieldConfig(_this, field, rootType);
      });
    };
  } catch (err) {
    _this.factory.emit('log', {
      source: 'types',
      level: 'error',
      error: new Error('FactoryInputObjectFieldConfigMapThunk: ' + err.message),
      stack: err.stack
    });
  }
}

function FactoryGQLInputObjectType(_this, definition, nameDefault) {
  try {
    var name = definition.name,
        fields = definition.fields,
        description = definition.description;


    return new _this.graphql.GraphQLInputObjectType({
      name: name || nameDefault,
      fields: FactoryInputObjectFieldConfigMapThunk(_this, fields, 'Input'),
      description: description
    });
  } catch (err) {
    _this.factory.emit('log', {
      source: 'types',
      level: 'error',
      error: new Error('FactoryGQLInputObjectType: ' + err.message),
      stack: err.stack
    });
  }
}

function FactoryArgumentConfig(_this) {
  var arg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var rootType = arguments[2];

  try {
    var a = _$1.isString(arg) || _$1.isArray(arg) ? { type: arg } : arg;
    var defaultValue = a.defaultValue,
        description = a.description;

    var type = _this.resolveType(a, rootType);

    return {
      type: type,
      defaultValue: defaultValue,
      description: description
    };
  } catch (err) {
    _this.factory.emit('log', {
      source: 'types',
      level: 'error',
      error: new Error('FactoryArgumentConfig: ' + err.message),
      stack: err.stack
    });
  }
}

function FactoryFieldConfigMapThunk(_this, fields, rootType) {
  try {
    var flds = _$1.omitBy(fields, function (field) {
      var omitFrom = field.omitFrom;

      return omitFrom && (_$1.includes(omitFrom, rootType) || omitFrom === rootType);
    });

    if (!_$1.keys(flds).length) return;

    return function () {
      return _$1.mapValues(flds, function (field) {
        var f = !_$1.has(field, 'type') && _$1.has(field, rootType) ? field[rootType] : field;
        var args = field.args,
            resolve = field.resolve,
            deprecationReason = field.deprecationReason,
            description = field.description;


        return {
          type: _this.resolveType(f, rootType),
          args: _$1.mapValues(args, function (arg) {
            return FactoryArgumentConfig(_this, arg, rootType);
          }),
          resolve: _this.bindFunction(resolve, f, false),
          deprecationReason: deprecationReason,
          description: description
        };
      });
    };
  } catch (err) {
    _this.factory.emit('log', {
      source: 'types',
      level: 'error',
      error: new Error('FactoryFieldConfigMapThunk: ' + err.message),
      stack: err.stack
    });
  }
}

function FactoryGQLInterfaceType(_this, definition, nameDefault) {
  try {
    var name = definition.name,
        fields = definition.fields,
        resolveType = definition.resolveType,
        description = definition.description;


    return new _this.graphql.GraphQLInterfaceType({
      name: name || nameDefault,
      fields: FactoryFieldConfigMapThunk(_this, fields, 'Interface'),
      resolveType: _this.bindFunction(resolveType, definition, true),
      description: description
    });
  } catch (err) {
    _this.factory.emit('log', {
      source: 'types',
      level: 'error',
      error: new Error('FactoryGQLInterfaceType: ' + err.message),
      stack: err.stack
    });
  }
}

function FactoryInterfacesThunk(_this) {
  var interfaces = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  try {
    if (!_$1.isArray(interfaces) || !interfaces.length) return;

    var thunk = _$1.without(_$1.map(interfaces, function (type) {
      var iface = _this.resolveType(type);
      if (iface instanceof _this.graphql.GraphQLInterfaceType) return iface;
      return null;
    }), null);

    return thunk.length > 0 ? function () {
      return thunk;
    } : undefined;
  } catch (err) {
    _this.factory.emit('log', {
      source: 'types',
      level: 'error',
      error: new Error('FactoryInterfacesThunk: ' + err.message),
      stack: err.stack
    });
  }
}

function FactoryGQLObjectType(_this, definition, nameDefault) {
  try {
    var name = definition.name,
        interfaces = definition.interfaces,
        fields = definition.fields,
        isTypeOf = definition.isTypeOf,
        description = definition.description;


    return new _this.graphql.GraphQLObjectType(_$1.merge({}, definition, {
      name: name || nameDefault,
      interfaces: FactoryInterfacesThunk(_this, interfaces),
      fields: FactoryFieldConfigMapThunk(_this, fields, 'Object'),
      isTypeOf: _this.bindFunction(isTypeOf, definition, true),
      description: description
    }));
  } catch (err) {
    _this.factory.emit('log', {
      source: 'types',
      level: 'error',
      error: new Error('FactoryGQLObjectType: ' + err.message),
      stack: err.stack
    });
  }
}

function FactoryGQLScalarType(_this, definition, nameDefault) {
  try {
    var name = definition.name,
        description = definition.description,
        serialize = definition.serialize,
        parseValue = definition.parseValue,
        parseLiteral = definition.parseLiteral;


    return new _this.graphql.GraphQLScalarType({
      name: name || nameDefault,
      description: description,
      serialize: _this.bindFunction(serialize, definition, true),
      parseValue: _this.bindFunction(parseValue, definition, true),
      parseLiteral: _this.bindFunction(parseLiteral, definition, true)
    });
  } catch (err) {
    _this.factory.emit('log', {
      source: 'types',
      level: 'error',
      error: new Error('FactoryGQLScalarType: ' + err.message),
      stack: err.stack
    });
  }
}

function FactoryGQLSchema(_this, definition, nameDefault) {
  try {
    var name = definition.name,
        query = definition.query,
        mutation = definition.mutation,
        subscription = definition.subscription;


    if (!_this.types || !_this.types[query]) {
      throw new Error('Type "' + query + '" not found');
    }

    var schema = new _this.graphql.GraphQLSchema({
      name: name || nameDefault,
      query: _this.types[query],
      mutation: _this.types[mutation],
      subscription: _this.types[subscription]
    });

    schema._factory = {
      name: name || nameDefault,
      key: nameDefault,
      query: _this.definition.getType(query),
      mutation: _this.definition.getType(mutation),
      subscription: _this.definition.getType(subscription)
    };

    return schema;
  } catch (err) {
    _this.factory.emit('log', {
      source: 'types',
      level: 'error',
      error: new Error('FactoryGQLSchema: ' + err.message),
      stack: err.stack
    });
  }
}

function FactoryGQLUnionType(_this, definition, nameDefault) {
  try {
    var name = definition.name,
        types = definition.types,
        resolveType = definition.resolveType,
        description = definition.description;


    return new _this.graphql.GraphQLUnionType({
      name: name || nameDefault,
      types: _$1.map(types, function (type) {
        return _this.resolveType(type);
      }),
      resolveType: _this.bindFunction(resolveType, definition, true),
      description: description
    });
  } catch (err) {
    _this.factory.emit('log', {
      source: 'types',
      level: 'error',
      error: new Error('FactoryGQLUnionType: ' + err.message),
      stack: err.stack
    });
  }
}

/*
 * Type generator class
 * NOTES:
 *   - Adding to base resolver context done in this.fnContext
 *   - Adding to individual field resolver context done in processMiddleware ctx variable
 */

var GraphQLFactoryTypeGenerator = function () {
  function GraphQLFactoryTypeGenerator(graphql, definition, lib, factory) {
    var _typeMap,
        _this = this;

    classCallCheck(this, GraphQLFactoryTypeGenerator);

    this._generated = false;
    this.graphql = graphql;
    this.definition = definition;
    this.factory = factory;
    this._types = {};
    this._schemas = {};
    this.typeMap = (_typeMap = {}, defineProperty(_typeMap, BOOLEAN$1, graphql.GraphQLBoolean), defineProperty(_typeMap, FLOAT$1, graphql.GraphQLFloat), defineProperty(_typeMap, ID, graphql.GraphQLID), defineProperty(_typeMap, INT$1, graphql.GraphQLInt), defineProperty(_typeMap, STRING$1, graphql.GraphQLString), _typeMap);

    // create a new function context
    this.fnContext = {
      lib: lib,
      definition: definition.definition,
      globals: definition.plugin.globals,
      graphql: graphql,
      utils: _$1,
      types: this._types,
      schemas: this._schemas
    };

    _$1.forEach(definition.pluginRegistry, function (plugin) {
      if (plugin.context) _this.fnContext = Object.assign(_this.fnContext, plugin.context);
    });
  }

  /**
   * Processes middleware
   * @param resolver
   * @param args
   * @param fieldDef
   * @returns {Promise}
   */


  createClass(GraphQLFactoryTypeGenerator, [{
    key: 'processMiddleware',
    value: function processMiddleware(resolver, args, fieldDef) {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        var status = {
          resolved: false,
          rejected: false,
          isFulfilled: false

          // create a new resolver context by merging the
          // type context with a new object and the fieldDef
        };var ctx = Object.assign({}, _this2.fnContext, { fieldDef: fieldDef });

        // create a reject handler so that reject is only called once
        var doReject = function doReject(error) {
          if (status.isFulfilled) return;
          status.isFulfilled = true;
          status.rejected = true;
          reject(error);
        };

        // create a resolve handler so that resolve is only called once
        var doResolve = function doResolve(result) {
          if (status.isFulfilled) return;
          status.isFulfilled = true;
          status.resolved = true;
          resolve(result);
        };

        // if there is no middleware proceed to the resolver
        if (!_this2.definition._middleware.before.length) {
          return _this2.processResolver(resolver, args, ctx, doResolve, doReject);
        }

        // add a timeout to the middleware
        var timeout = setTimeout(function () {
          _this2.processResolver(resolver, args, ctx, doResolve, doReject);
        }, _this2.definition._middleware.beforeTimeout);

        var hooks = _this2.definition._middleware.before.slice();
        var next = function next(error) {
          hooks = hooks.splice(1);
          if (error) {
            clearTimeout(timeout);
            return reject(error);
          } else if (!hooks.length) {
            clearTimeout(timeout);
            return _this2.processResolver(resolver, args, ctx, doResolve, doReject);
          }
          return hooks[0].apply(ctx, [args, next]);
        };
        return hooks[0].apply(ctx, [args, next]);
      });
    }
  }, {
    key: 'processResolver',
    value: function processResolver(resolver, args, ctx, resolve, reject) {
      var _this3 = this;

      return Promise.resolve(resolver.apply(ctx, _$1.map(args, function (arg) {
        return arg;
      }))).then(function (result) {
        return _this3.afterMiddleware(result, args, ctx, resolve, reject);
      }, reject);
    }
  }, {
    key: 'afterMiddleware',
    value: function afterMiddleware(result, args, ctx, resolve, reject) {
      // if there is no middleware resolve the result
      if (!this.definition._middleware.after.length) return resolve(result);

      // add a timeout to the middleware
      var timeout = setTimeout(function () {
        resolve(result);
      }, this.definition._middleware.afterTimeout);

      var hooks = this.definition._middleware.after.slice();
      var next = function next(error, res) {
        var nextResult = res === undefined ? result : res;
        hooks = hooks.splice(1);
        if (error) {
          clearTimeout(timeout);
          return reject(error);
        } else if (!hooks.length) {
          clearTimeout(timeout);
          return resolve(nextResult);
        }
        return hooks[0].apply(ctx, [args, nextResult, next]);
      };
      return hooks[0].apply(ctx, [args, result, next]);
    }
  }, {
    key: 'bindFunction',
    value: function bindFunction(fn, fieldDef, ignoreMiddleware) {
      var _this4 = this;

      if (!fn) return;
      var resolver = _$1.isFunction(fn) ? fn : this.definition.get('functions["' + fn + '"]');
      if (!_$1.isFunction(resolver)) {
        this.factory.emit('log', {
          source: 'typeGenerator',
          level: 'error',
          error: new Error('TypeGeneratorError: Could not find resolver function "' + fn + '"')
        });
      }
      return function (source, args, context, info) {
        return ignoreMiddleware === true ? resolver.call(Object.assign({}, _this4.fnContext, { fieldDef: fieldDef }), source, args, context, info) : _this4.processMiddleware(resolver, { source: source, args: args, context: context, info: info }, fieldDef);
      };
    }
  }, {
    key: 'makeFieldType',
    value: function makeFieldType(field) {
      var type = field.type,
          nullable = field.nullable,
          primary = field.primary;

      var isList = _$1.isArray(type) && type.length > 0;
      var nonNull = nullable === false || primary === true;
      var typeName = isList ? type[0] : type;
      var typeObj = null;

      if (_$1.has(this.types, '["' + typeName + '"]')) {
        typeObj = this.types[typeName];
      } else if (_$1.has(this.typeMap, '["' + typeName + '"]')) {
        typeObj = this.typeMap[typeName];
      } else if (this.definition.hasExtType(typeName)) {
        typeObj = this.definition.getExtType(typeName);
      } else if (_$1.has(this.graphql, '["' + typeName + '"]')) {
        typeObj = this.graphql[typeName];
      } else {
        var err = new Error('TypeGeneratorError: Invalid type "' + typeName + '"');
        this.factory.emit('log', {
          source: 'typeGenerator',
          level: 'error',
          error: err
        });
        throw err;
      }

      var gqlType = isList ? new this.graphql.GraphQLList(typeObj) : typeObj;

      return nonNull ? new this.graphql.GraphQLNonNull(gqlType) : gqlType;
    }
  }, {
    key: 'resolveType',
    value: function resolveType(field, rootType) {
      var f = _$1.isString(field) || _$1.isArray(field) ? { type: field } : field;
      var type = f.type;


      if (!type && _$1.has(f, '["' + rootType + '"]')) {
        return this.makeFieldType(_$1.merge({}, f, {
          type: f[rootType]
        }));
      }

      return this.makeFieldType(f);
    }
  }, {
    key: 'makeSchemas',
    value: function makeSchemas() {
      var _this5 = this;

      _$1.forEach(this.definition.schemas, function (definition, nameDefault) {
        var name = definition.name;

        _this5._schemas[name || nameDefault] = FactoryGQLSchema(_this5, definition, nameDefault);
      });
      return this;
    }
  }, {
    key: 'makeType',
    value: function makeType(typeToMake) {
      var _this6 = this;

      _$1.forEach(this.definition.types, function (definition, nameDefault) {
        var name = definition.name,
            type = definition.type;

        var useName = name || nameDefault;
        if (type !== typeToMake) return;

        switch (type) {
          case ENUM$1:
            _this6._types[useName] = FactoryGQLEnumType(_this6, definition, nameDefault);
            break;
          case INPUT:
            _this6._types[useName] = FactoryGQLInputObjectType(_this6, definition, nameDefault);
            break;
          case INTERFACE:
            _this6._types[useName] = FactoryGQLInterfaceType(_this6, definition, nameDefault);
            break;
          case OBJECT$1:
            _this6._types[useName] = FactoryGQLObjectType(_this6, definition, nameDefault);
            break;
          case SCALAR:
            _this6._types[useName] = FactoryGQLScalarType(_this6, definition, nameDefault);
            break;
          case UNION:
            _this6._types[useName] = FactoryGQLUnionType(_this6, definition, nameDefault);
            break;
          default:
            var err = new Error('TypeGeneratorError: "' + type + '" is an invalid base type');
            _this6.factory.emit('log', {
              source: 'typeGenerator',
              level: 'error',
              error: err
            });
            throw err;
        }
      });
      return this;
    }
  }, {
    key: 'values',
    value: function values() {
      return {
        types: this._types,
        schemas: this._schemas
      };
    }
  }, {
    key: 'generate',
    value: function generate() {
      // generate should only be called once
      if (this._generated) return;
      this._generated = true;

      return this.makeType(ENUM$1).makeType(SCALAR).makeType(INPUT).makeType(OBJECT$1).makeType(INTERFACE).makeType(UNION).makeSchemas().values();
    }
  }, {
    key: 'types',
    get: function get() {
      if (_$1.keys(this._types).length) return this._types;
      this.generate();
      return this._types;
    }
  }, {
    key: 'schemas',
    get: function get() {
      if (_$1.keys(this._schemas).length) return this._schemas;
      this.generate();
      return this._schemas;
    }
  }]);
  return GraphQLFactoryTypeGenerator;
}();

var GraphQLFactoryLibrary = function (_EventEmitter) {
  inherits(GraphQLFactoryLibrary, _EventEmitter);

  function GraphQLFactoryLibrary(graphql, definition, _factory) {
    classCallCheck(this, GraphQLFactoryLibrary);

    var _this = possibleConstructorReturn(this, (GraphQLFactoryLibrary.__proto__ || Object.getPrototypeOf(GraphQLFactoryLibrary)).call(this));

    var _ref = new GraphQLFactoryTypeGenerator(graphql, definition, _this, _factory),
        types = _ref.types,
        schemas = _ref.schemas;

    // store original and compiled definitions/types


    _this._definitions = {
      definition: definition.definition,
      graphql: graphql,
      schemas: schemas,
      types: types

      // build schema functions
    };_$1.forEach(schemas, function (schema, name) {
      _this[name] = function (requestString, rootValue, contextValue, variableValues, operationName) {
        return graphql.graphql(schema, requestString, rootValue, contextValue, variableValues, operationName);
      };

      // add the schema to the function to make it easily accessible
      _this[name].schema = schema;
    });
    return _this;
  }

  return GraphQLFactoryLibrary;
}(EventEmitter);

// standalone definition builder
function define() {
  var definition = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  return new GraphQLFactoryDefinition(definition, options);
}

// standalone compiler
function compile() {
  var definition = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var plugin = options.plugin;

  if (definition instanceof GraphQLFactoryDefinition) {
    return definition.registerPlugin(plugin).compile();
  }
  return define(definition, options).compile();
}

/**
 * graphql-factory instance
 * @property {GraphQL} graphql - instance of graphql
 * @property {ConstantsEnum} constants
 * @property {FactoryUtils} utils - Util functions
 */
var GraphQLFactory$1 = function (_EventEmitter) {
  inherits(GraphQLFactory, _EventEmitter);

  function GraphQLFactory(graphql) {
    classCallCheck(this, GraphQLFactory);

    /**
     * Compiles a {@link FactoryDefinition}
     * @function compile
     * @param {FactoryDefinition} definition
     * @param {Object} [options]
     * @param {String|Array} options.plugin - Plugin or array of plugins
     * @returns {GraphQLFactoryDefinition}
     */
    var _this = possibleConstructorReturn(this, (GraphQLFactory.__proto__ || Object.getPrototypeOf(GraphQLFactory)).call(this));

    _this.compile = compile;
    _this.constants = constants;
    _this.errors = [];
    _this.middleware = [];

    /**
     * Creates an un-compiled {@link FactoryDefinition}
     * @function define
     * @param {FactoryDefinition} definition
     * @param {Object} [options]
     * @param {String|Array} options.plugin - Plugin or array of plugins
     * @returns {GraphQLFactoryDefinition}
     */
    _this.define = define;
    _this.graphql = graphql;
    _this.utils = _$1;
    return _this;
  }

  /**
   * Middleware/plugin registration function that can be called on the factory
   * itself to use the same pattern as express, and other frameworks that support
   * middleware
   * @param plugin
   */


  createClass(GraphQLFactory, [{
    key: 'use',
    value: function use(plugin) {
      this.middleware.push(plugin);
    }

    /**
     * Creates a new GraphQLFactoryLibrary
     * @param {FactoryDefinition} definition
     * @param {Object} options
     * @param {String|Array} options.plugin - Plugin or array of plugins
     * @returns {GraphQLFactoryLibrary}
     */

  }, {
    key: 'make',
    value: function make() {
      var _this2 = this;

      var definition = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var plugin = options.plugin,
          beforeResolve = options.beforeResolve,
          afterResolve = options.afterResolve,
          beforeTimeout = options.beforeTimeout,
          afterTimeout = options.afterTimeout,
          logger = options.logger;

      // ensure that the factory def is an instance of the class

      var factoryDef = definition instanceof GraphQLFactoryDefinition ? definition : new GraphQLFactoryDefinition(definition);

      // setup a logger
      var _logger = (typeof logger === 'undefined' ? 'undefined' : _typeof(logger)) === 'object' ? logger : {};

      // emit an error event when log-level is error which throws an error
      this.on('log', function (log) {
        if (typeof _logger[log.level] === 'function') _logger[log.level](log);
        if (log.level === 'error') _this2.errors.push(log.error.message);
      });

      // forward definition logs to the main factory emitter
      factoryDef.on('log', function (payload) {
        _this2.emit('log', payload);
      });

      // build the definition
      factoryDef.registerPlugin(this.middleware).registerPlugin(plugin).beforeResolve(beforeResolve).beforeTimeout(beforeTimeout).afterResolve(afterResolve).afterTimeout(afterTimeout).compile();

      // create a new lib
      var lib = new GraphQLFactoryLibrary(this.graphql, factoryDef, this);

      // check for error and throw
      if (this.errors.length) {
        var errorMessage = 'GraphQLFactoryMakeError: ' + this.errors.join(', ');
        throw new Error(errorMessage);
      }

      // otherwise return the lib
      return lib;
    }
  }]);
  return GraphQLFactory;
}(EventEmitter);

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
var factory = function factory(graphql) {
  return new GraphQLFactory$1(graphql);
};

// add tools to main module
factory.compile = compile;
factory.constants = constants;
factory.define = define;
factory.utils = _$1;

// add classes to main module
factory.GraphQLFactory = GraphQLFactory$1;
factory.GraphQLFactoryCompiler = GraphQLFactoryCompiler;
factory.GraphQLFactoryDefinition = GraphQLFactoryDefinition;
factory.GraphQLFactoryLibrary = GraphQLFactoryLibrary;
factory.GraphQLFactoryTypeGenerator = GraphQLFactoryTypeGenerator;

module.exports = factory;
