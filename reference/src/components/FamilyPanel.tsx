import { Home } from 'lucide-react';
import type { PCPSDocument } from '../types/pcps';
import { SectionHeader, Card, Field, TextInput } from './FormFields';

interface Props {
  doc: PCPSDocument;
  onChange: (updater: (d: PCPSDocument) => PCPSDocument) => void;
}

export function FamilyPanel({ doc, onChange }: Props) {
  return (
    <div>
      <SectionHeader icon={<Home size={22} />} title="Family Details" description="Basic information about your family" />
      <Card>
        <Field label="Family Name" hint="A friendly name like 'The Smiths'">
          <TextInput value={doc.family_name || ''} onChange={(e) => onChange((d) => { d.family_name = e.target.value; return d; })} placeholder="The Smiths" />
        </Field>
        <Field label="Timezone" hint="Used for all schedules and time limits">
          <TextInput value={doc.timezone} onChange={(e) => onChange((d) => { d.timezone = e.target.value; return d; })} placeholder="Europe/London" />
        </Field>
      </Card>
    </div>
  );
}
