import { Users, Star, User } from 'lucide-react';
import type { Guardian } from '../types/pcps';
import { SectionHeader, Card, Field, TextInput, Select } from './FormFields';

interface Props {
  guardians: Guardian[];
  onAdd: () => void;
  onRemove: (idx: number) => void;
  onUpdate: (idx: number, g: Guardian) => void;
}

export function GuardiansPanel({ guardians, onAdd, onRemove, onUpdate }: Props) {
  return (
    <div>
      <SectionHeader icon={<Users size={22} />} title="Guardians" description="Adults who manage this family's policies" />
      {guardians.map((g, i) => (
        <Card key={g.guardian_id} className="card-removable">
          <div className="card-header-row">
            <span className="card-badge">{g.role === 'primary' ? <><Star size={14} /> Primary</> : <><User size={14} /> Guardian</>}</span>
            {guardians.length > 1 && <button className="btn btn-danger btn-sm" onClick={() => onRemove(i)}>Remove</button>}
          </div>
          <Field label="Name">
            <TextInput value={g.name} onChange={(e) => onUpdate(i, { ...g, name: e.target.value })} placeholder="Full name" />
          </Field>
          <Field label="Email">
            <TextInput type="email" value={g.email || ''} onChange={(e) => onUpdate(i, { ...g, email: e.target.value })} placeholder="email@example.com" />
          </Field>
          <Field label="Role">
            <Select value={g.role} onChange={(v) => onUpdate(i, { ...g, role: v as 'primary' | 'guardian' })} options={[
              { value: 'primary', label: 'Primary — full control' },
              { value: 'guardian', label: 'Guardian — manage child policies' },
            ]} />
          </Field>
        </Card>
      ))}
      <button className="btn btn-secondary btn-add" onClick={onAdd}>+ Add Guardian</button>
    </div>
  );
}
