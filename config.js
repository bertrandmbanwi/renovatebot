module.exports = {
  // ──────────────────────────────────────────────
  // Platform & Discovery
  //
  // Autodiscover scans all repos accessible to the
  // token/app and filters by the pattern below.
  // Change this to match your org or user account.
  // ──────────────────────────────────────────────
  platform: "github",
  autodiscover: true,
  autodiscoverFilter: ["your-org/*"],

  // ──────────────────────────────────────────────
  // Git Behavior
  // ──────────────────────────────────────────────
  branchPrefix: "renovate/",
  onboarding: false,
  requireConfig: "optional",

  // ──────────────────────────────────────────────
  // Dashboard & Limits
  //
  // The dependency dashboard creates a tracking
  // issue in each repo. PR limits prevent flood.
  // ──────────────────────────────────────────────
  dependencyDashboard: true,
  dependencyDashboardTitle: "Renovate Dependency Dashboard",
  labels: ["dependencies", "renovate"],
  prHourlyLimit: 5,
  prConcurrentLimit: 10,

  // ──────────────────────────────────────────────
  // Schedule
  //
  // Cron in the workflow triggers the run; this
  // schedule controls when Renovate creates PRs.
  // Useful to avoid PRs landing during work hours.
  // ──────────────────────────────────────────────
  schedule: ["before 9am on monday"],
  timezone: "America/Chicago",

  // ──────────────────────────────────────────────
  // Enabled Managers
  //
  // Each manager detects a specific ecosystem.
  // Add or remove based on what your org uses.
  // Full list: https://docs.renovatebot.com/modules/manager/
  // ──────────────────────────────────────────────
  enabledManagers: [
    "pip_requirements",  // requirements.txt
    "pip_setup",         // setup.py / setup.cfg
    "poetry",            // pyproject.toml (Poetry)
    "npm",               // package.json
    "dockerfile",        // Dockerfile FROM directives
    "docker-compose",    // docker-compose.yml images
    "github-actions",    // .github/workflows/*.yml
    "terraform",         // .tf provider/module blocks
    "helmv3",            // Chart.yaml dependencies
  ],

  // ──────────────────────────────────────────────
  // Automerge Strategy
  //
  // Low-risk updates merge automatically.
  // Major bumps always require human review.
  // ──────────────────────────────────────────────
  patch: {
    automerge: true,
  },
  minor: {
    automerge: true,
  },
  major: {
    automerge: false,
  },
  lockFileMaintenance: {
    enabled: true,
    automerge: true,
    schedule: ["before 6am on monday"],
  },

  // ──────────────────────────────────────────────
  // Package Rules — grouping to reduce PR noise
  //
  // Without grouping, each dependency gets its own
  // PR. These rules bundle related updates so you
  // review one PR per ecosystem per update type.
  // ──────────────────────────────────────────────
  packageRules: [
    // GitHub Actions — automerge, pin to SHA
    {
      matchManagers: ["github-actions"],
      groupName: "github-actions",
      labels: ["ci", "renovate"],
      automerge: true,
      pinDigests: true,
    },

    // Python minor + patch grouped
    {
      matchManagers: ["pip_requirements", "pip_setup", "poetry"],
      matchUpdateTypes: ["minor", "patch"],
      groupName: "python-minor-patch",
      labels: ["dependencies", "renovate"],
    },

    // npm minor + patch grouped
    {
      matchManagers: ["npm"],
      matchUpdateTypes: ["minor", "patch"],
      groupName: "npm-minor-patch",
      labels: ["dependencies", "renovate"],
    },

    // Docker base images grouped
    {
      matchManagers: ["dockerfile", "docker-compose"],
      groupName: "docker-images",
      labels: ["infrastructure", "renovate"],
    },

    // Terraform providers grouped
    {
      matchManagers: ["terraform"],
      groupName: "terraform-providers",
      labels: ["infrastructure", "renovate"],
    },

    // Helm charts grouped
    {
      matchManagers: ["helmv3"],
      groupName: "helm-charts",
      labels: ["infrastructure", "renovate"],
    },
  ],

  // ──────────────────────────────────────────────
  // Vulnerability Alerts
  //
  // Security patches always surface as PRs
  // regardless of schedule, and never automerge
  // so you can review the advisory first.
  // ──────────────────────────────────────────────
  vulnerabilityAlerts: {
    enabled: true,
    labels: ["security", "renovate"],
    automerge: false,
  },

  // ──────────────────────────────────────────────
  // PR Template
  // ──────────────────────────────────────────────
  prBodyTemplate:
    "{{{table}}}\n\n{{{warnings}}}\n\n{{{controls}}}\n\n{{{notes}}}",
};
