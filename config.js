module.exports = {
  // ──────────────────────────────────────────────
  // Platform & Discovery
  // ──────────────────────────────────────────────
  platform: "github",
  autodiscover: true,
  autodiscoverFilter: ["caelicode/*"],

  // ──────────────────────────────────────────────
  // Git Behavior
  // ──────────────────────────────────────────────
  branchPrefix: "renovate/",
  onboarding: false,
  requireConfig: "optional",

  // ──────────────────────────────────────────────
  // Dashboard & Labels
  // ──────────────────────────────────────────────
  dependencyDashboard: true,
  dependencyDashboardTitle: "Renovate Dependency Dashboard",
  labels: ["dependencies", "renovate"],
  prHourlyLimit: 5,
  prConcurrentLimit: 10,

  // ──────────────────────────────────────────────
  // Schedule — run once a week on Monday mornings
  // ──────────────────────────────────────────────
  schedule: ["before 9am on monday"],
  timezone: "America/Chicago",

  // ──────────────────────────────────────────────
  // Enabled Managers
  // ──────────────────────────────────────────────
  enabledManagers: [
    "pip_requirements",
    "pip_setup",
    "poetry",
    "npm",
    "dockerfile",
    "docker-compose",
    "github-actions",
    "terraform",
    "helmv3",
  ],

  // ──────────────────────────────────────────────
  // Automerge Strategy
  //   - Patch & minor: automerge (low risk)
  //   - Major: PR only, needs manual review
  //   - Lock file maintenance: automerge
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
  // ──────────────────────────────────────────────
  packageRules: [
    // Group all GitHub Actions updates together
    {
      matchManagers: ["github-actions"],
      groupName: "github-actions",
      labels: ["ci", "renovate"],
      automerge: true,
    },

    // Group all Python minor + patch together per repo
    {
      matchManagers: ["pip_requirements", "pip_setup", "poetry"],
      matchUpdateTypes: ["minor", "patch"],
      groupName: "python-minor-patch",
      labels: ["dependencies", "renovate"],
    },

    // Group all npm minor + patch together per repo
    {
      matchManagers: ["npm"],
      matchUpdateTypes: ["minor", "patch"],
      groupName: "npm-minor-patch",
      labels: ["dependencies", "renovate"],
    },

    // Group Docker base image updates
    {
      matchManagers: ["dockerfile", "docker-compose"],
      groupName: "docker-images",
      labels: ["infrastructure", "renovate"],
    },

    // Group Terraform provider updates
    {
      matchManagers: ["terraform"],
      groupName: "terraform-providers",
      labels: ["infrastructure", "renovate"],
    },

    // Group Helm chart updates
    {
      matchManagers: ["helmv3"],
      groupName: "helm-charts",
      labels: ["infrastructure", "renovate"],
    },

    // Pin GitHub Actions to full SHA for security
    {
      matchManagers: ["github-actions"],
      pinDigests: true,
    },
  ],

  // ──────────────────────────────────────────────
  // Vulnerability Alerts — always create PRs for
  // known vulnerabilities, regardless of schedule
  // ──────────────────────────────────────────────
  vulnerabilityAlerts: {
    enabled: true,
    labels: ["security", "renovate"],
    automerge: false,
  },

  // ──────────────────────────────────────────────
  // PR Body — clean, consistent format
  // ──────────────────────────────────────────────
  prBodyTemplate:
    "{{{table}}}\n\n{{{warnings}}}\n\n{{{controls}}}\n\n{{{notes}}}",
};
