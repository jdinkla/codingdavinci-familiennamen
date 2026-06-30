import { describe, expect, it, vi } from 'vitest';
import type { Request, Response } from 'express';
import { InvalidRegexpError } from '../src/db/connection.js';
import { errorHandler } from '../src/middleware/errorHandler.js';
import { ValidationError } from '../src/validation/ValidationError.js';

const mockResponse = (): Response => {
  const res = {} as Response;
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

describe('errorHandler', () => {
  it('maps ValidationError to 400', () => {
    const res = mockResponse();
    errorHandler(new ValidationError('bad input'), {} as Request, res, vi.fn());
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'bad input' });
  });

  it('maps InvalidRegexpError to 400', () => {
    const res = mockResponse();
    errorHandler(new InvalidRegexpError('(', new Error('bad regex')), {} as Request, res, vi.fn());
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'invalid regular expression: (' });
  });

  it('maps any other error to 500 without leaking internal detail', () => {
    const res = mockResponse();
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    errorHandler(new Error('unexpected db failure'), {} as Request, res, vi.fn());
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    consoleSpy.mockRestore();
  });
});
