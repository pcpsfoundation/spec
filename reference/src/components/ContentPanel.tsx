import { Shield } from 'lucide-react';
import type { Content, WebFilterMode } from '../types/pcps';
import { SectionHeader, Card, Field, NumberInput, Select, Toggle, TagInput } from './FormFields';

interface Props {
  content: Content;
  onChange: (c: Content) => void;
}

export function ContentPanel({ content, onChange }: Props) {
  const update = (patch: Partial<Content>) => onChange({ ...content, ...patch });

  return (
    <div>
      <SectionHeader icon={<Shield size={22} />} title="Content Filtering" description="Control what content the child can access" />

      <Card>
        <h3 className="card-subtitle">Age Rating</h3>
        <Field label="Maximum Age" hint="Content rated above this age will be blocked. Each platform maps this to its own rating system (PEGI, ESRB, etc.)">
          <NumberInput min={0} max={18} value={content.max_age_rating ?? 12} onChange={(e) => update({ max_age_rating: Number(e.target.value) })} />
        </Field>
      </Card>

      <Card>
        <h3 className="card-subtitle">Web Filtering</h3>
        <Field label="Filter Mode">
          <Select value={content.web?.mode || 'filtered'} onChange={(v) => update({ web: { ...content.web, mode: v as WebFilterMode } })} options={[
            { value: 'filtered', label: 'Filtered — platform applies age-appropriate filter' },
            { value: 'allowlist', label: 'Allowlist — only listed sites allowed' },
            { value: 'blocklist', label: 'Blocklist — listed sites blocked, others allowed' },
          ]} />
        </Field>
        {content.web?.mode === 'allowlist' && (
          <Field label="Allowed Domains" hint="Only these domains will be accessible">
            <TagInput tags={content.web?.allowlist || []} onChange={(t) => update({ web: { ...content.web, allowlist: t } })} placeholder="khanacademy.org" />
          </Field>
        )}
        {(content.web?.mode === 'blocklist' || content.web?.mode === 'filtered') && (
          <Field label="Blocked Domains" hint="These domains will always be blocked">
            <TagInput tags={content.web?.blocklist || []} onChange={(t) => update({ web: { ...content.web, blocklist: t } })} placeholder="reddit.com" />
          </Field>
        )}
        <Toggle checked={content.web?.safe_search ?? true} onChange={(v) => update({ web: { ...content.web, safe_search: v } })} label="Enforce Safe Search" />
      </Card>

      <Card>
        <h3 className="card-subtitle">Explicit Content</h3>
        <Toggle checked={content.explicit_content ?? false} onChange={(v) => update({ explicit_content: v })} label="Allow explicit content in music, podcasts, and books" />
      </Card>
    </div>
  );
}
