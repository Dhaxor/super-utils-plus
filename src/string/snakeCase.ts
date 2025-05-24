/**
 * Converts string to snake case.
 * 
 * @param string - The string to convert
 * @returns The snake cased string
 * 
 * @example
 * ```ts
 * snakeCase('Foo Bar');
 * // => 'foo_bar'
 * 
 * snakeCase('fooBar');
 * // => 'foo_bar'
 * 
 * snakeCase('--FOO-BAR--');
 * // => 'foo_bar'
 * ```
 */
export function snakeCase(string: string): string {
	if (!string) {
	  return '';
	}
	
	// Convert camelCase to snake_case
	const camelToSnake = string.replace(/([a-z0-9])([A-Z])/g, '$1_$2');
	
	// Convert to lowercase and remove special characters
	return camelToSnake
	  .toLowerCase()
	  .replace(/[\\s\\-]+/g, '_')
	  .replace(/[^a-z0-9_]/g, '')
	  .replace(/^_+|_+$/g, ''); // Remove leading/trailing underscores
  }