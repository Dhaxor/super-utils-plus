import { deepClone } from '../deepClone.js';

describe('deepClone', () => {
  test('should return primitives as-is', () => {
    expect(deepClone(1)).toBe(1);
    expect(deepClone('str')).toBe('str');
    expect(deepClone(true)).toBe(true);
    expect(deepClone(null)).toBeNull();
    expect(deepClone(undefined)).toBeUndefined();
    expect(deepClone(NaN)).toBeNaN();
    expect(deepClone(10n)).toBe(10n);

    const symbol = Symbol('s');
    expect(deepClone(symbol)).toBe(symbol);
  });

  test('should return functions by reference', () => {
    const fn = () => 1;
    expect(deepClone(fn)).toBe(fn);

    const clone = deepClone({ fn });
    expect(clone.fn).toBe(fn);
  });

  test('should clone arrays', () => {
    const array = [1, 'two', [3, 4], { five: 5 }];
    const clone = deepClone(array);

    expect(clone).toEqual(array);
    expect(Array.isArray(clone)).toBe(true);
    expect(clone).not.toBe(array);
    expect(clone[2]).not.toBe(array[2]);
    expect(clone[3]).not.toBe(array[3]);
  });

  test('should clone nested plain objects', () => {
    const object = { a: { b: { c: 1 } }, d: [1, { e: 2 }] };
    const clone = deepClone(object);

    expect(clone).toEqual(object);
    expect(clone).not.toBe(object);
    expect(clone.a).not.toBe(object.a);
    expect(clone.a.b).not.toBe(object.a.b);
    expect(clone.d).not.toBe(object.d);
    expect(clone.d[1]).not.toBe(object.d[1]);

    clone.a.b.c = 99;
    expect(object.a.b.c).toBe(1);
  });

  test('should clone Date objects', () => {
    const date = new Date(2020, 5, 15, 12, 30);
    const clone = deepClone(date);

    expect(clone).toBeInstanceOf(Date);
    expect(clone).not.toBe(date);
    expect(clone.getTime()).toBe(date.getTime());
  });

  test('should clone RegExp objects preserving flags and lastIndex', () => {
    const regexp = /ab+c/gi;
    regexp.lastIndex = 3;
    const clone = deepClone(regexp);

    expect(clone).toBeInstanceOf(RegExp);
    expect(clone).not.toBe(regexp);
    expect(clone.source).toBe('ab+c');
    expect(clone.flags).toBe('gi');
    expect(clone.lastIndex).toBe(3);
  });

  test('should clone Map instances with deep cloned keys and values', () => {
    const objectKey = { k: 1 };
    const objectValue = { v: [1, 2] };
    const map = new Map<any, any>([
      [objectKey, objectValue],
      ['s', 2],
    ]);
    const clone = deepClone(map);

    expect(clone).toBeInstanceOf(Map);
    expect(clone).not.toBe(map);
    expect(clone.size).toBe(2);
    expect(clone.get('s')).toBe(2);

    // The object key is cloned, so the original key no longer resolves
    expect(clone.has(objectKey)).toBe(false);
    const clonedKey = [...clone.keys()].find(key => typeof key === 'object');
    expect(clonedKey).toEqual(objectKey);
    expect(clonedKey).not.toBe(objectKey);

    const clonedValue = clone.get(clonedKey);
    expect(clonedValue).toEqual(objectValue);
    expect(clonedValue).not.toBe(objectValue);
    expect(clonedValue.v).not.toBe(objectValue.v);
  });

  test('should clone Set instances with deep cloned values', () => {
    const item = { a: 1 };
    const set = new Set<any>([item, 2, 'x']);
    const clone = deepClone(set);

    expect(clone).toBeInstanceOf(Set);
    expect(clone).not.toBe(set);
    expect(clone.size).toBe(3);
    expect(clone.has(2)).toBe(true);
    expect(clone.has('x')).toBe(true);
    expect(clone.has(item)).toBe(false);

    const clonedItem = [...clone].find(value => typeof value === 'object');
    expect(clonedItem).toEqual(item);
    expect(clonedItem).not.toBe(item);
  });

  test('should clone ArrayBuffer without sharing memory', () => {
    const buffer = new ArrayBuffer(4);
    new Uint8Array(buffer).set([1, 2, 3, 4]);
    const clone = deepClone(buffer);

    expect(clone).toBeInstanceOf(ArrayBuffer);
    expect(clone).not.toBe(buffer);
    expect(clone.byteLength).toBe(4);
    expect([...new Uint8Array(clone)]).toEqual([1, 2, 3, 4]);

    new Uint8Array(clone)[0] = 99;
    expect(new Uint8Array(buffer)[0]).toBe(1);
  });

  test('should clone typed arrays without sharing the underlying buffer', () => {
    const uint8 = new Uint8Array([1, 2, 3]);
    const uint8Clone = deepClone(uint8);

    expect(uint8Clone).toBeInstanceOf(Uint8Array);
    expect(uint8Clone).not.toBe(uint8);
    expect(uint8Clone.buffer).not.toBe(uint8.buffer);
    expect([...uint8Clone]).toEqual([1, 2, 3]);

    uint8Clone[0] = 42;
    expect(uint8[0]).toBe(1);

    const float64 = new Float64Array([1.5, -2.25]);
    const float64Clone = deepClone(float64);

    expect(float64Clone).toBeInstanceOf(Float64Array);
    expect(float64Clone).not.toBe(float64);
    expect(float64Clone.buffer).not.toBe(float64.buffer);
    expect([...float64Clone]).toEqual([1.5, -2.25]);
  });

  test('should clone only the viewed region of an offset typed array', () => {
    const buffer = new ArrayBuffer(8);
    new Uint8Array(buffer).set([0, 1, 2, 3, 4, 5, 6, 7]);
    const view = new Uint8Array(buffer, 4, 2);
    const clone = deepClone(view);

    expect([...clone]).toEqual([4, 5]);
    expect(clone.byteOffset).toBe(0);
    expect(clone.buffer.byteLength).toBe(2);
  });

  test('should clone DataView instances', () => {
    const buffer = new ArrayBuffer(4);
    const view = new DataView(buffer);
    view.setInt32(0, 123456);
    const clone = deepClone(view);

    expect(clone).toBeInstanceOf(DataView);
    expect(clone).not.toBe(view);
    expect(clone.buffer).not.toBe(buffer);
    expect(clone.getInt32(0)).toBe(123456);
  });

  test('should handle circular references in objects', () => {
    const object: any = { a: 1 };
    object.self = object;
    object.nested = { parent: object };
    const clone = deepClone(object);

    expect(clone).not.toBe(object);
    expect(clone.a).toBe(1);
    expect(clone.self).toBe(clone);
    expect(clone.nested.parent).toBe(clone);
    expect(clone.nested).not.toBe(object.nested);
  });

  test('should handle arrays containing themselves', () => {
    const array: any[] = [1, 2];
    array.push(array);
    const clone = deepClone(array);

    expect(clone).not.toBe(array);
    expect(clone[0]).toBe(1);
    expect(clone[1]).toBe(2);
    expect(clone[2]).toBe(clone);
  });

  test('should handle circular references in Map and Set', () => {
    const map = new Map<string, any>();
    map.set('self', map);
    const mapClone = deepClone(map);
    expect(mapClone.get('self')).toBe(mapClone);

    const set = new Set<any>();
    set.add(set);
    const setClone = deepClone(set);
    expect(setClone.has(setClone)).toBe(true);
    expect(setClone.has(set)).toBe(false);
  });

  test('should preserve shared references within the cloned graph', () => {
    const shared = { x: 1 };
    const object = { a: shared, b: shared };
    const clone = deepClone(object);

    expect(clone.a).toBe(clone.b);
    expect(clone.a).not.toBe(shared);
  });

  test('should preserve the prototype of class instances', () => {
    class Point {
      constructor(
        public x: number,
        public y: number
      ) {}

      get sum() {
        return this.x + this.y;
      }

      scale(factor: number) {
        return new Point(this.x * factor, this.y * factor);
      }
    }

    const point = new Point(1, 2);
    const clone = deepClone(point);

    expect(clone).toBeInstanceOf(Point);
    expect(clone).not.toBe(point);
    expect(Object.getPrototypeOf(clone)).toBe(Point.prototype);
    expect(clone.x).toBe(1);
    expect(clone.y).toBe(2);
    expect(clone.sum).toBe(3);
    expect(clone.scale(2)).toEqual(new Point(2, 4));
  });

  test('should deep clone nested values inside class instances', () => {
    class Box {
      items: Array<{ id: number }> = [];
    }

    const box = new Box();
    box.items.push({ id: 1 });
    const clone = deepClone(box);

    expect(clone).toBeInstanceOf(Box);
    expect(clone.items).toEqual([{ id: 1 }]);
    expect(clone.items).not.toBe(box.items);
    expect(clone.items[0]).not.toBe(box.items[0]);
  });

  test('should clone objects with a null prototype', () => {
    const object = Object.create(null);
    object.a = 1;
    const clone = deepClone(object);

    expect(Object.getPrototypeOf(clone)).toBeNull();
    expect(clone.a).toBe(1);
    expect(clone).not.toBe(object);
  });

  test('should copy enumerable symbol-keyed properties', () => {
    const visible = Symbol('visible');
    const hidden = Symbol('hidden');
    const object: any = { a: 1, [visible]: { nested: true } };
    Object.defineProperty(object, hidden, { value: 'secret', enumerable: false });
    const clone = deepClone(object);

    expect(clone.a).toBe(1);
    expect(clone[visible]).toEqual({ nested: true });
    expect(clone[visible]).not.toBe(object[visible]);
    expect(clone[hidden]).toBeUndefined();
    expect(Object.getOwnPropertySymbols(clone)).toEqual([visible]);
  });

  test('should never share nested references with the source', () => {
    const source = {
      array: [{ a: 1 }],
      map: new Map([['k', { v: 1 }]]),
      set: new Set([{ s: 1 }]),
      date: new Date(2021, 0, 1),
      regexp: /x/g,
      nested: { deep: { deeper: [1, { x: 1 }] } },
    };
    const clone = deepClone(source);

    expect(clone).toEqual(source);
    expect(clone.array).not.toBe(source.array);
    expect(clone.array[0]).not.toBe(source.array[0]);
    expect(clone.map).not.toBe(source.map);
    expect(clone.map.get('k')).not.toBe(source.map.get('k'));
    expect(clone.set).not.toBe(source.set);
    expect(clone.date).not.toBe(source.date);
    expect(clone.regexp).not.toBe(source.regexp);
    expect(clone.nested).not.toBe(source.nested);
    expect(clone.nested.deep).not.toBe(source.nested.deep);
    expect(clone.nested.deep.deeper).not.toBe(source.nested.deep.deeper);
    expect(clone.nested.deep.deeper[1]).not.toBe(source.nested.deep.deeper[1]);
  });

  test('should match the JSDoc example', () => {
    const objects = [{ a: 1 }, { b: 2 }];
    const deep = deepClone(objects);

    expect(deep[0] === objects[0]).toBe(false);
    expect(deep).toEqual(objects);
  });
});
