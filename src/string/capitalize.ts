/**
 * Converts the first character of string to upper case and the remaining to lower case.
 * 
 * @param string - The string to capitalize
 * @returns The capitalized string
 * 
 * @example
 * ```ts
 * capitalize('FRED');
 * // => 'Fred'
 * 
 * capitalize('fred');
 * // => 'Fred'
 * ```
 */
export function capitalize(string: string): string {
	if (!string) {
	  return '';
	}
	
	return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }
  
  /**
   * Converts the first character of string to upper case, leaving the rest unchanged.
   * 
   * @param string - The string to capitalize
   * @returns The capitalized string
   * 
   * @example
   * ```ts
   * capitalizeFirst('fred');
   * // => 'Fred'
   * 
   * capitalizeFirst('FRED');
   * // => 'FRED'
   * ```
   */
  export function capitalizeFirst(string: string): string {
	if (!string) {
	  return '';
	}
	
	return string.charAt(0).toUpperCase() + string.slice(1);
  }
  
  /**
   * Converts the first character of each word in the string to upper case.
   * 
   * @param string - The string to convert
   * @returns The title cased string
   * 
   * @example
   * ```ts
   * titleCase('fred, barney, and pebbles');
   * // => 'Fred, Barney, And Pebbles'
   * ```
   */
  export function titleCase(string: string): string {
	if (!string) {
	  return '';
	}
	
	return string.replace(/\\b\\w/g, match => match.toUpperCase());
  }