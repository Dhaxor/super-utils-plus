import { result } from '../../index';

describe('result', () => {
  test('should return the resolved non-function value', () => {
    expect(result({ a: [{ b: { c: 3 } }] }, 'a[0].b.c')).toBe(3);
  });

  test('should invoke a resolved function with its parent as this', () => {
    const object = {
      a: {
        value: 2,
        getValue() {
          return this.value;
        },
      },
    };

    expect(result(object, 'a.getValue')).toBe(2);
  });

  test('should return the default value for missing paths', () => {
    expect(result({ a: 1 }, 'b.c', 'default')).toBe('default');
  });

  test('should invoke a default function with the parent object as this', () => {
    const object = {
      a: {
        fallback: 'from-default',
      },
    };

    expect(result(object, 'a.missing', function(this: { fallback: string }) {
      return this.fallback;
    })).toBe('from-default');
  });
});