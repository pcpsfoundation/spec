import { useState, useCallback } from 'react';
import { Menu, Home, Users, Globe, Smartphone, Calendar, Clock, Shield, Package, MessageCircle, Wallet, Zap, Target, Save, Check } from 'lucide-react';
import { usePCPS } from './hooks/usePCPS';
import type { PCPSDocument, Child, Guardian, Device } from './types/pcps';
import { createDefaultChild, createDefaultGuardian, createDefaultDevice } from './data/defaults';
import { FamilyPanel } from './components/FamilyPanel';
import { GuardiansPanel } from './components/GuardiansPanel';
import { PlatformsPanel } from './components/PlatformsPanel';
import { ChildSelector } from './components/ChildSelector';
import { ChildHeader } from './components/ChildHeader';
import { DevicesPanel } from './components/DevicesPanel';
import { SchedulePanel } from './components/SchedulePanel';
import { TimeLimitsPanel } from './components/TimeLimitsPanel';
import { ContentPanel } from './components/ContentPanel';
import { AppsPanel } from './components/AppsPanel';
import { CommunicationPanel } from './components/CommunicationPanel';
import { SpendingPanel } from './components/SpendingPanel';
import { StatusPanel } from './components/StatusPanel';
import { OverridesPanel } from './components/OverridesPanel';
import './app.css';

type Section = 'family' | 'guardians' | 'platforms' | 'devices' | 'schedule' | 'time_limits' | 'content' | 'apps' | 'communication' | 'spending' | 'status' | 'overrides';

const ICON_SIZE = 18;

const FAMILY_SECTIONS: { key: Section; label: string; icon: React.ReactNode }[] = [
  { key: 'family', label: 'Family', icon: <Home size={ICON_SIZE} /> },
  { key: 'guardians', label: 'Guardians', icon: <Users size={ICON_SIZE} /> },
  { key: 'platforms', label: 'Platforms', icon: <Globe size={ICON_SIZE} /> },
];

const POLICY_SECTIONS: { key: Section; label: string; icon: React.ReactNode }[] = [
  { key: 'devices', label: 'Devices', icon: <Smartphone size={ICON_SIZE} /> },
  { key: 'schedule', label: 'Schedule', icon: <Calendar size={ICON_SIZE} /> },
  { key: 'time_limits', label: 'Time Limits', icon: <Clock size={ICON_SIZE} /> },
  { key: 'content', label: 'Content', icon: <Shield size={ICON_SIZE} /> },
  { key: 'apps', label: 'Apps', icon: <Package size={ICON_SIZE} /> },
  { key: 'communication', label: 'Communication', icon: <MessageCircle size={ICON_SIZE} /> },
  { key: 'spending', label: 'Spending', icon: <Wallet size={ICON_SIZE} /> },
  { key: 'status', label: 'Status', icon: <Zap size={ICON_SIZE} /> },
  { key: 'overrides', label: 'Overrides', icon: <Target size={ICON_SIZE} /> },
];

const POLICY_KEYS = new Set(POLICY_SECTIONS.map((s) => s.key));

export default function App() {
  const { doc, setDoc, loading, saving, error, lastSaved, save, platforms, setPlatforms, lastSyncResults } = usePCPS();
  const [activeSection, setActiveSection] = useState<Section>('family');
  const [selectedChildIdx, setSelectedChildIdx] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = (section: Section) => { setActiveSection(section); setSidebarOpen(false); };

  const selectChild = (idx: number) => {
    setSelectedChildIdx(idx);
    if (!POLICY_KEYS.has(activeSection)) setActiveSection('schedule');
    setSidebarOpen(false);
  };

  const updateDoc = useCallback((updater: (d: PCPSDocument) => PCPSDocument) => {
    setDoc((prev) => (prev ? updater(structuredClone(prev)) : prev));
  }, [setDoc]);

  const updateChild = useCallback((updater: (c: Child) => Child) => {
    updateDoc((d) => {
      if (d.children[selectedChildIdx]) d.children[selectedChildIdx] = updater(structuredClone(d.children[selectedChildIdx]));
      return d;
    });
  }, [updateDoc, selectedChildIdx]);

  const addChild = useCallback(() => {
    updateDoc((d) => { d.children.push(createDefaultChild(`Child ${d.children.length + 1}`)); return d; });
    setDoc((prev) => { if (prev) setSelectedChildIdx(prev.children.length - 1); return prev; });
    setActiveSection('schedule');
  }, [updateDoc, setDoc]);

  const removeChild = useCallback((idx: number) => {
    const name = doc?.children[idx]?.child_name || 'this child';
    if (!window.confirm(`Remove ${name}? This will delete all their policy settings.`)) return;
    updateDoc((d) => { d.children.splice(idx, 1); return d; });
    setSelectedChildIdx((prev) => Math.min(prev, Math.max(0, (doc?.children.length ?? 1) - 2)));
  }, [updateDoc, doc]);

  const addGuardian = useCallback(() => { updateDoc((d) => { d.guardians.push(createDefaultGuardian()); return d; }); }, [updateDoc]);
  const removeGuardian = useCallback((idx: number) => {
    const name = doc?.guardians[idx]?.name || 'this guardian';
    if (!window.confirm(`Remove ${name}?`)) return;
    updateDoc((d) => { d.guardians.splice(idx, 1); return d; });
  }, [updateDoc, doc]);
  const updateGuardian = useCallback((idx: number, g: Guardian) => { updateDoc((d) => { d.guardians[idx] = g; return d; }); }, [updateDoc]);

  const addDevice = useCallback(() => { updateChild((c) => { if (!c.devices) c.devices = []; c.devices.push(createDefaultDevice()); return c; }); }, [updateChild]);
  const removeDevice = useCallback((idx: number) => { updateChild((c) => { c.devices?.splice(idx, 1); return c; }); }, [updateChild]);
  const updateDevice = useCallback((idx: number, d: Device) => { updateChild((c) => { if (c.devices) c.devices[idx] = d; return c; }); }, [updateChild]);

  if (loading) return <div className="loading-screen"><div className="loading-spinner" /><p>Loading…</p></div>;
  if (!doc) return <div className="loading-screen"><p>No family policy found.</p></div>;

  const child = doc.children[selectedChildIdx];
  const policy = child?.policy;
  const showSaved = lastSaved && !saving;
  const isChildSection = POLICY_KEYS.has(activeSection);
  const enabledCount = platforms.filter((p) => p.enabled && p.endpoint).length;

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar-left">
          <button className="topbar-menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Menu"><Menu size={20} /></button>
          <h1 className="topbar-title">{doc.family_name || 'Family Policy'}</h1>
        </div>
        <div className="topbar-right">
          {showSaved && <span className="topbar-saved" role="status" aria-live="polite"><Check size={14} /> Saved</span>}
          {error && <span className="topbar-error" role="alert">{error}</span>}
          <button className="btn btn-primary btn-sm" onClick={() => save(doc)} disabled={saving || enabledCount === 0}>
            <Save size={16} /> {saving ? 'Syncing…' : enabledCount > 0 ? `Save to ${enabledCount} platform${enabledCount !== 1 ? 's' : ''}` : 'Save'}
          </button>
        </div>
      </header>

      <div className="main">
        <div className={`sidebar-backdrop ${sidebarOpen ? 'visible' : ''}`} onClick={() => setSidebarOpen(false)} />
        <nav className={`sidebar ${sidebarOpen ? 'open' : ''}`} aria-label="Policy sections">
          <div className="sidebar-group">
            <div className="sidebar-group-label">Family</div>
            {FAMILY_SECTIONS.map((s) => (
              <button key={s.key} className={`sidebar-item ${activeSection === s.key ? 'active' : ''}`} onClick={() => navigate(s.key)}>
                <span className="icon">{s.icon}</span>
                {s.label}
                {s.key === 'platforms' && enabledCount > 0 && <span className="sidebar-count">{enabledCount}</span>}
              </button>
            ))}
          </div>
          <div className="sidebar-group">
            <div className="sidebar-group-label">Children</div>
            <ChildSelector children={doc.children} selectedIdx={selectedChildIdx} onSelect={selectChild} onAdd={addChild} onRemove={removeChild} />
            <div className="sidebar-divider" />
            {child && POLICY_SECTIONS.map((s) => (
              <button key={s.key} className={`sidebar-item ${activeSection === s.key ? 'active' : ''}`} onClick={() => navigate(s.key)}>
                <span className="icon">{s.icon}</span>{s.label}
              </button>
            ))}
          </div>
        </nav>

        <main className="content">
          <div className="content-scroll">
            {isChildSection && child && <ChildHeader child={child} onChange={updateChild} />}
            {activeSection === 'family' && <FamilyPanel doc={doc} onChange={updateDoc} />}
            {activeSection === 'guardians' && <GuardiansPanel guardians={doc.guardians} onAdd={addGuardian} onRemove={removeGuardian} onUpdate={updateGuardian} />}
            {activeSection === 'platforms' && <PlatformsPanel platforms={platforms} onChange={setPlatforms} lastSyncResults={lastSyncResults} />}
            {activeSection === 'devices' && child && <DevicesPanel devices={child.devices || []} onAdd={addDevice} onRemove={removeDevice} onUpdate={updateDevice} />}
            {activeSection === 'schedule' && policy && <SchedulePanel schedule={policy.schedule || {}} onChange={(s) => updateChild((c) => { c.policy.schedule = s; return c; })} />}
            {activeSection === 'time_limits' && policy && <TimeLimitsPanel timeLimits={policy.time_limits || {}} onChange={(t) => updateChild((c) => { c.policy.time_limits = t; return c; })} />}
            {activeSection === 'content' && policy && <ContentPanel content={policy.content || {}} onChange={(ct) => updateChild((c) => { c.policy.content = ct; return c; })} />}
            {activeSection === 'apps' && policy && <AppsPanel apps={policy.apps || {}} onChange={(a) => updateChild((c) => { c.policy.apps = a; return c; })} />}
            {activeSection === 'communication' && policy && <CommunicationPanel communication={policy.communication || {}} onChange={(cm) => updateChild((c) => { c.policy.communication = cm; return c; })} />}
            {activeSection === 'spending' && policy && <SpendingPanel spending={policy.spending || {}} onChange={(sp) => updateChild((c) => { c.policy.spending = sp; return c; })} />}
            {activeSection === 'status' && policy && <StatusPanel status={policy.status || {}} onChange={(st) => updateChild((c) => { c.policy.status = st; return c; })} />}
            {activeSection === 'overrides' && policy && <OverridesPanel overrides={policy.overrides || {}} onChange={(o) => updateChild((c) => { c.policy.overrides = o; return c; })} />}
          </div>
          <div className="mobile-actions">
            <button className="btn btn-primary" onClick={() => save(doc)} disabled={saving || enabledCount === 0} style={{ flex: 1 }}>
              <Save size={16} /> {saving ? 'Syncing…' : enabledCount > 0 ? `Save to ${enabledCount} platform${enabledCount !== 1 ? 's' : ''}` : 'Save'}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
