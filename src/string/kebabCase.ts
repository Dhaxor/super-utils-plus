/**
 * Converts string to kebab case.
 * 
 * @param string - The string to convert
 * @returns The kebab cased string
 * 
 * @example
 * ```ts
 * kebabCase('Foo Bar');
 * // => 'foo-bar'
 * 
 * kebabCase('fooBar');
 * // => 'foo-bar'
 * 
 * kebabCase('__FOO_BAR__');
 * // => 'foo-bar'
 * ```
 */
export function kebabCase(string: string): string {
	if (!string) {
	  return '';
	}
	
	// Convert camelCase to kebab-case
	const camelToKebab = string.replace(/([a-z0-9])([A-Z])/g, '$1-$2');
	
	// Convert to lowercase and remove special characters
	return camelToKebab
	  .toLowerCase()
	  .replace(/[\\s_]+/g, '-')
	  .replace(/[^a-z0-9\\-]/g, '')
	  .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  }