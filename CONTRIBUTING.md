# Contributing to SuperUtilsPlus

Thanks for your interest in improving SuperUtilsPlus. Bug reports, fixes, new
utilities, and documentation improvements are all welcome.

## Development setup

```bash
git clone https://github.com/dhaxor/super-utils-plus.git
cd super-utils-plus
npm install        # also builds dist/ via the prepare script
npm test
```

Useful scripts:

| Script                  | What it does                                                        |
| ----------------------- | ------------------------------------------------------------------- |
| `npm test`              | Run the Jest test suite                                             |
| `npm run test:coverage` | Run tests and enforce the 80% coverage threshold                    |
| `npm run lint`          | ESLint over `src/`                                                  |
| `npm run format`        | Format the repository with Prettier                                 |
| `npm run typecheck`     | Type-check sources and tests without emitting                       |
| `npm run check`         | Lint, format check, typecheck, and tests with coverage (used by CI) |
| `npm run build`         | Build the CommonJS and ES module outputs into `dist/`               |
| `npm run demo`          | Run `demo.js` against the built package                             |

## Project layout

```
src/
  array/      Array utilities
  object/     Object utilities
  string/     String utilities
  function/   Function utilities (debounce, throttle, curry, …)
  utils/      Type guards, numbers, random values, shared types
  internal/   Private helpers shared between modules (not exported)
scripts/      Build and packaging scripts
```

Each utility lives in its own file with a JSDoc comment whose `@example` block
documents the intended behaviour. Tests live next to the code in `__tests__`
directories and import siblings with a `.js` extension (this is required for the
ES module build; Jest maps the extension back to the TypeScript source).

## Making changes

1. Fork the repository and create a branch from `master`.
2. Add or update tests for anything you change. Bug fixes should include a
   regression test.
3. Keep the public API stable. Behaviour follows the JSDoc examples, with Lodash
   semantics as the tie-breaker where the docs are silent.
4. Run `npm run check` and make sure it passes.
5. Add an entry to the `Unreleased` section of `CHANGELOG.md`.
6. Open a pull request describing the change and why it is needed.

### Adding a new utility

- Create `src/<module>/<name>.ts` and export it from `src/<module>/index.ts`.
- Never write through the keys `__proto__`, `constructor`, or `prototype` when a
  function accepts user-supplied paths or objects; use the guards in
  `src/internal/path.ts`.
- Document the function with a JSDoc block and at least one `@example`.
- Add it to the API index in `README.md`.

## Releasing

Releases are published to npm by the `Release` GitHub Actions workflow when a
version tag is pushed.

1. Update `version` in `package.json` and `package-lock.json`
   (`npm version <x.y.z> --no-git-tag-version`).
2. Move the `Unreleased` entries in `CHANGELOG.md` under a new version heading.
3. Merge those changes to `master` through a pull request with green CI.
4. Tag the merge commit and push the tag:

   ```bash
   git tag -a v2.0.0 -m "v2.0.0"
   git push origin v2.0.0
   ```

The workflow checks that the tag matches `package.json`, runs the full check,
builds, verifies the packed tarball, and publishes with npm provenance. It
authenticates with npm trusted publishing when that is configured for this
repository on npmjs.com, or with an `NPM_TOKEN` repository secret otherwise.

## Reporting bugs

Open an issue with a minimal reproduction, the expected result, and the actual
result. Security-sensitive reports (for example anything that could modify
`Object.prototype`) are very welcome; please mark them clearly.

## License

By contributing, you agree that your contributions will be licensed under the
project's MIT License.
