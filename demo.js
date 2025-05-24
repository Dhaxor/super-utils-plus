// This is a comprehensive demo of the SuperUtilsPlus library
// When the library is properly built, you can run this file with Node.js

// Import utility functions
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

console.log('=== SuperUtilsPlus Demo ===');
console.log('A modern alternative to Lodash with improved TypeScript support and performance');
console.log('------------------------------------------------------------------');

// Demo: Array utilities
console.log('\n=== Array Utilities ===');

const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
console.log('Original array:', numbers);
console.log('chunk(numbers, 3):', chunk(numbers, 3));

const messyArray = [0, 1, false, 2, '', 3, null, undefined, NaN];
console.log('messyArray:', messyArray);
console.log('compact(messyArray):', compact(messyArray));
console.log('compactNil(messyArray):', compactNil(messyArray));

const arr1 = [1, 2, 3, 4];
const arr2 = [3, 4, 5, 6];
console.log('difference([1, 2, 3, 4], [3, 4, 5, 6]):', difference(arr1, arr2));

console.log('intersection([1, 2, 3], [2, 3, 4]):', intersection([1, 2, 3], [2, 3, 4]));

console.log('union([1, 2], [2, 3]):', union([1, 2], [2, 3]));

console.log('uniq([1, 2, 1, 3, 2]):', uniq([1, 2, 1, 3, 2]));

console.log('flatten([1, [2, [3, [4]], 5]]):', flatten([1, [2, [3, [4]], 5]]));
console.log('flattenDeep([1, [2, [3, [4]], 5]]):', flattenDeep([1, [2, [3, [4]], 5]]));

const users = [
  { 'user': 'barney', 'age': 36, 'active': true },
  { 'user': 'fred', 'age': 40, 'active': false },
  { 'user': 'pebbles', 'age': 1, 'active': true }
];
console.log('groupBy by active status:', groupBy(users, 'active'));
console.log('groupBy by age range:', groupBy(users, user => Math.floor(user.age / 10) * 10 + 's'));

// Demo: Object utilities
console.log('\n=== Object Utilities ===');

const deepObject = { a: [{ b: { c: 3 } }] };
console.log('Original object:', deepObject);
console.log("get(deepObject, 'a[0].b.c'):", get(deepObject, 'a[0].b.c'));
console.log("get(deepObject, 'x.y.z', 'default'):", get(deepObject, 'x.y.z', 'default'));

// Set
console.log("set(deepObject, 'a[0].b.d', 4):", set({ ...deepObject }, 'a[0].b.d', 4));
console.log("set({}, 'a.b[0].c', 3):", set({}, 'a.b[0].c', 3));

// Pick and Omit
const pickOmitObj = { a: 1, b: 2, c: 3, d: 4 };
console.log('pick({ a: 1, b: 2, c: 3, d: 4 }, ["a", "c"]):', pick(pickOmitObj, ['a', 'c']));
console.log('omit({ a: 1, b: 2, c: 3, d: 4 }, ["a", "c"]):', omit(pickOmitObj, ['a', 'c']));
console.log('pickBy({ a: 1, b: 2, c: 3, d: 4 }, x => x % 2 === 1):', pickBy(pickOmitObj, x => x % 2 === 1));
console.log('omitBy({ a: 1, b: 2, c: 3, d: 4 }, x => x % 2 === 1):', omitBy(pickOmitObj, x => x % 2 === 1));

// Merge
const mergeObj1 = { a: 1, b: { c: 2 } };
const mergeObj2 = { b: { d: 3 }, e: 4 };
console.log('merge({ a: 1, b: { c: 2 } }, { b: { d: 3 }, e: 4 }):', merge({ ...mergeObj1 }, mergeObj2));

// Deep Clone
const original = { a: 1, b: { c: 2, d: [1, 2] } };
const clone = deepClone(original);
original.b.c = 99;
original.b.d.push(3);
console.log('Original after modification:', original);
console.log('Clone (unchanged):', clone);

// Demo: String utilities
console.log('\n=== String Utilities ===');

console.log('camelCase("hello world"):', camelCase('hello world'));
console.log('camelCase("--hello-world--"):', camelCase('--hello-world--'));
console.log('kebabCase("helloWorld"):', kebabCase('helloWorld'));
console.log('snakeCase("helloWorld"):', snakeCase('helloWorld'));
console.log('capitalize("HELLO"):', capitalize('HELLO'));
console.log('titleCase("hello world"):', titleCase('hello world'));
console.log('trim("  hello  "):', trim('  hello  '));
console.log('trimStart("  hello  "):', trimStart('  hello  '));
console.log('trimEnd("  hello  "):', trimEnd('  hello  '));
console.log('truncate("hello world", { length: 8 }):', truncate('hello world', { length: 8 }));

// Template
const compiled = template('Hello <%= user %>!');
console.log('template("Hello <%= user %>!")({ user: "John" }):', compiled({ user: 'John' }));

// Demo: Function utilities
console.log('\n=== Function Utilities ===');

// Memoize
function fibonacci(n) {
  return n < 2 ? n : fibonacci(n - 1) + fibonacci(n - 2);
}

const fastFibonacci = memoize(fibonacci);
console.time('Regular fibonacci(15)');
fibonacci(15);
console.timeEnd('Regular fibonacci(15)');

console.time('Memoized fibonacci(15)');
fastFibonacci(15);
console.timeEnd('Memoized fibonacci(15)');

// Curry
function add(a, b, c) {
  return a + b + c;
}

const curriedAdd = curry(add);
console.log('curry(add)(1)(2)(3):', curriedAdd(1)(2)(3));
console.log('curry(add)(1, 2)(3):', curriedAdd(1, 2)(3));
console.log('curry(add)(1)(2, 3):', curriedAdd(1)(2, 3));

// Partial
const greet = (greeting, name) => `${greeting}, ${name}!`;
const sayHello = partial(greet, 'Hello');
console.log('partial(greet, "Hello")("World"):', sayHello('World'));

// Compose
const addOne = x => x + 1;
const double = x => x * 2;
const square = x => x * x;

const composed = compose(square, double, addOne);
console.log('compose(square, double, addOne)(5):', composed(5)); // ((5 + 1) * 2)² = 12² = 144

// Pipe
const piped = pipe(addOne, double, square);
console.log('pipe(addOne, double, square)(5):', piped(5)); // ((5 + 1) * 2)² = 12² = 144

// Demo: Type checking
console.log('\n=== Type Checking ===');

console.log('isNumber(123):', isNumber(123));
console.log('isNumber("123"):', isNumber('123'));
console.log('isNumber(NaN):', isNumber(NaN));
console.log('isString("hello"):', isString('hello'));
console.log('isObject({}):', isObject({}));
console.log('isObject([]):', isObject([])); // false, unlike Lodash
console.log('isArray([]):', isArray([]));
console.log('isPlainObject({}):', isPlainObject({}));
console.log('isPlainObject([]):', isPlainObject([]));
console.log('isNil(null):', isNil(null));
console.log('isNil(undefined):', isNil(undefined));
console.log('isNil(0):', isNil(0));

const obj1 = { a: 1, b: { c: 2 } };
const obj2 = { a: 1, b: { c: 2 } };
const obj3 = { a: 1, b: { c: 3 } };
console.log('isEqual(obj1, obj2):', isEqual(obj1, obj2));
console.log('isEqual(obj1, obj3):', isEqual(obj1, obj3));
console.log('isEqual([1, 2, 3], [1, 2, 3]):', isEqual([1, 2, 3], [1, 2, 3]));

// Demo: Random utilities
console.log('\n=== Random Utilities ===');

console.log('random(1, 10):', random(1, 10));
console.log('randomInt(1, 10):', randomInt(1, 10));
console.log('randomString(10):', randomString(10));
console.log('randomUUID():', randomUUID());

console.log('\n=== End of Demo ===');
console.log('SuperUtilsPlus provides a comprehensive set of utilities for modern JavaScript development');
console.log('with improved TypeScript support, better performance, and more intuitive API design.');