# PA1 Tools & Collaboration Setup

Owner: Trần Hà Anh Quân (PA1-Q1–Q3 / ACT-08). Peer reviewer for Q1/Q3: Nguyễn Phan Thế Vinh.
Quân owns the Q2 technology proposal in Section 3.2; Ánh reviews it.

## Repository configuration

| File | Purpose |
| --- | --- |
| [README](../../README.md) | Scope, proposed stack, and collaboration workflow |
| [.gitignore](../../.gitignore) | Local environment files, dependencies, build output, and editor files |
| [CI workflow](../../.github/workflows/ci.yml) | Repository checks and conditional application checks |
| [PR template](../../.github/PULL_REQUEST_TEMPLATE.md) | Issue/WBS links, review checklist, AI usage, and evidence |
| [Dependabot](../../.github/dependabot.yml) | Weekly GitHub Actions dependency update checks |
| [Copilot instructions](../../.github/copilot-instructions.md) | Project-specific review guidance |

The template skeleton is present under `src/`, `docs/management/weekly/`,
`docs/requirements/`, `docs/design/`, `docs/test/`, `docs/ai-usage/`, and
`pa/PA1/` through `pa/PA5/`. Empty directories use `.gitkeep`. This does not
introduce feature code, a database schema, or an application deployment.

## CI behavior

`UniLib CI` runs on pull requests targeting `main` and pushes to `main`.
The `repository-checks` job checks that README is nonempty and scans tracked text
files for unresolved merge conflict markers. A scan error also fails the job.

Node.js 22 is configured for future npm packages. If `frontend/package.json` or
`backend/package.json` exists, that package must have `package-lock.json`; CI
runs `npm ci` followed by any available lint, test, and build scripts. A failing
command stops the job. Without packages, CI explicitly reports repository-only
checks. A green result at this stage is not application test or deployment evidence.

The package directory names are provisional; only the required `src/` skeleton
is created. Once the team confirms the architecture and Quân's technology proposal
has been reviewed by Ánh, update package paths, supported
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

## Evidence and remaining Q1 checks

Status recorded on 2026-10-19; distinguish repository configuration from GitHub settings.

| Item | Evidence / status |
| --- | --- |
| Initial setup | [PR #2](https://github.com/Vincenthevinh/UniLib/pull/2), merged as `72d44fa` in main history |
| Initial CI | [Actions run](https://github.com/Vincenthevinh/UniLib/actions/runs/39198066990), successful per the PR output supplied by Quân; repository checks only |
| Copilot | [Review comment](https://github.com/Vincenthevinh/UniLib/pull/2#pullrequestreview-5566791056): unable to review because the requester reached their quota limit |
| Human approval on PR #2 | Public reviews API returned only Copilot's `COMMENTED` entry; no human approval recorded |
| Main protection | Public branch API returned `protected: false`; effective branch rules endpoint returned no rules. Authenticated account `thaquan` has push permission but no admin permission; administrator action is required |
| TA / instructor access | Not verified; a repository administrator must confirm accepted collaborator access for the correct accounts |
| Dependabot | Configuration is present in main; the latest main update changed Actions versions. Scheduled update behavior is not independently verified |
| Projects board | Q2 deliverable; no board URL recorded yet |

Q1 must remain open until branch protection, TA/instructor access, and human review
of the completion PR are verified. A merged PR alone does not establish approval.

Administrator checklist for `main`:

- Require a pull request before merging.
- Require at least one approving human review.
- Require the `repository-checks` status check to pass.
- Confirm TA and instructor accounts have accepted the intended repository access.
- Record the settings evidence and approval link here after verification.

## Q1 local validation

On 2026-10-19, automated local checks verified all 11 template directories,
15 ignore/keep cases (including nested `.env` files, sanitized examples, and
submission artifacts), relative documentation links, and the three CI shell
checks. `git diff --check` passed. No application tests or deployment were run.

The [Q1 AI usage record](../ai-usage/pa1-q1-repository-setup.md) is ready for
Vinh to consolidate into PA1 Section 7.
