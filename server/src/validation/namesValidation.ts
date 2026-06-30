import { z } from 'zod';
import { parseNamesParam } from '@familiennamen/shared';
import { ValidationError } from './ValidationError.js';

const namesSchema = z
  .array(z.string().min(1, "'names' entries must not be empty"))
  .min(1, "missing required 'names' query parameter");

/**
 * Normalizes and validates the `?names=a&names=b` query parameter shared by
 * every list-of-names route. Throws `ValidationError` (mapped to a 400 by
 * the central error handler) when no names were supplied, or when a
 * supplied name is an empty string (e.g. `?names=` with no value) — the
 * latter has no equivalent in the original path-param-based routes, and is
 * an edge case introduced by the new query-string design, so it's rejected
 * outright rather than silently searching for a literal empty name.
 */
export const requireNames = (rawQueryNames: unknown): string[] => {
  const result = namesSchema.safeParse(parseNamesParam(rawQueryNames));
  if (!result.success) {
    throw new ValidationError(result.error.issues[0]?.message ?? 'invalid names parameter');
  }
  return result.data;
};
