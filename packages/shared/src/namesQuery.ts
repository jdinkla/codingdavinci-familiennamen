/**
 * Single source of truth for the `?names=a&names=b` query-string convention
 * used by every list-of-names API route. Replaces the old custom
 * tab-separated/URI-encoded single-path-segment scheme.
 */

/** Builds a query string fragment (no leading `?`) from a list of names. */
export const buildNamesQuery = (names: readonly string[]): string =>
  names.map((name) => `names=${encodeURIComponent(name)}`).join('&');

/**
 * Normalizes Express's `req.query.names` into a string array.
 * With zero `names=` params it's `undefined`, with exactly one it's a
 * plain `string`, with two or more it's a `string[]` — this is the
 * "one-vs-many" gotcha every list-of-names route must handle.
 */
export const parseNamesParam = (raw: unknown): string[] => {
  if (raw === undefined) return [];
  if (Array.isArray(raw)) {
    return raw.filter((value): value is string => typeof value === 'string');
  }
  if (typeof raw === 'string') return [raw];
  return [];
};
