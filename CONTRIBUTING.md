# Contributing to jewish-zmanim

## Setup

```bash
# Requires Node.js >= 18 and yarn
yarn install
```

## Development Commands

```bash
yarn test           # Run tests in watch mode
yarn test --run     # Run tests once
yarn typecheck      # TypeScript type-check
yarn build          # Type-check + bundle (outputs to dist/)
yarn dev            # Watch mode build
yarn check          # Lint + format check (Biome)
yarn check:fix      # Auto-fix lint + format issues
```

## Pull Requests

1. Fork the repo and create a branch from `main`.
2. Run `yarn test --run` and ensure all tests pass.
3. Add or update tests for any halachic time changes — include reference values from a trusted source (e.g. MyZmanim.com).
4. Run `yarn check:fix` before committing to auto-fix lint/format issues.
5. Update `CHANGELOG.md` under `[Unreleased]`.

## Adding a New City

Edit `src/cities.ts` and add a `CityRow` entry with:
- `latitude`, `longitude` (decimal degrees)
- `country_en`, `city_en`
- `tz_name` (IANA timezone name, e.g. `"America/Chicago"`)
- `elevation` (optional, in meters)

Then add a corresponding fixture in `tests/cityInfos.ts` and accuracy tests in `tests/zmanim.test.ts`.

## Halachic Accuracy

All zmanim calculations are validated against MyZmanim.com with the following tolerances:
- Israeli cities: 10–30 seconds
- Diaspora cities: 5–10 seconds

If you change any solar math, re-validate all existing test cases.

