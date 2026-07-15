import { assert, describe, it } from 'vitest';
import {
  getTimezoneInfo,
  getTimezoneInfoFromName,
  guessTimezoneName,
  resolveTimezone,
} from '../src/timezone';

describe('guessTimezoneName', () => {
  it('returns Asia/Jerusalem for coordinates in Israel', () => {
    const tz = guessTimezoneName(31.7683, 35.2137); // Jerusalem
    assert.equal(tz, 'Asia/Jerusalem');
  });

  it('returns America/New_York for coordinates in US east coast', () => {
    const tz = guessTimezoneName(40.7128, -74.006); // New York
    assert.equal(tz, 'America/New_York');
  });

  it('resolves open-ocean coordinates to a nautical/Etc timezone', () => {
    const tz = guessTimezoneName(0, 0); // Atlantic ocean (Gulf of Guinea)
    assert.equal(tz, 'Etc/GMT');
  });

  it('returns Australia/Sydney for southern-hemisphere coordinates', () => {
    const tz = guessTimezoneName(-33.8688, 151.2093); // Sydney
    assert.equal(tz, 'Australia/Sydney');
  });

  it('propagates a RangeError for out-of-range coordinates', () => {
    assert.throws(() => guessTimezoneName(91, 0), /latitude/i);
    assert.throws(() => guessTimezoneName(0, 999), /longitude/i);
  });
});

describe('getTimezoneInfoFromName', () => {
  it('detects standard time and DST correctly for Asia/Jerusalem', () => {
    const winter = getTimezoneInfoFromName('2026-02-13', 'Asia/Jerusalem');
    assert.equal(winter.offset, 2);
    assert.equal(winter.dst, false);
    assert.equal(winter.dstLabel, 'שעון חורף');

    const summer = getTimezoneInfoFromName('2026-07-15', 'Asia/Jerusalem');
    assert.equal(summer.offset, 3);
    assert.equal(summer.dst, true);
    assert.equal(summer.dstLabel, 'שעון קיץ');
  });

  it('detects standard time and DST correctly for America/New_York', () => {
    const winter = getTimezoneInfoFromName('2026-02-13', 'America/New_York');
    assert.equal(winter.offset, -5);
    assert.equal(winter.dst, false);
    assert.equal(winter.dstLabel, 'Standard Time');

    const summer = getTimezoneInfoFromName('2026-07-15', 'America/New_York');
    assert.equal(summer.offset, -4);
    assert.equal(summer.dst, true);
    assert.equal(summer.dstLabel, 'Summer Time');
  });

  it('detects DST for the southern hemisphere (January is summer)', () => {
    // Australia/Sydney: DST active in January (+11), standard in July (+10).
    // Exercises the Math.min(janOffset, julOffset) standard-offset logic.
    const january = getTimezoneInfoFromName('2026-01-15', 'Australia/Sydney');
    assert.equal(january.offset, 11);
    assert.equal(january.dst, true);
    assert.equal(january.dstLabel, 'Summer Time');

    const july = getTimezoneInfoFromName('2026-07-15', 'Australia/Sydney');
    assert.equal(july.offset, 10);
    assert.equal(july.dst, false);
    assert.equal(july.dstLabel, 'Standard Time');
  });

  it('reports no DST year-round for a fixed-offset zone (Asia/Kolkata)', () => {
    // India never observes DST and sits at a half-hour offset.
    for (const dateStr of ['2026-01-15', '2026-07-15']) {
      const info = getTimezoneInfoFromName(dateStr, 'Asia/Kolkata');
      assert.equal(info.offset, 5.5);
      assert.equal(info.dst, false);
      assert.equal(info.dstLabel, 'Standard Time');
    }
  });
});

describe('resolveTimezone', () => {
  it('resolves timezone from coordinates when timezoneName is omitted', () => {
    const info = resolveTimezone(31.7683, 35.2137, '2026-02-13');
    assert.equal(info.timezoneName, 'Asia/Jerusalem');
    assert.equal(info.offset, 2);
    assert.equal(info.dst, false);
  });

  it('uses explicit timezoneName even if coordinates map elsewhere', () => {
    const info = resolveTimezone(31.7683, 35.2137, '2026-02-13', 'America/New_York');
    assert.equal(info.timezoneName, 'America/New_York');
    assert.equal(info.offset, -5);
  });

  it('still resolves open-ocean coordinates (geo-tz covers the globe)', () => {
    const info = resolveTimezone(0, 0, '2026-02-13'); // Atlantic ocean
    assert.equal(info.timezoneName, 'Etc/GMT');
    assert.equal(info.offset, 0);
  });
});

describe('getTimezoneInfo (legacy helper)', () => {
  it('returns correct offset and dst for Asia/Jerusalem winter vs summer', () => {
    const winter = getTimezoneInfo('2026-02-13', 'Asia/Jerusalem');
    assert.equal(winter.offset, 2);
    assert.equal(winter.dst, false);

    const summer = getTimezoneInfo('2026-07-15', 'Asia/Jerusalem');
    assert.equal(summer.offset, 3);
    assert.equal(summer.dst, true);
  });

  it('returns correct offset and dst for America/New_York winter vs summer', () => {
    const winter = getTimezoneInfo('2026-02-13', 'America/New_York');
    assert.equal(winter.offset, -5);
    assert.equal(winter.dst, false);

    const summer = getTimezoneInfo('2026-07-15', 'America/New_York');
    assert.equal(summer.offset, -4);
    assert.equal(summer.dst, true);
  });
});
