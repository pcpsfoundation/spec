import { Calendar } from "lucide-react";
import type { Schedule, CustomSchedule, DayOfWeek } from '../types/pcps';
import { SectionHeader, Card, Field, TimeInput } from './FormFields';

const DAYS: { value: DayOfWeek; label: string; short: string }[] = [
  { value: 'monday', label: 'Monday', short: 'Mon' },
  { value: 'tuesday', label: 'Tuesday', short: 'Tue' },
  { value: 'wednesday', label: 'Wednesday', short: 'Wed' },
  { value: 'thursday', label: 'Thursday', short: 'Thu' },
  { value: 'friday', label: 'Friday', short: 'Fri' },
  { value: 'saturday', label: 'Saturday', short: 'Sat' },
  { value: 'sunday', label: 'Sunday', short: 'Sun' },
];

interface Props {
  schedule: Schedule;
  onChange: (s: Schedule) => void;
}

export function SchedulePanel({ schedule, onChange }: Props) {
  const update = (patch: Partial<Schedule>) => onChange({ ...schedule, ...patch });

  const addCustom = () => {
    const custom = schedule.custom || [];
    update({ custom: [...custom, { days: ['wednesday'], allowed_from: '07:00', allowed_until: '18:00' }] });
  };

  const updateCustom = (idx: number, c: CustomSchedule) => {
    const custom = [...(schedule.custom || [])];
    custom[idx] = c;
    update({ custom });
  };

  const removeCustom = (idx: number) => {
    const custom = [...(schedule.custom || [])];
    custom.splice(idx, 1);
    update({ custom });
  };

  const toggleDay = (customIdx: number, day: DayOfWeek) => {
    const c = { ...(schedule.custom || [])[customIdx] };
    c.days = c.days.includes(day) ? c.days.filter((d) => d !== day) : [...c.days, day];
    if (c.days.length > 0) updateCustom(customIdx, c);
  };

  return (
    <div>
      <SectionHeader icon={<Calendar size={22} />} title="Schedule" description="When the device may be used" />

      <Card>
        <h3 className="card-subtitle">Weekdays (Mon–Fri)</h3>
        <div className="inline-row">
          <Field label="From">
            <TimeInput value={schedule.weekday?.allowed_from || '07:00'} onChange={(e) => update({ weekday: { allowed_from: e.target.value, allowed_until: schedule.weekday?.allowed_until || '20:00' } })} />
          </Field>
          <Field label="Until">
            <TimeInput value={schedule.weekday?.allowed_until || '20:00'} onChange={(e) => update({ weekday: { allowed_from: schedule.weekday?.allowed_from || '07:00', allowed_until: e.target.value } })} />
          </Field>
        </div>
      </Card>

      <Card>
        <h3 className="card-subtitle">Weekends (Sat–Sun)</h3>
        <div className="inline-row">
          <Field label="From">
            <TimeInput value={schedule.weekend?.allowed_from || '08:00'} onChange={(e) => update({ weekend: { allowed_from: e.target.value, allowed_until: schedule.weekend?.allowed_until || '21:00' } })} />
          </Field>
          <Field label="Until">
            <TimeInput value={schedule.weekend?.allowed_until || '21:00'} onChange={(e) => update({ weekend: { allowed_from: schedule.weekend?.allowed_from || '08:00', allowed_until: e.target.value } })} />
          </Field>
        </div>
      </Card>

      {(schedule.custom || []).map((c, i) => (
        <Card key={i} className="card-removable">
          <div className="card-header-row">
            <h3 className="card-subtitle">Custom Override #{i + 1}</h3>
            <button className="btn btn-danger btn-sm" onClick={() => removeCustom(i)}>Remove</button>
          </div>
          <Field label="Days">
            <div className="day-picker">
              {DAYS.map((d) => (
                <button key={d.value} className={`day-btn ${c.days.includes(d.value) ? 'active' : ''}`} onClick={() => toggleDay(i, d.value)}>
                  {d.short}
                </button>
              ))}
            </div>
          </Field>
          <div className="inline-row">
            <Field label="From">
              <TimeInput value={c.allowed_from} onChange={(e) => updateCustom(i, { ...c, allowed_from: e.target.value })} />
            </Field>
            <Field label="Until">
              <TimeInput value={c.allowed_until} onChange={(e) => updateCustom(i, { ...c, allowed_until: e.target.value })} />
            </Field>
          </div>
        </Card>
      ))}

      <button className="btn btn-secondary btn-add" onClick={addCustom}>+ Add Custom Day Override</button>
    </div>
  );
}
