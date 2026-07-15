import { assert, describe, it, vi } from 'vitest';

// Isolated file: mock geo-tz so `find` yields no zone. In practice geo-tz
// always resolves in-range coordinates (and throws on out-of-range ones), so
// this branch is otherwise unreachable — but resolveTimezone still guards it.
vi.mock('geo-tz', () => ({ find: () => [] as string[] }));

const { guessTimezoneName, resolveTimezone } = await import('../src/timezone');

describe('resolveTimezone – unresolvable coordinates', () => {
  it('guessTimezoneName returns null when geo-tz finds no zone', () => {
    assert.equal(guessTimezoneName(0, 0), null);
  });

  it('throws a helpful error naming the coordinates', () => {
    assert.throws(
      () => resolveTimezone(12.34, 56.78, '2026-02-13'),
      /Cannot determine timezone for coordinates \(12\.34, 56\.78\)/
    );
  });

  it('still succeeds when an explicit timezoneName is supplied', () => {
    // The lookup is short-circuited, so a missing zone does not matter.
    const info = resolveTimezone(12.34, 56.78, '2026-02-13', 'Asia/Jerusalem');
    assert.equal(info.timezoneName, 'Asia/Jerusalem');
    assert.equal(info.offset, 2);
  });
});
