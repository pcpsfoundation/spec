import { useState, useCallback, useEffect } from 'react';
import type { PCPSDocument } from '../types/pcps';
import type { Platform } from '../data/platforms';
import type { SyncResult } from '../api/mock';
import { SUGGESTED_PLATFORMS } from '../data/platforms';
import { getFamily, saveFamily } from '../api/mock';

export function usePCPS() {
  const [doc, setDoc] = useState<PCPSDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [platforms, setPlatforms] = useState<Platform[]>(SUGGESTED_PLATFORMS);
  const [lastSyncResults, setLastSyncResults] = useState<SyncResult[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getFamily();
        if (!cancelled) setDoc(data);
      } catch (e) {
        if (!cancelled) setError(String(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const save = useCallback(async (document: PCPSDocument) => {
    setSaving(true);
    setError(null);
    setLastSyncResults(null);
    try {
      const res = await saveFamily(document, platforms);
      setDoc(res.data);
      setLastSaved(res.timestamp);
      setLastSyncResults(res.syncResults);
    } catch (e) {
      setError(String(e));
    } finally {
      setSaving(false);
    }
  }, [platforms]);

  return { doc, setDoc, loading, saving, error, lastSaved, save, platforms, setPlatforms, lastSyncResults };
}
