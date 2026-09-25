import { toPredicate, toPropertyIteratee, toValueIteratee } from '../iteratee.js';

const users = [
  { user: 'barney', age: 36, active: true },
  { user: 'fred', age: 40, active: false },
];

describe('toPredicate', () => {
  test('should return functions unchanged', () => {
    const fn = (value: number) => value > 1;
    expect(toPredicate(fn)).toBe(fn);
  });

  test('should build a matchesProperty predicate from a pair', () => {
    const predicate = toPredicate<(typeof users)[number]>(['active', false]);
    expect(users.filter(predicate)).toEqual([users[1]]);
  });

  test('should build a matches predicate from an object', () => {
    const predicate = toPredicate<(typeof users)[number]>({ age: 36, active: true });
    expect(users.filter(predicate)).toEqual([users[0]]);
    expect(toPredicate<any>({ a: 1 })('not an object', 0, [])).toBe(false);
  });

  test('should build a property predicate from a string', () => {
    const predicate = toPredicate<(typeof users)[number]>('active');
    expect(users.filter(predicate)).toEqual([users[0]]);
    expect(toPredicate<any>('length')('abc', 0, [])).toBe(false);
  });

  test('should fall back to truthiness for other values', () => {
    const predicate = toPredicate<any>(undefined as any);
    expect([0, 1, '', 'a', null].filter(predicate)).toEqual([1, 'a']);
  });

  test('should treat arrays that are not pairs as truthiness predicates', () => {
    const predicate = toPredicate<any>([1, 2, 3] as any);
    expect([0, 1].filter(predicate)).toEqual([1]);
  });
});

describe('toValueIteratee', () => {
  test('should return functions unchanged', () => {
    const fn = (value: { age: number }) => value.age;
    expect(toValueIteratee(fn)).toBe(fn);
  });

  test('should read a property by name', () => {
    const iteratee = toValueIteratee<(typeof users)[number], number>('age');
    expect(users.map(iteratee)).toEqual([36, 40]);
  });

  test('should return undefined for nil values', () => {
    const iteratee = toValueIteratee<any, unknown>('age');
    expect(iteratee(null)).toBeUndefined();
    expect(iteratee(undefined)).toBeUndefined();
  });
});

describe('toPropertyIteratee', () => {
  test('should return functions unchanged', () => {
    const fn = (value: number, index: number) => value + index;
    expect(toPropertyIteratee(fn)).toBe(fn);
  });

  test('should read properties of objects, arrays, and strings', () => {
    const iteratee = toPropertyIteratee<any, unknown>('length');
    expect([[1, 2], 'abc', { length: 7 }].map(iteratee)).toEqual([2, 3, 7]);
  });

  test('should return undefined for nil values', () => {
    const iteratee = toPropertyIteratee<any, unknown>('x');
    expect([null, undefined].map(iteratee)).toEqual([undefined, undefined]);
  });
});
