import type { ErrorRequestHandler } from 'express';
import type { ApiErrorBody } from '@familiennamen/shared';
import { InvalidRegexpError } from '../db/connection.js';
import { ValidationError } from '../validation/ValidationError.js';

/**
 * Central error -> HTTP mapping. Controllers stay thin: they validate via
 * the `require*` helpers (which throw `ValidationError`, built on zod's
 * `safeParse` — nothing in this codebase calls zod's throwing `.parse()`,
 * so there's no raw `ZodError` to handle here) and let Express 5's native
 * async-handler rejection forwarding deliver thrown errors here, rather
 * than each controller hand-rolling try/catch -> status.
 */
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ValidationError || err instanceof InvalidRegexpError) {
    res.status(400).json({ error: err.message } satisfies ApiErrorBody);
    return;
  }
  console.error(err);
  res.status(500).json({ error: 'Internal server error' } satisfies ApiErrorBody);
};
