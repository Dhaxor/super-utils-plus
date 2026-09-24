import { assign, assignIn, assignWith, assignInWith, extend, extendWith } from '../assign';

describe('assign', () => {
  test('should assign source properties to destination object', () => {
    expect(assign({ a: 1 }, { b: 2 }, { c: 3 })).toEqual({ a: 1, b: 2, c: 3 });
  });

  test('should override existing properties', () => {
    expect(assign({ a: 1, b: 2 }, { b: 3, c: 4 })).toEqual({ a: 1, b: 3, c: 4 });
  });

  test('should handle empty objects', () => {
    expect(assign({}, { a: 1 })).toEqual({ a: 1 });
    expect(assign({ a: 1 }, {})).toEqual({ a: 1 });
  });

  test('should return the destination object when no sources are provided', () => {
    const obj = { a: 1 };
    expect(assign(obj)).toBe(obj);
  });
});

describe('assignIn', () => {
  test('should assign own and inherited source properties', () => {
    function Foo(this: any) {
      this.a = 1;
    }
    Foo.prototype.b = 2;

    const result = assignIn({ c: 3 }, new (Foo as any)());
    expect(result).toEqual({ a: 1, b: 2, c: 3 });
  });

  test('should override existing properties', () => {
    expect(assignIn({ a: 1, b: 2 }, { b: 3, c: 4 })).toEqual({ a: 1, b: 3, c: 4 });
  });

  test('should handle empty objects', () => {
    expect(assignIn({}, { a: 1 })).toEqual({ a: 1 });
    expect(assignIn({ a: 1 }, {})).toEqual({ a: 1 });
  });
});

describe('assignWith', () => {
  test('should assign properties using customizer', () => {
    function customizer(objValue: any, srcValue: any) {
      return objValue === undefined ? srcValue : objValue;
    }

    expect(assignWith({ a: 1 }, { a: 2, b: 2 }, customizer)).toEqual({ a: 1, b: 2 });
  });

  test('should use regular assignment when customizer returns undefined', () => {
    function customizer(_objValue: any, _srcValue: any) {
      return undefined;
    }

    expect(assignWith({ a: 1 }, { a: 2, b: 2 }, customizer)).toEqual({ a: 2, b: 2 });
  });
});

describe('assignInWith', () => {
  test('should assign properties using customizer including inherited ones', () => {
    function Foo(this: any) {
      this.a = 1;
    }
    Foo.prototype.b = 2;

    function customizer(objValue: any, srcValue: any) {
      return objValue === undefined ? srcValue : objValue;
    }

    const result = assignInWith({ c: 3 }, new (Foo as any)(), customizer);
    expect(result).toEqual({ a: 1, b: 2, c: 3 });
  });

  test('should use regular assignment when customizer returns undefined', () => {
    function customizer(_objValue: any, _srcValue: any) {
      return undefined;
    }

    expect(assignInWith({ a: 1 }, { a: 2, b: 2 }, customizer)).toEqual({ a: 2, b: 2 });
  });
});

describe('aliases', () => {
  test('extend should be an alias for assignIn', () => {
    expect(extend).toBe(assignIn);
  });

  test('extendWith should be an alias for assignInWith', () => {
    expect(extendWith).toBe(assignInWith);
  });
});
