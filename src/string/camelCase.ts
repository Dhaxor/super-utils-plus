/**
 * Converts string to camel case.
 * 
 * @param string - The string to convert
 * @returns The camel cased string
 * 
 * @example
 * ```ts
 * camelCase('Foo Bar');
 * // => 'fooBar'
 * 
 * camelCase('--foo-bar--');
 * // => 'fooBar'
 * 
 * camelCase('__FOO_BAR__');
 * // => 'fooBar'
 * ```
 */
export function camelCase(string: string): string {
  if (!string) {
    return '';
  }
  
  // Convert to lowercase and remove special characters
  const words = string
    .toLowerCase()
    .replace(/[\\s\\-_]+/g, ' ')
    .replace(/[^a-z\\s]/g, '')
    .trim()
    .split(' ');
  
  // First word lowercase, rest with capitalized first letter
  return words
    .map((word, index) => {
      if (index === 0) {
        return word;
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join('');
}