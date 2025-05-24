# Contributing to SuperUtilsPlus

We love your input! We want to make contributing to SuperUtilsPlus as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## Development Process

We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

### Pull Requests

1. Fork the repo and create your branch from `main`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code lints.
6. Issue that pull request!

### Development Setup

1. Fork and clone the repository
2. Install dependencies: `npm install`
3. Run tests: `npm test`
4. Build the library: `npm run build`

### Code Structure

- `/src`: Source code
  - `/array`: Array utility functions
  - `/object`: Object utility functions
  - `/string`: String utility functions
  - `/function`: Function utility functions
  - `/utils`: General utility functions

### Coding Style

- TypeScript for type safety
- Jest for testing
- ESLint for linting
- Prettier for code formatting

Run `npm run lint` to check your code style and `npm run format` to automatically format your code.

## Testing

We have a robust test suite using Jest. Please add tests for any new features or bug fixes.

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage
```

## Documentation

Please update the documentation when adding or modifying features. Documentation is written in Markdown.

## License

By contributing, you agree that your contributions will be licensed under the project's MIT License.