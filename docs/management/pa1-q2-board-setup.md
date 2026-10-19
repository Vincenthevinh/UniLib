# PA1-Q2: Technology Stack and Task Board

Owner: Trần Hà Anh Quân. Stack reviewer: Vũ Thị Ánh. WBS/schedule owner: Nguyễn Phan Thế Vinh.

## Technology proposal

The five-layer proposal is maintained in [PA1 Section 3.2](../../pa/PA1/PA1-ProjectProposal-Plan.md).
Ánh's review and team confirmation remain pending. No application implementation,
deployment, or paid hosting purchase is part of this task.

## WBS import source

[pa1-wbs-board.json](pa1-wbs-board.json) contains every level-3 work package
extracted from the current PA1 WBS. Preserve each ID, description, owner, effort,
and stream. Do not import phase summary rows as separate work packages.

The snapshot contains **69 work packages and 318 person-hours**. The document's
summary currently says 274 hours, and the kickoff minutes mention 53 work packages.
Vinh needs to reconcile these figures before the PA1 baseline. No estimates or
owners have been silently changed during extraction.

| Phase | Work packages | Sum of package effort (h) | Existing summary (h) |
| --- | ---: | ---: | ---: |
| PA1 | 14 | 54 | 45 |
| PA2 | 13 | 60 | 48 |
| PA3 | 12 | 56 | 48 |
| PA4 | 9 | 41 | 37 |
| PA5 | 17 | 91 | 83 |
| Final | 4 | 16 | 16 |
| Total | 69 | 318 | 274 |

The existing phase summary values themselves sum to 277 rather than the stated
274 total. Treat these as reconciliation findings, not approved revised estimates.

Two ownership differences also need Vinh's confirmation:

- WBS 1.2.3 assigns Architecture & Technology Justification to Ánh, while the
  latest task allocation assigns Section 3.2 to Quân with Ánh reviewing.
- WBS 1.2.8 assigns Project Schedule & Critical Path Mapping to Ánh, while the
  latest task allocation assigns schedule data to Vinh and Gantt visuals to Ánh.

## Board configuration

Repository task list: [WBS issues](https://github.com/Vincenthevinh/UniLib/issues?q=is%3Aissue%20%22%5BWBS%22).
Individual issue URLs are recorded in the manifest. Repository issues are not
yet Project items; a Project URL will be recorded only after API verification.

All **69 issues (#6–#74)** were created via the repository API. The 21 Quân
packages are assigned to `thaquan`; the 23 Vinh packages to `Vincenthevinh`.
The remaining 25 packages retain Ánh/Nguyên as their named owner in the issue
body, with GitHub assignees pending username confirmation. No task has been
marked complete by this import and no due date has been invented.

Use a repository-linked GitHub Project with a board view grouped by `Status`:
`Backlog`, `Todo`, `In progress`, `Review`, `Done`.

| Field | Type | Population rule |
| --- | --- | --- |
| Title | Issue title | `[WBS x.y.z] Work package name` |
| Assignees | GitHub users | Use confirmed username mappings only |
| WBS ID | Text | Original level-3 ID |
| Owner | Text | Original WBS owner; retain even when username mapping is pending |
| Phase | Single select | PA1, PA2, PA3, PA4, PA5, Final |
| Effort (h) | Number | Original WBS estimate |
| Due date | Date | Approved V2 schedule only; leave unset until available |
| Status | Single select | Start in Backlog unless actual progress is verified |

Dates are pending because PA1 Section 4.4 is still a schedule placeholder.
Do not substitute a phase deadline for an approved work-package due date.
Q1 remains incomplete while its administrator/review checks are deferred.

## Access and remaining actions

The current GitHub API credential can access repository issues but lacks Projects
scopes: `read:project` is required to read Projects, and `project` is required to
create/update them with a classic token, as documented in [GitHub's Projects API guide](https://docs.github.com/en/issues/planning-and-tracking-with-projects/automating-your-project/using-the-api-to-manage-projects).
No browser automation will be used.
Do not paste credentials into chat or commit them to the repository.

1. Confirm the existing Project URL, or create a shared UniLib Project once API
   access is available. Avoid creating a second board if the team already has one.
2. Configure the fields and status options above; link the UniLib repository.
3. Add each WBS issue to the Project and populate its original WBS fields.
4. Confirm Ánh/Nguyên's GitHub usernames and assign their issues accordingly.
5. Apply Vinh's approved V2 dates and reconcile the WBS inconsistencies.
6. Compare the Project's WBS ID set with the manifest, then record the Project URL
   and request review. Q2 is not Done until the board, owners, dates, and stack
   review are verified.
