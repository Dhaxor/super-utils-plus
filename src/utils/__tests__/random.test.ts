import { webcrypto } from 'crypto';

import { random, randomInt, randomString, randomUUID } from '../random.js';

const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const ALMOST_ONE = 0.9999999;

describe('random', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should return min when Math.random returns 0', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0);

    expect(random(1, 10)).toBe(1);
    expect(random(-5, 5)).toBe(-5);
    expect(random(2.5, 3)).toBe(2.5);
  });

  test('should stay below max when Math.random is close to 1', () => {
    jest.spyOn(Math, 'random').mockReturnValue(ALMOST_ONE);

    expect(random(1, 10)).toBeLessThan(10);
    expect(random(1, 10)).toBeGreaterThan(9.99);
    expect(random(-5, 5)).toBeLessThan(5);
  });

  test('should scale Math.random into the requested range', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.5);

    expect(random(0, 10)).toBe(5);
    expect(random(2, 4)).toBe(3);
    expect(random(-10, 10)).toBe(0);
  });

  test('should default to the range [0, 1)', () => {
    const spy = jest.spyOn(Math, 'random').mockReturnValue(0);
    expect(random()).toBe(0);

    spy.mockReturnValue(0.25);
    expect(random()).toBe(0.25);

    spy.mockReturnValue(ALMOST_ONE);
    expect(random()).toBeLessThan(1);
  });

  test('should default max to 1 when only min is given', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.5);

    expect(random(0.5)).toBe(0.75);
  });

  test('should return numbers within [min, max) without mocking', () => {
    for (let i = 0; i < 100; i++) {
      const value = random(1, 10);
      expect(value).toBeGreaterThanOrEqual(1);
      expect(value).toBeLessThan(10);
    }
  });
});

describe('randomInt', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should return min when Math.random returns 0', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0);

    expect(randomInt(1, 10)).toBe(1);
    expect(randomInt(0, 0)).toBe(0);
    expect(randomInt(-10, -1)).toBe(-10);
  });

  test('should return max when Math.random is close to 1', () => {
    jest.spyOn(Math, 'random').mockReturnValue(ALMOST_ONE);

    expect(randomInt(1, 10)).toBe(10);
    expect(randomInt(0, 0)).toBe(0);
    expect(randomInt(-10, -1)).toBe(-1);
  });

  test('should map intermediate values onto the integers in range', () => {
    const spy = jest.spyOn(Math, 'random').mockReturnValue(0.5);
    expect(randomInt(1, 10)).toBe(6);

    spy.mockReturnValue(0.09);
    expect(randomInt(1, 10)).toBe(1);

    spy.mockReturnValue(0.1);
    expect(randomInt(1, 10)).toBe(2);
  });

  test('should ceil min and floor max for non-integer bounds', () => {
    const spy = jest.spyOn(Math, 'random').mockReturnValue(0);
    expect(randomInt(1.2, 9.8)).toBe(2);
    expect(randomInt(-1.5, 1.5)).toBe(-1);

    spy.mockReturnValue(ALMOST_ONE);
    expect(randomInt(1.2, 9.8)).toBe(9);
    expect(randomInt(-1.5, 1.5)).toBe(1);
  });

  test('should return the bound when min equals max', () => {
    const spy = jest.spyOn(Math, 'random').mockReturnValue(0);
    expect(randomInt(5, 5)).toBe(5);

    spy.mockReturnValue(ALMOST_ONE);
    expect(randomInt(5, 5)).toBe(5);
  });

  test('should return integers within the inclusive bounds without mocking', () => {
    const seen = new Set<number>();
    for (let i = 0; i < 200; i++) {
      const value = randomInt(1, 3);
      expect(Number.isInteger(value)).toBe(true);
      expect(value).toBeGreaterThanOrEqual(1);
      expect(value).toBeLessThanOrEqual(3);
      seen.add(value);
    }
    expect(seen.size).toBeGreaterThan(1);
  });
});

describe('randomString', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should generate a string of the requested length', () => {
    expect(randomString(0)).toBe('');
    expect(randomString(1)).toHaveLength(1);
    expect(randomString(10)).toHaveLength(10);
    expect(randomString(100)).toHaveLength(100);
  });

  test('should use an alphanumeric charset by default', () => {
    expect(randomString(200)).toMatch(/^[A-Za-z0-9]+$/);
  });

  test('should only use characters from the given charset', () => {
    expect(randomString(50, 'ab')).toMatch(/^[ab]+$/);
    expect(randomString(4, 'q')).toBe('qqqq');
  });

  test('should pick characters from the charset using Math.random', () => {
    jest
      .spyOn(Math, 'random')
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0.5)
      .mockReturnValueOnce(0.99);

    expect(randomString(3, 'ABC')).toBe('ABC');
  });

  test('should use the first character when Math.random returns 0', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0);

    expect(randomString(5, 'xyz')).toBe('xxxxx');
    expect(randomString(3)).toBe('AAA');
  });

  test('should use the last character when Math.random is close to 1', () => {
    jest.spyOn(Math, 'random').mockReturnValue(ALMOST_ONE);

    expect(randomString(5, 'xyz')).toBe('zzzzz');
    expect(randomString(3)).toBe('999');
  });

  test('should call Math.random once per character', () => {
    const spy = jest.spyOn(Math, 'random');

    randomString(7, 'abc');

    expect(spy).toHaveBeenCalledTimes(7);
  });
});

describe('randomUUID', () => {
  const originalDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'crypto');

  // Jest's Node 18 environment does not expose the Web Crypto global even though
  // Node itself does, so install Node's implementation explicitly for every test.
  const hostCrypto = (globalThis as { crypto?: Crypto }).crypto;
  const nativeCrypto: Crypto =
    typeof hostCrypto?.randomUUID === 'function' ? hostCrypto : (webcrypto as unknown as Crypto);

  const replaceCrypto = (value: unknown) => {
    Object.defineProperty(globalThis, 'crypto', {
      value,
      configurable: true,
      writable: true,
      enumerable: true,
    });
  };

  const restoreCrypto = () => replaceCrypto(nativeCrypto);

  beforeEach(() => {
    restoreCrypto();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  afterAll(() => {
    if (originalDescriptor) {
      Object.defineProperty(globalThis, 'crypto', originalDescriptor);
    } else {
      delete (globalThis as { crypto?: unknown }).crypto;
    }
  });

  test('should generate a v4 UUID when crypto.randomUUID is available', () => {
    expect(typeof crypto.randomUUID).toBe('function');

    for (let i = 0; i < 20; i++) {
      expect(randomUUID()).toMatch(UUID_V4);
    }
  });

  test('should delegate to crypto.randomUUID when it is available', () => {
    const spy = jest
      .spyOn(crypto, 'randomUUID')
      .mockReturnValue('11111111-2222-4333-8444-555555555555');
    const mathSpy = jest.spyOn(Math, 'random');

    expect(randomUUID()).toBe('11111111-2222-4333-8444-555555555555');
    expect(spy).toHaveBeenCalledTimes(1);
    expect(mathSpy).not.toHaveBeenCalled();
  });

  test('should generate a v4 UUID when crypto is unavailable', () => {
    replaceCrypto(undefined);
    try {
      expect(typeof crypto).toBe('undefined');

      for (let i = 0; i < 20; i++) {
        expect(randomUUID()).toMatch(UUID_V4);
      }
    } finally {
      restoreCrypto();
    }
  });

  test('should build the fallback UUID from Math.random', () => {
    replaceCrypto(undefined);
    try {
      const spy = jest.spyOn(Math, 'random').mockReturnValue(0);
      expect(randomUUID()).toBe('00000000-0000-4000-8000-000000000000');

      spy.mockReturnValue(ALMOST_ONE);
      expect(randomUUID()).toBe('ffffffff-ffff-4fff-bfff-ffffffffffff');

      spy.mockReturnValue(0.5);
      expect(randomUUID()).toBe('88888888-8888-4888-8888-888888888888');
    } finally {
      restoreCrypto();
    }
  });

  test('should fall back when crypto exists but has no randomUUID', () => {
    replaceCrypto({});
    try {
      const mathSpy = jest.spyOn(Math, 'random');

      expect(randomUUID()).toMatch(UUID_V4);
      expect(mathSpy).toHaveBeenCalled();
    } finally {
      restoreCrypto();
    }
  });

  test('should generate unique values', () => {
    const uuids = new Set<string>();
    for (let i = 0; i < 100; i++) {
      uuids.add(randomUUID());
    }

    expect(uuids.size).toBe(100);
  });

  test('should not leak a replaced crypto into later tests', () => {
    replaceCrypto({});
    restoreCrypto();

    expect(globalThis.crypto).toBe(nativeCrypto);
    expect(typeof crypto.randomUUID).toBe('function');
    expect(randomUUID()).toMatch(UUID_V4);
  });
});
