import { assert, describe, it } from 'vitest';
import { type CityRow, Zmanim } from '../src/index';
import { CITY_INFOS } from './cityInfos';

const {
  jerusalemWinter,
  jerusalemSummer,
  telAvivSummer,
  newYorkInfo,
  jerusalemElev,
  safedElev,
  brooklynInfo,
  parisInfo,
  beitShemeshInfo,
  modiinInfo,
  maalehAdumimInfo,
  haifaInfo,
  londonInfo,
  melbourneInfo,
  miamiInfo,
  beerShevaInfo,
  eilatInfo,
  sarcellesInfo,
  kiryatMalachiInfo,
} = CITY_INFOS;

function timeToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

describe('Zmanim - static methods', () => {
  it('isJerusalem - returns true for Jerusalem', () => {
    const row: CityRow = {
      latitude: 31.77,
      longitude: 35.21,
      country_en: 'Israel',
      city_en: 'Jerusalem',
    };
    assert.equal(Zmanim.isJerusalem(row), true);
  });

  it('isJerusalem - returns true for ירושלים', () => {
    const row: CityRow = {
      latitude: 31.77,
      longitude: 35.21,
      country_en: 'ישראל',
      city_en: 'ירושלים',
    };
    assert.equal(Zmanim.isJerusalem(row), true);
  });

  it('isJerusalem - returns false for Tel Aviv', () => {
    const row: CityRow = {
      latitude: 32.08,
      longitude: 34.78,
      country_en: 'Israel',
      city_en: 'Tel Aviv',
    };
    assert.equal(Zmanim.isJerusalem(row), false);
  });

  it('isHaifa - returns true for haifa', () => {
    const row: CityRow = {
      latitude: 32.79,
      longitude: 34.99,
      country_en: 'Israel',
      city_en: 'haifa',
    };
    assert.equal(Zmanim.isHaifa(row), true);
  });

  it('isIsrael - returns true for Israel', () => {
    const row: CityRow = { latitude: 32, longitude: 35, country_en: 'Israel' };
    assert.equal(Zmanim.isIsrael(row), true);
  });

  it('isIsrael - returns false for US', () => {
    const row: CityRow = { latitude: 40, longitude: -74, country_en: 'United States' };
    assert.equal(Zmanim.isIsrael(row), false);
  });
});

describe('Zmanim - getCityInfoByRow', () => {
  it('sets min=40 for Jerusalem', () => {
    const row: CityRow = {
      latitude: 31.77,
      longitude: 35.21,
      country_en: 'Israel',
      city_en: 'Jerusalem',
    };
    const info = Zmanim.getCityInfoByRow(row, new Date('2024-06-15'));
    assert.equal(info.min, 40);
  });

  it('sets min=30 for Haifa', () => {
    const row: CityRow = {
      latitude: 32.79,
      longitude: 34.99,
      country_en: 'Israel',
      city_en: 'haifa',
    };
    const info = Zmanim.getCityInfoByRow(row, new Date('2024-06-15'));
    assert.equal(info.min, 30);
  });

  it('sets min=30 for other Israeli cities', () => {
    const row: CityRow = {
      latitude: 32.08,
      longitude: 34.78,
      country_en: 'Israel',
      city_en: 'Tel Aviv',
    };
    const info = Zmanim.getCityInfoByRow(row, new Date('2024-06-15'));
    assert.equal(info.min, 30);
  });

  it('sets min=18 for non-Israeli cities', () => {
    const row: CityRow = {
      latitude: 40.71,
      longitude: -74.0,
      country_en: 'United States',
      tz_name: 'America/New_York',
    };
    const info = Zmanim.getCityInfoByRow(row, new Date('2024-06-15'));
    assert.equal(info.min, 18);
  });
});

describe('Zmanim - time calculations', () => {
  it('Jerusalem winter - sunrise around 6:00-7:30, sunset around 16:30-17:30', () => {
    const t = new Zmanim(jerusalemWinter, new Date('2024-01-15')).getTimes();
    const sunrise = timeToMinutes(t.netzHachama);
    const sunset = timeToMinutes(t.shkiah);

    assert.ok(sunrise > 6 * 60, `sunrise ${t.netzHachama} should be after 6:00`);
    assert.ok(sunrise < 7 * 60 + 30, `sunrise ${t.netzHachama} should be before 7:30`);
    assert.ok(sunset > 16 * 60 + 30, `sunset ${t.shkiah} should be after 16:30`);
    assert.ok(sunset < 17 * 60 + 30, `sunset ${t.shkiah} should be before 17:30`);
  });

  it('Jerusalem summer - sunrise around 5:00-6:00, sunset around 19:00-20:30', () => {
    const t = new Zmanim(jerusalemSummer, new Date('2024-06-21')).getTimes();
    const sunrise = timeToMinutes(t.netzHachama);
    const sunset = timeToMinutes(t.shkiah);

    assert.ok(sunrise > 5 * 60, `sunrise ${t.netzHachama} should be after 5:00`);
    assert.ok(sunrise < 6 * 60, `sunrise ${t.netzHachama} should be before 6:00`);
    assert.ok(sunset > 19 * 60, `sunset ${t.shkiah} should be after 19:00`);
    assert.ok(sunset < 20 * 60 + 30, `sunset ${t.shkiah} should be before 20:30`);
  });

  it('time order is correct: alot < tefillin < sunrise < shema < tefila < chatzos < minchaGedola < plagHamincha < shkiah < shkiahElevated < tzes', () => {
    const t = new Zmanim(jerusalemElev, new Date('2024-03-20')).getTimes();

    const order = [
      { name: 'alosHashachar', val: timeToMinutes(t.alosHashachar) },
      { name: 'tefillin', val: timeToMinutes(t.tefillin) },
      { name: 'netzHachama', val: timeToMinutes(t.netzHachama) },
      { name: 'kriasShema', val: timeToMinutes(t.kriasShema) },
      { name: 'tefila', val: timeToMinutes(t.tefila) },
      { name: 'chatzos', val: timeToMinutes(t.chatzos) },
      { name: 'minchaGedola', val: timeToMinutes(t.minchaGedola) },
      { name: 'plagHamincha', val: timeToMinutes(t.plagHamincha) },
      { name: 'shkiah', val: timeToMinutes(t.shkiah) },
      { name: 'shkiahElevated', val: timeToMinutes(t.shkiahElevated) },
      { name: 'tzesHakochavim', val: timeToMinutes(t.tzesHakochavim) },
    ];

    for (let i = 1; i < order.length; i++) {
      assert.ok(
        order[i].val > order[i - 1].val,
        `${order[i].name} (${order[i].val}) should be after ${order[i - 1].name} (${order[i - 1].val})`
      );
    }
  });

  it('shabbat enter is afternoon, shabbat exit is after enter', () => {
    const t = new Zmanim(jerusalemWinter, new Date('2024-03-20')).getTimes();
    const shabbosEnter = timeToMinutes(t.shabbosEnter);
    const shabbosExit = timeToMinutes(t.shabbosExit);

    assert.ok(shabbosEnter > 15 * 60, 'shabbat enter should be after 15:00');
    assert.ok(shabbosEnter < 20 * 60, 'shabbat enter should be before 20:00');
    assert.ok(shabbosExit > shabbosEnter, 'shabbat exit should be after enter');
  });
});

describe('Zmanim - New York', () => {
  it('NY winter - reasonable sunrise/sunset', () => {
    const t = new Zmanim(newYorkInfo, new Date('2024-01-15')).getTimes();
    const sunrise = timeToMinutes(t.netzHachama);
    const sunset = timeToMinutes(t.shkiah);

    assert.ok(sunrise > 6 * 60 + 30, `NY sunrise ${t.netzHachama} should be after 6:30`);
    assert.ok(sunrise < 8 * 60, `NY sunrise ${t.netzHachama} should be before 8:00`);
    assert.ok(sunset > 16 * 60, `NY sunset ${t.shkiah} should be after 16:00`);
    assert.ok(sunset < 17 * 60 + 30, `NY sunset ${t.shkiah} should be before 17:30`);
  });
});

describe('Zmanim - getTimes', () => {
  it('returns ZmanimTimes with all required fields', () => {
    const times = new Zmanim(jerusalemWinter, new Date('2024-03-20')).getTimes();

    assert.ok(typeof times.alosHashachar === 'string');
    assert.ok(typeof times.tefillin === 'string');
    assert.ok(typeof times.netzHachama === 'string');
    assert.ok(typeof times.kriasShema === 'string');
    assert.ok(typeof times.tefila === 'string');
    assert.ok(typeof times.chatzos === 'string');
    assert.ok(typeof times.minchaGedola === 'string');
    assert.ok(typeof times.plagHamincha === 'string');
    assert.ok(typeof times.shkiah === 'string');
    assert.ok(typeof times.shkiahElevated === 'string');
    assert.ok(typeof times.tzesHakochavim === 'string');
    assert.ok(typeof times.shabbosEnter === 'string');
    assert.ok(typeof times.shabbosExit === 'string');
    assert.ok(typeof times.DST === 'boolean');
    assert.ok(typeof times.date === 'string');
  });
});

describe('Zmanim - Tel Aviv vs Jerusalem', () => {
  it('Tel Aviv sunrise is slightly later than Jerusalem (west)', () => {
    const jlm = new Zmanim(jerusalemSummer, new Date('2024-06-15')).getTimes();
    const tlv = new Zmanim(telAvivSummer, new Date('2024-06-15')).getTimes();

    const jlmSunrise = timeToMinutes(jlm.netzHachama);
    const tlvSunrise = timeToMinutes(tlv.netzHachama);

    assert.ok(
      tlvSunrise >= jlmSunrise,
      `TLV sunrise (${tlv.netzHachama}) should be >= JLM sunrise (${jlm.netzHachama})`
    );
  });
});

function timeToSeconds(t: string): number {
  const p = t.split(':').map(Number);
  return p[0] * 3600 + p[1] * 60 + (p[2] || 0);
}

function assertWithinSeconds(actual: string, expected: string, maxDiff: number, label: string) {
  const d = Math.abs(timeToSeconds(actual) - timeToSeconds(expected));
  assert.ok(d <= maxDiff, `${label}: ${actual} vs ${expected} (diff ${d}s, max ${maxDiff}s)`);
}

describe('Zmanim - accuracy vs MyZmanim (Jerusalem Feb 8 2026)', () => {
  const t = new Zmanim(jerusalemElev, new Date('2026-02-08')).getTimes();
  const T = 30; // tolerance in seconds

  it('alos within 30s', () => assertWithinSeconds(t.alosHashachar, '5:13:45', T, 'alos'));
  it('tefillin within 30s', () => assertWithinSeconds(t.tefillin, '5:35:40', T, 'tefillin'));
  it('sunrise within 30s', () => assertWithinSeconds(t.netzHachama, '6:27:36', T, 'sunrise'));
  it('shema within 30s', () => assertWithinSeconds(t.kriasShema, '9:10:32', T, 'shema'));
  it('tefila within 30s', () => assertWithinSeconds(t.tefila, '10:04:51', T, 'tefila'));
  it('chatzot within 30s', () => assertWithinSeconds(t.chatzos, '11:53:28', T, 'chatzot'));
  it('mincha gedola within 30s', () =>
    assertWithinSeconds(t.minchaGedola, '12:23:28', T, 'minchaG'));
  it('plag within 30s', () => assertWithinSeconds(t.plagHamincha, '16:11:27', T, 'plag'));
  it('sunset within 30s', () => assertWithinSeconds(t.shkiah, '17:19:21', T, 'sunset'));
  it('tzeis within 30s', () => assertWithinSeconds(t.tzesHakochavim, '17:56:54', T, 'tzeis'));
});

describe('Zmanim - accuracy vs MyZmanim (Safed Feb 13 2026)', () => {
  const t = new Zmanim(safedElev, new Date('2026-02-13')).getTimes();
  const T = 30;

  it('alos within 30s', () => assertWithinSeconds(t.alosHashachar, '5:09:26', T, 'alos'));
  it('tefillin within 30s', () => assertWithinSeconds(t.tefillin, '5:31:32', T, 'tefillin'));
  it('sunrise within 30s', () => assertWithinSeconds(t.netzHachama, '6:23:44', T, 'sunrise'));
  it('shema within 30s', () => assertWithinSeconds(t.kriasShema, '9:08:04', T, 'shema'));
  it('chatzot within 30s', () => assertWithinSeconds(t.chatzos, '11:52:24', T, 'chatzot'));
  it('sunset within 30s', () => assertWithinSeconds(t.shkiah, '17:21:04', T, 'sunset'));
  it('tzeis within 30s', () => assertWithinSeconds(t.tzesHakochavim, '17:58:47', T, 'tzeis'));
  it('candle lighting within 30s', () =>
    assertWithinSeconds(t.shabbosEnter, '16:55:20', T, 'candles'));
});

describe('Zmanim - accuracy vs MyZmanim (Brooklyn Feb 8 2026)', () => {
  const t = new Zmanim(brooklynInfo, new Date('2026-02-08')).getTimes();
  const T = 5; // Brooklyn is extremely precise — 5s tolerance

  it('alos within 5s', () => assertWithinSeconds(t.alosHashachar, '5:35:32', T, 'alos'));
  it('tefillin within 5s', () => assertWithinSeconds(t.tefillin, '6:06:59', T, 'tefillin'));
  it('sunrise within 5s', () => assertWithinSeconds(t.netzHachama, '6:58:07', T, 'sunrise'));
  it('shema (Gra/Tanya) within 5s', () => assertWithinSeconds(t.kriasShema, '9:34:10', T, 'shema'));
  it('tefila (Gra/Tanya) within 5s', () => assertWithinSeconds(t.tefila, '10:26:11', T, 'tefila'));
  it('chatzot within 5s', () => assertWithinSeconds(t.chatzos, '12:10:13', T, 'chatzot'));
  it('mincha gedola within 5s', () =>
    assertWithinSeconds(t.minchaGedola, '12:40:13', T, 'minchaG'));
  it('plag (Gra/Tanya) within 5s', () =>
    assertWithinSeconds(t.plagHamincha, '16:17:17', T, 'plag'));
  it('sunset within 5s', () => assertWithinSeconds(t.shkiah, '17:22:18', T, 'sunset'));
  it('tzeis within 5s', () => assertWithinSeconds(t.tzesHakochavim, '18:04:19', T, 'tzeis'));
});

describe('Zmanim - accuracy vs MyZmanim (Brooklyn Feb 13 2026 Shabbat)', () => {
  const t = new Zmanim(brooklynInfo, new Date('2026-02-13')).getTimes();
  const T = 5;

  it('alos within 5s', () => assertWithinSeconds(t.alosHashachar, '5:30:08', T, 'alos'));
  it('tefillin within 5s', () => assertWithinSeconds(t.tefillin, '6:01:25', T, 'tefillin'));
  it('sunrise within 5s', () => assertWithinSeconds(t.netzHachama, '6:52:04', T, 'sunrise'));
  it('shema (Gra/Tanya) within 5s', () => assertWithinSeconds(t.kriasShema, '9:31:09', T, 'shema'));
  it('chatzot within 5s', () => assertWithinSeconds(t.chatzos, '12:10:14', T, 'chatzot'));
  it('plag (Gra/Tanya) within 5s', () =>
    assertWithinSeconds(t.plagHamincha, '16:22:06', T, 'plag'));
  it('sunset within 5s', () => assertWithinSeconds(t.shkiah, '17:28:24', T, 'sunset'));
  it('tzeis within 5s', () => assertWithinSeconds(t.tzesHakochavim, '18:10:00', T, 'tzeis'));
  it('candle lighting within 5s', () =>
    assertWithinSeconds(t.shabbosEnter, '17:10:24', T, 'candles'));
});

describe('Zmanim - accuracy vs MyZmanim (Paris Feb 8 2026)', () => {
  const t = new Zmanim(parisInfo, new Date('2026-02-08')).getTimes();
  const T = 10;

  it('alos within 10s', () => assertWithinSeconds(t.alosHashachar, '6:34:55', T, 'alos'));
  it('tefillin within 10s', () => assertWithinSeconds(t.tefillin, '7:11:07', T, 'tefillin'));
  it('sunrise within 10s', () => assertWithinSeconds(t.netzHachama, '8:10:35', T, 'sunrise'));
  it('shema (Gra/Tanya) within 10s', () =>
    assertWithinSeconds(t.kriasShema, '10:37:51', T, 'shema'));
  it('chatzot within 10s', () => assertWithinSeconds(t.chatzos, '13:05:08', T, 'chatzot'));
  it('sunset within 10s', () => assertWithinSeconds(t.shkiah, '17:59:42', T, 'sunset'));
  it('tzeis within 10s', () => assertWithinSeconds(t.tzesHakochavim, '18:48:39', T, 'tzeis'));
});

describe('Zmanim - accuracy vs MyZmanim (Paris Feb 13 2026 Shabbat)', () => {
  const t = new Zmanim(parisInfo, new Date('2026-02-13')).getTimes();
  const T = 10;

  it('alos', () => assertWithinSeconds(t.alosHashachar, '6:27:39', T, 'alos'));
  it('tefillin', () => assertWithinSeconds(t.tefillin, '7:03:40', T, 'tefillin'));
  it('sunrise', () => assertWithinSeconds(t.netzHachama, '8:02:25', T, 'sunrise'));
  it('shema', () => assertWithinSeconds(t.kriasShema, '10:33:48', T, 'shema'));
  it('chatzot', () => assertWithinSeconds(t.chatzos, '13:05:11', T, 'chatzot'));
  it('sunset', () => assertWithinSeconds(t.shkiah, '18:07:58', T, 'sunset'));
  it('tzeis', () => assertWithinSeconds(t.tzesHakochavim, '18:56:18', T, 'tzeis'));
  it('candle lighting', () => assertWithinSeconds(t.shabbosEnter, '17:49:58', T, 'candles'));
});

// Beit Shemesh (elevation 205m, tz 2, Israel, min 40)
describe('Zmanim - accuracy vs MyZmanim (Beit Shemesh Feb 8 2026)', () => {
  const t = new Zmanim(beitShemeshInfo, new Date('2026-02-08')).getTimes();
  const T = 10;

  it('alos', () => assertWithinSeconds(t.alosHashachar, '5:14:38', T, 'alos'));
  it('tefillin', () => assertWithinSeconds(t.tefillin, '5:36:33', T, 'tefillin'));
  it('sunrise', () => assertWithinSeconds(t.netzHachama, '6:28:19', T, 'sunrise'));
  it('shema', () => assertWithinSeconds(t.kriasShema, '9:11:20', T, 'shema'));
  it('chatzot', () => assertWithinSeconds(t.chatzos, '11:54:22', T, 'chatzot'));
  it('sunset', () => assertWithinSeconds(t.shkiah, '17:20:27', T, 'sunset'));
  it('tzeis', () => assertWithinSeconds(t.tzesHakochavim, '17:57:50', T, 'tzeis'));
});

describe('Zmanim - accuracy vs MyZmanim (Beit Shemesh Feb 13 2026 Shabbat)', () => {
  const t = new Zmanim(beitShemeshInfo, new Date('2026-02-13')).getTimes();
  const T = 10;

  it('alos', () => assertWithinSeconds(t.alosHashachar, '5:10:53', T, 'alos'));
  it('tefillin', () => assertWithinSeconds(t.tefillin, '5:32:41', T, 'tefillin'));
  it('sunrise', () => assertWithinSeconds(t.netzHachama, '6:24:03', T, 'sunrise'));
  it('chatzot', () => assertWithinSeconds(t.chatzos, '11:54:25', T, 'chatzot'));
  it('sunset', () => assertWithinSeconds(t.shkiah, '17:24:47', T, 'sunset'));
  it('tzeis', () => assertWithinSeconds(t.tzesHakochavim, '18:01:52', T, 'tzeis'));
  it('candle lighting', () => assertWithinSeconds(t.shabbosEnter, '16:47:18', 15, 'candles'));
});

// Modiin (sea level, tz 2, Israel, min 30)
describe('Zmanim - accuracy vs MyZmanim (Modiin Feb 8 2026)', () => {
  const t = new Zmanim(modiinInfo, new Date('2026-02-08')).getTimes();
  const T = 5;

  it('alos', () => assertWithinSeconds(t.alosHashachar, '5:14:38', T, 'alos'));
  it('tefillin', () => assertWithinSeconds(t.tefillin, '5:36:35', T, 'tefillin'));
  it('sunrise', () => assertWithinSeconds(t.netzHachama, '6:28:22', T, 'sunrise'));
  it('shema', () => assertWithinSeconds(t.kriasShema, '9:11:19', T, 'shema'));
  it('chatzot', () => assertWithinSeconds(t.chatzos, '11:54:17', T, 'chatzot'));
  it('sunset', () => assertWithinSeconds(t.shkiah, '17:20:13', T, 'sunset'));
  it('tzeis', () => assertWithinSeconds(t.tzesHakochavim, '17:57:35', T, 'tzeis'));
});

describe('Zmanim - accuracy vs MyZmanim (Modiin Feb 13 2026 Shabbat)', () => {
  const t = new Zmanim(modiinInfo, new Date('2026-02-13')).getTimes();
  const T = 5;

  it('alos', () => assertWithinSeconds(t.alosHashachar, '5:10:52', T, 'alos'));
  it('sunrise', () => assertWithinSeconds(t.netzHachama, '6:24:04', T, 'sunrise'));
  it('chatzot', () => assertWithinSeconds(t.chatzos, '11:54:19', T, 'chatzot'));
  it('sunset', () => assertWithinSeconds(t.shkiah, '17:24:36', T, 'sunset'));
  it('tzeis', () => assertWithinSeconds(t.tzesHakochavim, '18:01:40', T, 'tzeis'));
  it('candle lighting', () => assertWithinSeconds(t.shabbosEnter, '16:54:36', T, 'candles'));
});

// Maaleh Adumim (sea level, tz 2, Israel, min 30, tefillin 11°)
describe('Zmanim - accuracy vs MyZmanim (Maaleh Adumim Feb 8 2026)', () => {
  const t = new Zmanim(maalehAdumimInfo, new Date('2026-02-08')).getTimes();
  const T = 5;

  it('alos', () => assertWithinSeconds(t.alosHashachar, '5:13:25', T, 'alos'));
  it('tefillin (11°)', () => assertWithinSeconds(t.tefillin, '5:37:44', T, 'tefillin'));
  it('sunrise', () => assertWithinSeconds(t.netzHachama, '6:27:03', T, 'sunrise'));
  it('shema', () => assertWithinSeconds(t.kriasShema, '9:10:05', T, 'shema'));
  it('chatzot', () => assertWithinSeconds(t.chatzos, '11:53:08', T, 'chatzot'));
  it('sunset', () => assertWithinSeconds(t.shkiah, '17:19:14', T, 'sunset'));
  it('tzeis', () => assertWithinSeconds(t.tzesHakochavim, '17:56:33', T, 'tzeis'));
});

describe('Zmanim - accuracy vs MyZmanim (Maaleh Adumim Feb 13 2026 Shabbat)', () => {
  const t = new Zmanim(maalehAdumimInfo, new Date('2026-02-13')).getTimes();
  const T = 5;

  it('alos', () => assertWithinSeconds(t.alosHashachar, '5:09:39', T, 'alos'));
  it('tefillin (11°)', () => assertWithinSeconds(t.tefillin, '5:33:51', T, 'tefillin'));
  it('sunrise', () => assertWithinSeconds(t.netzHachama, '6:22:47', T, 'sunrise'));
  it('chatzot', () => assertWithinSeconds(t.chatzos, '11:53:11', T, 'chatzot'));
  it('sunset', () => assertWithinSeconds(t.shkiah, '17:23:35', T, 'sunset'));
  it('tzeis', () => assertWithinSeconds(t.tzesHakochavim, '18:00:36', T, 'tzeis'));
  it('candle lighting', () => assertWithinSeconds(t.shabbosEnter, '16:53:35', T, 'candles'));
});

// Haifa (sea level, tz 2, Israel, min 30)
describe('Zmanim - accuracy vs MyZmanim (Haifa Feb 8 2026)', () => {
  const t = new Zmanim(haifaInfo, new Date('2026-02-08')).getTimes();
  const T = 10;

  it('alos', () => assertWithinSeconds(t.alosHashachar, '5:15:24', T, 'alos'));
  it('tefillin', () => assertWithinSeconds(t.tefillin, '5:37:34', T, 'tefillin'));
  it('sunrise', () => assertWithinSeconds(t.netzHachama, '6:29:54', T, 'sunrise'));
  it('shema', () => assertWithinSeconds(t.kriasShema, '9:12:10', T, 'shema'));
  it('chatzot', () => assertWithinSeconds(t.chatzos, '11:54:27', T, 'chatzot'));
  it('sunset', () => assertWithinSeconds(t.shkiah, '17:19:00', T, 'sunset'));
  it('tzeis', () => assertWithinSeconds(t.tzesHakochavim, '17:56:46', T, 'tzeis'));
});

describe('Zmanim - accuracy vs MyZmanim (Haifa Feb 13 2026 Shabbat)', () => {
  const t = new Zmanim(haifaInfo, new Date('2026-02-13')).getTimes();
  const T = 10;

  it('alos', () => assertWithinSeconds(t.alosHashachar, '5:11:28', T, 'alos'));
  it('sunrise', () => assertWithinSeconds(t.netzHachama, '6:25:26', T, 'sunrise'));
  it('chatzot', () => assertWithinSeconds(t.chatzos, '11:54:29', T, 'chatzot'));
  it('sunset', () => assertWithinSeconds(t.shkiah, '17:23:32', T, 'sunset'));
  it('tzeis', () => assertWithinSeconds(t.tzesHakochavim, '18:01:00', T, 'tzeis'));
  it('candle lighting', () => assertWithinSeconds(t.shabbosEnter, '16:53:32', T, 'candles'));
});

// London (sea level, tz 0, min 18)
describe('Zmanim - accuracy vs MyZmanim (London Feb 8 2026)', () => {
  const t = new Zmanim(londonInfo, new Date('2026-02-08')).getTimes();
  const T = 10;

  it('alos', () => assertWithinSeconds(t.alosHashachar, '5:45:56', T, 'alos'));
  it('tefillin', () => assertWithinSeconds(t.tefillin, '6:24:10', T, 'tefillin'));
  it('sunrise', () => assertWithinSeconds(t.netzHachama, '7:27:15', T, 'sunrise'));
  it('shema', () => assertWithinSeconds(t.kriasShema, '9:51:06', T, 'shema'));
  it('chatzot', () => assertWithinSeconds(t.chatzos, '12:14:58', T, 'chatzot'));
  it('sunset', () => assertWithinSeconds(t.shkiah, '17:02:41', T, 'sunset'));
  it('tzeis', () => assertWithinSeconds(t.tzesHakochavim, '17:54:40', T, 'tzeis'));
});

// Melbourne (sea level, tz 11 AEDT, min 18, Southern Hemisphere)
describe('Zmanim - accuracy vs MyZmanim (Melbourne Feb 9 2026)', () => {
  const t = new Zmanim(melbourneInfo, new Date('2026-02-09')).getTimes();
  const T = 10;

  it('alos', () => assertWithinSeconds(t.alosHashachar, '5:15:44', T, 'alos'));
  it('tefillin', () => assertWithinSeconds(t.tefillin, '5:50:38', T, 'tefillin'));
  it('sunrise', () => assertWithinSeconds(t.netzHachama, '6:42:31', T, 'sunrise'));
  it('shema', () => assertWithinSeconds(t.kriasShema, '10:08:15', T, 'shema'));
  it('chatzot', () => assertWithinSeconds(t.chatzos, '13:33:59', T, 'chatzot'));
  it('plag', () => assertWithinSeconds(t.plagHamincha, '18:59:43', T, 'plag'));
  it('sunset', () => assertWithinSeconds(t.shkiah, '20:25:27', T, 'sunset'));
  it('tzeis', () => assertWithinSeconds(t.tzesHakochavim, '21:07:31', T, 'tzeis'));
});

describe('Zmanim - accuracy vs MyZmanim (Melbourne Feb 13 2026 Shabbat)', () => {
  const t = new Zmanim(melbourneInfo, new Date('2026-02-13')).getTimes();
  const T = 10;

  it('alos', () => assertWithinSeconds(t.alosHashachar, '5:21:34', T, 'alos'));
  it('sunrise', () => assertWithinSeconds(t.netzHachama, '6:47:00', T, 'sunrise'));
  it('chatzot', () => assertWithinSeconds(t.chatzos, '13:33:59', T, 'chatzot'));
  it('sunset', () => assertWithinSeconds(t.shkiah, '20:20:59', T, 'sunset'));
  it('tzeis', () => assertWithinSeconds(t.tzesHakochavim, '21:02:32', T, 'tzeis'));
  it('candle lighting', () => assertWithinSeconds(t.shabbosEnter, '20:02:59', T, 'candles'));
});

// Miami (sea level, tz -5, min 18)
describe('Zmanim - accuracy vs MyZmanim (Miami Feb 8 2026)', () => {
  const t = new Zmanim(miamiInfo, new Date('2026-02-08')).getTimes();
  const T = 5;

  it('alos', () => assertWithinSeconds(t.alosHashachar, '5:51:05', T, 'alos'));
  it('tefillin', () => assertWithinSeconds(t.tefillin, '6:17:43', T, 'tefillin'));
  it('sunrise', () => assertWithinSeconds(t.netzHachama, '7:00:36', T, 'sunrise'));
  it('shema', () => assertWithinSeconds(t.kriasShema, '9:47:50', T, 'shema'));
  it('chatzot', () => assertWithinSeconds(t.chatzos, '12:35:05', T, 'chatzot'));
  it('plag', () => assertWithinSeconds(t.plagHamincha, '16:59:52', T, 'plag'));
  it('sunset', () => assertWithinSeconds(t.shkiah, '18:09:34', T, 'sunset'));
  it('tzeis', () => assertWithinSeconds(t.tzesHakochavim, '18:44:43', T, 'tzeis'));
});

describe('Zmanim - accuracy vs MyZmanim (Miami Feb 13 2026 Shabbat)', () => {
  const t = new Zmanim(miamiInfo, new Date('2026-02-13')).getTimes();
  const T = 5;

  it('alos', () => assertWithinSeconds(t.alosHashachar, '5:48:13', T, 'alos'));
  it('sunrise', () => assertWithinSeconds(t.netzHachama, '6:57:16', T, 'sunrise'));
  it('chatzot', () => assertWithinSeconds(t.chatzos, '12:35:06', T, 'chatzot'));
  it('sunset', () => assertWithinSeconds(t.shkiah, '18:12:56', T, 'sunset'));
  it('tzeis', () => assertWithinSeconds(t.tzesHakochavim, '18:47:49', T, 'tzeis'));
  it('candle lighting', () => assertWithinSeconds(t.shabbosEnter, '17:54:56', T, 'candles'));
});

// Beer Sheva (sea level, tz 2, Israel, min 20)
describe('Zmanim - accuracy vs MyZmanim (Beer Sheva Feb 8 2026)', () => {
  const t = new Zmanim(beerShevaInfo, new Date('2026-02-08')).getTimes();
  const T = 5;

  it('alos', () => assertWithinSeconds(t.alosHashachar, '5:15:06', T, 'alos'));
  it('tefillin', () => assertWithinSeconds(t.tefillin, '5:36:54', T, 'tefillin'));
  it('sunrise', () => assertWithinSeconds(t.netzHachama, '6:28:19', T, 'sunrise'));
  it('shema', () => assertWithinSeconds(t.kriasShema, '9:11:44', T, 'shema'));
  it('chatzot', () => assertWithinSeconds(t.chatzos, '11:55:09', T, 'chatzot'));
  it('sunset', () => assertWithinSeconds(t.shkiah, '17:22:01', T, 'sunset'));
  it('tzeis', () => assertWithinSeconds(t.tzesHakochavim, '17:59:07', T, 'tzeis'));
});

describe('Zmanim - accuracy vs MyZmanim (Beer Sheva Feb 13 2026 Shabbat)', () => {
  const t = new Zmanim(beerShevaInfo, new Date('2026-02-13')).getTimes();
  const T = 5;

  it('alos', () => assertWithinSeconds(t.alosHashachar, '5:11:25', T, 'alos'));
  it('sunrise', () => assertWithinSeconds(t.netzHachama, '6:24:08', T, 'sunrise'));
  it('chatzot', () => assertWithinSeconds(t.chatzos, '11:55:12', T, 'chatzot'));
  it('sunset', () => assertWithinSeconds(t.shkiah, '17:26:16', T, 'sunset'));
  it('tzeis', () => assertWithinSeconds(t.tzesHakochavim, '18:03:05', T, 'tzeis'));
  it('candle lighting (20 min)', () =>
    assertWithinSeconds(t.shabbosEnter, '17:06:16', T, 'candles'));
});

// Eilat (sea level, tz 2, Israel, min 30)
describe('Zmanim - accuracy vs MyZmanim (Eilat Feb 8 2026)', () => {
  const t = new Zmanim(eilatInfo, new Date('2026-02-08')).getTimes();
  const T = 5;

  it('alos', () => assertWithinSeconds(t.alosHashachar, '5:13:19', T, 'alos'));
  it('tefillin', () => assertWithinSeconds(t.tefillin, '5:34:46', T, 'tefillin'));
  it('sunrise', () => assertWithinSeconds(t.netzHachama, '6:25:17', T, 'sunrise'));
  it('shema', () => assertWithinSeconds(t.kriasShema, '9:09:53', T, 'shema'));
  it('chatzot', () => assertWithinSeconds(t.chatzos, '11:54:30', T, 'chatzot'));
  it('sunset', () => assertWithinSeconds(t.shkiah, '17:23:44', T, 'sunset'));
  it('tzeis', () => assertWithinSeconds(t.tzesHakochavim, '18:00:11', T, 'tzeis'));
});

describe('Zmanim - accuracy vs MyZmanim (Eilat Feb 13 2026 Shabbat)', () => {
  const t = new Zmanim(eilatInfo, new Date('2026-02-13')).getTimes();
  const T = 5;

  it('alos', () => assertWithinSeconds(t.alosHashachar, '5:09:54', T, 'alos'));
  it('sunrise', () => assertWithinSeconds(t.netzHachama, '6:21:23', T, 'sunrise'));
  it('chatzot', () => assertWithinSeconds(t.chatzos, '11:54:33', T, 'chatzot'));
  it('sunset', () => assertWithinSeconds(t.shkiah, '17:27:43', T, 'sunset'));
  it('tzeis', () => assertWithinSeconds(t.tzesHakochavim, '18:03:53', T, 'tzeis'));
  it('candle lighting', () => assertWithinSeconds(t.shabbosEnter, '16:57:43', T, 'candles'));
});

// Sarcelles (sea level, tz 1, min 18)
describe('Zmanim - accuracy vs MyZmanim (Sarcelles Feb 8 2026)', () => {
  const t = new Zmanim(sarcellesInfo, new Date('2026-02-08')).getTimes();
  const T = 10;

  it('alos', () => assertWithinSeconds(t.alosHashachar, '6:34:47', T, 'alos'));
  it('tefillin', () => assertWithinSeconds(t.tefillin, '7:11:05', T, 'tefillin'));
  it('sunrise', () => assertWithinSeconds(t.netzHachama, '8:10:43', T, 'sunrise'));
  it('chatzot', () => assertWithinSeconds(t.chatzos, '13:04:56', T, 'chatzot'));
  it('sunset', () => assertWithinSeconds(t.shkiah, '17:59:10', T, 'sunset'));
  it('tzeis', () => assertWithinSeconds(t.tzesHakochavim, '18:48:16', T, 'tzeis'));
});

describe('Zmanim - accuracy vs MyZmanim (Sarcelles Feb 13 2026 Shabbat)', () => {
  const t = new Zmanim(sarcellesInfo, new Date('2026-02-13')).getTimes();
  const T = 10;

  it('alos', () => assertWithinSeconds(t.alosHashachar, '6:27:29', T, 'alos'));
  it('sunrise', () => assertWithinSeconds(t.netzHachama, '8:02:30', T, 'sunrise'));
  it('chatzot', () => assertWithinSeconds(t.chatzos, '13:04:59', T, 'chatzot'));
  it('sunset', () => assertWithinSeconds(t.shkiah, '18:07:29', T, 'sunset'));
  it('tzeis', () => assertWithinSeconds(t.tzesHakochavim, '18:55:57', T, 'tzeis'));
  it('candle lighting', () => assertWithinSeconds(t.shabbosEnter, '17:49:29', T, 'candles'));
});

// Kiryat Malachi (sea level, tz 2, Israel, min 30)
describe('Zmanim - accuracy vs MyZmanim (Kiryat Malachi Feb 13 2026 Shabbat)', () => {
  const t = new Zmanim(kiryatMalachiInfo, new Date('2026-02-13')).getTimes();
  const T = 5;

  it('alos 16.1°', () => assertWithinSeconds(t.alosHashachar, '5:11:50', T, 'alos'));
  it('misheyakir 11.5°', () => assertWithinSeconds(t.tefillin, '5:33:38', T, 'tefillin'));
  it('sunrise', () => assertWithinSeconds(t.netzHachama, '6:24:55', T, 'sunrise'));
  it('shema GRA', () => assertWithinSeconds(t.kriasShema, '9:10:09', T, 'shemaGra'));
  it('shema AR 72', () => assertWithinSeconds(t.sofZmanShemaMGA, '8:34:09', T, 'shemaAR'));
  it('tefila GRA', () => assertWithinSeconds(t.tefila, '10:05:13', T, 'tefilaGra'));
  it('chatzot', () => assertWithinSeconds(t.chatzos, '11:55:23', T, 'chatzot'));
  it('plag', () => assertWithinSeconds(t.plagHamincha, '16:17:00', T, 'plag'));
  it('sunset', () => assertWithinSeconds(t.shkiah, '17:25:51', T, 'sunset'));
  it('candle lighting 30 min', () => assertWithinSeconds(t.shabbosEnter, '16:55:51', T, 'candles'));
  it('tzeis RT 72', () => assertWithinSeconds(t.tzeisRT, '18:37:51', T, 'tzeisRT'));
});

describe('Zmanim - constructor without date', () => {
  it('uses current date when no date is passed', () => {
    const z = new Zmanim(jerusalemWinter);
    assert.ok(z instanceof Zmanim);
    const t = z.getTimes();
    assert.ok(typeof t.netzHachama === 'string');
  });
});

describe('Zmanim - timezone 13 wraps to -11', () => {
  it('handles timezone=13 (Samoa/Tonga area) by converting to -11', () => {
    // tz=13 is treated as -11 internally to handle wrap-around
    const samoaInfo: CityInfo = {
      latitude: -13.8,
      longitude: -172.1,
      country: 'Samoa',
      city: 'Apia',
      timezone: 13,
      dst: false,
      min: 18,
    };
    const z = new Zmanim(samoaInfo, new Date('2024-06-15'));
    const t = z.getTimes();
    assert.ok(typeof t.netzHachama === 'string');
  });
});

describe('Zmanim - isHaifa Hebrew', () => {
  it('returns true for Hebrew חיפה / ישראל', () => {
    const row: CityRow = {
      latitude: 32.79,
      longitude: 34.99,
      country_en: 'ישראל',
      city_en: 'חיפה',
    };
    assert.equal(Zmanim.isHaifa(row), true);
  });
});

describe('Zmanim - fromCoordinates non-Israel', () => {
  it('succeeds and sets country to empty string for non-Israel coordinates', () => {
    const z = Zmanim.fromCoordinates(40.71, -74.0, new Date('2024-06-15'), {
      timezoneName: 'America/New_York',
    });
    assert.ok(z instanceof Zmanim);
    const t = z.getTimes();
    assert.ok(typeof t.netzHachama === 'string');
  });
});

describe('Zmanim - fromCityRow fallback timezone name', () => {
  it('uses city_en as timezone name when no tz_name and non-Israel country', () => {
    // Triggers getTimezoneName fallback: no tz_name, not Israel → city_en || ''
    const row: CityRow = {
      latitude: 40.71,
      longitude: -74.0,
      country_en: 'United States',
      // no tz_name, no city_en → returns ''
    };
    // getTimezoneInfo('', '') will throw → caught, offset=0, dst=false
    const z = Zmanim.fromCityRow(row, new Date('2024-06-15'));
    assert.ok(z instanceof Zmanim);
  });
});

describe('Zmanim - fromCoordinates validation', () => {
  it('throws RangeError for latitude > 90', () => {
    assert.throws(() => Zmanim.fromCoordinates(91, 35, new Date('2024-06-15')), RangeError);
  });

  it('throws RangeError for latitude < -90', () => {
    assert.throws(() => Zmanim.fromCoordinates(-91, 35, new Date('2024-06-15')), RangeError);
  });

  it('throws RangeError for longitude > 180', () => {
    assert.throws(() => Zmanim.fromCoordinates(31, 181, new Date('2024-06-15')), RangeError);
  });

  it('throws RangeError for longitude < -180', () => {
    assert.throws(() => Zmanim.fromCoordinates(31, -181, new Date('2024-06-15')), RangeError);
  });

  it('throws TypeError for invalid date', () => {
    assert.throws(() => Zmanim.fromCoordinates(31, 35, new Date('not-a-date')), TypeError);
  });

  it('throws RangeError for negative elevation', () => {
    assert.throws(
      () => Zmanim.fromCoordinates(31, 35, new Date('2024-06-15'), { elevation: -1 }),
      RangeError
    );
  });
});

describe('Zmanim - Chabad accuracy (Brooklyn Feb 13 2026)', () => {
  const t = new Zmanim(brooklynInfo, new Date('2026-02-13')).getTimes();
  const T = 5;

  it('shema GRA', () => assertWithinSeconds(t.kriasShema, '9:31:10', T, 'shemaGra'));
  it('shema AR', () => assertWithinSeconds(t.sofZmanShemaMGA, '8:55:10', T, 'shemaAR'));
  it('tefila GRA', () => assertWithinSeconds(t.tefila, '10:24:11', T, 'tefilaGra'));
  it('chatzot', () => assertWithinSeconds(t.chatzos, '12:10:14', T, 'chatzot'));
  it('plag', () => assertWithinSeconds(t.plagHamincha, '16:22:04', T, 'plag'));
  it('tzeis RT 72', () => assertWithinSeconds(t.tzeisRT, '18:40:21', T, 'tzeisRT'));
});

describe('Zmanim - Chabad accuracy (Jerusalem Feb 8 2026)', () => {
  const t = new Zmanim(jerusalemElev, new Date('2026-02-08')).getTimes();
  const T = 30;

  it('shema GRA', () => assertWithinSeconds(t.kriasShema, '9:10:32', T, 'shemaGra'));
  it('shema AR', () => assertWithinSeconds(t.sofZmanShemaMGA, '8:34:32', T, 'shemaAR'));
  it('tefila GRA', () => assertWithinSeconds(t.tefila, '10:04:51', T, 'tefilaGra'));
  it('chatzot', () => assertWithinSeconds(t.chatzos, '11:53:28', T, 'chatzot'));
  it('plag', () => assertWithinSeconds(t.plagHamincha, '16:11:27', T, 'plag'));
  it('tzeis RT 72', () => assertWithinSeconds(t.tzeisRT, '18:35:38', T, 'tzeisRT'));
});

describe('Zmanim - Chabad accuracy (London Feb 13 2026)', () => {
  const t = new Zmanim(londonInfo, new Date('2026-02-13')).getTimes();
  const T = 10;

  it('misheyakir 10.2°', () => assertWithinSeconds(t.tefillin, '6:16:00', T, 'tefillin'));
  it('shema GRA', () => assertWithinSeconds(t.kriasShema, '9:46:39', T, 'shemaGra'));
  it('shema AR', () => assertWithinSeconds(t.sofZmanShemaMGA, '9:10:39', T, 'shemaAR'));
  it('tefila GRA', () => assertWithinSeconds(t.tefila, '10:36:07', T, 'tefilaGra'));
  it('chatzot', () => assertWithinSeconds(t.chatzos, '12:15:03', T, 'chatzot'));
  it('plag', () => assertWithinSeconds(t.plagHamincha, '16:10:01', T, 'plag'));
  // London test uses min=18 (londonInfo), MyZmanim ref used min=15
  it('candle lighting 18 min', () => assertWithinSeconds(t.shabbosEnter, '16:53:55', T, 'candles'));
  it('tzeis RT 72', () => assertWithinSeconds(t.tzeisRT, '18:23:52', T, 'tzeisRT'));
});

describe('Zmanim - Chabad accuracy (Melbourne Feb 13 2026)', () => {
  const t = new Zmanim(melbourneInfo, new Date('2026-02-13')).getTimes();
  const T = 10;

  it('shema GRA', () => assertWithinSeconds(t.kriasShema, '10:10:29', T, 'shemaGra'));
  it('shema AR', () => assertWithinSeconds(t.sofZmanShemaMGA, '9:34:29', T, 'shemaAR'));
  it('tefila GRA', () => assertWithinSeconds(t.tefila, '11:18:19', T, 'tefilaGra'));
  it('chatzot', () => assertWithinSeconds(t.chatzos, '13:33:59', T, 'chatzot'));
  it('mincha gedola', () => assertWithinSeconds(t.minchaGedola, '14:07:54', T, 'minchaG'));
  it('plag', () => assertWithinSeconds(t.plagHamincha, '18:56:11', T, 'plag'));
  it('tzeis RT 72', () => assertWithinSeconds(t.tzeisRT, '21:32:59', T, 'tzeisRT'));
});

describe('Zmanim.fromCoordinates', () => {
  it('creates Zmanim with Jerusalem candle minutes = 40', () => {
    const z = Zmanim.fromCoordinates(31.78, 35.22, new Date('2026-02-13'));
    // biome-ignore lint/suspicious/noExplicitAny: accessing private field for test
    const internal = z as any;
    assert.equal(internal.shabatmin, 40);
    assert.equal(z.timezoneInfo.timezoneName, 'Asia/Jerusalem');
  });

  it('creates Zmanim with non-Jerusalem Israel candle minutes = 30', () => {
    const z = Zmanim.fromCoordinates(32.08, 34.78, new Date('2026-02-13'));
    // biome-ignore lint/suspicious/noExplicitAny: accessing private field for test
    const internal = z as any;
    assert.equal(internal.shabatmin, 30);
  });

  it('honors custom candleMinutes and tefillinDeg and matches direct CityInfo', () => {
    const date = new Date('2026-02-08');
    const tFrom = Zmanim.fromCoordinates(
      maalehAdumimInfo.latitude,
      maalehAdumimInfo.longitude,
      date,
      { candleMinutes: 30, tefillinDeg: 11 }
    ).getTimes();
    const tDirect = new Zmanim(maalehAdumimInfo, date).getTimes();

    assert.equal(tFrom.tefillin, tDirect.tefillin);
    assert.equal(tFrom.netzHachama, tDirect.netzHachama);
  });
});

describe('Zmanim.fromCityRow', () => {
  it('produces same result as getCityInfoByRow + constructor', () => {
    const row: CityRow = {
      latitude: 31.77,
      longitude: 35.21,
      country_en: 'Israel',
      city_en: 'Jerusalem',
    };
    const date = new Date('2026-02-13');

    const tFromRow = Zmanim.fromCityRow(row, date).getTimes();
    const tDirect = new Zmanim(Zmanim.getCityInfoByRow(row, date), date).getTimes();

    assert.equal(tFromRow.netzHachama, tDirect.netzHachama);
    assert.equal(tFromRow.shabbosEnter, tDirect.shabbosEnter);
  });
});

describe('Zmanim.getCityInfoByRow - error fallback', () => {
  it('falls back to timezone=0,dst=false on invalid timezone', () => {
    const row: CityRow = {
      latitude: 10,
      longitude: 20,
      country_en: 'Nowhere',
      city_en: 'Nowhere',
      tz_name: 'Invalid/Zone',
    };
    const info = Zmanim.getCityInfoByRow(row, new Date('2026-02-13'));
    assert.equal(info.timezone, 0);
    assert.equal(info.dst, false);
    assert.equal(info.min, 18);
  });
});
