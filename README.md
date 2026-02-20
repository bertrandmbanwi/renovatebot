# Renovate Bot

Centralized dependency management for the [CaeliCode](https://github.com/caelicode) organization.

This repo runs [Renovate](https://github.com/renovatebot/renovate) on a weekly schedule via GitHub Actions, autodiscovering all repos under `caelicode/*` and opening PRs for dependency updates.

## What It Manages

| Ecosystem | Scope |
|-----------|-------|
| **Python** | pip requirements, setup.py, Poetry |
| **npm** | package.json, lock files |
| **Docker** | Dockerfile, docker-compose base images |
| **GitHub Actions** | Workflow action versions (pinned to SHA) |
| **Terraform** | Provider and module versions |
| **Helm** | Chart dependencies |

## Automerge Rules

- **Patch + minor** updates automerge after checks pass
- **Major** updates open a PR for manual review
- **Vulnerability fixes** always open a PR (never automerged, flagged `security`)
- **GitHub Actions** updates automerge and are pinned to full SHA digests for security

## Schedule

Runs every **Monday before 9 AM CT**. Can also be triggered manually via `workflow_dispatch` with optional dry-run and debug modes.

## Setup

The workflow requires a `RENOVATE_TOKEN` repository secret with `repo` + `workflow` scopes and access to the CaeliCode organization.

## Manual Trigger

```
gh workflow run renovate.yml -R bertrandmbanwi/renovatebot
```

Dry run (no PRs created):
```
gh workflow run renovate.yml -R bertrandmbanwi/renovatebot -f dry_run=full -f log_level=debug
```
