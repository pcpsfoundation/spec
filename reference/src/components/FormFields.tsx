import { type ReactNode, type InputHTMLAttributes } from 'react';

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <div className="field">
      <label className="field-label">{label}</label>
      {hint && <span className="field-hint">{hint}</span>}
      <div className="field-input">{children}</div>
    </div>
  );
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement> & { className?: string }) {
  const { className = '', ...rest } = props;
  return <input type="text" className={`input ${className}`} {...rest} />;
}

export function NumberInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input type="number" className="input input-num" {...props} />;
}

export function TimeInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input type="time" className="input input-time" {...props} />;
}

export function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <select className="input" value={value} onChange={(e) => onChange(e.target.value)}>
      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <label className="toggle">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} aria-label={label || 'Toggle'} />
      <span className="toggle-track" aria-hidden="true"><span className="toggle-thumb" /></span>
      {label && <span className="toggle-label">{label}</span>}
    </label>
  );
}

export function SectionHeader({ title, description, icon }: { title: string; description?: string; icon?: ReactNode }) {
  return (
    <div className="section-header">
      {icon && <span className="section-icon">{icon}</span>}
      <div>
        <h2 className="section-title">{title}</h2>
        {description && <p className="section-desc">{description}</p>}
      </div>
    </div>
  );
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`card ${className}`}>{children}</div>;
}

export function TagInput({ tags, onChange, placeholder }: { tags: string[]; onChange: (t: string[]) => void; placeholder?: string }) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = (e.target as HTMLInputElement).value.trim();
      if (val && !tags.includes(val)) { onChange([...tags, val]); (e.target as HTMLInputElement).value = ''; }
    }
  };
  return (
    <div className="tag-input-wrap">
      <div className="tags">
        {tags.map((t, i) => (
          <span key={i} className="tag">{t}<button className="tag-remove" aria-label={`Remove ${t}`} onClick={() => onChange(tags.filter((_, idx) => idx !== i))}>×</button></span>
        ))}
      </div>
      <input type="text" className="input" placeholder={placeholder || 'Type and press Enter'} onKeyDown={handleKeyDown} />
    </div>
  );
}
