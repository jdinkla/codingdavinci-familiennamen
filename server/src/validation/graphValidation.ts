import { z } from 'zod';
import type { GraphDepth } from '@familiennamen/shared';
import { ValidationError } from './ValidationError.js';

const depthSchema = z.preprocess(
  (raw) => (raw === undefined ? '1' : raw),
  z
    .string()
    .regex(/^[12]$/, "'depth' must be 1 or 2")
    .transform((value) => Number.parseInt(value, 10) as GraphDepth)
);

/** Parses the optional `?depth=` param; defaults to 1, rejects anything other than 1 or 2. */
export const parseDepth = (raw: unknown): GraphDepth => {
  const result = depthSchema.safeParse(raw);
  if (!result.success) {
    throw new ValidationError(result.error.issues[0]?.message ?? "invalid 'depth' parameter");
  }
  return result.data;
};
