import { Zap } from "lucide-react";
import type { Status } from '../types/pcps';
import { SectionHeader, Card, Field, TextInput, Toggle } from './FormFields';

interface Props {
  status: Status;
  onChange: (s: Status) => void;
}

export function StatusPanel({ status, onChange }: Props) {
  const update = (patch: Partial<Status>) => onChange({ ...status, ...patch });

  return (
    <div>
      <SectionHeader icon={<Zap size={22} />} title="Device Status" description="Current enforcement state of the policy" />

      <Card>
        <Toggle checked={status.policy_active ?? true} onChange={(v) => update({ policy_active: v })} label="Policy Active" />
        <p className="card-note">When inactive, no rules are enforced</p>
      </Card>

      <Card>
        <h3 className="card-subtitle">Pause Controls</h3>
        <Toggle checked={status.paused ?? false} onChange={(v) => update({ paused: v, paused_until: v ? null : null })} label="Paused (free time)" />
        <p className="card-note">Temporarily suspends all schedule and time limit restrictions</p>
        {status.paused && (
          <Field label="Paused Until" hint="Leave empty for indefinite pause">
            <TextInput type="datetime-local" value={status.paused_until?.slice(0, 16) || ''} onChange={(e) => update({ paused_until: e.target.value ? new Date(e.target.value).toISOString() : null })} />
          </Field>
        )}
      </Card>

      <Card>
        <h3 className="card-subtitle">Emergency Lock</h3>
        <Toggle checked={status.locked ?? false} onChange={(v) => update({ locked: v })} label="Device Locked" />
        <p className="card-note">Full lockdown — no usage allowed</p>
        {status.locked && (
          <Field label="Lock Reason" hint="Message shown to the child">
            <TextInput value={status.locked_reason || ''} onChange={(e) => update({ locked_reason: e.target.value || null })} placeholder="Time to do homework" />
          </Field>
        )}
      </Card>
    </div>
  );
}
