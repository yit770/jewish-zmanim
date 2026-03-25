import type { CityInfo } from '../src/interfaces';

export const CITY_INFOS: Record<string, CityInfo> = {
  // Jerusalem city info - winter (IST = UTC+2)
  jerusalemWinter: {
    latitude: 31.7683,
    longitude: 35.2137,
    country: 'Israel',
    city: 'Jerusalem',
    timezone: 2,
    dst: false,
    min: 40,
  },

  // Jerusalem city info - summer (IDT = UTC+3)
  jerusalemSummer: {
    latitude: 31.7683,
    longitude: 35.2137,
    country: 'Israel',
    city: 'Jerusalem',
    timezone: 3,
    dst: true,
    min: 40,
  },

  // Tel Aviv city info - summer
  telAvivSummer: {
    latitude: 32.0853,
    longitude: 34.7818,
    country: 'Israel',
    city: 'Tel Aviv',
    timezone: 3,
    dst: true,
    min: 23,
  },

  // New York city info
  newYorkInfo: {
    latitude: 40.7128,
    longitude: -74.006,
    country: 'United States',
    city: 'New York',
    timezone: -5,
    dst: false,
    min: 18,
  },

  // Accuracy tests vs MyZmanim – elevated Jerusalem & Safed
  jerusalemElev: {
    latitude: 31.7683,
    longitude: 35.2137,
    country: 'Israel',
    city: 'Jerusalem',
    timezone: 2,
    dst: false,
    min: 40,
    elevation: 650,
  },
  safedElev: {
    latitude: 32.9646,
    longitude: 35.496,
    country: 'Israel',
    city: 'Safed',
    timezone: 2,
    dst: false,
    min: 30,
    elevation: 570,
  },

  // Brooklyn
  brooklynInfo: {
    latitude: 40.6782,
    longitude: -73.9442,
    country: 'United States',
    city: 'Brooklyn',
    timezone: -5,
    dst: false,
    min: 18,
    elevation: 0,
  },

  // Paris
  parisInfo: {
    latitude: 48.8566,
    longitude: 2.3522,
    country: 'France',
    city: 'Paris',
    timezone: 1,
    dst: false,
    min: 18,
    elevation: 0,
  },

  // Beit Shemesh (elevation 205m, tz 2, Israel, min 40)
  beitShemeshInfo: {
    latitude: 31.7514,
    longitude: 34.9886,
    country: 'Israel',
    city: 'Beit Shemesh',
    timezone: 2,
    dst: false,
    min: 40,
    elevation: 205,
  },

  // Modiin (sea level, tz 2, Israel, min 30)
  modiinInfo: {
    latitude: 31.8978,
    longitude: 35.0104,
    country: 'Israel',
    city: 'Modiin',
    timezone: 2,
    dst: false,
    min: 30,
    elevation: 0,
  },

  // Maaleh Adumim (sea level, tz 2, Israel, min 30, tefillin 11°)
  maalehAdumimInfo: {
    latitude: 31.7771,
    longitude: 35.3088,
    country: 'Israel',
    city: 'Maaleh Adumim',
    timezone: 2,
    dst: false,
    min: 30,
    elevation: 0,
    tefillinDeg: 11,
  },

  // Haifa (sea level, tz 2, Israel, min 30)
  haifaInfo: {
    latitude: 32.794,
    longitude: 34.9896,
    country: 'Israel',
    city: 'Haifa',
    timezone: 2,
    dst: false,
    min: 30,
    elevation: 0,
  },

  // London (sea level, tz 0, min 18)
  londonInfo: {
    latitude: 51.5074,
    longitude: -0.1278,
    country: 'United Kingdom',
    city: 'London',
    timezone: 0,
    dst: false,
    min: 18,
    elevation: 0,
  },

  // Melbourne (sea level, tz 11 AEDT, min 18, Southern Hemisphere)
  melbourneInfo: {
    latitude: -37.8136,
    longitude: 144.9631,
    country: 'Australia',
    city: 'Melbourne',
    timezone: 11,
    dst: true,
    min: 18,
    elevation: 0,
  },

  // Miami (sea level, tz -5, min 18)
  miamiInfo: {
    latitude: 25.7617,
    longitude: -80.1918,
    country: 'United States',
    city: 'Miami',
    timezone: -5,
    dst: false,
    min: 18,
    elevation: 0,
  },

  // Beer Sheva (sea level, tz 2, Israel, min 20)
  beerShevaInfo: {
    latitude: 31.2518,
    longitude: 34.7913,
    country: 'Israel',
    city: 'Beer Sheva',
    timezone: 2,
    dst: false,
    min: 20,
    elevation: 0,
  },

  // Eilat (sea level, tz 2, Israel, min 30)
  eilatInfo: {
    latitude: 29.5577,
    longitude: 34.9519,
    country: 'Israel',
    city: 'Eilat',
    timezone: 2,
    dst: false,
    min: 30,
    elevation: 0,
  },

  // Sarcelles (sea level, tz 1, min 18)
  sarcellesInfo: {
    latitude: 48.9955,
    longitude: 2.3808,
    country: 'France',
    city: 'Sarcelles',
    timezone: 1,
    dst: false,
    min: 18,
    elevation: 0,
  },

  // Kiryat Malachi (sea level, tz 2, Israel, min 30)
  kiryatMalachiInfo: {
    latitude: 31.7326,
    longitude: 34.7449,
    country: 'Israel',
    city: 'Kiryat Malachi',
    timezone: 2,
    dst: false,
    min: 30,
    elevation: 0,
  },

  // Utility test city with timezone 13
  tz13City: {
    latitude: 0,
    longitude: 0,
    country: '',
    city: '',
    timezone: 13,
    dst: false,
    min: 18,
  },
};
