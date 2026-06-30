/**
 * Frozen API response contract shared between server and client.
 * Field names are camelCase JSON keys as sent over the wire.
 */

export interface FokoRecord {
  id: number;
  familyName: string;
  begin: number | null;
  end: number | null;
  submitter: string | null;
  denomination: string | null;
  country: string | null;
  region: string | null;
  postalCode: string | null;
  placeName: string | null;
  placeURI: string | null;
  lon: number;
  lat: number;
  ort: string;
}

export interface MapPoint {
  id: number;
  familyName: string;
  begin: number | null;
  end: number | null;
  plz: string | null;
  placeName: string | null;
  lon: number;
  lat: number;
}

export interface TimelineEntry {
  id: number;
  name: string;
  begin: number | null;
  end: number | null;
  country: string | null;
  plz: string | null;
  ort: string;
  placeUri: string | null;
}

export interface GraphNode {
  id: string;
  group: number;
}

export interface GraphLink {
  source: string;
  target: string;
  value?: number;
}

export interface GraphResponse {
  nodes: GraphNode[];
  links: GraphLink[];
}

export type GraphDepth = 1 | 2;

export type HealthStatus =
  | { status: 'ok'; rows: number }
  | { status: 'error'; error: string };

export interface ApiErrorBody {
  error: string;
}

/** Names search results are just the list of matching family-name strings. */
export type NameSearchResult = string[];
