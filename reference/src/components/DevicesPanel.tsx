import { Smartphone, Apple, Monitor, Gamepad2, Flame, Laptop } from 'lucide-react';
import type { Device } from '../types/pcps';
import { SectionHeader, Card, Field, TextInput, Select } from './FormFields';

const PLATFORMS = [
  { value: 'apple', label: 'Apple (iPhone, iPad, Mac)' },
  { value: 'google', label: 'Google / Android' },
  { value: 'microsoft', label: 'Microsoft / Xbox' },
  { value: 'nintendo', label: 'Nintendo' },
  { value: 'sony', label: 'Sony / PlayStation' },
  { value: 'amazon', label: 'Amazon' },
  { value: 'other', label: 'Other' },
];

function PlatformIcon({ platform }: { platform: string }) {
  const size = 18;
  switch (platform) {
    case 'apple': return <Apple size={size} />;
    case 'google': return <Smartphone size={size} />;
    case 'microsoft': return <Monitor size={size} />;
    case 'nintendo': return <Gamepad2 size={size} />;
    case 'sony': return <Gamepad2 size={size} />;
    case 'amazon': return <Flame size={size} />;
    default: return <Laptop size={size} />;
  }
}

function platformLabel(platform: string) {
  return PLATFORMS.find((p) => p.value === platform)?.label || platform;
}

interface Props {
  devices: Device[];
  onAdd: () => void;
  onRemove: (idx: number) => void;
  onUpdate: (idx: number, d: Device) => void;
}

export function DevicesPanel({ devices, onAdd, onRemove, onUpdate }: Props) {
  return (
    <div>
      <SectionHeader icon={<Smartphone size={22} />} title="Devices" description="Devices linked to this child" />
      {devices.length === 0 && (
        <Card><p className="empty-msg">No devices added yet. The policy will apply to all devices.</p></Card>
      )}
      {devices.map((d, i) => (
        <Card key={d.device_id} className="card-removable">
          <div className="card-header-row">
            <span className="card-badge"><PlatformIcon platform={d.platform} /> {platformLabel(d.platform)}</span>
            <button className="btn btn-danger btn-sm" onClick={() => onRemove(i)}>Remove</button>
          </div>
          <Field label="Device Name">
            <TextInput value={d.device_name} onChange={(e) => onUpdate(i, { ...d, device_name: e.target.value })} placeholder="Alex's iPad" />
          </Field>
          <Field label="Platform">
            <Select value={d.platform} onChange={(v) => onUpdate(i, { ...d, platform: v })} options={PLATFORMS} />
          </Field>
          <Field label="Model">
            <TextInput value={d.model || ''} onChange={(e) => onUpdate(i, { ...d, model: e.target.value })} placeholder="iPad Air, Switch OLED, etc." />
          </Field>
        </Card>
      ))}
      <button className="btn btn-secondary btn-add" onClick={onAdd}>+ Add Device</button>
    </div>
  );
}
