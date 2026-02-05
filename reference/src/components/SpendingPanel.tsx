import { Wallet } from "lucide-react";
import type { Spending } from '../types/pcps';
import { SectionHeader, Card, Field, NumberInput, TextInput, Toggle } from './FormFields';

interface Props {
  spending: Spending;
  onChange: (s: Spending) => void;
}

export function SpendingPanel({ spending, onChange }: Props) {
  const update = (patch: Partial<Spending>) => onChange({ ...spending, ...patch });

  const hasBudget = spending.monthly_budget != null;

  return (
    <div>
      <SectionHeader icon={<Wallet size={22} />} title="Spending" description="Control purchases and in-app transactions" />

      <Card>
        <Toggle checked={spending.require_approval ?? true} onChange={(v) => update({ require_approval: v })} label="Require guardian approval for all purchases" />
        <Toggle checked={spending.allow_free_downloads ?? false} onChange={(v) => update({ allow_free_downloads: v })} label="Allow free app downloads without approval" />
        <Toggle checked={spending.in_app_purchases ?? false} onChange={(v) => update({ in_app_purchases: v })} label="Allow in-app purchases" />
      </Card>

      <Card>
        <h3 className="card-subtitle">Monthly Budget</h3>
        <Toggle checked={hasBudget} onChange={(v) => update({ monthly_budget: v ? { amount: 10, currency: 'GBP' } : null })} label="Set a monthly spending limit" />
        {hasBudget && spending.monthly_budget && (
          <div className="inline-row" style={{ marginTop: 12 }}>
            <Field label="Amount">
              <NumberInput min={0} step={0.5} value={spending.monthly_budget.amount} onChange={(e) => update({ monthly_budget: { ...spending.monthly_budget!, amount: Number(e.target.value) } })} />
            </Field>
            <Field label="Currency">
              <TextInput value={spending.monthly_budget.currency} onChange={(e) => update({ monthly_budget: { ...spending.monthly_budget!, currency: e.target.value.toUpperCase() } })} placeholder="GBP" maxLength={3} style={{ width: 80 }} />
            </Field>
          </div>
        )}
      </Card>
    </div>
  );
}
