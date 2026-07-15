// ═══════════════════════════════════════════════════════════════════════════
// Automatic Timezone Resolution from Coordinates
// Uses geo-tz (IANA boundary polygons) for lookup + Intl API for DST-aware
// offset calculation. geo-tz is regenerated with every tzdata release, so the
// coordinate → timezone mapping stays current without any manual maintenance.
// ═══════════════════════════════════════════════════════════════════════════

import { find as findTimezones } from 'geo-tz';
import type { TimezoneResult } from './interfaces';

/**
 * Resolve the IANA timezone name for a latitude/longitude using geo-tz's
 * polygon boundaries (accurate worldwide, including across DST borders).
 * Returns null only if the coordinates fall outside every known zone.
 */
export function guessTimezoneName(lat: number, lng: number): string | null {
  const zones = findTimezones(lat, lng);
  return zones.length > 0 ? zones[0] : null;
}

/**
 * Get timezone info for a given date and IANA timezone name.
 * Uses Intl API for accurate DST detection.
 */
export function getTimezoneInfoFromName(dateStr: string, timezoneName: string): TimezoneResult {
  const date = new Date(`${dateStr}T12:00:00Z`); // noon UTC to avoid date boundary issues

  // Calculate UTC offset for the given date
  const utcStr = date.toLocaleString('en-US', { timeZone: 'UTC' });
  const tzStr = date.toLocaleString('en-US', { timeZone: timezoneName });
  const utcDate = new Date(utcStr);
  const tzDate = new Date(tzStr);
  const offset = (tzDate.getTime() - utcDate.getTime()) / (1000 * 60 * 60);

  // Calculate January offset to determine DST
  const jan = new Date(date.getFullYear(), 0, 15, 12, 0, 0); // Jan 15 to avoid edge cases
  const utcJan = new Date(jan.toLocaleString('en-US', { timeZone: 'UTC' }));
  const tzJan = new Date(jan.toLocaleString('en-US', { timeZone: timezoneName }));
  const janOffset = (tzJan.getTime() - utcJan.getTime()) / (1000 * 60 * 60);

  // Also check July offset for southern hemisphere
  const jul = new Date(date.getFullYear(), 6, 15, 12, 0, 0);
  const utcJul = new Date(jul.toLocaleString('en-US', { timeZone: 'UTC' }));
  const tzJul = new Date(jul.toLocaleString('en-US', { timeZone: timezoneName }));
  const julOffset = (tzJul.getTime() - utcJul.getTime()) / (1000 * 60 * 60);

  // DST is active if current offset differs from the standard (winter) offset
  const standardOffset = Math.min(janOffset, julOffset);
  const dst = offset !== standardOffset;

  // Determine if this is an Israel timezone for Hebrew labels
  const isHebrew = timezoneName === 'Asia/Jerusalem';
  const dstLabel = dst
    ? isHebrew
      ? 'שעון קיץ'
      : 'Summer Time'
    : isHebrew
      ? 'שעון חורף'
      : 'Standard Time';

  return { timezoneName, offset, dst, dstLabel };
}

/**
 * Resolve timezone from coordinates + date.
 * If timezoneName is provided, uses it directly.
 * Otherwise, guesses from coordinates.
 * Throws if timezone cannot be determined.
 */
export function resolveTimezone(
  lat: number,
  lng: number,
  dateStr: string,
  timezoneName?: string
): TimezoneResult {
  const tzName = timezoneName || guessTimezoneName(lat, lng);
  if (!tzName) {
    throw new Error(
      `Cannot determine timezone for coordinates (${lat}, ${lng}). ` +
        `Please provide timezoneName parameter (e.g. "Asia/Jerusalem", "America/New_York").`
    );
  }
  return getTimezoneInfoFromName(dateStr, tzName);
}

export function getTimezoneInfo(
  dateStr: string,
  timeZone: string
): { offset: number; dst: boolean } {
  const date = new Date(dateStr);
  const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
  const tzDate = new Date(date.toLocaleString('en-US', { timeZone }));
  const offset = (tzDate.getTime() - utcDate.getTime()) / (1000 * 60 * 60);

  const jan = new Date(date.getFullYear(), 0, 1);
  const utcJan = new Date(jan.toLocaleString('en-US', { timeZone: 'UTC' }));
  const tzJan = new Date(jan.toLocaleString('en-US', { timeZone }));
  const janOffset = (tzJan.getTime() - utcJan.getTime()) / (1000 * 60 * 60);

  return { offset, dst: offset !== janOffset };
}
