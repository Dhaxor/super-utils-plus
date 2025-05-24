/**
 * Truncates string if it's longer than the given maximum string length.
 * The last characters of the truncated string are replaced with the omission
 * string which defaults to "...".
 * 
 * @param string - The string to truncate
 * @param options - The options object
 * @returns The truncated string
 * 
 * @example
 * ```ts
 * truncate('hi-diddly-ho there, neighborino');
 * // => 'hi-diddly-ho there, neighbo...'
 * 
 * truncate('hi-diddly-ho there, neighborino', {
 *   length: 24,
 *   omission: ' [...]'
 * });
 * // => 'hi-diddly-ho there [...]'
 * 
 * truncate('hi-diddly-ho there, neighborino', {
 *   length: 24,
 *   omission: ' [...]',
 *   separator: ' '
 * });
 * // => 'hi-diddly-ho there [...]'
 * 
 * truncate('hi-diddly-ho there, neighborino', {
 *   length: 24,
 *   omission: ' [...]',
 *   separator: /,? +/
 * });
 * // => 'hi-diddly-ho there [...]'
 * ```
 */
export function truncate(
	string: string,
	options: {
	  length?: number;
	  omission?: string;
	  separator?: string | RegExp;
	} = {}
  ): string {
	if (!string) {
	  return '';
	}
	
	const {
	  length = 30,
	  omission = '...',
	  separator
	} = options;
	
	if (string.length <= length) {
	  return string;
	}
	
	let truncateIndex = Math.max(0, length - omission.length);
	
	// If a separator is specified, find the last occurrence before the truncate index
	if (separator) {
	  let lastIndex: number;
	  
	  if (typeof separator === 'string') {
		lastIndex = string.substring(0, truncateIndex).lastIndexOf(separator);
	  } else {
		// Find the last match of the separator regex
		const matches = string.substring(0, truncateIndex).match(separator);
		lastIndex = matches && matches.length > 0
		  ? string.substring(0, truncateIndex).lastIndexOf(matches[matches.length - 1]) +
			matches[matches.length - 1].length
		  : -1;
	  }
	  
	  if (lastIndex >= 0) {
		truncateIndex = lastIndex;
	  }
	}
	
	return string.substring(0, truncateIndex) + omission;
  }