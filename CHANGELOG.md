# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.0.0] - 2026-09-25

This release fixes security and correctness bugs across the library. Most code
keeps working unchanged, but the behaviours below changed on purpose.

### Breaking changes

- `defaults` and `defaultsDeep` return a new object instead of mutating the first
  argument. Use the return value: `config = defaults(config, fallback)`.
- `defaultsDeep` only fills `undefined` properties; `null` values are kept, matching
  `defaults` and Lodash.
- `get` returns a stored `null` instead of the default value. The default applies only
  when the resolved value is `undefined`, as the documentation always stated.
- The string path `''` now addresses the empty-string key (`get({ '': 1 }, '')` is `1`).
  Leading, trailing, or doubled dots produce empty-string segments, as in Lodash. Use `[]`
  for "no path".
- `merge` assigns `Date`, `Map`, `Set`, and class-instance source values instead of
  recursing into them.
- `camelCase`, `kebabCase`, and `snakeCase` drop apostrophes and accents
  (`"Don't Crème"` becomes `'dont-creme'`), matching Lodash. Previously they returned
  mangled output, so any code that relied on the old results was already broken.
- `curryRight`, `partial`, and `partialRight` now apply arguments in the documented
  order; `partial.placeholder` and `partialRight.placeholder` are the same symbol.
- The build output moved from `dist/` to `dist/cjs` (CommonJS) and `dist/esm`
  (ES modules). Imports through the `exports` map (`super-utils-plus` and its subpaths)
  are unaffected; only tools that bypass it and reference files under `dist/` directly
  need updating.

### Security

- `set`, `merge`, `defaults`, `defaultsDeep`, and `zipObjectDeep` now ignore the keys
  `__proto__`, `constructor`, and `prototype`, so untrusted paths and JSON can no longer
  modify `Object.prototype` (prototype pollution).

### Fixed

- `camelCase`, `kebabCase`, and `snakeCase` returned the input squashed to lowercase
  (`camelCase('Foo Bar')` gave `'foobar'`) because their regular expressions were
  double-escaped. They now split words correctly, including camel-case and acronym
  boundaries (`'XMLHttpRequest'` → `'xmlHttpRequest'`).
- `titleCase` never changed its input for the same reason.
- `trim`, `trimStart`, and `trimEnd` with custom characters threw or silently failed
  for characters that are special in regular expressions (for example `[`, `]`, `.`).
- `template` dropped backslashes from literal template text.
- `pad`, `padStart`, and `padEnd` threw on `null`/`undefined` input; it is now treated as `''`.
- `trim`, `trimStart`, and `trimEnd` accept `null` for the characters argument (whitespace).
- String paths follow Lodash's `toPath`: `''` addresses the empty-string key, leading,
  trailing, or doubled dots produce empty segments, and quoted bracket segments may contain
  `]`, `.`, and backslash escapes.
- `set` creates an object rather than an array for negative or fractional numeric segments,
  and stringifies array path elements before the unsafe-key check so an element such as
  `['__proto__']` cannot bypass it.
- `truncate` with a regular-expression separator cut in the wrong place and ignored
  all but the first match.
- `set` wrote to the root object instead of the correct parent when replacing a
  primitive in the middle of a path (`set({ a: { b: 1 } }, 'a.b.c', 2)` produced
  `{ a: { b: 1 }, b: { c: 2 } }`).
- `hasInPath` threw a `TypeError` when an intermediate value was a primitive.
- `has`, `hasPath`, and `hasInPath` now work on arrays and accept bracket-notation paths.
- `isEqual` treated any two `Map`s or any two `Set`s as equal. It now compares their
  entries (Map keys and Set members deeply, as multisets, in near-linear time for
  typical data), supports typed arrays, and handles circular references, including
  values compared against several cyclic partners at once.
- `throttle` with `trailing: false` dropped a call made after the wait had elapsed but
  before its timer fired.
- `partial` and `partialRight` passed the placeholder symbol itself to the function when
  fewer arguments than placeholders were supplied; unfilled placeholders are now `undefined`,
  and both functions share one `placeholder` symbol.
- `curryRight` applied arguments in the wrong order (`curried(3)(2)(1)` produced
  `[3, 2, 1]` instead of `[1, 2, 3]`).
- `deepClone` overflowed the stack on circular references and turned class instances
  into plain objects. It now preserves prototypes, clones `ArrayBuffer`s, typed arrays, and
  Node `Buffer`s, and keeps an own `"__proto__"` key an own key on the clone.
- `defaultsDeep` mutated nested objects of its input and shared references with its sources.
  It now returns a new object and leaves all inputs untouched.
- `merge` no longer shares object and array references with its sources, and assigns
  non-plain objects such as `Date`, `Map`, and class instances instead of recursing into them.
- `get` returned the default value for a resolved `null`; it now does so only for `undefined`,
  as documented.
- `map` and `mapValues` with a property-name iteratee now read properties of arrays and
  strings too (`map([[1, 2], [3]], 'length')` → `[2, 1]`).
- `intersectionBy` and `differenceBy` compare derived keys with SameValueZero like
  `uniqBy` and `unionBy`, instead of deep equality, and now pass only the element to
  function iteratees (so `parseInt` works as an iteratee).
- `groupBy`, `invert`, `invertBy`, `fromPairs`, `zipObject`, `mapKeys`, `mapValues`, `pick`,
  `omit`, `pickBy`, and `omitBy` store a `"__proto__"` key as an own property instead of
  silently replacing the result's prototype.
- `intersection` no longer performs a linear scan of every other array per element.

### Added

- `words(string, pattern?)` splits a string into words (used by the case converters).
- `deburr(string)` strips diacritics; the case converters deburr their input and drop
  apostrophes so `kebabCase("don't stop")` is `'dont-stop'`.
- ES module build alongside CommonJS, with a conditional `exports` map and per-format
  type declarations. Subpath imports (`super-utils-plus/array`, …) work in both formats.
- `PredicateShorthand`, `ValueIteratee`, `TruncateOptions`, and `MemoizeCache` types.
- Continuous integration on Node 18, 20, and 22, with a packed-tarball smoke test.
- A release workflow publishes to npm with provenance when a `v*` tag is pushed.

### Changed

- Shared path parsing and predicate normalisation live in `src/internal`; the public
  API is unchanged.
- The repository no longer ships committed tarballs, a broken second demo script, or an
  unused Rollup configuration. `npm run demo` runs against the built package.
- Source is formatted with Prettier; `npm run check` runs lint, format check, typecheck,
  and tests with coverage.

## [1.1.0]

Initial tracked release.

[Unreleased]: https://github.com/Dhaxor/super-utils-plus/compare/v2.0.0...HEAD
[2.0.0]: https://github.com/Dhaxor/super-utils-plus/compare/b8e1012...v2.0.0
[1.1.0]: https://github.com/Dhaxor/super-utils-plus/tree/b8e1012
