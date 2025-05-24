# SuperUtilsPlus

A superior alternative to Lodash with improved performance, TypeScript support, and developer experience.

## Features

- **Full TypeScript Support**: Type definitions are first-class citizens
- **Modern JavaScript**: Written for ES2020+ with full ESM and CommonJS support
- **Tree-Shakable**: Only import what you need
- **Zero Dependencies**: Lightweight and no bloat
- **Extensive Testing**: High test coverage for reliable code
- **Extended Functionality**: More utility functions than Lodash
- **Performance Focused**: Optimized for speed and efficiency
- **Browser & Node.js**: Works everywhere JavaScript runs

## Installation

```bash
npm install super-utils
# or
yarn add super-utils
# or
pnpm add super-utils
```

## Usage Examples

### Array Functions

```js
import { chunk, compact, difference, flatten, flattenDeep, groupBy } from 'super-utils';

// Create chunks of arrays
chunk([1, 2, 3, 4, 5], 2);
// => [[1, 2], [3, 4], [5]]

// Remove falsy values from array
compact([0, 1, false, 2, '', 3, null, undefined, NaN]);
// => [1, 2, 3]

// Remove only null and undefined values
compactNil([0, 1, false, 2, '', 3, null, undefined, NaN]);
// => [0, 1, false, 2, '', 3, NaN]

// Find values not included in other arrays
difference([2, 1], [2, 3]);
// => [1]

// Find values not included using deep equality
differenceDeep([{ 'x': 2 }, { 'x': 1 }], [{ 'x': 1 }]);
// => [{ 'x': 2 }]

// Find values not included using a custom iteratee
differenceBy([2.1, 1.2], Math.floor, [2.3, 3.4]);
// => [1.2]

// Flatten an array one level
flatten([1, [2, [3, [4]], 5]]);
// => [1, 2, [3, [4]], 5]

// Recursively flatten an array
flattenDeep([1, [2, [3, [4]], 5]]);
// => [1, 2, 3, 4, 5]

// Group array elements by a key or function
groupBy([6.1, 4.2, 6.3], Math.floor);
// => { '4': [4.2], '6': [6.1, 6.3] }

groupBy(['one', 'two', 'three'], 'length');
// => { '3': ['one', 'two'], '5': ['three'] }
```

### Object Functions

```js
import { get, deepClone } from 'super-utils';

// Get a value from an object with a path
const object = { 'a': [{ 'b': { 'c': 3 } }] };

get(object, 'a[0].b.c');
// => 3

get(object, ['a', '0', 'b', 'c']);
// => 3

get(object, 'a.b.c', 'default');
// => 'default'

// Create a deep clone of an object
const original = { a: 1, b: { c: 2 } };
const clone = deepClone(original);

original.b.c = 99;
// clone.b.c is still 2
```

### String Functions

```js
import { camelCase } from 'super-utils';

// Convert a string to camel case
camelCase('Foo Bar');
// => 'fooBar'

camelCase('--foo-bar--');
// => 'fooBar'

camelCase('__FOO_BAR__');
// => 'fooBar'
```

### Function Utilities

```js
import { debounce } from 'super-utils';

// Create a debounced function
const debouncedSave = debounce(saveFunction, 300, { leading: true, trailing: true });

// Call it multiple times, but it will only execute once after 300ms of inactivity
debouncedSave();
debouncedSave();
debouncedSave();

// Cancel the debounced function
debouncedSave.cancel();

// Immediately invoke the debounced function
debouncedSave.flush();
```

### Type Checking

```js
import { 
  isNil, isUndefined, isNull, isNumber, isString, isBoolean,
  isFunction, isArray, isObject, isPlainObject, isEmpty, isEqual 
} from 'super-utils';

// Check types
isNumber(123);      // => true
isNumber('123');    // => false
isNumber(NaN);      // => false (more intuitive than Lodash)

isString('hello');  // => true
isObject({});       // => true
isObject([]);       // => false (unlike Lodash, arrays are not objects)
isArray([]);        // => true

// Check for null or undefined
isNil(null);        // => true
isNil(undefined);   // => true
isNil(0);           // => false

// Deep equality comparison
isEqual({ a: 1, b: 2 }, { a: 1, b: 2 });  // => true
isEqual([1, 2, 3], [1, 2, 3]);            // => true
```

### Random Utilities

```js
import { random, randomInt, randomString, randomUUID } from 'super-utils';

// Generate a random number between min and max
random(1, 10);  // => 4.237...

// Generate a random integer between min and max (inclusive)
randomInt(1, 10);  // => 7

// Generate a random string
randomString(10);  // => "a1b2c3d4e5"
randomString(5, 'ABC');  // => "BACAB"

// Generate a random UUID
randomUUID();  // => "1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed"
```

## Tree-Shaking with Module Imports

For optimal bundle size, import only what you need:

```js
// Import only what you need from specific modules
import { chunk, difference } from 'super-utils/array';
import { get } from 'super-utils/object';
import { debounce } from 'super-utils/function';
import { isArray } from 'super-utils/utils';
```

## TypeScript Support

SuperUtilsPlus is written in TypeScript and provides full type definitions:

```ts
import { get } from 'super-utils';

interface User {
  name: string;
  profile: {
    age: number;
    email: string;
  };
}

// Type-safe access with generics
const user = get<User>(data, 'users[0]');
```

## License

MIT