# Centralized Renovate Bot

A production-ready template for running [Renovate](https://github.com/renovatebot/renovate) as a centralized dependency manager across an entire GitHub organization — from a single repo, with zero per-repo config required.

## Why Centralized?

Tools like Dependabot require a config file in every repository. This approach flips that model: one repo, one config, one workflow manages dependency updates across all your org's repos automatically. Target repos don't need to know Renovate exists.

## What It Manages

| Ecosystem | Detected Files |
|-----------|---------------|
| **Python** | `requirements.txt`, `setup.py`, `pyproject.toml` (Poetry) |
| **npm** | `package.json`, lock files |
| **Docker** | `Dockerfile` FROM directives, `docker-compose.yml` images |
| **GitHub Actions** | `.github/workflows/*.yml` action versions |
| **Terraform** | `.tf` provider and module version blocks |
| **Helm** | `Chart.yaml` dependencies |

## How It Works

```
┌──────────────────────┐     ┌─────────────────────────────┐
│  This repo            │     │  Your org repos             │
│                       │     │                             │
│  config.js            │────▶│  org/repo-a  ──▶ PRs        │
│  .github/workflows/   │     │  org/repo-b  ──▶ PRs        │
│    renovate.yml       │     │  org/repo-c  ──▶ PRs        │
│                       │     │  ...                        │
└──────────────────────┘     └─────────────────────────────┘
         │
    Runs weekly via
    GitHub Actions
```

Renovate autodiscovers all repos matching the filter pattern, scans for supported dependency files, and opens grouped PRs with update details.

## Automerge Rules

| Update Type | Behavior |
|------------|----------|
| Patch | Automerge |
| Minor | Automerge |
| Major | PR for manual review |
| Lock file maintenance | Automerge |
| Vulnerability fix | PR for review (labeled `security`) |
| GitHub Actions | Automerge + pinned to SHA digest |

## PR Noise Reduction

Without grouping, each dependency gets its own PR — a 10-dependency update means 10 PRs. This config bundles them by ecosystem and update type:

- `python-minor-patch` — all Python minor/patch in one PR
- `npm-minor-patch` — all npm minor/patch in one PR
- `github-actions` — all Actions updates in one PR
- `docker-images` — all Dockerfile base image bumps in one PR
- `terraform-providers` — all Terraform provider updates in one PR
- `helm-charts` — all Helm chart dependency updates in one PR

## Authentication

Two options are provided in the workflow:

**Option A — GitHub App (recommended for orgs)**
Uses `actions/create-github-app-token` to generate short-lived tokens scoped to the org. No long-lived PATs, better audit trail, cleaner separation of concerns.

**Option B — Personal Access Token**
Simpler setup. Create a classic PAT with `repo` + `workflow` scopes and store it as `RENOVATE_TOKEN`.

## Setup

1. Fork or copy this repo into your org (or personal account)
2. Edit `config.js` — change `autodiscoverFilter` to `["your-org/*"]`
3. Edit `config.js` — adjust `timezone`, `schedule`, and `enabledManagers` as needed
4. Add authentication (see workflow comments for Option A or B)
5. Run manually: `gh workflow run renovate.yml`
6. Verify with dry run: `gh workflow run renovate.yml -f dry_run=full -f log_level=debug`

## Per-Repo Overrides

Individual repos can optionally drop a `renovate.json` to override central defaults:

```json
{
  "extends": ["config:recommended"],
  "packageRules": [
    {
      "matchPackageNames": ["some-critical-package"],
      "automerge": false
    }
  ]
}
```

This is optional — repos without a config file inherit the central rules automatically.

## License

MIT
