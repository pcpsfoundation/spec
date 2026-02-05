import { Package } from 'lucide-react';
import type { Apps, AppEntry } from '../types/pcps';
import { SectionHeader, Card, Field, TextInput, Toggle } from './FormFields';

interface Props {
  apps: Apps;
  onChange: (a: Apps) => void;
}

export function AppsPanel({ apps, onChange }: Props) {
  const update = (patch: Partial<Apps>) => onChange({ ...apps, ...patch });

  const addBlocked = () => update({ blocked: [...(apps.blocked || []), { app_name: '', reason: '' }] });
  const addAllowed = () => update({ always_allowed: [...(apps.always_allowed || []), { app_name: '' }] });

  const updateBlocked = (idx: number, e: AppEntry) => { const list = [...(apps.blocked || [])]; list[idx] = e; update({ blocked: list }); };
  const removeBlocked = (idx: number) => { const list = [...(apps.blocked || [])]; list.splice(idx, 1); update({ blocked: list }); };

  const updateAllowed = (idx: number, e: AppEntry) => { const list = [...(apps.always_allowed || [])]; list[idx] = e; update({ always_allowed: list }); };
  const removeAllowed = (idx: number) => { const list = [...(apps.always_allowed || [])]; list.splice(idx, 1); update({ always_allowed: list }); };

  return (
    <div>
      <SectionHeader icon={<Package size={22} />} title="App Controls" description="Manage which apps can be installed and used" />

      <Card>
        <Toggle checked={apps.require_approval ?? true} onChange={(v) => update({ require_approval: v })} label="Require approval for new app installations" />
      </Card>

      <Card>
        <h3 className="card-subtitle">Blocked Apps</h3>
        {(apps.blocked || []).map((a, i) => (
          <div key={i} className="list-item list-item-vertical">
            <div className="inline-row">
              <Field label="App Name"><TextInput value={a.app_name} onChange={(e) => updateBlocked(i, { ...a, app_name: e.target.value })} placeholder="TikTok" /></Field>
              <Field label="Reason"><TextInput value={a.reason || ''} onChange={(e) => updateBlocked(i, { ...a, reason: e.target.value })} placeholder="Not age appropriate" /></Field>
            </div>
            <button className="btn btn-danger btn-sm" onClick={() => removeBlocked(i)}>Remove</button>
          </div>
        ))}
        <button className="btn btn-secondary btn-sm" onClick={addBlocked}>+ Block an App</button>
      </Card>

      <Card>
        <h3 className="card-subtitle">Always Allowed Apps</h3>
        <p className="card-note">These apps stay available even during downtime or when time limits are reached</p>
        {(apps.always_allowed || []).map((a, i) => (
          <div key={i} className="list-item">
            <TextInput value={a.app_name} onChange={(e) => updateAllowed(i, { ...a, app_name: e.target.value })} placeholder="App name" style={{ flex: 1 }} />
            <button className="btn btn-danger btn-sm" aria-label={`Remove ${a.app_name || 'app'}`} onClick={() => removeAllowed(i)}>×</button>
          </div>
        ))}
        <button className="btn btn-secondary btn-sm" onClick={addAllowed}>+ Allow an App</button>
      </Card>
    </div>
  );
}
