import type { PCPSDocument } from '../types/pcps';
import type { Platform } from '../data/platforms';
import { EXAMPLE_DOCUMENT } from '../data/defaults';

let store: PCPSDocument | null = structuredClone(EXAMPLE_DOCUMENT);

const MOCK_LATENCY_MS = 400;
const PER_PLATFORM_LATENCY_MS = 200;

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export interface SyncResult {
  platformId: string;
  platformName: string;
  endpoint: string;
  success: boolean;
  message: string;
  durationMs: number;
}

export interface SaveResponse {
  data: PCPSDocument;
  timestamp: string;
  syncResults: SyncResult[];
}

/**
 * GET - load the family document
 */
export async function getFamily(): Promise<PCPSDocument | null> {
  await delay(MOCK_LATENCY_MS);
  return store ? structuredClone(store) : null;
}

/**
 * SAVE - persist locally then POST to each enabled platform endpoint
 */
export async function saveFamily(doc: PCPSDocument, platforms: Platform[]): Promise<SaveResponse> {
  await delay(MOCK_LATENCY_MS);

  const saved = structuredClone(doc);
  saved.updated_at = new Date().toISOString();
  store = structuredClone(saved);

  const enabled = platforms.filter((p) => p.enabled && p.endpoint);

  // Simulate per-platform POST
  const syncResults: SyncResult[] = [];
  for (const p of enabled) {
    const start = Date.now();
    await delay(PER_PLATFORM_LATENCY_MS + Math.random() * 200);
    const durationMs = Date.now() - start;
    const success = Math.random() > 0.1;
    syncResults.push({
      platformId: p.id,
      platformName: p.name || p.endpoint,
      endpoint: p.endpoint,
      success,
      message: success
        ? `POST ${p.endpoint} → 200 OK`
        : `POST ${p.endpoint} → 503 Service Unavailable`,
      durationMs,
    });
  }

  return { data: saved, timestamp: new Date().toISOString(), syncResults };
}
