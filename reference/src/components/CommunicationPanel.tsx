import { MessageCircle } from "lucide-react";
import type { Communication, CommunicationMode, Contact } from '../types/pcps';
import { SectionHeader, Card, Field, Select, Toggle, TextInput, TagInput } from './FormFields';

interface Props {
  communication: Communication;
  onChange: (c: Communication) => void;
}

export function CommunicationPanel({ communication, onChange }: Props) {
  const update = (patch: Partial<Communication>) => onChange({ ...communication, ...patch });

  const addContact = () => {
    update({ allowed_contacts: [...(communication.allowed_contacts || []), { name: '', identifiers: [] }] });
  };

  const updateContact = (idx: number, c: Contact) => {
    const list = [...(communication.allowed_contacts || [])];
    list[idx] = c;
    update({ allowed_contacts: list });
  };

  const removeContact = (idx: number) => {
    const list = [...(communication.allowed_contacts || [])];
    list.splice(idx, 1);
    update({ allowed_contacts: list });
  };

  return (
    <div>
      <SectionHeader icon={<MessageCircle size={22} />} title="Communication" description="Control who the child can communicate with" />

      <Card>
        <Field label="Communication Mode">
          <Select value={communication.mode || 'contacts_only'} onChange={(v) => update({ mode: v as CommunicationMode })} options={[
            { value: 'unrestricted', label: 'Unrestricted — no communication limits' },
            { value: 'contacts_only', label: 'Contacts Only — only approved contacts' },
            { value: 'disabled', label: 'Disabled — no communication allowed' },
          ]} />
        </Field>
        <Toggle checked={communication.block_unknown_callers ?? true} onChange={(v) => update({ block_unknown_callers: v })} label="Block unknown callers and messages" />
      </Card>

      {communication.mode !== 'disabled' && communication.mode !== 'unrestricted' && (
        <Card>
          <h3 className="card-subtitle">Allowed Contacts</h3>
          {(communication.allowed_contacts || []).map((c, i) => (
            <div key={i} className="list-item list-item-vertical contact-item">
              <div className="card-header-row">
                <Field label="Name">
                  <TextInput value={c.name} onChange={(e) => updateContact(i, { ...c, name: e.target.value })} placeholder="Mum" />
                </Field>
                <button className="btn btn-danger btn-sm" onClick={() => removeContact(i)}>Remove</button>
              </div>
              <Field label="Identifiers" hint="Phone numbers, emails, etc.">
                <TagInput tags={c.identifiers} onChange={(t) => updateContact(i, { ...c, identifiers: t })} placeholder="+447700000000" />
              </Field>
            </div>
          ))}
          <button className="btn btn-secondary btn-sm" onClick={addContact}>+ Add Contact</button>
        </Card>
      )}
    </div>
  );
}
