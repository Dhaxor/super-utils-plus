import { find, findLast, findIndex, findLastIndex } from '../find';

describe('find', () => {
  const users = [
    { user: 'barney', age: 36, active: true },
    { user: 'fred', age: 40, active: false },
    { user: 'pebbles', age: 1, active: true }
  ];

  test('should find an element using a function predicate', () => {
    expect(find(users, o => o.age < 40)).toEqual(users[0]);
  });

  test('should find an element using an object predicate', () => {
    expect(find(users, { age: 1, active: true })).toEqual(users[2]);
  });

  test('should find an element using a property-value pair', () => {
    expect(find(users, ['active', false])).toEqual(users[1]);
  });

  test('should find an element using a property name', () => {
    expect(find(users, 'active')).toEqual(users[0]);
  });

  test('should return undefined when nothing is found', () => {
    expect(find(users, { age: 100 })).toBeUndefined();
  });

  test('should honor fromIndex', () => {
    expect(find(users, 'active', 1)).toEqual(users[2]);
  });

  test('should handle edge cases', () => {
    expect(find([], (o: { age: number }) => o.age < 40)).toBeUndefined();
    expect(find(null as any, (o: { age: number }) => o.age < 40)).toBeUndefined();
  });
});

describe('findLast', () => {
  const users = [
    { user: 'barney', age: 36, active: true },
    { user: 'fred', age: 40, active: false },
    { user: 'pebbles', age: 1, active: true }
  ];

  test('should find the last element using a function predicate', () => {
    expect(findLast(users, o => o.active)).toEqual(users[2]);
  });

  test('should find the last element using an object predicate', () => {
    expect(findLast(users, { active: true })).toEqual(users[2]);
  });

  test('should find the last element using a property-value pair', () => {
    expect(findLast(users, ['active', true])).toEqual(users[2]);
  });

  test('should find the last element using a property name', () => {
    expect(findLast(users, 'active')).toEqual(users[2]);
  });

  test('should return undefined when nothing is found', () => {
    expect(findLast(users, { age: 100 })).toBeUndefined();
  });

  test('should honor fromIndex', () => {
    expect(findLast(users, 'active', 1)).toEqual(users[0]);
  });

  test('should handle edge cases', () => {
    expect(findLast([], (o: { age: number }) => o.age < 40)).toBeUndefined();
    expect(findLast(null as any, (o: { age: number }) => o.age < 40)).toBeUndefined();
  });
});

describe('findIndex', () => {
  const users = [
    { user: 'barney', age: 36, active: true },
    { user: 'fred', age: 40, active: false },
    { user: 'pebbles', age: 1, active: true }
  ];

  test('should find the index using a function predicate', () => {
    expect(findIndex(users, o => o.age < 40)).toBe(0);
  });

  test('should find the index using an object predicate', () => {
    expect(findIndex(users, { age: 1, active: true })).toBe(2);
  });

  test('should find the index using a property-value pair', () => {
    expect(findIndex(users, ['active', false])).toBe(1);
  });

  test('should find the index using a property name', () => {
    expect(findIndex(users, 'active')).toBe(0);
  });

  test('should return -1 when nothing is found', () => {
    expect(findIndex(users, { age: 100 })).toBe(-1);
  });

  test('should honor fromIndex', () => {
    expect(findIndex(users, 'active', 1)).toBe(2);
  });

  test('should handle edge cases', () => {
    expect(findIndex([], (o: { age: number }) => o.age < 40)).toBe(-1);
    expect(findIndex(null as any, (o: { age: number }) => o.age < 40)).toBe(-1);
  });
});

describe('findLastIndex', () => {
  const users = [
    { user: 'barney', age: 36, active: true },
    { user: 'fred', age: 40, active: false },
    { user: 'pebbles', age: 1, active: true }
  ];

  test('should find the last index using a function predicate', () => {
    expect(findLastIndex(users, o => o.active)).toBe(2);
  });

  test('should find the last index using an object predicate', () => {
    expect(findLastIndex(users, { active: true })).toBe(2);
  });

  test('should find the last index using a property-value pair', () => {
    expect(findLastIndex(users, ['active', true])).toBe(2);
  });

  test('should find the last index using a property name', () => {
    expect(findLastIndex(users, 'active')).toBe(2);
  });

  test('should return -1 when nothing is found', () => {
    expect(findLastIndex(users, { age: 100 })).toBe(-1);
  });

  test('should honor fromIndex', () => {
    expect(findLastIndex(users, 'active', 1)).toBe(0);
  });

  test('should handle edge cases', () => {
    expect(findLastIndex([], (o: { age: number }) => o.age < 40)).toBe(-1);
    expect(findLastIndex(null as any, (o: { age: number }) => o.age < 40)).toBe(-1);
  });
});