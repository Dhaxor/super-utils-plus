/**
 * Removes leading and trailing whitespace or specified characters from string.
 * 
 * @param string - The string to trim
 * @param chars - The characters to trim
 * @returns The trimmed string
 * 
 * @example
 * ```ts
 * trim('  abc  ');
 * // => 'abc'
 * 
 * trim('-_-abc-_-', '_-');
 * // => 'abc'
 * ```
 */
export function trim(string: string, chars?: string): string {
	if (!string) {
	  return '';
	}
	
	if (!chars) {
	  return string.trim();
	}
	
	// Create a regex pattern with the chars to trim
	const pattern = new RegExp(`^[${escapeRegExp(chars)}]+|[${escapeRegExp(chars)}]+$`, 'g');
	return string.replace(pattern, '');
  }
  
  /**
   * Removes leading whitespace or specified characters from string.
   * 
   * @param string - The string to trim
   * @param chars - The characters to trim
   * @returns The trimmed string
   * 
   * @example
   * ```ts
   * trimStart('  abc  ');
   * // => 'abc  '
   * 
   * trimStart('-_-abc-_-', '_-');
   * // => 'abc-_-'
   * ```
   */
  export function trimStart(string: string, chars?: string): string {
	if (!string) {
	  return '';
	}
	
	if (!chars) {
	  return string.trimStart();
	}
	
	// Create a regex pattern with the chars to trim
	const pattern = new RegExp(`^[${escapeRegExp(chars)}]+`, 'g');
	return string.replace(pattern, '');
  }
  
  /**
   * Removes trailing whitespace or specified characters from string.
   * 
   * @param string - The string to trim
   * @param chars - The characters to trim
   * @returns The trimmed string
   * 
   * @example
   * ```ts
   * trimEnd('  abc  ');
   * // => '  abc'
   * 
   * trimEnd('-_-abc-_-', '_-');
   * // => '-_-abc'
   * ```
   */
  export function trimEnd(string: string, chars?: string): string {
	if (!string) {
	  return '';
	}
	
	if (!chars) {
	  return string.trimEnd();
	}
	
	// Create a regex pattern with the chars to trim
	const pattern = new RegExp(`[${escapeRegExp(chars)}]+$`, 'g');
	return string.replace(pattern, '');
  }
  
  /**
   * Escapes the RegExp special characters in a string.
   */
  function escapeRegExp(string: string): string {
	return string.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&');
  }