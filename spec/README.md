# PCPS — Parental Controls Policy Specification

An open standard for defining parental control policies in a vendor-neutral, portable JSON format. Define once, apply everywhere.

## The Problem

Every platform has parental controls. None of them talk to each other. When bedtime is 8pm, you set it in Apple Screen Time, then Google Family Link, then Microsoft Family Safety, then the router app. When you block an app on one device, it's still available on another.

PCPS fixes this — not by creating yet another app, but by defining a standard format that every platform can implement.

## What's in This Repo

| File                                 | Description                                               |
| ------------------------------------ | --------------------------------------------------------- |
| [specification.md](specification.md) | The full PCPS specification (v1.0, Draft)                 |
| [schema.json](schema.json)           | JSON Schema (Draft 2020-12) for validating PCPS documents |
| [example.json](example.json)         | A complete example policy for a two-child family          |

## Quick Example

A PCPS document is a JSON file describing a family's parental control policy:

```json
{
  "pcps": "1.0",
  "family": {
    "guardians": [{ "name": "Alice", "role": "primary" }],
    "children": [
      {
        "name": "Charlie",
        "date_of_birth": "2016-03-15",
        "policy": {
          "schedule": {
            "weekday": { "start": "07:00", "end": "20:00" },
            "weekend": { "start": "08:00", "end": "21:00" }
          },
          "time_limits": {
            "daily_minutes": 120
          },
          "content_filtering": {
            "age_ratings": { "pegi": 7 }
          }
        }
      }
    ]
  }
}
```

## Policy Sections

All sections are optional — omit any section to defer to platform defaults.

- **Schedule** — Allowed usage windows (weekday/weekend, with custom day overrides)
- **Time Limits** — Daily screen time, per-app limits, per-category limits
- **Content Filtering** — Age ratings (PEGI, ESRB, IARC), web filtering, explicit content
- **App Controls** — Require approval for new apps, block or always-allow specific apps
- **Communication** — Restrict contacts to an approved list
- **Spending** — Purchase approval, monthly budgets, in-app purchase controls
- **Overrides** — Bonus time and temporary rule modifications

## Platform Mappings

The specification includes detailed mappings showing how each PCPS section translates to native controls on:

- Apple Screen Time
- Google Family Link
- Microsoft Family Safety
- Nintendo Parental Controls

## Design Principles

- **No central service** — Platforms hold their own data. No middleman.
- **No user accounts** — Authentication is each platform's responsibility.
- **No telemetry** — PCPS defines policy, not surveillance.
- **Simple JSON** — Readable by humans and machines alike.
- **Extensible** — Vendors can add namespaced extensions without breaking the spec.

## How It Works

1. A parent authors a policy using any PCPS-compatible app
2. The app sends the same JSON document to each platform's PCPS API endpoint
3. Each platform maps the policy to its native controls — no central service involved

The platform API contract is two endpoints:

- `POST /pcps/policy` — Import a PCPS document
- `GET /pcps/policy` — Export current settings as PCPS

## Validation

Validate a PCPS document against the schema:

```bash
# Using ajv-cli
npx ajv validate -s schema.json -d your-policy.json
```

## Governance

PCPS is maintained by an independent, non-profit foundation with no commercial interest in the products parental controls are applied to. Board seats go to platforms, child safety organisations, and independent experts.

## License

- Specification: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)
- Test suite: [Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0)

## Get Involved

- [Read the specification](specification.md)
- [View the example policy](example.json)
- [Join as a member](mailto:members@pcpsfoundation.org)
- [Contact us](mailto:hello@pcpsfoundation.org)
