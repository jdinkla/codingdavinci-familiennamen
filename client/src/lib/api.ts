import {
  buildNamesQuery,
  type ApiErrorBody,
  type FokoRecord,
  type GraphDepth,
  type GraphResponse,
  type HealthStatus,
  type MapPoint,
  type NameSearchResult,
  type TimelineEntry,
} from '@familiennamen/shared';

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

const getJson = async <T>(path: string): Promise<T> => {
  const res = await fetch(path);
  if (!res.ok) {
    const body = (await res.json().catch(() => ({ error: res.statusText }))) as ApiErrorBody;
    throw new ApiError(res.status, body.error ?? res.statusText);
  }
  return (await res.json()) as T;
};

export const getHealth = (): Promise<HealthStatus> => getJson('/api/health');

export const searchExact = (familyName: string): Promise<NameSearchResult> =>
  getJson(`/api/name/${encodeURIComponent(familyName)}`);

export const searchLike = (pattern: string): Promise<NameSearchResult> =>
  getJson(`/api/name/like/${encodeURIComponent(pattern)}`);

export const searchRegexp = (pattern: string): Promise<NameSearchResult> =>
  getJson(`/api/name/regexp/${encodeURIComponent(pattern)}`);

export const getFoko = (names: string[]): Promise<FokoRecord[]> => getJson(`/api/foko?${buildNamesQuery(names)}`);

export const getFokoSample = (): Promise<FokoRecord[]> => getJson('/api/foko-sample');

export const getMap = (names: string[]): Promise<MapPoint[]> => getJson(`/api/map?${buildNamesQuery(names)}`);

export const getTimeline = (names: string[]): Promise<TimelineEntry[]> =>
  getJson(`/api/timeline?${buildNamesQuery(names)}`);

export const getGraph = (names: string[], depth: GraphDepth): Promise<GraphResponse> =>
  getJson(`/api/graph?${buildNamesQuery(names)}&depth=${depth}`);
