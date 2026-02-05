import { Globe, Check, AlertCircle, Plus, Trash2, ExternalLink } from 'lucide-react';
import type { Platform } from '../data/platforms';
import { createPlatform } from '../data/platforms';
import type { SyncResult } from '../api/mock';
import { SectionHeader, Card, Field, TextInput, Toggle } from './FormFields';

interface Props {
  platforms: Platform[];
  onChange: (platforms: Platform[]) => void;
  lastSyncResults: SyncResult[] | null;
}

export function PlatformsPanel({ platforms, onChange, lastSyncResults }: Props) {
  const add = () => onChange([...platforms, createPlatform()]);

  const update = (idx: number, patch: Partial<Platform>) => {
    const list = platforms.map((p, i) => i === idx ? { ...p, ...patch } : p);
    onChange(list);
  };

  const remove = (idx: number) => onChange(platforms.filter((_, i) => i !== idx));

  const enabledCount = platforms.filter((p) => p.enabled && p.endpoint).length;

  return (
    <div>
      <SectionHeader
        icon={<Globe size={22} />}
        title="Platforms"
        description="Add the platforms you want to sync your family policy to. Each platform needs a PCPS adapter endpoint URL."
      />

      {platforms.map((p, i) => {
        const syncResult = lastSyncResults?.find((r) => r.platformId === p.id);
        return (
          <Card key={p.id}>
            <div className="platform-row">
              <div className="platform-fields">
                <Field label="Platform Name">
                  <TextInput
                    value={p.name}
                    onChange={(e) => update(i, { name: e.target.value })}
                    placeholder="e.g. Apple Screen Time, My School, ..."
                  />
                </Field>
                <Field label="Endpoint URL" hint="The PCPS adapter URL that receives your family policy">
                  <div className="input-with-icon">
                    <ExternalLink size={14} className="input-icon" />
                    <TextInput
                      value={p.endpoint}
                      onChange={(e) => update(i, { endpoint: e.target.value })}
                      placeholder="https://pcps-adapter.example.com/v1/family"
                      className="input-with-pad"
                    />
                  </div>
                </Field>
              </div>
              <div className="platform-actions">
                <Toggle checked={p.enabled} onChange={(v) => update(i, { enabled: v })} />
                <button className="btn btn-danger btn-sm" onClick={() => remove(i)} title="Remove platform">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            {syncResult && (
              <div className={`sync-result ${syncResult.success ? 'success' : 'failure'}`}>
                {syncResult.success ? <Check size={14} /> : <AlertCircle size={14} />}
                <span className="sync-result-msg">{syncResult.message}</span>
                <span className="sync-result-time">{syncResult.durationMs}ms</span>
              </div>
            )}
          </Card>
        );
      })}

      <button className="btn btn-secondary btn-add" onClick={add}>
        <Plus size={16} /> Add Platform
      </button>

      <div className="platform-summary">
        {enabledCount === 0
          ? 'No platforms enabled. Add and enable at least one to sync your policy.'
          : `When you save, your policy will be sent to ${enabledCount} platform${enabledCount !== 1 ? 's' : ''}.`
        }
      </div>
    </div>
  );
}
