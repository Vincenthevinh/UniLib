# UniLib PA2 SRS working sections

The authoritative frozen identifiers and decisions are in [PA2 Master ID Registry](../../pa/PA2/00-id-registry.md) and the [23 October kickoff minutes](../../pa/PA2/meetings/2026-10-23-kickoff.md). These links are intentional: the registry lives under pa/PA2, not docs/pa2.

## Ownership and handoff

| Section | File | Owner | Reviewer |
| --- | --- | --- | --- |
| Contribution | [00-contribution.md](00-contribution.md) | Vinh | Quan |
| Introduction | [01-introduction.md](01-introduction.md) | Vinh | Quan |
| Glossary | [02-glossary.md](02-glossary.md) | Nguyen | Anh |
| Problem statement | [03-problem-statement.md](03-problem-statement.md) | Nguyen | Anh |
| Stakeholders | [04-stakeholders.md](04-stakeholders.md) | Vinh | Quan |
| Functional requirements | [05-functional-requirements.md](05-functional-requirements.md) | Nguyen | Anh |
| Non-functional requirements | [06-non-functional-requirements.md](06-non-functional-requirements.md) | Quan | Vinh |
| Business rules | [07-business-rules.md](07-business-rules.md) | Nguyen | Quan |
| Acceptance criteria | [08-acceptance-criteria.md](08-acceptance-criteria.md) | Vinh | Nguyen |
| Use case model | [09-use-case-model.md](09-use-case-model.md) | Quan | Vinh |
| Use case specifications | [10-use-case-specifications.md](10-use-case-specifications.md) and [uc/](uc/) | Split by team plan | Peer review |
| Prototype | 11-prototype.md (owned by Anh) | Anh | Nguyen |
| RTM | 12-traceability-matrix.md (owned by Vinh) | Vinh | Nguyen |
| Requirements review | 13-requirements-review.md (owned by Vinh) | Vinh | All |
| AI usage log | 14-ai-usage-log.md (owned by Vinh) | Vinh | All |

Only the document owner creates or edits their own sections; this index does not assert that currently missing teammate sections are complete. Quan's use case specs are UC-02, UC-04, UC-07, UC-08 and UC-09 according to the supplied PA2 task plan. The kickoff minutes and frozen registry carry different specification ownership; see the technical review handoff for reconciliation.

## Developer delivery timing

The original PA2 plan has six planned windows from 2026-10-22 through
2026-11-04. See [the schedule and actual work log](../ai-usage/pa2-q1-q6-quan.md).
Planned deadlines are distinct from real Git commit/push history; the
final `pa2-baseline` tag requires team approval and is not yet created.

## Developer diagrams

- [PlantUML source](diagrams/use-case.puml) and [rendered SVG](diagrams/use-case.svg)
- [Copy / Loan / Reservation state transitions](diagrams/state-transitions.md)

## Collaboration process

1. Make changes in a feature branch and retain frozen F/FR/NFR/BR/UC/SCR/AC identifiers.
2. Attach requirement IDs, verification evidence and AI use disclosure to the PR.
3. Obtain at least one reviewer approval and passing repository checks before merging.
4. Vinh validates RTM/prototype/review-log coverage and gives final PA2 sign-off.
5. Create the pa2-baseline tag only after all PA2 deliverables are approved and merged.

This repository currently contains requirements documentation, not a runnable UniLib application. Test methods in PA2 describe PA4/PA5 obligations; they are not claims of passing runtime tests.
