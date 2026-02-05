import type { Child } from '../types/pcps';

interface Props {
  children: Child[];
  selectedIdx: number;
  onSelect: (idx: number) => void;
  onAdd: () => void;
  onRemove: (idx: number) => void;
}

export function ChildSelector({ children, selectedIdx, onSelect, onAdd, onRemove }: Props) {
  return (
    <div className="child-selector">
      {children.map((child, i) => (
        <div key={child.child_id} className={`child-tab ${i === selectedIdx ? 'active' : ''}`}>
          <button className="child-tab-btn" onClick={() => onSelect(i)}>
            <span className="child-tab-avatar">{child.child_name?.[0] || '?'}</span>
            <span className="child-tab-info">
              <span className="child-tab-name">{child.child_name || 'Unnamed'}</span>
              <span className="child-tab-age">{child.child_age != null ? `Age ${child.child_age}` : ''}</span>
            </span>
          </button>
          {children.length > 1 && (
            <button className="child-tab-remove" onClick={(e) => { e.stopPropagation(); onRemove(i); }} aria-label={`Remove ${child.child_name || 'child'}`} title={`Remove ${child.child_name || 'child'}`}>×</button>
          )}
        </div>
      ))}
      <button className="btn btn-ghost btn-sm child-add-btn" onClick={onAdd}>+ Add Child</button>
    </div>
  );
}
