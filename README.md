# Zmanim – Halachic Times Library

A comprehensive TypeScript library for calculating Jewish halachic times.

---

## Overview

### What's Included

| # | Feature | Description | Key Method |
|---|---------|-------------|------------|
| 1 | **Zmanim** | All halachic times – dawn, sunrise, Shema, Tefila, Chatzot, Mincha, Plag, Tzeis, Rabbenu Tam. Jean Meeus algorithm with elevation support | `getTimes()` |


### Accuracy & Verification

| Metric | Value |
|--------|-------|
| Solar algorithm | Jean Meeus (solar position with iterative refinement) |
| Tested cities | 17 cities across 6 countries, both hemispheres |


### Table of Contents

| | Section | What It Covers |
|---|---------|----------------|
| | [Quick Start](#quick-start) | Basic zmanim usage with built-in cities |
| 1 | [Auto Timezone](#1-auto-timezone--fromcoordinates) | Coordinates → timezone + DST |
| | [Project Structure](#project-structure) | Source files overview |
| | [CityInfo Configuration](#cityinfo-configuration) | Location setup |
| | [API Reference](#api-reference) | Full method tables |

## Installation

```bash
npm install zmanim
```
Or

```bash
yarn add zmanim
```

## Quick Start

The library ships with a built-in `cities` registry. Use it to get a typed `CityRow` and resolve it to a full `CityInfo`:

```typescript
import { Zmanim, cities } from 'zmanim';

const date = new Date('2026-02-08');

// Use the convenience factory:
const z = Zmanim.fromCityRow(cities.israel.jerusalem, date);

const t = z.getTimes();
console.log(t.alosHashachar);     // "5:13:47"  Dawn (16.1°)
console.log(t.tefillin);          // "5:35:42"  Misheyakir (11.5°)
console.log(t.netzHachama);       // "6:27:24"  Sunrise
console.log(t.sofZmanShemaMGA);   // "8:xx:xx"  Latest Shema (Magen Avraham)
console.log(t.kriasShema);        // "9:10:27"  Latest Shema (GRA & Baal HaTanya)
console.log(t.tefila);            // "10:xx:xx" Latest Tefila (GRA & Baal HaTanya)
console.log(t.chatzos);           // "11:53:31" Midday
console.log(t.minchaGedola);      // "12:23:31" Earliest Mincha
console.log(t.plagHamincha);      // "16:11:40" Plag HaMincha
console.log(t.shkiah);            // "17:19:38" Sunset
console.log(t.shkiahElevated);    // "17:23:xx" Sunset (observer elevation)
console.log(t.tzesHakochavim);    // "17:56:56" Nightfall (8.5°)
console.log(t.tzeisRT);           // "18:31:xx" Rabbenu Tam (72 min)
console.log(t.shabbosEnter);      // "16:48:xx" Candle lighting (40 min)
console.log(t.shabbosExit);       // "18:01:xx" Havdalah
```

### Available Cities

```typescript
cities.israel.jerusalem
cities.israel.telAviv
cities.israel.haifa
cities.israel.safed
cities.israel.beitShemesh
cities.israel.modiin
cities.israel.maalehAdumim
cities.israel.beerSheva
cities.israel.eilat
cities.israel.kiryatMalachi

cities.unitedStates.newYork
cities.unitedStates.brooklyn
cities.unitedStates.miami

cities.france.paris
cities.france.sarcelles

cities.unitedKingdom.london

cities.australia.melbourne
```

## 1. Auto Timezone – `fromCoordinates()`

Create a Zmanim instance from **coordinates only** – timezone and DST are detected automatically.

```typescript
import { Zmanim } from 'zmanim';

// Just lat/lng + date – that's it!
const z = Zmanim.fromCoordinates(29.5577, 34.9519, new Date('2026-02-13'));

console.log(z.timezoneInfo.timezoneName); // "Asia/Jerusalem"
console.log(z.timezoneInfo.offset);       // 2 (IST)
console.log(z.timezoneInfo.dst);          // false
console.log(z.timezoneInfo.dstLabel);     // "Winter"

// Summer – DST auto-detected:
const summer = Zmanim.fromCoordinates(29.5577, 34.9519, new Date('2026-07-15'));
console.log(summer.timezoneInfo.offset);   // 3 (IDT)
console.log(summer.timezoneInfo.dstLabel); // "Summer"

// Works worldwide:
const ny = Zmanim.fromCoordinates(40.6782, -73.9442, new Date('2026-02-13'));
console.log(ny.timezoneInfo.timezoneName); // "America/New_York"
console.log(ny.timezoneInfo.offset);       // -5 (EST)

// Override timezone if needed:
const custom = Zmanim.fromCoordinates(29.5577, 34.9519, new Date('2026-02-13'), {
  timezoneName: 'Europe/London',
  elevation: 100,
  candleMinutes: 18,
});
```

**Options:**
- `timezoneName` – IANA timezone override (auto-detected if omitted)
- `elevation` – meters above sea level (default 0)
- `candleMinutes` – candle lighting minutes (auto: Jerusalem 40, Israel 30, diaspora 18)
- `tefillinDeg` – degrees below horizon for tefillin

**Supported regions** (auto-detection): Israel, US, Canada, UK, France, Germany, Italy, Spain, Greece, Poland, Hungary, Nordics, Baltics, Russia, Turkey, Australia, South Africa, UAE, India, China, Japan, Brazil, Argentina, Morocco.

## Project Structure

```
src/
├── index.ts           # Re-exports Zmanim class, cities, and interfaces
├── zmanim.ts          # Main Zmanim class with all methods
├── interfaces.ts      # TypeScript interfaces (CityInfo, ZmanimTimes, etc.)
├── cities.ts          # Built-in city registry (cities.israel.jerusalem, etc.)
├── timezone.ts        # Auto timezone from coordinates, DST detection
└── solar.ts           # Solar position calculations (Meeus)
```

## CityInfo Configuration

```typescript
interface CityInfo {
  latitude: number;      // Decimal degrees (positive = North)
  longitude: number;     // Decimal degrees (positive = East)
  country: string;       // "Israel" enables Israel-specific defaults
  city: string;          // City name
  timezone: number;      // Effective UTC offset (including DST if active)
  dst: boolean;          // Is DST currently active?
  min: number;           // Candle lighting minutes before sunset
  elevation?: number;    // Meters above sea level (default: 0)
  tefillinDeg?: number;  // Degrees below horizon for misheyakir
  timezoneName?: string; // IANA timezone name (e.g. "Asia/Jerusalem")
}
```

**Candle lighting defaults:**
- Jerusalem: 40 minutes
- Haifa / other Israeli cities: 30 minutes
- Diaspora: 18 minutes

**Tefillin degrees defaults:**
- Israel: 11.5°
- Diaspora: 10.2°

## API Reference

### Static Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `Zmanim.fromCoordinates(lat, lng, date, opts?)` | `Zmanim & { timezoneInfo }` | Auto timezone + DST from coordinates |
| `Zmanim.fromCityRow(row, date)` | `Zmanim` | Convenience factory from a `CityRow` |
| `Zmanim.isJerusalem(row)` | `boolean` | Check if CityRow is Jerusalem |
| `Zmanim.isHaifa(row)` | `boolean` | Check if CityRow is Haifa |
| `Zmanim.isIsrael(row)` | `boolean` | Check if CityRow is in Israel |

### Instance Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `getTimes()` | `ZmanimTimes` | All standard halachic times, fully typed |

### `ZmanimTimes` Fields

| Field | Type | Description |
|-------|------|-------------|
| `alosHashachar` | `string` | Dawn (16.1°) |
| `tefillin` | `string` | Misheyakir – earliest tefillin (11.5° Israel / 10.2° diaspora) |
| `netzHachama` | `string` | Sunrise |
| `sofZmanShemaMGA` | `string` | Latest Shema (Magen Avraham) |
| `kriasShema` | `string` | Latest Shema (GRA & Baal HaTanya) |
| `tefila` | `string` | Latest Tefila (GRA & Baal HaTanya) |
| `chatzos` | `string` | Midday |
| `minchaGedola` | `string` | Earliest Mincha |
| `plagHamincha` | `string` | Plag HaMincha |
| `shkiah` | `string` | Sunset (flat horizon) |
| `shkiahElevated` | `string` | Sunset at observer elevation (= `shkiah` when elevation is 0) |
| `tzesHakochavim` | `string` | Nightfall (8.5°) |
| `tzeisRT` | `string` | Rabbenu Tam – nightfall (elevated sunset + 72 min) |
| `shabbosEnter` | `string` | Candle lighting |
| `shabbosEnterUnix` | `number` | Candle lighting as Unix timestamp |
| `shabbosExit` | `string` | Havdalah |
| `shabbosExitUnix` | `number` | Havdalah as Unix timestamp |
| `DST` | `boolean` | Is DST active |
| `date` | `string` | Date string (YYYY-MM-DD HH:MM:SS) |

### Exported Types

| Type | Description |
|------|-------------|
| `CityInfo` | Location configuration for Zmanim constructor |
| `CityRow` | Raw city row data (for `fromCityRow`) |
| `ZmanimTimes` | Return type of `getTimes()` |
| `CoordinateOptions` | Options for `fromCoordinates()` |
| `TimezoneResult` | Timezone info returned by `fromCoordinates()` |
| `cities` | Built-in city registry |

## Testing

```bash
yarn test
```
## Credits

Credit to Yitzhak Cohen for his great work, without him this would not be possible. 

## License

MIT

