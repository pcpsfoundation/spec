// PCPS v1.1 Types

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export type AppCategory = 'games' | 'social_media' | 'educational' | 'video' | 'music' | 'creativity' | 'browsing' | 'communication' | 'other';

export type GuardianRole = 'primary' | 'guardian';

export type WebFilterMode = 'allowlist' | 'blocklist' | 'filtered';

export type CommunicationMode = 'unrestricted' | 'contacts_only' | 'disabled';

export type OverrideType = 'extend_schedule' | 'extra_time' | 'unblock_app' | 'unblock_site';

export interface Guardian {
  guardian_id: string;
  name: string;
  email?: string;
  role: GuardianRole;
}

export interface Device {
  device_id: string;
  device_name: string;
  platform: string;
  model?: string;
}

export interface TimeWindow {
  allowed_from: string; // HH:MM
  allowed_until: string; // HH:MM
}

export interface CustomSchedule extends TimeWindow {
  days: DayOfWeek[];
}

export interface Schedule {
  weekday?: TimeWindow;
  weekend?: TimeWindow;
  custom?: CustomSchedule[];
}

export interface CategoryLimit {
  category: AppCategory;
  daily_minutes: number | null;
}

export interface AppTimeLimit {
  app_name: string;
  daily_minutes: number | null;
}

export interface TimeLimits {
  daily?: {
    weekday?: number;
    weekend?: number;
  };
  by_category?: CategoryLimit[];
  by_app?: AppTimeLimit[];
}

export interface Content {
  max_age_rating?: number;
  web?: WebFilter;
  explicit_content?: boolean;
}

export interface WebFilter {
  mode?: WebFilterMode;
  allowlist?: string[];
  blocklist?: string[];
  safe_search?: boolean;
}

export interface AppEntry {
  app_name: string;
  reason?: string;
}

export interface Apps {
  require_approval?: boolean;
  blocked?: AppEntry[];
  always_allowed?: AppEntry[];
}

export interface Contact {
  name: string;
  identifiers: string[];
}

export interface Communication {
  mode?: CommunicationMode;
  allowed_contacts?: Contact[];
  block_unknown_callers?: boolean;
}

export interface MonthlyBudget {
  amount: number;
  currency: string;
}

export interface Spending {
  require_approval?: boolean;
  allow_free_downloads?: boolean;
  monthly_budget?: MonthlyBudget | null;
  in_app_purchases?: boolean;
}

export interface Status {
  policy_active?: boolean;
  paused?: boolean;
  paused_until?: string | null;
  locked?: boolean;
  locked_reason?: string | null;
}

export interface BonusTime {
  minutes: number;
  reason?: string;
  granted_at: string;
  expires_at: string;
}

export interface TemporaryRule {
  type: OverrideType;
  date: string;
  reason?: string;
  [key: string]: unknown;
}

export interface Overrides {
  bonus_time?: BonusTime | null;
  temporary_rules?: TemporaryRule[];
}

export interface Policy {
  schedule?: Schedule;
  time_limits?: TimeLimits;
  content?: Content;
  apps?: Apps;
  communication?: Communication;
  spending?: Spending;
  status?: Status;
  overrides?: Overrides;
  extensions?: Record<string, Record<string, unknown>>;
}

export interface Child {
  child_id: string;
  child_name: string;
  child_age?: number;
  timezone?: string;
  devices?: Device[];
  policy: Policy;
}

export interface PCPSDocument {
  pcps_version: '1.1';
  family_id: string;
  family_name?: string;
  created_at?: string;
  updated_at?: string;
  timezone: string;
  guardians: Guardian[];
  children: Child[];
  extensions?: Record<string, Record<string, unknown>>;
}
