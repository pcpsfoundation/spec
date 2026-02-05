import { v4 as uuidv4 } from 'uuid';
import type { PCPSDocument, Child, Guardian, Policy, Device } from '../types/pcps';

export function createDefaultPolicy(): Policy {
  return {
    schedule: {
      weekday: { allowed_from: '07:00', allowed_until: '20:00' },
      weekend: { allowed_from: '08:00', allowed_until: '21:00' },
      custom: [],
    },
    time_limits: {
      daily: { weekday: 60, weekend: 120 },
      by_category: [],
      by_app: [],
    },
    content: {
      max_age_rating: 12,
      web: { mode: 'filtered', allowlist: [], blocklist: [], safe_search: true },
      explicit_content: false,
    },
    apps: {
      require_approval: true,
      blocked: [],
      always_allowed: [],
    },
    communication: {
      mode: 'contacts_only',
      allowed_contacts: [],
      block_unknown_callers: true,
    },
    spending: {
      require_approval: true,
      allow_free_downloads: false,
      monthly_budget: null,
      in_app_purchases: false,
    },
    status: {
      policy_active: true,
      paused: false,
      paused_until: null,
      locked: false,
      locked_reason: null,
    },
    overrides: {
      bonus_time: null,
      temporary_rules: [],
    },
  };
}

export function createDefaultChild(name = 'New Child', age = 10): Child {
  return {
    child_id: uuidv4(),
    child_name: name,
    child_age: age,
    devices: [],
    policy: createDefaultPolicy(),
  };
}

export function createDefaultGuardian(name = '', role: 'primary' | 'guardian' = 'guardian'): Guardian {
  return { guardian_id: uuidv4(), name, email: '', role };
}

export function createDefaultDevice(): Device {
  return { device_id: uuidv4(), device_name: '', platform: 'apple', model: '' };
}

export function createDefaultDocument(): PCPSDocument {
  return {
    pcps_version: '1.1',
    family_id: uuidv4(),
    family_name: '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Europe/London',
    guardians: [createDefaultGuardian('', 'primary')],
    children: [createDefaultChild()],
    extensions: {},
  };
}

export const EXAMPLE_DOCUMENT: PCPSDocument = {
  pcps_version: '1.1',
  family_id: 'f1a2b3c4-d5e6-7890-abcd-ef1234567890',
  family_name: 'The Smiths',
  created_at: '2026-01-15T10:00:00Z',
  updated_at: '2026-02-06T08:00:00Z',
  timezone: 'Europe/London',
  guardians: [
    { guardian_id: 'g1000001-aaaa-bbbb-cccc-ddddeeeeeeee', name: 'Sarah Smith', email: 'sarah@example.com', role: 'primary' },
    { guardian_id: 'g2000002-aaaa-bbbb-cccc-ddddeeeeeeee', name: 'James Smith', email: 'james@example.com', role: 'guardian' },
  ],
  children: [
    {
      child_id: 'child-001',
      child_name: 'Alex',
      child_age: 10,
      devices: [
        { device_id: 'device-001', device_name: "Alex's iPad", platform: 'apple', model: 'iPad Air' },
        { device_id: 'device-002', device_name: "Alex's Switch", platform: 'nintendo', model: 'Switch OLED' },
      ],
      policy: {
        schedule: {
          weekday: { allowed_from: '07:00', allowed_until: '19:30' },
          weekend: { allowed_from: '08:00', allowed_until: '20:30' },
          custom: [{ days: ['wednesday'], allowed_from: '07:00', allowed_until: '18:00' }],
        },
        time_limits: {
          daily: { weekday: 60, weekend: 120 },
          by_category: [
            { category: 'games', daily_minutes: 30 },
            { category: 'educational', daily_minutes: null },
            { category: 'social_media', daily_minutes: 0 },
          ],
          by_app: [{ app_name: 'Clash of Clans', daily_minutes: 15 }],
        },
        content: {
          max_age_rating: 12,
          web: { mode: 'filtered', allowlist: [], blocklist: ['reddit.com', '4chan.org'], safe_search: true },
          explicit_content: false,
        },
        apps: {
          require_approval: true,
          blocked: [{ app_name: 'TikTok', reason: 'Not age appropriate' }],
          always_allowed: [{ app_name: 'Messages' }, { app_name: 'School Homework App' }],
        },
        communication: {
          mode: 'contacts_only',
          allowed_contacts: [
            { name: 'Mum', identifiers: ['+447700000000', 'mum@example.com'] },
            { name: 'Dad', identifiers: ['+447700000001'] },
            { name: 'Gran', identifiers: ['+447700000002'] },
          ],
          block_unknown_callers: true,
        },
        spending: { require_approval: true, allow_free_downloads: false, monthly_budget: { amount: 5, currency: 'GBP' }, in_app_purchases: false },
        status: { policy_active: true, paused: false, paused_until: null, locked: false, locked_reason: null },
        overrides: { bonus_time: null, temporary_rules: [] },
      },
    },
    {
      child_id: 'child-002',
      child_name: 'Emma',
      child_age: 7,
      devices: [{ device_id: 'device-003', device_name: "Emma's Fire Tablet", platform: 'amazon', model: 'Fire HD 10 Kids' }],
      policy: {
        schedule: {
          weekday: { allowed_from: '08:00', allowed_until: '18:00' },
          weekend: { allowed_from: '08:00', allowed_until: '19:00' },
        },
        time_limits: {
          daily: { weekday: 45, weekend: 90 },
          by_category: [
            { category: 'games', daily_minutes: 20 },
            { category: 'educational', daily_minutes: null },
            { category: 'video', daily_minutes: 30 },
          ],
        },
        content: {
          max_age_rating: 7,
          web: { mode: 'allowlist', allowlist: ['khanacademy.org', 'bbc.co.uk/bitesize', 'pbskids.org'], blocklist: [], safe_search: true },
          explicit_content: false,
        },
        apps: { require_approval: true, blocked: [], always_allowed: [{ app_name: 'School Homework App' }] },
        communication: {
          mode: 'contacts_only',
          allowed_contacts: [
            { name: 'Mum', identifiers: ['+447700000000'] },
            { name: 'Dad', identifiers: ['+447700000001'] },
          ],
          block_unknown_callers: true,
        },
        spending: { require_approval: true, allow_free_downloads: false, monthly_budget: null, in_app_purchases: false },
        status: { policy_active: true, paused: false, paused_until: null, locked: false, locked_reason: null },
        overrides: { bonus_time: null, temporary_rules: [] },
      },
    },
  ],
  extensions: {},
};
