# Jewish Zmanim

A TypeScript library for calculating the daily halachic times (זמנים) that a Jewish app needs — alos hashachar, netz, sof zman krias shema and tefila, chatzos, mincha gedola, plag hamincha, shkiah, tzeis hakochavim, Rabbeinu Tam, and Shabbos candle-lighting / havdalah.

Built for Jewish developers who want accurate zmanim,computes the shaah zmanis in both the GRA and the Alter Rebbe / Magen Avraham shitos, and applies the right minhag defaults out of the box — 40 minutes candle-lighting in Yerushalayim, 30 minutes elsewhere in Eretz Yisrael, 18 minutes in chutz la'aretz, and the correct misheyakir degree for Israel vs. the diaspora.

Give it a built-in city or just GPS coordinates and it resolves the timezone and DST for you.

## Installation

```bash
npm install jewish-zmanim
# or
yarn add jewish-zmanim
```

## Usage

### From a built-in city

```typescript
import { Zmanim, cities } from 'jewish-zmanim';

const date = new Date('2026-02-08');
const z = Zmanim.fromCityRow(cities.israel.jerusalem, date);

const t = z.getTimes();
console.log(t.netzHachama);    // "6:27:37"  Sunrise (netz)
console.log(t.kriasShema);     // "9:10:33"  Latest Shema (GRA / Baal HaTanya)
console.log(t.chatzos);        // "11:53:31" Midday
console.log(t.shkiah);         // "17:19:25" Sunset (shkiah)
console.log(t.tzesHakochavim); // "17:56:56" Nightfall (8.5°)
console.log(t.shabbosEnter);   // "16:47:58" Candle lighting (40 min in Yerushalayim)
```

### From GPS coordinates

Pass only latitude, longitude, and a date — the IANA timezone and DST are detected automatically:

```typescript
import { Zmanim } from 'jewish-zmanim';

const z = Zmanim.fromCoordinates(31.7683, 35.2137, new Date('2026-07-15'));

console.log(z.timezoneInfo.timezoneName); // "Asia/Jerusalem"
console.log(z.timezoneInfo.offset);       // 3 (IDT — DST auto-detected)
console.log(z.timezoneInfo.dst);          // true

const t = z.getTimes();
console.log(t.netzHachama);  // Sunrise
console.log(t.shkiah);       // Sunset
```

Optionally override the timezone or tune the calculation:

```typescript
Zmanim.fromCoordinates(31.7683, 35.2137, new Date('2026-02-08'), {
  timezoneName: 'Asia/Jerusalem', // IANA override (otherwise auto-detected)
  elevation: 800,                 // meters above sea level
  candleMinutes: 40,              // candle-lighting minutes before shkiah
  tefillinDeg: 11.5,              // misheyakir sun depression in degrees
});
```

## Available cities

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

or use any GPS coordinates

## API

| Method | Returns | Description |
|--------|---------|-------------|
| `Zmanim.fromCityRow(row, date)` | `Zmanim` | Build from a built-in `cities.*` entry |
| `Zmanim.fromCoordinates(lat, lng, date, opts?)` | `Zmanim & { timezoneInfo }` | Auto timezone + DST from coordinates |
| `z.getTimes()` | `ZmanimTimes` | All halachic times for the day, fully typed |

### `ZmanimTimes` fields

`alosHashachar`, `tefillin` (misheyakir), `netzHachama` (sunrise), `sofZmanShemaMGA`, `kriasShema`, `tefila`, `chatzos`, `minchaGedola`, `plagHamincha`, `shkiah`, `shkiahElevated`, `tzesHakochavim`, `tzeisRT` (Rabbeinu Tam), `shabbosEnter` / `shabbosEnterUnix`, `shabbosExit` / `shabbosExitUnix`, `DST`, `date`.

Times are returned as `"H:MM:SS"` strings in the location's local time; the `*Unix` fields are epoch seconds.

## Development

```bash
yarn test --run   # run the test suite (269 tests, 17 cities across 6 countries)
yarn typecheck    # type-check
yarn build        # bundle to dist/ (dual CJS + ESM)
```

## Credits

Credit to Yitzhak Cohen for his great work, without him this would not be possible.

## License

MIT
