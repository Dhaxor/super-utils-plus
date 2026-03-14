import { sample, sampleSize, shuffle } from '../../index';

describe('shuffle', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should return a shuffled copy of the array', () => {
    jest.spyOn(Math, 'random')
      .mockReturnValueOnce(0.1)
      .mockReturnValueOnce(0.9);

    const array = [1, 2, 3];
    const shuffled = shuffle(array);

    expect(shuffled).toEqual([3, 2, 1]);
    expect(array).toEqual([1, 2, 3]);
  });

  test('should handle empty arrays', () => {
    expect(shuffle([])).toEqual([]);
    expect(shuffle(null as any)).toEqual([]);
  });
});

describe('sample', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should return a random element from the array', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.6);
    expect(sample(['a', 'b', 'c'])).toBe('b');
  });

  test('should return undefined for empty arrays', () => {
    expect(sample([])).toBeUndefined();
    expect(sample(null as any)).toBeUndefined();
  });
});

describe('sampleSize', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should return the requested number of unique random elements', () => {
    jest.spyOn(Math, 'random')
      .mockReturnValueOnce(0.75)
      .mockReturnValueOnce(0.25)
      .mockReturnValueOnce(0.5);

    expect(sampleSize([1, 2, 3, 4], 2)).toEqual([3, 2]);
  });

  test('should clamp the requested size to array length and handle invalid sizes', () => {
    expect(sampleSize([1, 2, 3], 10)).toHaveLength(3);
    expect(sampleSize([1, 2, 3], 0)).toEqual([]);
    expect(sampleSize(null as any, 2)).toEqual([]);
  });
});