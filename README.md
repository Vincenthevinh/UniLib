# UniLib – University Library Management System

## Overview

UniLib is a web-based university library management system for readers,
librarians, and administrators, developed by Team T05.

## Main Features

- F01: User Authentication and Roles
- F02: Book Catalog Management
- F03: Physical Book Copy Management
- F04: Search and Browse Books
- F05: Borrow and Return Management, including overdue loan tracking
- F06: Book Reservation

E-book reading, payment processing, physical scanner integration, inter-library
loans, AI recommendations, external email/SMS services, and native mobile apps
are outside the agreed scope.

## Technology Stack

To be confirmed by Ánh in PA1 Section 3 (Technology Stack & Architecture).
Initial proposal: React, Node.js, Express, PostgreSQL.

## Getting Started

```sh
git clone https://github.com/Vincenthevinh/UniLib.git
cd UniLib
```

The repository currently contains planning documents and repository tooling.
There is no application to install, run, or deploy yet. Application setup
instructions and source directories will be added after architecture confirmation.

## Collaboration Workflow

1. Create a task in GitHub Issues and link its WBS work package.
2. Create a feature branch from `main`.
3. Implement the assigned task and use Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`).
4. Open a Pull Request using the repository template and record meaningful AI usage.
5. Check the `repository-checks` CI result.
6. Request at least one teammate review and resolve feedback.
7. Merge after approval and passing required checks.

CI and AI review do not replace human review.

## Project Management

GitHub Projects is the team's chosen task board. Each WBS work package should
have an issue, an owner, and a due date.

- [PA0: Project Idea & Team Contract](pa/PA0-ProjectIdea-TeamContract.md)
- [PA1: Project Proposal & Plan](pa/PA1/PA1-ProjectProposal-Plan.md)
- [Kickoff meeting minutes](docs/management/kickoff-meeting-minutes.md)
- [PA1 tools setup and GitHub verification checklist](docs/management/pa1-tools-setup.md)

## Repository Structure

```text
.github/             CI workflow, PR template, Copilot instructions, Dependabot
docs/management/     Team coordination and tooling documentation
pa/                  Phase submission documents
README.md            Project overview and collaboration workflow
```
