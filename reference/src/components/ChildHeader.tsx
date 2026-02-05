import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { Child } from '../types/pcps';

interface Props {
  child: Child;
  onChange: (updater: (c: Child) => Child) => void;
}

export function ChildHeader({ child, onChange }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="child-header">
      <button
        className="child-header-summary"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        aria-label={`${child.child_name || 'Child'} details. ${expanded ? 'Collapse' : 'Expand'} to edit.`}
        type="button"
      >
        <div className="child-header-avatar" aria-hidden="true">{child.child_name?.[0] || '?'}</div>
        <div className="child-header-info">
          <span className="child-header-name">{child.child_name || 'Unnamed child'}</span>
          {child.child_age != null && <span className="child-header-age">Age {child.child_age}</span>}
        </div>
        <span className="child-header-toggle" aria-hidden="true">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </span>
      </button>
      {expanded && (
        <div className="child-header-fields">
          <label className="child-header-field">
            <span>Name</span>
            <input className="input" value={child.child_name} onChange={(e) => onChange((c) => { c.child_name = e.target.value; return c; })} />
          </label>
          <label className="child-header-field">
            <span>Age</span>
            <input className="input" type="number" min={0} max={17} style={{ width: 80 }} value={child.child_age ?? ''} onChange={(e) => onChange((c) => { c.child_age = e.target.value ? Number(e.target.value) : undefined; return c; })} />
          </label>
          <label className="child-header-field">
            <span>Timezone</span>
            <input className="input" value={child.timezone || ''} placeholder="Family default" onChange={(e) => onChange((c) => { c.timezone = e.target.value || undefined; return c; })} />
          </label>
        </div>
      )}
    </div>
  );
}
