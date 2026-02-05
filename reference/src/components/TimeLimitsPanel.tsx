import { Clock } from 'lucide-react';
import type { TimeLimits, AppCategory, CategoryLimit, AppTimeLimit } from '../types/pcps';
import { SectionHeader, Card, Field, NumberInput, TextInput, Select, Toggle } from './FormFields';

const CATEGORIES: { value: AppCategory; label: string }[] = [
  { value: 'games', label: 'Games' },
  { value: 'social_media', label: 'Social Media' },
  { value: 'educational', label: 'Educational' },
  { value: 'video', label: 'Video' },
  { value: 'music', label: 'Music' },
  { value: 'creativity', label: 'Creativity' },
  { value: 'browsing', label: 'Browsing' },
  { value: 'communication', label: 'Communication' },
  { value: 'other', label: 'Other' },
];

interface Props {
  timeLimits: TimeLimits;
  onChange: (t: TimeLimits) => void;
}

export function TimeLimitsPanel({ timeLimits, onChange }: Props) {
  const update = (patch: Partial<TimeLimits>) => onChange({ ...timeLimits, ...patch });

  const addCategory = () => {
    const used = new Set((timeLimits.by_category || []).map((c) => c.category));
    const available = CATEGORIES.find((c) => !used.has(c.value));
    if (!available) return;
    update({ by_category: [...(timeLimits.by_category || []), { category: available.value, daily_minutes: 30 }] });
  };
  const updateCategory = (idx: number, c: CategoryLimit) => { const cats = [...(timeLimits.by_category || [])]; cats[idx] = c; update({ by_category: cats }); };
  const removeCategory = (idx: number) => { const cats = [...(timeLimits.by_category || [])]; cats.splice(idx, 1); update({ by_category: cats }); };

  const addApp = () => { update({ by_app: [...(timeLimits.by_app || []), { app_name: '', daily_minutes: 30 }] }); };
  const updateApp = (idx: number, a: AppTimeLimit) => { const apps = [...(timeLimits.by_app || [])]; apps[idx] = a; update({ by_app: apps }); };
  const removeApp = (idx: number) => { const apps = [...(timeLimits.by_app || [])]; apps.splice(idx, 1); update({ by_app: apps }); };

  return (
    <div>
      <SectionHeader icon={<Clock size={22} />} title="Time Limits" description="How long the device or specific apps can be used per day" />

      <Card>
        <h3 className="card-subtitle">Daily Screen Time</h3>
        <div className="inline-row">
          <Field label="Weekdays (minutes)">
            <NumberInput min={0} value={timeLimits.daily?.weekday ?? ''} onChange={(e) => update({ daily: { ...timeLimits.daily, weekday: e.target.value ? Number(e.target.value) : undefined } })} placeholder="60" />
          </Field>
          <Field label="Weekends (minutes)">
            <NumberInput min={0} value={timeLimits.daily?.weekend ?? ''} onChange={(e) => update({ daily: { ...timeLimits.daily, weekend: e.target.value ? Number(e.target.value) : undefined } })} placeholder="120" />
          </Field>
        </div>
      </Card>

      <Card>
        <h3 className="card-subtitle">By Category</h3>
        {(timeLimits.by_category || []).map((c, i) => (
          <div key={i} className="list-item">
            <Select value={c.category} onChange={(v) => updateCategory(i, { ...c, category: v as AppCategory })} options={CATEGORIES} />
            <div className="limit-control">
              <Toggle checked={c.daily_minutes !== null} onChange={(on) => updateCategory(i, { ...c, daily_minutes: on ? 30 : null })} label={c.daily_minutes === null ? 'Unlimited' : ''} />
              {c.daily_minutes !== null && (
                <NumberInput min={0} value={c.daily_minutes} onChange={(e) => updateCategory(i, { ...c, daily_minutes: Number(e.target.value) })} style={{ width: 80 }} />
              )}
              {c.daily_minutes !== null && <span className="unit">mins</span>}
            </div>
            <button className="btn btn-danger btn-sm" aria-label={`Remove ${c.category} limit`} onClick={() => removeCategory(i)}>×</button>
          </div>
        ))}
        <button className="btn btn-secondary btn-sm" onClick={addCategory}>+ Add Category Limit</button>
      </Card>

      <Card>
        <h3 className="card-subtitle">By App</h3>
        {(timeLimits.by_app || []).map((a, i) => (
          <div key={i} className="list-item">
            <TextInput value={a.app_name} onChange={(e) => updateApp(i, { ...a, app_name: e.target.value })} placeholder="App name" style={{ flex: 1 }} />
            <div className="limit-control">
              <NumberInput min={0} value={a.daily_minutes ?? ''} onChange={(e) => updateApp(i, { ...a, daily_minutes: e.target.value ? Number(e.target.value) : null })} style={{ width: 80 }} />
              <span className="unit">mins</span>
            </div>
            <button className="btn btn-danger btn-sm" aria-label={`Remove ${a.app_name || 'app'} limit`} onClick={() => removeApp(i)}>×</button>
          </div>
        ))}
        <button className="btn btn-secondary btn-sm" onClick={addApp}>+ Add App Limit</button>
      </Card>
    </div>
  );
}
