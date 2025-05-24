import { TemplateOptions } from '../utils/types';

/**
 * Creates a compiled template function that can interpolate data properties
 * in "interpolate" delimiters, HTML-escape interpolated data properties in
 * "escape" delimiters, and execute JavaScript in "evaluate" delimiters.
 * 
 * @param string - The template string
 * @param options - The options object
 * @returns The compiled template function
 * 
 * @example
 * ```ts
 * // Use the default delimiters: <%= value %>, <%- value %>, <% code %>
 * const compiled = template('hello <%= user %>!');
 * compiled({ 'user': 'fred' });
 * // => 'hello fred!'
 * 
 * // Use custom delimiters
 * const compiled = template('hello {{user}}!', {
 *   interpolate: /{{([\s\S]+?)}}/g
 * });
 * compiled({ 'user': 'fred' });
 * // => 'hello fred!'
 * ```
 */
export function template(
  string: string,
  options: TemplateOptions = {}
): (data?: Record<string, any>) => string {
  const settings = {
    interpolate: options.interpolate || /<%=([\s\S]+?)%>/g,
    escape: options.escape || /<%-([\s\S]+?)%>/g,
    evaluate: options.evaluate || /<%([\s\S]+?)%>/g,
  };
  
  // Combine the template delimiters into a single pattern
  const matcher = new RegExp([
    settings.escape.source,
    settings.interpolate.source,
    settings.evaluate.source,
  ].join('|') + '|$', 'g');
  
  // Compile the template source, escaping string literals
  let index = 0;
  let source = "__p += '";
  
  string.replace(matcher, (match, escape, interpolate, evaluate, offset) => {
    // Add the text between the last match and this one
    source += string.slice(index, offset).replace(/[\\'\n\r]/g, char => {
      return char === "'" ? "\\'" : char === '\n' ? '\\n' : char === '\r' ? '\\r' : char;
    });
    
    index = offset + match.length;
    
    if (escape) {
      // HTML escape the value
      source += "' +\n((__t = (" + escape + ")) == null ? '' : _.escape(__t)) +\n'";
    } else if (interpolate) {
      // Interpolate the value
      source += "' +\n((__t = (" + interpolate + ")) == null ? '' : __t) +\n'";
    } else if (evaluate) {
      // Evaluate the code
      source += "';\n" + evaluate + "\n__p += '";
    }
    
    return match;
  });
  
  source += "';\n";
  
  // Add a sourceURL for easier debugging
  source += "\n//# sourceURL=/template-source.js";
  
  // Wrap the compiled source in a function
  const renderFunction = new Function('_', 'data', [
    "var __t, __p = '', __j = Array.prototype.join, __e = _.escape;",
    "with (data || {}) {",
    source,
    "};",
    "return __p;",
  ].join('\n'));
  
  const escapeHTML = (str: string) => 
    String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  
  // Create the final template function
  const compiledTemplate = (data?: Record<string, any>) => {
    try {
      return renderFunction({ escape: escapeHTML }, data);
    } catch (e) {
      const err = e as Error;
      err.message = `Template Error: ${err.message}`;
      throw err;
    }
  };
  
  return compiledTemplate;
}