import { filter, reject } from '../filter.js';

const users = [
  { user: 'barney', age: 36, active: true },
  { user: 'fred', age: 40, active: false },
  { user: 'pebbles', age: 1, active: true },
];

describe('filter', () => {
  test('should filter using a function predicate', () => {
    expect(filter(users, o => !o.active)).toEqual([users[1]]);
  });

  test('should provide index and collection to the predicate', () => {
    const indices: number[] = [];
    const collections: (typeof users)[] = [];
    filter(users, (_value, index, collection) => {
      indices.push(index);
      collections.push(collection);
      return true;
    });
    expect(indices).toEqual([0, 1, 2]);
    expect(collections).toEqual([users, users, users]);
  });

  test('should filter using an object predicate (matches shorthand)', () => {
    expect(filter(users, { age: 36 })).toEqual([users[0]]);
    expect(filter(users, { age: 36, active: true })).toEqual([users[0]]);
    expect(filter(users, { age: 36, active: false })).toEqual([]);
  });

  test('should match every object when the object predicate is empty', () => {
    expect(filter([1, { a: 1 }, null, 'x'] as any[], {})).toEqual([{ a: 1 }]);
  });

  test('should filter using a property-value pair (matchesProperty shorthand)', () => {
    expect(filter(users, ['active', false])).toEqual([users[1]]);
    expect(filter(users, ['active', true])).toEqual([users[0], users[2]]);
  });

  test('should filter using a property name (property shorthand)', () => {
    expect(filter(users, 'active')).toEqual([users[0], users[2]]);
  });

  test('should use strict equality for shorthand comparisons', () => {
    expect(filter(users, { age: '36' })).toEqual([]);
    expect(filter(users, ['age', '36'])).toEqual([]);
  });

  test('should treat non-object items as non-matching for shorthands', () => {
    const mixed = [1, 'a', null, undefined, { active: true }] as any[];
    expect(filter(mixed, { active: true })).toEqual([{ active: true }]);
    expect(filter(mixed, ['active', true])).toEqual([{ active: true }]);
    expect(filter(mixed, 'active')).toEqual([{ active: true }]);
  });

  test('should fall back to truthiness for unrecognised predicates', () => {
    expect(filter([0, 1, '', 'a', null], 42 as any)).toEqual([1, 'a']);
    expect(filter([0, 1, 2], ['a', 'b', 'c'] as any)).toEqual([1, 2]);
  });

  test('should not mutate the input array', () => {
    const array = [1, 2, 3];
    filter(array, n => n > 1);
    expect(array).toEqual([1, 2, 3]);
  });

  test('should return an empty array for empty input', () => {
    expect(filter([], () => true)).toEqual([]);
  });

  test('should handle null and undefined', () => {
    expect(filter(null as any, 'active')).toEqual([]);
    expect(filter(undefined as any, 'active')).toEqual([]);
  });
});

describe('reject', () => {
  test('should reject using a function predicate', () => {
    const people = [
      { user: 'barney', age: 36, active: false },
      { user: 'fred', age: 40, active: true },
    ];
    expect(reject(people, o => !o.active)).toEqual([people[1]]);
    expect(reject(users, o => !o.active)).toEqual([users[0], users[2]]);
  });

  test('should provide index and collection to the predicate', () => {
    const indices: number[] = [];
    const collections: (typeof users)[] = [];
    filter(users, (_value, index, collection) => {
      indices.push(index);
      collections.push(collection);
      return false;
    });
    expect(indices).toEqual([0, 1, 2]);
    expect(collections).toEqual([users, users, users]);
  });

  test('should reject using an object predicate (matches shorthand)', () => {
    expect(reject(users, { age: 36 })).toEqual([users[1], users[2]]);
    expect(reject(users, { age: 36, active: true })).toEqual([users[1], users[2]]);
    expect(reject(users, { age: 36, active: false })).toEqual(users);
  });

  test('should reject using a property-value pair (matchesProperty shorthand)', () => {
    expect(reject(users, ['active', false])).toEqual([users[0], users[2]]);
    expect(reject(users, ['active', true])).toEqual([users[1]]);
  });

  test('should reject using a property name (property shorthand)', () => {
    expect(reject(users, 'active')).toEqual([users[1]]);
  });

  test('should keep non-object items when using shorthands', () => {
    const mixed = [1, 'a', null, { active: true }] as any[];
    expect(reject(mixed, { active: true })).toEqual([1, 'a', null]);
    expect(reject(mixed, ['active', true])).toEqual([1, 'a', null]);
    expect(reject(mixed, 'active')).toEqual([1, 'a', null]);
  });

  test('should fall back to falsiness for unrecognised predicates', () => {
    expect(reject([0, 1, '', 'a', null], 42 as any)).toEqual([0, '', null]);
  });

  test('should not mutate the input array', () => {
    const array = [1, 2, 3];
    reject(array, n => n > 1);
    expect(array).toEqual([1, 2, 3]);
  });

  test('should return an empty array for empty input', () => {
    expect(reject([], () => false)).toEqual([]);
  });

  test('should handle null and undefined', () => {
    expect(reject(null as any, 'active')).toEqual([]);
    expect(reject(undefined as any, 'active')).toEqual([]);
  });
});
