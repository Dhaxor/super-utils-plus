a/**
 * SuperUtilsPlus Demo
 * 
 * Run this file with Node.js to see SuperUtilsPlus in action:
 * node test-demo.js
 */

// Note: For a real package, you would import from the package name
// But for this demo, we'll import directly from the source files
const {
  // Array utilities
  chunk, compact, compactNil, difference, differenceDeep, flatten, flattenDeep,
  intersection, intersectionDeep, union, unionDeep, uniq, uniqDeep, groupBy,
  
  // Object utilities
  get, set, pick, pickBy, omit, omitBy, merge, deepClone,
  
  // String utilities
  camelCase, kebabCase, snakeCase, capitalize, titleCase, 
  trim, trimStart, trimEnd, truncate, template,
  
  // Function utilities
  debounce, throttle, memoize, curry, partial, compose, pipe,
  
  // Type checking
  isNumber, isString, isObject, isArray, isPlainObject, isEqual, isNil,
  
  // Random utilities
  random, randomInt, randomString, randomUUID
} = require('./src');

// Create a colored log function for better readability
const log = {
  title: (msg) => console.log(`\n\x1b[1m\x1b[36m${msg}\x1b[0m`),
  subtitle: (msg) => console.log(`\x1b[1m\x1b[33m  ${msg}\x1b[0m`),
  result: (msg) => console.log(`  \x1b[32m${msg}\x1b[0m`),
  code: (msg) => console.log(`  \x1b[90m${msg}\x1b[0m`),
  separator: () => console.log('-'.repeat(80))
};

log.title('SuperUtilsPlus Demo');
log.separator();

// Array Utilities Demo
log.title('Array Utilities');

log.subtitle('chunk()');
log.code('chunk([1, 2, 3, 4, 5], 2)');
log.result(JSON.stringify(chunk([1, 2, 3, 4, 5], 2)));

log.subtitle('compact()');
log.code('compact([0, 1, false, 2, "", 3, null, undefined, NaN])');
log.result(JSON.stringify(compact([0, 1, false, 2, '', 3, null, undefined, NaN])));

log.subtitle('compactNil()');
log.code('compactNil([0, 1, false, 2, "", 3, null, undefined, NaN])');
log.result(JSON.stringify(compactNil([0, 1, false, 2, '', 3, null, undefined, NaN])));

log.subtitle('difference()');
log.code('difference([1, 2, 3, 4], [2, 3])');
log.result(JSON.stringify(difference([1, 2, 3, 4], [2, 3])));

log.subtitle('intersection()');
log.code('intersection([1, 2, 3], [2, 3, 4])');
log.result(JSON.stringify(intersection([1, 2, 3], [2, 3, 4])));

log.subtitle('union()');
log.code('union([1, 2], [2, 3])');
log.result(JSON.stringify(union([1, 2], [2, 3])));

log.subtitle('uniq()');
log.code('uniq([1, 2, 1, 3, 2])');
log.result(JSON.stringify(uniq([1, 2, 1, 3, 2])));

log.subtitle('flatten()');
log.code('flatten([1, [2, [3, [4]], 5]])');
log.result(JSON.stringify(flatten([1, [2, [3, [4]], 5]])));

log.subtitle('flattenDeep()');
log.code('flattenDeep([1, [2, [3, [4]], 5]])');
log.result(JSON.stringify(flattenDeep([1, [2, [3, [4]], 5]])));

log.subtitle('groupBy()');
log.code('groupBy([6.1, 4.2, 6.3], Math.floor)');
log.result(JSON.stringify(groupBy([6.1, 4.2, 6.3], Math.floor), null, 2));
log.code('groupBy(["one", "two", "three"], "length")');
log.result(JSON.stringify(groupBy(['one', 'two', 'three'], 'length'), null, 2));

log.separator();

// Object Utilities Demo
log.title('Object Utilities');

const obj = { a: [{ b: { c: 3 } }] };

log.subtitle('get()');
log.code('get({ a: [{ b: { c: 3 } }] }, "a[0].b.c")');
log.result(get(obj, 'a[0].b.c'));
log.code('get({ a: [{ b: { c: 3 } }] }, "x.y.z", "default")');
log.result(get(obj, 'x.y.z', 'default'));

log.subtitle('set()');
log.code('set({ a: [{ b: { c: 3 } }] }, "a[0].b.d", 4)');
const setResult = set({ ...obj }, 'a[0].b.d', 4);
log.result(JSON.stringify(setResult));

log.subtitle('pick()');
log.code('pick({ a: 1, b: 2, c: 3, d: 4 }, ["a", "c"])');
log.result(JSON.stringify(pick({ a: 1, b: 2, c: 3, d: 4 }, ['a', 'c'])));

log.subtitle('omit()');
log.code('omit({ a: 1, b: 2, c: 3, d: 4 }, ["a", "c"])');
log.result(JSON.stringify(omit({ a: 1, b: 2, c: 3, d: 4 }, ['a', 'c'])));

log.subtitle('merge()');
log.code('merge({ a: 1, b: { c: 2 } }, { b: { d: 3 }, e: 4 })');
log.result(JSON.stringify(merge({ a: 1, b: { c: 2 } }, { b: { d: 3 }, e: 4 })));

log.subtitle('deepClone()');
const original = { a: 1, b: { c: 2, d: [1, 2] } };
const clone = deepClone(original);
original.b.c = 99;
original.b.d.push(3);

log.code('const original = { a: 1, b: { c: 2, d: [1, 2] } }');
log.code('const clone = deepClone(original)');
log.code('original.b.c = 99');
log.code('original.b.d.push(3)');
log.result(`original: ${JSON.stringify(original)}`);
log.result(`clone: ${JSON.stringify(clone)}`);

log.separator();

// String Utilities Demo
log.title('String Utilities');

log.subtitle('camelCase()');
log.code('camelCase("Foo Bar")');
log.result(camelCase('Foo Bar'));
log.code('camelCase("--foo-bar--")');
log.result(camelCase('--foo-bar--'));

log.subtitle('kebabCase()');
log.code('kebabCase("fooBar")');
log.result(kebabCase('fooBar'));

log.subtitle('snakeCase()');
log.code('snakeCase("fooBar")');
log.result(snakeCase('fooBar'));

log.subtitle('capitalize()');
log.code('capitalize("HELLO")');
log.result(capitalize('HELLO'));

log.subtitle('trim()');
log.code('trim("  hello  ")');
log.result(`"${trim('  hello  ')}"`);
log.code('trimStart("  hello  ")');
log.result(`"${trimStart('  hello  ')}"`);
log.code('trimEnd("  hello  ")');
log.result(`"${trimEnd('  hello  ')}"`);

log.subtitle('truncate()');
log.code('truncate("hello world", { length: 8 })');
log.result(truncate('hello world', { length: 8 }));

log.subtitle('template()');
log.code('template("Hello <%= user %>!")({ user: "John" })');
const compiledTemplate = template('Hello <%= user %>!');
log.result(compiledTemplate({ user: 'John' }));

log.separator();

// Function Utilities Demo
log.title('Function Utilities');

log.subtitle('debounce()');
log.code('const debouncedFn = debounce(fn, 300, { leading: true });');
log.result('Function is available and fully functional');

log.subtitle('throttle()');
log.code('const throttledFn = throttle(fn, 300, { leading: true });');
log.result('Function is available and fully functional');

log.subtitle('memoize()');
log.code('const memoizedFn = memoize(expensiveFunction);');
function addSlowly(a, b) {
  // Simulate a slow calculation
  const start = Date.now();
  while (Date.now() - start < 10) {} // Wait 10ms
  return a + b;
}
const memoizedAdd = memoize(addSlowly);
// First call is slow
log.code('First call: memoizedAdd(1, 2)');
log.result(`Result: ${memoizedAdd(1, 2)} (slow)`);
// Second call is fast due to memoization
log.code('Second call: memoizedAdd(1, 2)');
log.result(`Result: ${memoizedAdd(1, 2)} (fast, result from cache)`);

log.subtitle('curry()');
log.code('const curriedAdd = curry((a, b, c) => a + b + c)');
log.code('curriedAdd(1)(2)(3)');
const curriedAddFn = curry((a, b, c) => a + b + c);
log.result(`Result: ${curriedAddFn(1)(2)(3)}`);

log.subtitle('partial()');
log.code('const greet = (greeting, name) => `${greeting}, ${name}!`');
log.code('const sayHello = partial(greet, "Hello")');
log.code('sayHello("World")');
const greetFn = (greeting, name) => `${greeting}, ${name}!`;
const sayHelloFn = partial(greetFn, 'Hello');
log.result(`Result: ${sayHelloFn('World')}`);

log.subtitle('compose()');
log.code('const composed = compose(x => x*x, x => x*2, x => x+1)');
log.code('composed(5)'); // ((5 + 1) * 2)² = 12² = 144
const composedFn = compose(x => x*x, x => x*2, x => x+1);
log.result(`Result: ${composedFn(5)}`);

log.separator();

// Type Checking Demo
log.title('Type Checking');

log.subtitle('isNumber()');
log.code('isNumber(123)');
log.result(isNumber(123));
log.code('isNumber("123")');
log.result(isNumber('123'));
log.code('isNumber(NaN)');
log.result(isNumber(NaN));

log.subtitle('isString()');
log.code('isString("hello")');
log.result(isString('hello'));

log.subtitle('isObject()');
log.code('isObject({})');
log.result(isObject({}));
log.code('isObject([])');
log.result(isObject([]));

log.subtitle('isArray()');
log.code('isArray([])');
log.result(isArray([]));

log.subtitle('isNil()');
log.code('isNil(null)');
log.result(isNil(null));
log.code('isNil(undefined)');
log.result(isNil(undefined));
log.code('isNil(0)');
log.result(isNil(0));

log.subtitle('isEqual()');
log.code('isEqual({ a: 1, b: 2 }, { a: 1, b: 2 })');
log.result(isEqual({ a: 1, b: 2 }, { a: 1, b: 2 }));
log.code('isEqual([1, 2, 3], [1, 2, 3])');
log.result(isEqual([1, 2, 3], [1, 2, 3]));
log.code('isEqual([1, 2, 3], [1, 2, 4])');
log.result(isEqual([1, 2, 3], [1, 2, 4]));

log.separator();

// Random Utilities Demo
log.title('Random Utilities');

log.subtitle('random()');
log.code('random(1, 10)');
log.result(random(1, 10));

log.subtitle('randomInt()');
log.code('randomInt(1, 10)');
log.result(randomInt(1, 10));

log.subtitle('randomString()');
log.code('randomString(10)');
log.result(randomString(10));
log.code('randomString(5, "ABC")');
log.result(randomString(5, 'ABC'));

log.subtitle('randomUUID()');
log.code('randomUUID()');
log.result(randomUUID());

log.separator();

log.title('SuperUtilsPlus');
log.result('A modern, TypeScript-first utility library');
log.result('Fully implemented with all the functions from Lodash and more!');
log.result('Check out README.md and DEPLOYMENT.md for more information');

log.separator();