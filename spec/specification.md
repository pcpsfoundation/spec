# Parental Controls Policy Specification (PCPS)

**Version:** 1.0.
**Date:** 2026-02-06.
**Status:** Draft.

---

## 1. Introduction

### 1.1 Purpose

The Parental Controls Policy Specification (PCPS) defines a vendor-neutral, portable data format for expressing parental control policies across devices and platforms. It enables parents to define rules once and apply them consistently, regardless of whether their child uses an Apple, Google, Microsoft, Nintendo, or any other device.

### 1.2 Problem Statement

Today, parental controls are fragmented. A parent with a child who uses an iPad, an Android phone, a Windows PC, and a Nintendo Switch must configure four separate, incompatible systems. There is no open standard that allows a parent to express rules like "no screen time after 8pm" and have that policy understood by every device.

No existing open standard (IEEE 2089, ISO 27566, W3C PICS, etc.) addresses this. They focus on content labelling, age verification, or age-appropriate design — not on portable, machine-readable parental policies.

### 1.3 Goals

- Define a **simple, human-readable** format (JSON) for parental control policies
- Represent a **complete family** — guardians, children, and all their policies — in a single document
- Cover the **common denominator** of features across major platforms
- Be **portable** — a policy created for one platform should be meaningful on another
- Be **extensible** — platforms can add vendor-specific extensions without breaking the spec
- Remain **privacy-conscious** — the spec describes policy, not surveillance

### 1.4 Non-Goals

- API transport specification (HTTP methods, endpoints, authentication)
- Activity logging or monitoring
- Location tracking
- Content classification systems (use existing rating systems by reference)

---

## 2. Terminology

| Term         | Definition                                                                               |
| ------------ | ---------------------------------------------------------------------------------------- |
| **Family**   | The top-level unit. A PCPS document describes one family.                                |
| **Guardian** | An adult responsible for one or more children, who creates and manages policies          |
| **Child**    | An individual whose device usage is governed by a policy                                 |
| **Policy**   | The set of rules for one child (schedule, time limits, content, apps, etc.)              |
| **Platform** | A device or service that enforces policies (e.g. iOS, Android, Windows, Nintendo Switch) |
| **Adapter**  | Software that translates a PCPS document into platform-native controls                   |

---

## 3. Document Structure

A PCPS document is a single JSON object representing one family. It contains guardians, children, and each child's policy.

```json
{
  "pcps_version": "1.0",
  "family_id": "uuid",
  "family_name": "string",
  "created_at": "ISO 8601 datetime",
  "updated_at": "ISO 8601 datetime",
  "timezone": "IANA timezone",
  "guardians": [],
  "children": [],
  "extensions": {}
}
```

### 3.1 Required Fields

| Field          | Type          | Description                                                                        |
| -------------- | ------------- | ---------------------------------------------------------------------------------- |
| `pcps_version` | string        | Must be `"1.0"`                                                                    |
| `family_id`    | string (UUID) | Unique identifier for this family                                                  |
| `timezone`     | string        | IANA timezone (e.g. `"Europe/London"`) used as the default for all time references |
| `guardians`    | array         | At least one guardian                                                              |
| `children`     | array         | At least one child with a policy                                                   |

### 3.2 Optional Fields

| Field         | Type              | Description                                     |
| ------------- | ----------------- | ----------------------------------------------- |
| `family_name` | string            | Display name for the family (e.g. "The Smiths") |
| `created_at`  | string (ISO 8601) | When the document was first created             |
| `updated_at`  | string (ISO 8601) | When the document was last modified             |

---

## 4. Guardians

The `guardians` array lists all adults who can manage this family's policies.

```json
{
  "guardians": [
    {
      "guardian_id": "uuid",
      "name": "Sarah Smith",
      "email": "sarah@example.com",
      "role": "primary"
    },
    {
      "guardian_id": "uuid",
      "name": "James Smith",
      "email": "james@example.com",
      "role": "guardian"
    }
  ]
}
```

### 4.1 Fields

| Field         | Type          | Description                                                                                           |
| ------------- | ------------- | ----------------------------------------------------------------------------------------------------- |
| `guardian_id` | string (UUID) | Unique identifier for this guardian                                                                   |
| `name`        | string        | Display name                                                                                          |
| `email`       | string        | Contact email                                                                                         |
| `role`        | string        | `"primary"` (can manage all settings and other guardians) or `"guardian"` (can manage child policies) |

### 4.2 Rules

- At least one guardian MUST have the role `"primary"`
- Guardian identity and authentication are outside the scope of this spec — the `guardian_id` is an opaque identifier that the implementing service manages

---

## 5. Children

The `children` array contains one entry per child, each with their own policy.

```json
{
  "children": [
    {
      "child_id": "child-001",
      "child_name": "Alex",
      "child_age": 10,
      "timezone": "Europe/London",
      "devices": [],
      "policy": {}
    }
  ]
}
```

### 5.1 Fields

| Field        | Type    | Description                                                  |
| ------------ | ------- | ------------------------------------------------------------ |
| `child_id`   | string  | Unique identifier for this child                             |
| `child_name` | string  | Display name                                                 |
| `child_age`  | integer | Age of the child (0–17)                                      |
| `timezone`   | string  | (Optional) Override the family-level timezone for this child |
| `devices`    | array   | (Optional) Devices linked to this child                      |
| `policy`     | object  | The child's parental control policy                          |

### 5.2 Devices

Each child may optionally list the devices their policy applies to.

```json
{
  "devices": [
    {
      "device_id": "device-001",
      "device_name": "Alex's iPad",
      "platform": "apple",
      "model": "iPad Air"
    }
  ]
}
```

| Field         | Type   | Description                                                                                                        |
| ------------- | ------ | ------------------------------------------------------------------------------------------------------------------ |
| `device_id`   | string | Unique identifier for the device                                                                                   |
| `device_name` | string | Human-readable name                                                                                                |
| `platform`    | string | Platform identifier: `"apple"`, `"google"`, `"microsoft"`, `"nintendo"`, `"sony"`, `"amazon"`, or other vendor key |
| `model`       | string | (Optional) Device model                                                                                            |

If `devices` is omitted or empty, the policy applies to all devices associated with the child.

---

## 6. Policy

Each child's `policy` object contains the following sections. All sections are optional — omitting a section means the platform's defaults apply.

```json
{
  "policy": {
    "schedule": {},
    "time_limits": {},
    "content": {},
    "apps": {},
    "communication": {},
    "spending": {},
    "status": {},
    "overrides": {}
  }
}
```

---

## 7. Schedule

The `schedule` section defines when a device may be used. It represents allowed time windows.

```json
{
  "schedule": {
    "weekday": {
      "allowed_from": "07:00",
      "allowed_until": "20:00"
    },
    "weekend": {
      "allowed_from": "08:00",
      "allowed_until": "21:00"
    },
    "custom": [
      {
        "days": ["wednesday"],
        "allowed_from": "07:00",
        "allowed_until": "18:00"
      }
    ]
  }
}
```

### 7.1 Fields

| Field     | Type   | Description                             |
| --------- | ------ | --------------------------------------- |
| `weekday` | object | Default schedule for Monday–Friday      |
| `weekend` | object | Default schedule for Saturday–Sunday    |
| `custom`  | array  | Overrides for specific days of the week |

Each schedule object contains:

| Field           | Type           | Description                          |
| --------------- | -------------- | ------------------------------------ |
| `allowed_from`  | string (HH:MM) | Earliest time the device can be used |
| `allowed_until` | string (HH:MM) | Latest time the device can be used   |

Custom entries additionally include:

| Field  | Type             | Description                                                                                                           |
| ------ | ---------------- | --------------------------------------------------------------------------------------------------------------------- |
| `days` | array of strings | Days this rule applies to. Valid values: `monday`, `tuesday`, `wednesday`, `thursday`, `friday`, `saturday`, `sunday` |

### 7.2 Resolution Order

1. If a `custom` entry exists for the current day, it takes precedence
2. Otherwise, `weekend` applies on Saturday and Sunday
3. Otherwise, `weekday` applies on Monday through Friday

### 7.3 Behaviour

Outside allowed hours, the device should prevent new sessions from starting. Platforms MAY choose to warn the child before the end of the allowed window (e.g. a 5-minute warning). When the allowed window ends, the platform SHOULD gracefully end the session (e.g. save state, then lock).

---

## 8. Time Limits

The `time_limits` section restricts **how long** a device or app can be used, independent of the schedule.

```json
{
  "time_limits": {
    "daily": {
      "weekday": 60,
      "weekend": 120
    },
    "by_category": [
      {
        "category": "games",
        "daily_minutes": 30
      },
      {
        "category": "social_media",
        "daily_minutes": 20
      },
      {
        "category": "educational",
        "daily_minutes": null
      }
    ],
    "by_app": [
      {
        "app_name": "Example Game",
        "daily_minutes": 15
      }
    ]
  }
}
```

### 8.1 Fields

| Field           | Type    | Description                                 |
| --------------- | ------- | ------------------------------------------- |
| `daily`         | object  | Overall daily screen time limits in minutes |
| `daily.weekday` | integer | Minutes allowed Monday–Friday               |
| `daily.weekend` | integer | Minutes allowed Saturday–Sunday             |
| `by_category`   | array   | Time limits per app category                |
| `by_app`        | array   | Time limits for specific apps               |

A value of `null` for any minutes field means **unlimited** (no limit applied).

### 8.2 Categories

The following categories are the **canonical PCPS category list**. This is the universal taxonomy — the PCPS document only stores these values. Platform adapters are responsible for mapping their native app categories to this list.

| Category        | Description                          | Example platform mappings                                          |
| --------------- | ------------------------------------ | ------------------------------------------------------------------ |
| `games`         | Games and entertainment apps         | Apple: Games; Google Play: Games                                   |
| `social_media`  | Social networking and messaging apps | Apple: Social Networking; Google Play: Social                      |
| `educational`   | Learning and educational apps        | Apple: Education; Google Play: Education                           |
| `video`         | Video streaming apps                 | Apple: Entertainment (video); Google Play: Video Players           |
| `music`         | Music and audio apps                 | Apple: Music; Google Play: Music & Audio                           |
| `creativity`    | Drawing, music creation, coding apps | Apple: Productivity/Photo & Video; Google Play: Art & Design       |
| `browsing`      | Web browsers                         | Apple: Utilities (browsers); Google Play: Communication (browsers) |
| `communication` | Phone, video calling, messaging      | Apple: Social Networking (calling); Google Play: Communication     |
| `other`         | Anything not categorised above       | Default for unmapped categories                                    |

Platform adapters MUST map their native categories to this list. Apps that span multiple categories should be mapped to the most relevant one. If a platform category has no clear match, it should be mapped to `other`.

Vendor apps MAY present these categories using friendlier labels in their UI (e.g. "Social Media" instead of `social_media`), but the value stored in the PCPS document MUST be from this list.

### 8.3 Precedence

Time limits are applied in this order (most specific wins):

1. **by_app** — if a per-app limit exists, it applies to that app
2. **by_category** — if a per-category limit exists, it applies to apps in that category
3. **daily** — the overall daily limit always applies regardless of per-app or per-category limits

All limits are enforced independently. A child hitting a 30-minute `games` limit cannot continue playing even if their daily limit has not been reached.

---

## 9. Content Filtering

The `content` section defines what content the child may access.

```json
{
  "content": {
    "max_age_rating": 12,
    "web": {
      "mode": "allowlist",
      "allowlist": ["education.com", "khanacademy.org", "bbc.co.uk/bitesize"],
      "blocklist": [],
      "safe_search": true
    },
    "explicit_content": false
  }
}
```

### 9.1 Age Rating

| Field            | Type    | Description                                                                       |
| ---------------- | ------- | --------------------------------------------------------------------------------- |
| `max_age_rating` | integer | Maximum content age allowed (0–18). Content rated above this age will be blocked. |

The PCPS document stores a single, universal age number. Platform adapters are responsible for mapping this to their native rating system:

| max_age_rating | PEGI    | ESRB | USK    | CERO   |
| -------------- | ------- | ---- | ------ | ------ |
| 0–2            | PEGI 3  | EC   | USK 0  | CERO A |
| 3–6            | PEGI 3  | E    | USK 0  | CERO A |
| 7–9            | PEGI 7  | E    | USK 6  | CERO A |
| 10–11          | PEGI 12 | E10+ | USK 12 | CERO B |
| 12–15          | PEGI 12 | T    | USK 12 | CERO B |
| 16–17          | PEGI 16 | M    | USK 16 | CERO C |
| 18             | PEGI 18 | AO   | USK 18 | CERO Z |

This mapping is advisory. Adapters SHOULD map to the nearest restrictive rating that does not exceed the child's `max_age_rating`. For example, a child with `max_age_rating: 13` on a PEGI platform should be allowed up to PEGI 12 but not PEGI 16.

A vendor app MAY present a simplified set of age choices (e.g. the PEGI breakpoints: 3, 7, 12, 16, 18) in its UI. The app stores the chosen age number in the PCPS document, not the rating label. This ensures the policy is portable to platforms using different rating systems.

### 9.2 Web Filtering

| Field         | Type             | Description                                                                                                                                                            |
| ------------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `mode`        | string           | `"allowlist"` (only listed sites allowed), `"blocklist"` (listed sites blocked, all others allowed), or `"filtered"` (platform applies its own age-appropriate filter) |
| `allowlist`   | array of strings | Domains permitted (used when mode is `allowlist`)                                                                                                                      |
| `blocklist`   | array of strings | Domains blocked (used when mode is `blocklist` or `filtered`)                                                                                                          |
| `safe_search` | boolean          | Whether to enforce safe search on supported search engines                                                                                                             |

### 9.3 Explicit Content

| Field              | Type    | Description                                                                |
| ------------------ | ------- | -------------------------------------------------------------------------- |
| `explicit_content` | boolean | Whether explicit/mature content is allowed in music, podcasts, books, etc. |

---

## 10. App Controls

The `apps` section defines which apps can be installed and used.

```json
{
  "apps": {
    "require_approval": true,
    "blocked": [
      {
        "app_name": "Bad App",
        "reason": "Not age appropriate"
      }
    ],
    "always_allowed": [
      {
        "app_name": "School App"
      }
    ]
  }
}
```

### 10.1 Fields

| Field              | Type    | Description                                                                          |
| ------------------ | ------- | ------------------------------------------------------------------------------------ |
| `require_approval` | boolean | If `true`, new app installations require guardian approval                           |
| `blocked`          | array   | Apps that are explicitly blocked                                                     |
| `always_allowed`   | array   | Apps that are always available, even during downtime or when time limits are reached |

Each app entry contains:

| Field      | Type   | Description                                                                      |
| ---------- | ------ | -------------------------------------------------------------------------------- |
| `app_name` | string | Human-readable app name. This is the canonical identifier used across platforms. |
| `reason`   | string | (Optional) Reason for blocking                                                   |

The PCPS document identifies apps by name, not by platform-specific identifiers (e.g. bundle IDs or package names). Platform adapters are responsible for resolving app names to their native identifiers. This ensures that blocking "TikTok" works on every platform regardless of whether the underlying ID is `com.zhiliaoapp.musically` (iOS) or `com.ss.android.ugc.trill` (Android).

### 10.2 Always-Allowed Apps

Apps in the `always_allowed` list are exempt from schedule and time limit restrictions. This is intended for essential apps such as phone/emergency calling, school apps, or medical apps. They are NOT exempt from content filtering.

---

## 11. Communication

The `communication` section controls who the child can communicate with.

```json
{
  "communication": {
    "mode": "contacts_only",
    "allowed_contacts": [
      {
        "name": "Mum",
        "identifiers": ["+44700000000", "mum@example.com"]
      },
      {
        "name": "Dad",
        "identifiers": ["+44700000001"]
      }
    ],
    "block_unknown_callers": true
  }
}
```

### 11.1 Fields

| Field                   | Type    | Description                                                                                      |
| ----------------------- | ------- | ------------------------------------------------------------------------------------------------ |
| `mode`                  | string  | `"unrestricted"`, `"contacts_only"` (only approved contacts), or `"disabled"` (no communication) |
| `allowed_contacts`      | array   | List of approved contacts (used when mode is `contacts_only`)                                    |
| `block_unknown_callers` | boolean | Block incoming calls/messages from unknown numbers                                               |

Each contact entry contains:

| Field         | Type             | Description                                                      |
| ------------- | ---------------- | ---------------------------------------------------------------- |
| `name`        | string           | Display name of the contact                                      |
| `identifiers` | array of strings | Phone numbers, email addresses, or platform-specific identifiers |

---

## 12. Spending

The `spending` section controls purchases and in-app transactions.

```json
{
  "spending": {
    "require_approval": true,
    "allow_free_downloads": true,
    "monthly_budget": {
      "amount": 10.0,
      "currency": "GBP"
    },
    "in_app_purchases": false
  }
}
```

### 12.1 Fields

| Field                     | Type    | Description                                                       |
| ------------------------- | ------- | ----------------------------------------------------------------- |
| `require_approval`        | boolean | If `true`, all purchases require guardian approval                |
| `allow_free_downloads`    | boolean | Whether the child can download free apps/content without approval |
| `monthly_budget`          | object  | (Optional) Monthly spending limit                                 |
| `monthly_budget.amount`   | number  | Budget amount                                                     |
| `monthly_budget.currency` | string  | ISO 4217 currency code (e.g. `"GBP"`, `"USD"`, `"EUR"`)           |
| `in_app_purchases`        | boolean | Whether in-app purchases are permitted                            |

---

## 13. Device Status

The `status` section represents the current enforcement state of the policy.

```json
{
  "status": {
    "policy_active": true,
    "paused": false,
    "paused_until": null,
    "locked": false,
    "locked_reason": null
  }
}
```

### 13.1 Fields

| Field           | Type                      | Description                                                                      |
| --------------- | ------------------------- | -------------------------------------------------------------------------------- |
| `policy_active` | boolean                   | Whether this policy is currently active                                          |
| `paused`        | boolean                   | Whether enforcement is temporarily paused (e.g. "free time" granted by guardian) |
| `paused_until`  | string (ISO 8601) or null | When the pause expires. `null` means paused indefinitely until manually resumed  |
| `locked`        | boolean                   | Whether the device is in emergency lockdown (no usage allowed)                   |
| `locked_reason` | string or null            | (Optional) Reason displayed to the child                                         |

### 13.2 Status Precedence

1. If `locked` is `true`, the device is fully locked regardless of other settings
2. If `paused` is `true`, all schedule and time limit restrictions are suspended
3. If `policy_active` is `false`, no rules are enforced

---

## 14. Overrides

The `overrides` section allows temporary modifications to the policy without changing the base rules.

```json
{
  "overrides": {
    "bonus_time": {
      "minutes": 30,
      "reason": "Good behaviour",
      "granted_at": "2026-02-06T18:00:00Z",
      "expires_at": "2026-02-06T23:59:59Z"
    },
    "temporary_rules": [
      {
        "type": "extend_schedule",
        "allowed_until": "22:00",
        "date": "2026-02-14",
        "reason": "Sleepover"
      }
    ]
  }
}
```

### 14.1 Bonus Time

| Field        | Type              | Description                                     |
| ------------ | ----------------- | ----------------------------------------------- |
| `minutes`    | integer           | Extra minutes granted on top of the daily limit |
| `reason`     | string            | (Optional) Why the bonus was granted            |
| `granted_at` | string (ISO 8601) | When the bonus was granted                      |
| `expires_at` | string (ISO 8601) | When the bonus expires if unused                |

### 14.2 Temporary Rules

Temporary rules override the corresponding base section for a specific date or date range.

| Field    | Type                | Description                                                                          |
| -------- | ------------------- | ------------------------------------------------------------------------------------ |
| `type`   | string              | The type of override: `extend_schedule`, `extra_time`, `unblock_app`, `unblock_site` |
| `date`   | string (YYYY-MM-DD) | The date this override applies to                                                    |
| `reason` | string              | (Optional) Explanation for the override                                              |

Additional fields depend on the `type` — see examples above.

---

## 15. Extensions

The `extensions` section allows platforms to include vendor-specific features that are not part of the core spec. Extensions can appear at the family level (top-level `extensions`) or within a child's policy.

```json
{
  "extensions": {
    "apple": {
      "communication_safety": true,
      "ask_to_buy": true
    },
    "google": {
      "school_time": {
        "enabled": true,
        "apps": ["com.google.classroom"]
      }
    }
  }
}
```

### 15.1 Rules

- Extensions MUST be namespaced under a vendor key (e.g. `"apple"`, `"google"`, `"microsoft"`, `"nintendo"`)
- Extensions MUST NOT duplicate functionality available in the core spec
- Adapters SHOULD ignore extensions they do not understand
- Extensions SHOULD NOT be required for basic policy enforcement

---

## 16. Complete Example

See `examples/example.pcps.json` for a complete two-guardian, two-child family document with different policies per child, device listings, and a range of restrictions.

---

## 17. Playground & Tooling

### 17.1 Schema File

The JSON Schema is available at:

```
spec/schema.json
```

To use it in your editor (VS Code, JetBrains, etc.), reference it in your JSON file:

```json
{
  "$schema": "https://raw.githubusercontent.com/pcpsfoundation/spec/master/spec/schema.json",
  "pcps_version": "1.0",
  ...
}
```

Most editors will provide autocomplete and inline validation automatically.

---

## Appendix A. JSON Schema

A formal JSON Schema for validating PCPS documents is published alongside this specification at:

```
spec/schema.json
```

---

## Appendix B. Platform Mapping

This appendix shows how PCPS policy sections map to features on major platforms.

### B.1 Apple Screen Time

| PCPS Section                | Apple Screen Time Feature                         |
| --------------------------- | ------------------------------------------------- |
| `schedule`                  | Downtime                                          |
| `time_limits.daily`         | Screen Time daily limit                           |
| `time_limits.by_category`   | App Limits (by category)                          |
| `time_limits.by_app`        | App Limits (per app)                              |
| `content.age_ratings`       | Content & Privacy Restrictions → Content Ratings  |
| `content.web`               | Content & Privacy Restrictions → Web Content      |
| `content.explicit_content`  | Content & Privacy Restrictions → Explicit Content |
| `apps.require_approval`     | Ask to Buy                                        |
| `apps.blocked`              | Block apps                                        |
| `apps.always_allowed`       | Always Allowed                                    |
| `communication`             | Communication Limits                              |
| `spending.require_approval` | Ask to Buy                                        |
| `spending.in_app_purchases` | iTunes & App Store Purchases                      |
| `status.paused`             | (no direct equivalent)                            |
| `status.locked`             | (no direct equivalent)                            |
| `overrides.bonus_time`      | "One More Minute" / approve more time             |

### B.2 Google Family Link

| PCPS Section                | Family Link Feature               |
| --------------------------- | --------------------------------- |
| `schedule`                  | Bedtime                           |
| `time_limits.daily`         | Daily limit                       |
| `time_limits.by_app`        | App limits                        |
| `content.age_ratings`       | Google Play content restrictions  |
| `content.web`               | Google SafeSearch, Chrome filters |
| `apps.require_approval`     | Require approval for apps         |
| `apps.blocked`              | Block apps                        |
| `spending.require_approval` | Purchase approvals                |
| `overrides.bonus_time`      | Bonus time                        |
| `status.locked`             | Lock device                       |

### B.3 Microsoft Family Safety

| PCPS Section          | Family Safety Feature         |
| --------------------- | ----------------------------- |
| `schedule`            | Screen time schedule          |
| `time_limits.daily`   | Screen time limits            |
| `time_limits.by_app`  | App and game limits           |
| `content.age_ratings` | Content restrictions          |
| `content.web`         | Web and search filters (Edge) |
| `apps.blocked`        | Block apps                    |
| `spending`            | Spending controls             |

### B.4 Nintendo Switch Parental Controls

| PCPS Section          | Nintendo Feature                 |
| --------------------- | -------------------------------- |
| `schedule`            | Bedtime alarm                    |
| `time_limits.daily`   | Play time limit                  |
| `content.age_ratings` | Restriction level                |
| `communication`       | Communication restrictions       |
| `apps.always_allowed` | Whitelist                        |
| `spending`            | eShop restrictions (via Account) |
| `status.paused`       | Disable for today                |

---

## Authors

- Richard Midwinter (PCPS Foundation)

---

## License

This specification is released under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
