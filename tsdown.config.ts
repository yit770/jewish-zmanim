import { defineConfig } from 'tsdown'

export default defineConfig({
  // exports map is maintained manually in package.json (with explicit
  // "types" conditions); don't let tsdown regenerate/simplify it on build.
  format: ['esm', 'cjs'],
  // geo-tz loads its IANA boundary data files at runtime; keep it external
  // so it is required from node_modules rather than bundled into dist.
  deps: { neverBundle: ['geo-tz'] },
})
