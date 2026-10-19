# PA1 Tools & Collaboration Setup

Owner: Trần Hà Anh Quân (Q1–Q2 / ACT-08). Peer reviewer: Nguyễn Phan Thế Vinh.

## Repository configuration

| File | Purpose |
| --- | --- |
| [README](../../README.md) | Scope, proposed stack, and collaboration workflow |
| [CI workflow](../../.github/workflows/ci.yml) | Repository checks and conditional application checks |
| [PR template](../../.github/PULL_REQUEST_TEMPLATE.md) | Issue/WBS links, review checklist, AI usage, and evidence |
| [Dependabot](../../.github/dependabot.yml) | Weekly GitHub Actions dependency update checks |
| [Copilot instructions](../../.github/copilot-instructions.md) | Project-specific review guidance |

These files prepare the repository configuration. They do not establish that
GitHub Actions, branch protection, a Projects board, or Copilot review has been
verified on GitHub. Record actual evidence below after verification.

## CI behavior

`UniLib CI` runs on pull requests targeting `main` and pushes to `main`.
The `repository-checks` job checks that README is nonempty and scans tracked text
files for unresolved merge conflict markers. A scan error also fails the job.

Node.js 22 is configured for future npm packages. If `frontend/package.json` or
`backend/package.json` exists, that package must have `package-lock.json`; CI
runs `npm ci` followed by any available lint, test, and build scripts. A failing
command stops the job. Without packages, CI explicitly reports repository-only
checks. A green result at this stage is not application test or deployment evidence.

The directory names are provisional; no application directories are created by
this setup. Once Ánh confirms the architecture, update package paths, supported
Node version, and required scripts. Replace optional script execution with required
checks so missing tests cannot silently pass. Add npm Dependabot entries for the
confirmed directories and design deployment separately when hosting is agreed.

## GitHub verification procedure

1. Commit the setup on the working branch and push it to `origin`.
2. Open a PR targeting `main`, fill out the template, and link the issue/WBS task.
3. Wait for `UniLib CI / repository-checks` and inspect the logs. Save the run URL.
4. In the PR's **Reviewers** menu, request **Copilot** if it is available for the
   account and repository. Save the review URL and address actionable feedback.
   Availability depends on access and account settings; instructions alone do not
   activate Copilot. See [GitHub's Copilot review guide](https://docs.github.com/en/copilot/how-tos/copilot-on-github/use-copilot-agents/copilot-code-review).
5. Request Vinh or another teammate's review. At least one human approval is
   required by the team before merge; CI and Copilot do not replace it.
6. A repository administrator should verify that protection/rules for `main`
   enforce PRs, at least one approval, and the `repository-checks` status check.
7. After merging, verify Dependabot configuration on the default branch and
   monitor its update PRs. See [GitHub's Actions dependency update guide](https://docs.github.com/en/code-security/how-tos/secure-your-supply-chain/secure-your-dependencies/auto-update-actions).
8. Consider automatic Copilot reviews only after a successful manual trial and
   confirmation of account support. Do not enable automatic merging.

## Task coordination

Use GitHub Issues and Projects for WBS tasks, owners, due dates, and progress.
Add the actual board link when verified. Follow the kickoff meeting's communication
rules and retain weekly reports under `docs/management/weekly/` when authored.

## Evidence to collect

- [ ] Setup PR URL
- [ ] Passing GitHub Actions run URL and repository-only log output
- [ ] Copilot review URL, or a note explaining unavailable access
- [ ] Human approval URL
- [ ] Main branch protection/rules evidence
- [ ] GitHub Projects board URL with assigned WBS tasks
- [ ] Dependabot configuration verified on the default branch

No remote verification evidence has been recorded yet.
