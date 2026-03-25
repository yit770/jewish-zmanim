# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-06-01

### Added
- Initial release of `jewish-zmanim`
- Jean Meeus solar position algorithm with iterative two-pass refinement
- `Zmanim` class with full halachic time calculations (16+ zmanim)
- `fromCityRow()` static factory for built-in cities
- `fromCoordinates()` static factory with automatic timezone and DST detection
- Built-in city registry: 18 cities across Israel, US, Europe, and Australia
- GRA and Alter Rebbe (MGA) shaah zmanit calculation methods
- Israel-aware defaults for candle lighting (Jerusalem 40 min, Israel 30 min, diaspora 18 min)
- Elevation-adjusted sunrise/sunset calculations
- Shabbat enter/exit times with Unix timestamps
- Dual CJS/ESM distribution via `tsdown`
- Full TypeScript type definitions
- 80+ accuracy tests validated against MyZmanim.com (5–30 second tolerance)
