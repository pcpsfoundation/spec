import { Target } from "lucide-react";
import type { Overrides, OverrideType, TemporaryRule } from '../types/pcps';
import { SectionHeader, Card, Field, NumberInput, TextInput, Select, Toggle } from './FormFields';

interface Props {
  overrides: Overrides;
  onChange: (o: Overrides) => void;
}

export function OverridesPanel({ overrides, onChange }: Props) {
  const update = (patch: Partial<Overrides>) => onChange({ ...overrides, ...patch });

  const hasBonus = overrides.bonus_time != null;

  const addRule = () => {
    update({ temporary_rules: [...(overrides.temporary_rules || []), { type: 'extend_schedule', date: new Date().toISOString().slice(0, 10), reason: '' }] });
  };

  const updateRule = (idx: number, r: TemporaryRule) => {
    const list = [...(overrides.temporary_rules || [])];
    list[idx] = r;
    update({ temporary_rules: list });
  };

  const removeRule = (idx: number) => {
    const list = [...(overrides.temporary_rules || [])];
    list.splice(idx, 1);
    update({ temporary_rules: list });
  };

  return (
    <div>
      <SectionHeader icon={<Target size={22} />} title="Overrides" description="Temporary modifications without changing base rules" />

      <Card>
        <h3 className="card-subtitle">Bonus Time</h3>
        <Toggle checked={hasBonus} onChange={(v) => update({ bonus_time: v ? { minutes: 30, reason: '', granted_at: new Date().toISOString(), expires_at: new Date(Date.now() + 86400000).toISOString() } : null })} label="Grant bonus time" />
        {hasBonus && overrides.bonus_time && (
          <>
            <Field label="Extra Minutes">
              <NumberInput min={1} value={overrides.bonus_time.minutes} onChange={(e) => update({ bonus_time: { ...overrides.bonus_time!, minutes: Number(e.target.value) } })} />
            </Field>
            <Field label="Reason">
              <TextInput value={overrides.bonus_time.reason || ''} onChange={(e) => update({ bonus_time: { ...overrides.bonus_time!, reason: e.target.value } })} placeholder="Good behaviour" />
            </Field>
            <Field label="Expires At">
              <TextInput type="datetime-local" value={overrides.bonus_time.expires_at.slice(0, 16)} onChange={(e) => update({ bonus_time: { ...overrides.bonus_time!, expires_at: new Date(e.target.value).toISOString() } })} />
            </Field>
          </>
        )}
      </Card>

      <Card>
        <h3 className="card-subtitle">Temporary Rules</h3>
        {(overrides.temporary_rules || []).map((r, i) => (
          <div key={i} className="list-item list-item-vertical">
            <div className="card-header-row">
              <Field label="Type">
                <Select value={r.type} onChange={(v) => updateRule(i, { ...r, type: v as OverrideType })} options={[
                  { value: 'extend_schedule', label: 'Extend Schedule' },
                  { value: 'extra_time', label: 'Extra Time' },
                  { value: 'unblock_app', label: 'Unblock App' },
                  { value: 'unblock_site', label: 'Unblock Site' },
                ]} />
              </Field>
              <button className="btn btn-danger btn-sm" onClick={() => removeRule(i)}>Remove</button>
            </div>
            <div className="inline-row">
              <Field label="Date">
                <TextInput type="date" value={r.date} onChange={(e) => updateRule(i, { ...r, date: e.target.value })} />
              </Field>
              <Field label="Reason">
                <TextInput value={r.reason || ''} onChange={(e) => updateRule(i, { ...r, reason: e.target.value })} placeholder="Sleepover, birthday, etc." />
              </Field>
            </div>
          </div>
        ))}
        <button className="btn btn-secondary btn-sm" onClick={addRule}>+ Add Temporary Rule</button>
      </Card>
    </div>
  );
}
