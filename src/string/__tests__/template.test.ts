import { template } from '../template.js';

describe('template', () => {
  test('should interpolate data properties with <%= %>', () => {
    const compiled = template('hello <%= user %>!');
    expect(compiled({ user: 'fred' })).toBe('hello fred!');
  });

  test('should interpolate arbitrary expressions', () => {
    expect(
      template('<%= user.name.toUpperCase() %> is <%= age + 1 %>')({
        user: { name: 'fred' },
        age: 41,
      })
    ).toBe('FRED is 42');
  });

  test('should interpolate multiple values', () => {
    expect(template('<%= a %>-<%= b %>-<%= a %>')({ a: 1, b: 2 })).toBe('1-2-1');
  });

  test('should HTML-escape data properties with <%- %>', () => {
    const compiled = template('<%- value %>');
    expect(compiled({ value: '<b>"Tom" & \'Jerry\'</b>' })).toBe(
      '&lt;b&gt;&quot;Tom&quot; &amp; &#39;Jerry&#39;&lt;/b&gt;'
    );
    expect(compiled({ value: 'plain' })).toBe('plain');
    expect(compiled({ value: 5 })).toBe('5');
  });

  test('should not HTML-escape interpolated values', () => {
    expect(template('<%= value %>')({ value: '<b>&</b>' })).toBe('<b>&</b>');
  });

  test('should evaluate JavaScript with <% %>', () => {
    const compiled = template(
      '<ul><% for (let i = 0; i < items.length; i++) { %><li><%= items[i] %></li><% } %></ul>'
    );
    expect(compiled({ items: ['a', 'b', 'c'] })).toBe('<ul><li>a</li><li>b</li><li>c</li></ul>');
    expect(compiled({ items: [] })).toBe('<ul></ul>');
  });

  test('should support conditionals in evaluate blocks', () => {
    const compiled = template(
      '<% if (loggedIn) { %>hi <%= name %><% } else { %>please log in<% } %>'
    );
    expect(compiled({ loggedIn: true, name: 'fred' })).toBe('hi fred');
    expect(compiled({ loggedIn: false })).toBe('please log in');
  });

  test('should use a custom interpolate delimiter', () => {
    const compiled = template('hello {{user}}!', {
      interpolate: /{{([\s\S]+?)}}/g,
    });
    expect(compiled({ user: 'fred' })).toBe('hello fred!');
  });

  test('should use a custom escape delimiter', () => {
    const compiled = template('[[ value ]]', {
      escape: /\[\[([\s\S]+?)\]\]/g,
    });
    expect(compiled({ value: '<a>' })).toBe('&lt;a&gt;');
  });

  test('should use a custom evaluate delimiter', () => {
    const compiled = template('{% for (const x of xs) { %}<%= x %>{% } %}', {
      evaluate: /{%([\s\S]+?)%}/g,
    });
    expect(compiled({ xs: [1, 2, 3] })).toBe('123');
  });

  test('should render null and undefined interpolated values as an empty string', () => {
    expect(template('[<%= a %>][<%= b %>]')({ a: null, b: undefined })).toBe('[][]');
    expect(template('[<%- a %>][<%- b %>]')({ a: null, b: undefined })).toBe('[][]');
  });

  test('should render other falsy values as their string form', () => {
    expect(template('<%= a %>|<%= b %>|<%= c %>')({ a: 0, b: false, c: '' })).toBe('0|false|');
    expect(template('<%- a %>|<%- b %>')({ a: 0, b: false })).toBe('0|false');
  });

  test('should keep literal text with quotes, backslashes and newlines verbatim', () => {
    expect(template("a\\b 'c'\nd")()).toBe("a\\b 'c'\nd");
    expect(template('line1\r\nline2')()).toBe('line1\r\nline2');
    expect(template('x y z')()).toBe('x y z');
    expect(template("it's <%= what %>\\<%= what %>")({ what: 'ok' })).toBe("it's ok\\ok");
  });

  test('should return the template unchanged when it contains no delimiters', () => {
    expect(template('static text')({ ignored: true })).toBe('static text');
  });

  test('should return an empty string for an empty template', () => {
    expect(template('')()).toBe('');
    expect(template('')({ a: 1 })).toBe('');
  });

  test('should allow calling the compiled function without data', () => {
    expect(template('hello')()).toBe('hello');
    expect(template('<%= 1 + 1 %>')()).toBe('2');
    expect(template('<%= 1 + 1 %>')(undefined)).toBe('2');
  });

  test('should be reusable with different data', () => {
    const compiled = template('hi <%= name %>');
    expect(compiled({ name: 'fred' })).toBe('hi fred');
    expect(compiled({ name: 'barney' })).toBe('hi barney');
  });

  test('should rethrow runtime errors with a "Template Error:" prefix', () => {
    expect(() => template('<%= missing %>')({})).toThrow(/^Template Error: /);
    expect(() => template('<%= missing %>')({})).toThrow(ReferenceError);
    expect(() => template("<% throw new Error('boom') %>")()).toThrow('Template Error: boom');
  });
});
