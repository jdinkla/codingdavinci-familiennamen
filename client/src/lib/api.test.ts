import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  ApiError,
  getFoko,
  getFokoSample,
  getGraph,
  getHealth,
  getMap,
  getTimeline,
  searchExact,
  searchLike,
  searchRegexp,
} from './api.js';

const jsonResponse = (status: number, body: unknown): Response =>
  ({
    ok: status >= 200 && status < 300,
    status,
    statusText: 'Error',
    json: () => Promise.resolve(body),
  }) as Response;

describe('api client', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns parsed JSON on a successful response', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse(200, ['müller']));
    await expect(searchExact('müller')).resolves.toEqual(['müller']);
  });

  it('throws ApiError with the body error message on a non-ok response', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse(400, { error: "missing required 'names' query parameter" }));
    await expect(getFoko([])).rejects.toMatchObject({
      name: 'ApiError',
      status: 400,
      message: "missing required 'names' query parameter",
    });
  });

  it('falls back to the response statusText when the error body has no error field', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse(500, {}));
    await expect(getHealth()).rejects.toMatchObject({ status: 500, message: 'Error' });
  });

  it('falls back to statusText when the error response body is not valid JSON', async () => {
    const res = {
      ok: false,
      status: 503,
      statusText: 'Service Unavailable',
      json: () => Promise.reject(new SyntaxError('Unexpected end of JSON input')),
    } as unknown as Response;
    vi.mocked(fetch).mockResolvedValueOnce(res);
    await expect(getHealth()).rejects.toMatchObject({ status: 503, message: 'Service Unavailable' });
    expect(ApiError.prototype).toBeInstanceOf(Error);
  });

  it('percent-encodes single-name path segments', async () => {
    vi.mocked(fetch).mockResolvedValue(jsonResponse(200, []));
    await searchLike('m%er');
    expect(fetch).toHaveBeenCalledWith('/api/name/like/m%25er');
    await searchRegexp('m(x)');
    expect(fetch).toHaveBeenCalledWith('/api/name/regexp/m(x)');
  });

  it('builds a repeated-names query string for list-of-names endpoints', async () => {
    vi.mocked(fetch).mockResolvedValue(jsonResponse(200, []));
    await getMap(['müller', 'meier, von']);
    expect(fetch).toHaveBeenCalledWith('/api/map?names=m%C3%BCller&names=meier%2C%20von');
    await getTimeline(['schmidt']);
    expect(fetch).toHaveBeenCalledWith('/api/timeline?names=schmidt');
  });

  it('includes the depth parameter for graph queries', async () => {
    vi.mocked(fetch).mockResolvedValue(jsonResponse(200, { nodes: [], links: [] }));
    await getGraph(['müller'], 2);
    expect(fetch).toHaveBeenCalledWith('/api/graph?names=m%C3%BCller&depth=2');
  });

  it('getFokoSample and getHealth hit their fixed, param-less paths', async () => {
    vi.mocked(fetch).mockResolvedValue(jsonResponse(200, []));
    await getFokoSample();
    expect(fetch).toHaveBeenCalledWith('/api/foko-sample');
    await getHealth();
    expect(fetch).toHaveBeenCalledWith('/api/health');
  });
});
