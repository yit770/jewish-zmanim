import type { CityRow } from './interfaces';

export const cities: Record<string, Record<string, CityRow>> = {
  israel: {
    jerusalem: {
      city_en: 'Jerusalem',
      latitude: 31.7683,
      longitude: 35.2137,
      country_en: 'Israel',
      elevation: 650,
    },
    telAviv: { city_en: 'Tel Aviv', latitude: 32.0853, longitude: 34.7818, country_en: 'Israel' },
    haifa: { city_en: 'haifa', latitude: 32.794, longitude: 34.9896, country_en: 'Israel' },
    safed: {
      city_en: 'Safed',
      latitude: 32.9646,
      longitude: 35.496,
      country_en: 'Israel',
      elevation: 570,
    },
    beitShemesh: {
      city_en: 'Beit Shemesh',
      latitude: 31.7514,
      longitude: 34.9886,
      country_en: 'Israel',
      elevation: 205,
    },
    modiin: {
      city_en: 'Modiin',
      latitude: 31.8978,
      longitude: 35.0104,
      country_en: 'Israel',
      elevation: 300,
    },
    maalehAdumim: {
      city_en: 'Maaleh Adumim',
      latitude: 31.7771,
      longitude: 35.3088,
      country_en: 'Israel',
      elevation: 430,
    },
    beerSheva: {
      city_en: 'Beer Sheva',
      latitude: 31.2518,
      longitude: 34.7913,
      country_en: 'Israel',
    },
    eilat: { city_en: 'Eilat', latitude: 29.5577, longitude: 34.9519, country_en: 'Israel' },
    kiryatMalachi: {
      city_en: 'Kiryat Malachi',
      latitude: 31.7326,
      longitude: 34.7449,
      country_en: 'Israel',
    },
  },
  unitedStates: {
    newYork: {
      city_en: 'New York',
      latitude: 40.7128,
      longitude: -74.006,
      country_en: 'United States',
      tz_name: 'America/New_York',
    },
    brooklyn: {
      city_en: 'Brooklyn',
      latitude: 40.6782,
      longitude: -73.9442,
      country_en: 'United States',
      tz_name: 'America/New_York',
    },
    miami: {
      city_en: 'Miami',
      latitude: 25.7617,
      longitude: -80.1918,
      country_en: 'United States',
      tz_name: 'America/New_York',
    },
  },
  france: {
    paris: {
      city_en: 'Paris',
      latitude: 48.8566,
      longitude: 2.3522,
      country_en: 'France',
      tz_name: 'Europe/Paris',
    },
    sarcelles: {
      city_en: 'Sarcelles',
      latitude: 48.9955,
      longitude: 2.3808,
      country_en: 'France',
      tz_name: 'Europe/Paris',
    },
  },
  unitedKingdom: {
    london: {
      city_en: 'London',
      latitude: 51.5074,
      longitude: -0.1278,
      country_en: 'United Kingdom',
      tz_name: 'Europe/London',
    },
  },
  australia: {
    melbourne: {
      city_en: 'Melbourne',
      latitude: -37.8136,
      longitude: 144.9631,
      country_en: 'Australia',
      tz_name: 'Australia/Melbourne',
    },
  },
};
