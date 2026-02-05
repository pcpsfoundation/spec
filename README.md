# PCPS — Parental Controls Policy Specification

An open standard for defining parental control policies in a vendor-neutral, portable JSON format. Define your family's rules once, apply them across every platform.

**Website:** https://pcpsfoundation.org

## Repository Structure

| Directory                | Description                                               |
| ------------------------ | --------------------------------------------------------- |
| [spec/](spec/)           | The PCPS specification, JSON Schema, and example document |
| [reference/](reference/) | A React reference app for authoring PCPS policies         |
| [web/](web/)             | The pcpsfoundation.org website                            |

## The Specification

The full specification lives in [`spec/specification.md`](spec/specification.md). It defines:

- A **JSON document format** covering schedules, time limits, content filtering, app controls, communication, and spending
- A **two-endpoint platform API** (`POST /pcps/policy`, `GET /pcps/policy`) for importing and exporting policies
- **Platform mappings** for Apple Screen Time, Google Family Link, Microsoft Family Safety, and Nintendo Parental Controls

Validate documents against the schema at [`spec/schema.json`](spec/schema.json). See a complete example at [`spec/example.json`](spec/example.json).

## Reference App

A reference implementation for authoring and syncing PCPS policies is available at:

**https://reference.pcpsfoundation.org**

Source code is in the [`reference/`](reference/) directory. Built with React and Vite.

## License

- Specification: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)
- Reference app: [Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0)
