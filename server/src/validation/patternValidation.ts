import { ValidationError } from './ValidationError.js';

/**
 * Validates the raw `:pattern` path segment shared by the `like` and
 * `regexp` name-search routes. Mirrors the original's
 * `pattern.length < 4` check exactly: this is a check on the *raw* string
 * length, not an alphanumeric-stripped length (that stripping only ever
 * existed client-side in the old AngularJS app).
 */
export const requirePattern = (pattern: string): string => {
  if (pattern.length < 4) {
    throw new ValidationError('Pattern has to have a minimal length of 4 characters');
  }
  return pattern;
};
