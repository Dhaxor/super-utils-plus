# SuperUtilsPlus

[![npm version](https://img.shields.io/npm/v/super-utils-plus.svg)](https://www.npmjs.com/package/super-utils-plus)
[![CI](https://github.com/dhaxor/super-utils-plus/actions/workflows/ci.yml/badge.svg)](https://github.com/dhaxor/super-utils-plus/actions/workflows/ci.yml)
[![license](https://img.shields.io/npm/l/super-utils-plus.svg)](./LICENSE)

A modern, typed utility library in the spirit of Lodash: 140+ array, object,
string, function, and type-checking helpers with zero dependencies.

- **TypeScript first** – every function ships with precise type definitions and
  type guards (`isString(x)` narrows `x` to `string`).
- **ESM and CommonJS** – a conditional `exports` map serves the right build to
  `import` and `require`, with matching declaration files for each.
- **Tree-shakable** – `sideEffects: false` and per-module subpath exports
  (`super-utils-plus/array`, …) so bundlers keep only what you use.
- **Safe by default** – path-based helpers (`set`, `merge`, `defaultsDeep`,
  `zipObjectDeep`) refuse to write through `__proto__`, `constructor`, or
  `prototype`, so untrusted input cannot pollute `Object.prototype`.
- **Zero dependencies** – works in Node.js 14+ and every modern browser.

## Installation

```bash
npm install super-utils-plus
# or
yarn add super-utils-plus
# or
pnpm add super-utils-plus
```

## Usage

```ts
// ES modules
import { chunk, debounce, camelCase } from 'super-utils-plus';

// CommonJS
const { chunk, debounce, camelCase } = require('super-utils-plus');

// Import a single module for the smallest bundles
import { chunk, difference } from 'super-utils-plus/array';
import { get, set } from 'super-utils-plus/object';
import { camelCase } from 'super-utils-plus/string';
import { debounce, throttle } from 'super-utils-plus/function';
import { isEqual, isPlainObject } from 'super-utils-plus/utils';
```

## Examples

### Arrays

```ts
import {
  chunk,
  compact,
  compactNil,
  difference,
  differenceBy,
  flattenDeep,
  groupBy,
  range,
  uniqBy,
} from 'super-utils-plus';

chunk([1, 2, 3, 4, 5], 2);
// => [[1, 2], [3, 4], [5]]

compact([0, 1, false, 2, '', 3, null, undefined, NaN]);
// => [1, 2, 3]

compactNil([0, 1, false, 2, '', 3, null, undefined, NaN]);
// => [0, 1, false, 2, '', 3, NaN]   (only null and undefined removed)

difference([2, 1], [2, 3]);
// => [1]

differenceBy([2.1, 1.2], Math.floor, [2.3, 3.4]);
// => [1.2]

flattenDeep([1, [2, [3, [4]], 5]]);
// => [1, 2, 3, 4, 5]

groupBy(['one', 'two', 'three'], 'length');
// => { '3': ['one', 'two'], '5': ['three'] }

uniqBy([{ x: 1 }, { x: 2 }, { x: 1 }], 'x');
// => [{ x: 1 }, { x: 2 }]

range(0, 20, 5);
// => [0, 5, 10, 15]
```

Functions that take a predicate (`find`, `filter`, `reject`, `findIndex`, …)
accept the familiar shorthands:

```ts
const users = [
  { user: 'barney', age: 36, active: true },
  { user: 'fred', age: 40, active: false },
];

find(users, o => o.age < 40); // function
find(users, { age: 40, active: false }); // matches
find(users, ['active', false]); // matchesProperty
find(users, 'active'); // property (truthy)
```

### Objects

```ts
import { get, set, merge, deepClone, pick, omit } from 'super-utils-plus';

const object = { a: [{ b: { c: 3 } }] };

get(object, 'a[0].b.c'); // => 3
get(object, ['a', 0, 'b', 'c']); // => 3
get(object, 'a.b.c', 'default'); // => 'default'

set({}, 'a[0].b.c', 4);
// => { a: [{ b: { c: 4 } }] }

merge({ a: [{ b: 2 }, { d: 4 }] }, { a: [{ c: 3 }, { e: 5 }] });
// => { a: [{ b: 2, c: 3 }, { d: 4, e: 5 }] }

const clone = deepClone({ date: new Date(), map: new Map([[1, { deep: true }]]) });
// Dates, RegExps, Maps, Sets, typed arrays, class instances, and circular
// references are all handled.

pick({ a: 1, b: 2, c: 3 }, ['a', 'c']); // => { a: 1, c: 3 }
omit({ a: 1, b: 2, c: 3 }, ['a', 'c']); // => { b: 2 }
```

### Strings

```ts
import {
  camelCase,
  kebabCase,
  snakeCase,
  titleCase,
  truncate,
  template,
  words,
} from 'super-utils-plus';

camelCase('Foo Bar'); // => 'fooBar'
camelCase('XMLHttpRequest'); // => 'xmlHttpRequest'
kebabCase('fooBar'); // => 'foo-bar'
snakeCase('--FOO-BAR--'); // => 'foo_bar'
titleCase('fred, barney, and pebbles');
// => 'Fred, Barney, And Pebbles'
words('fred, barney, & pebbles');
// => ['fred', 'barney', 'pebbles']

truncate('hi-diddly-ho there, neighborino', { length: 24, separator: /,? +/ });
// => 'hi-diddly-ho there...'

const compiled = template('hello <%= user %>!');
compiled({ user: 'fred' }); // => 'hello fred!'
```

### Functions

```ts
import { debounce, throttle, memoize, curry, partial, pipe } from 'super-utils-plus';

const save = debounce(persist, 300, { leading: true, trailing: true, maxWait: 1000 });
save();
save();
save(); // persist runs at most on the leading and trailing edges
save.cancel(); // drop any pending call
save.flush(); // run a pending call now

const onScroll = throttle(updatePosition, 100);

const fib = memoize((n: number): number => (n < 2 ? n : fib(n - 1) + fib(n - 2)));

const add = curry((a: number, b: number, c: number) => a + b + c);
add(1)(2)(3); // => 6
add(1, 2)(3); // => 6

const greet = partial((greeting: string, name: string) => `${greeting} ${name}`, 'hello');
greet('fred'); // => 'hello fred'

const slugify = pipe(String, kebabCase);
```

### Type checking and numbers

```ts
import {
  isNumber,
  isObject,
  isPlainObject,
  isEqual,
  isEmpty,
  clamp,
  inRange,
} from 'super-utils-plus';

isNumber(NaN); // => false (Lodash says true)
isObject([]); // => false (Lodash says true)
isPlainObject(new Map()); // => false

isEqual(new Map([[1, { a: 1 }]]), new Map([[1, { a: 1 }]])); // => true
isEqual(new Set([1, 2]), new Set([2, 1])); // => true

isEmpty({}); // => true
isEmpty(new Map()); // => true

clamp(10, -5, 5); // => 5
inRange(3, 2, 4); // => true
```

### Random values

```ts
import { random, randomInt, randomString, randomUUID } from 'super-utils-plus';

random(1, 10); // => 4.237…  (min inclusive, max exclusive)
randomInt(1, 10); // => 7       (both bounds inclusive)
randomString(10); // => 'a1B2c3D4e5'
randomString(5, 'ABC'); // => 'BACAB'
randomUUID(); // => '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'
```

## API

### `super-utils-plus/array`

| Function                                                                           | Description                                                                         |
| ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `chunk(array, size?)`                                                              | Split an array into groups of `size`                                                |
| `compact(array)`                                                                   | Remove all falsy values                                                             |
| `compactNil(array)`                                                                | Remove only `null` and `undefined`                                                  |
| `difference(array, ...values)`                                                     | Values not present in the other arrays (SameValueZero)                              |
| `differenceDeep(array, ...values)`                                                 | Like `difference`, using deep equality                                              |
| `differenceBy(array, iteratee, ...values)`                                         | Like `difference`, comparing keys derived by `iteratee`                             |
| `drop(array, n?)` / `dropRight(array, n?)`                                         | Drop `n` elements from the start / end                                              |
| `dropWhile(array, predicate)` / `dropRightWhile(array, predicate)`                 | Drop elements while `predicate` holds                                               |
| `fill(array, value, start?, end?)`                                                 | Copy of `array` with a range filled by `value`                                      |
| `filter(collection, predicate)` / `reject(collection, predicate)`                  | Keep / drop matching elements (shorthands supported)                                |
| `find(collection, predicate, fromIndex?)` / `findLast(...)`                        | First / last matching element                                                       |
| `findIndex(array, predicate, fromIndex?)` / `findLastIndex(...)`                   | Index of the first / last match, else `-1`                                          |
| `flatten(array)` / `flattenDeep(array)`                                            | Flatten one level / recursively                                                     |
| `forEach(collection, iteratee)` / `forEachRight(...)`                              | Iterate; return `false` from `iteratee` to stop early (`each`, `eachRight` aliases) |
| `groupBy(array, iteratee)`                                                         | Group elements by a derived key                                                     |
| `head(array)` / `first(array)` / `last(array)`                                     | First / last element                                                                |
| `tail(array)` / `initial(array)`                                                   | All but the first / last element                                                    |
| `intersection(...arrays)`                                                          | Values present in every array                                                       |
| `intersectionDeep(...arrays)` / `intersectionBy(...arrays, iteratee)`              | Deep-equality / keyed variants                                                      |
| `map(collection, iteratee)`                                                        | Map with a function or property name                                                |
| `flatMap(...)` / `flatMapDeep(...)` / `flatMapDepth(collection, iteratee, depth?)` | Map then flatten                                                                    |
| `range(start, end?, step?)` / `rangeRight(...)`                                    | Numeric ranges                                                                      |
| `reduce(collection, iteratee, accumulator)` / `reduceRight(...)`                   | Fold from the left / right                                                          |
| `remove(array, predicate)`                                                         | Remove matching elements **in place** and return them                               |
| `sample(array)` / `sampleSize(array, n?)` / `shuffle(array)`                       | Random selection and shuffling                                                      |
| `slice(array, start?, end?)`                                                       | Slice without mutating                                                              |
| `take(array, n?)` / `takeRight(array, n?)`                                         | First / last `n` elements                                                           |
| `takeWhile(array, predicate)` / `takeRightWhile(array, predicate)`                 | Take elements while `predicate` holds                                               |
| `union(...arrays)` / `unionDeep(...)` / `unionBy(...arrays, iteratee)`             | Unique values from all arrays                                                       |
| `uniq(array)` / `uniqDeep(array)` / `uniqBy(array, iteratee)`                      | Deduplicate                                                                         |
| `zip(...arrays)` / `unzip(array)`                                                  | Group / regroup elements by position                                                |
| `zipWith(...arrays, iteratee)` / `unzipWith(array, iteratee)`                      | Combine groups with `iteratee`                                                      |
| `zipObject(props, values)` / `zipObjectDeep(paths, values)`                        | Build an object from keys / paths and values                                        |

### `super-utils-plus/object`

| Function                                                                      | Description                                                                       |
| ----------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| `assign(object, ...sources)`                                                  | `Object.assign` (mutates `object`)                                                |
| `assignIn(object, ...sources)` / `extend`                                     | Copy own and inherited properties into a new object                               |
| `assignWith(object, source, customizer)` / `assignInWith(...)` / `extendWith` | Customised assignment                                                             |
| `deepClone(value)`                                                            | Deep clone; handles Date, RegExp, Map, Set, typed arrays, class instances, cycles |
| `defaults(object, ...sources)`                                                | Fill `undefined` properties from sources (returns a new object)                   |
| `defaultsDeep(object, ...sources)`                                            | Recursive `defaults`; inputs are never mutated                                    |
| `fromPairs(pairs)`                                                            | Object from `[key, value]` pairs                                                  |
| `get(object, path, defaultValue?)`                                            | Read a value at a dot/bracket path                                                |
| `set(object, path, value)`                                                    | Write a value at a path, creating containers as needed                            |
| `has(object, key)` / `hasIn(object, key)`                                     | Own / own-or-inherited property check                                             |
| `hasPath(object, path)` / `hasInPath(object, path)`                           | Path variants of `has` / `hasIn`                                                  |
| `invert(object)` / `invertBy(object, iteratee?)`                              | Swap keys and values                                                              |
| `keys(object)` / `keysIn(object)`                                             | Own / own-and-inherited enumerable keys                                           |
| `values(object)` / `valuesIn(object)`                                         | Own / own-and-inherited values                                                    |
| `toPairs(object)` / `entries` / `toPairsIn(object)` / `entriesIn`             | `[key, value]` pairs                                                              |
| `mapValues(object, iteratee)` / `mapKeys(object, iteratee)`                   | Transform values / keys                                                           |
| `merge(object, ...sources)`                                                   | Recursive merge into `object` (mutates and returns it)                            |
| `omit(object, paths)` / `omitBy(object, predicate)`                           | Object without the given keys / matching entries                                  |
| `pick(object, paths)` / `pickBy(object, predicate)`                           | Object with only the given keys / matching entries                                |
| `result(object, path, defaultValue?)`                                         | Like `get`, but invokes function values                                           |

### `super-utils-plus/string`

| Function                                                         | Description                                                 |
| ---------------------------------------------------------------- | ----------------------------------------------------------- |
| `camelCase(string)` / `kebabCase(string)` / `snakeCase(string)`  | Case conversion                                             |
| `capitalize(string)`                                             | Upper-case the first character, lower-case the rest         |
| `capitalizeFirst(string)`                                        | Upper-case the first character only                         |
| `titleCase(string)`                                              | Upper-case the first character of every word                |
| `words(string, pattern?)`                                        | Split into words (camel-case, acronym, and ordinal aware)   |
| `deburr(string)`                                                 | Replace accented Latin letters with basic Latin letters     |
| `pad(string, length?, chars?)` / `padStart(...)` / `padEnd(...)` | Padding                                                     |
| `trim(string, chars?)` / `trimStart(...)` / `trimEnd(...)`       | Trim whitespace or the given characters                     |
| `truncate(string, options?)`                                     | Shorten with an omission string, optionally at a separator  |
| `template(string, options?)`                                     | Compile an ERB-style template (`<%= %>`, `<%- %>`, `<% %>`) |

### `super-utils-plus/function`

| Function                                                         | Description                                                                       |
| ---------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| `debounce(func, wait?, options?)`                                | Delay until calls stop; `leading`, `trailing`, `maxWait`; `.cancel()`, `.flush()` |
| `throttle(func, wait?, options?)`                                | At most one call per `wait`; `leading`, `trailing`; `.cancel()`, `.flush()`       |
| `memoize(func, resolver?)`                                       | Cache results by key; exposes `.cache` (a `Map`)                                  |
| `curry(func, arity?)` / `curryRight(func, arity?)`               | Currying from the left / right                                                    |
| `partial(func, ...partials)` / `partialRight(func, ...partials)` | Partial application with placeholders                                             |
| `compose(...funcs)` / `pipe(...funcs)`                           | Function composition right-to-left / left-to-right                                |

### `super-utils-plus/utils`

| Function                                         | Description                                                |
| ------------------------------------------------ | ---------------------------------------------------------- |
| `isNil`, `isNull`, `isUndefined`                 | Nullish checks                                             |
| `isNumber`, `isFinite`, `isInteger`, `isNaN`     | Numeric checks (`isNumber(NaN)` is `false`)                |
| `isString`, `isBoolean`, `isFunction`, `isArray` | Primitive and array checks                                 |
| `isObject`, `isPlainObject`                      | Object checks (arrays are not objects)                     |
| `isDate`, `isRegExp`                             | Built-in instance checks                                   |
| `isEmpty(value)`                                 | Empty string, array, object, Map, or Set (or nil)          |
| `isEqual(a, b)`                                  | Deep equality including Map, Set, typed arrays, and cycles |
| `clamp(value, lower, upper)`                     | Constrain to an inclusive range                            |
| `inRange(number, start, end?)`                   | Check membership in `[start, end)`                         |
| `random(min?, max?)`                             | Random float in `[min, max)`                               |
| `randomInt(min, max)`                            | Random integer in `[min, max]`                             |
| `randomString(length, charset?)`                 | Random string                                              |
| `randomUUID()`                                   | RFC 4122 v4 UUID (uses `crypto.randomUUID` when available) |

Types such as `PredicateShorthand`, `ValueIteratee`, `DebounceOptions`,
`ThrottleOptions`, `TemplateOptions`, `TruncateOptions`, `PropertyPath`, and
`DeepPartial` are exported from the root and from `super-utils-plus/utils`.

## Differences from Lodash

SuperUtilsPlus follows Lodash's naming and semantics closely, with a few
deliberate exceptions:

| Behaviour                                           | Lodash                    | SuperUtilsPlus                                              |
| --------------------------------------------------- | ------------------------- | ----------------------------------------------------------- |
| `isNumber(NaN)`                                     | `true`                    | `false`                                                     |
| `isObject([])` / `isObject(fn)`                     | `true`                    | `false` (arrays and functions are not objects)              |
| `isEmpty(1)` / `isEmpty(true)`                      | `true`                    | `false` (only collections and nil are empty)                |
| `random(1, 10)`                                     | integer                   | float in `[1, 10)`; use `randomInt` for integers            |
| `defaults` / `defaultsDeep`                         | mutate the destination    | return a new object                                         |
| Array `-Deep` variants (`uniqDeep`, `unionDeep`, …) | not available             | compare with deep equality                                  |
| Collection helpers                                  | accept objects and arrays | array-only; use `mapValues`, `pickBy`, `omitBy` for objects |

## TypeScript

The library is written in TypeScript. Type guards narrow correctly and generic
helpers keep element types:

```ts
import { get, isString, uniqBy } from 'super-utils-plus';

interface User {
  id: number;
  name: string;
}

const users: User[] = [
  { id: 1, name: 'a' },
  { id: 1, name: 'b' },
];
const unique = uniqBy(users, 'id'); // User[]
const name = get<string>(users, '[0].name');

function shout(value: unknown) {
  if (isString(value)) {
    return value.toUpperCase(); // value: string
  }
}
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md). Run `npm run check` before opening a
pull request.

## License

[MIT](./LICENSE)
