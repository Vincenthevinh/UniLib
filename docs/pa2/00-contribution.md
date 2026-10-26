# 1. Member Contribution Assessment

**Project:** UniLib – University Library Management System  
**Phase:** PA2 – Software Requirements Specification  
**Task:** PA2-V2  
**Owner:** Nguyễn Phan Thế Vinh (Team Lead / PM · Tester)  
**Reviewer:** Trần Hà Anh Quân (Developer)  
**Status:** Baseline Framework (Target 25% per member; final percentage sign-off scheduled for Slot S6 / 2026-11-03)  
**Reference:** PA0 Team Contract §3.1, §3.5; PA1 Baseline WBS 2.0; Master ID Registry v1.0.0-frozen; docs/management/pa1-wbs-board.json  

---

## 1.1 Assessment Policy & Governance

In compliance with the course syllabus and the approved Team Contract (PA0 §3.1 and §3.5), all four team members are committed to an equitable workload distribution aiming for equal 25% contribution. 

### Assessment Principles
1. **Single Ownership & Traceable Accountability:** Every SRS section, functional module, wireframe set, and technical review is assigned to exactly one primary author and one independent peer reviewer.
2. **Objective Evidence Requirement:** Final contribution percentages must be substantiated by concrete evidence recorded in the project repository: assigned GitHub issues on the project task board, merged pull requests, verifiable commit histories, and peer review logs.
3. **Punctuality & Quality Standards:** Deliverables must meet internal deadlines—established as two days prior to the course submission gate (internal deadline: Monday, November 02, 2026; course deadline: Wednesday, November 04, 2026)—and adhere strictly to the frozen Master ID Registry (`docs/pa2/00-id-registry.md`) and domain glossary (`docs/pa2/02-glossary.md`).
4. **Slot S6 Finalization Protocol:** The preliminary target contribution of 25% per member recorded below represents the baseline plan. Final percentage allocation will be formally inspected, mutually agreed upon, and locked during the Slot S6 final walkthrough meeting on Tuesday, November 03, 2026 (Task `PA2-V6`), prior to final document packaging and submission.

---

## 1.2 Member Contribution Assessment Framework

| Student ID | Member Name | Role(s) in PA2 | Target Contribution | Assigned Work Packages & Verifiable Evidence | Status & Verification |
| :--- | :--- | :--- | :---: | :--- | :---: |
| **23127520** | **Nguyễn Phan Thế Vinh** | Team Lead / PM, Software Tester | **25%**<br>*(Target; confirmed at S6)* | **Tasks V1–V6 (WBS 2.4.1, 2.4.2):**<br>• **Task PA2-V1 (S1):** Chaired PA2 kickoff meeting; resolved open items (`D-PA2-01` loan limit, `D-PA2-02` pickup window); established and froze Master ID Registry ([2026-10-23-kickoff.md](meetings/2026-10-23-kickoff.md), [00-id-registry.md](00-id-registry.md)); created 24 GitHub Project work packages.<br>• **Task PA2-V2 (S2):** Authored Section 1 Contribution Assessment Framework ([00-contribution.md](00-contribution.md)), Section 2.1 Introduction, Purpose & Scope ([01-introduction.md](01-introduction.md)), and Section 4 Stakeholders ([04-stakeholders.md](04-stakeholders.md)).<br>• **Task PA2-V3 (S3):** Draft 19 Given-When-Then Acceptance Criteria statements (`AC-F01-01` to `AC-F07-02`).<br>• **Task PA2-V4 (S4):** Establish Master Requirements Traceability Matrix (RTM) baseline linking User Needs $\rightarrow$ FR $\rightarrow$ UC $\rightarrow$ Screen $\rightarrow$ Verification.<br>• **Task PA2-V5 (S5):** Coordinate formal requirements inspection walkthrough; author Requirements Review Log (`Table 11`).<br>• **Task PA2-V6 (S6):** Finalize contribution percentages; consolidate markdown sections; assemble `PA2-SoftwareRequirementsSpecification.docx` and compile final PDF.<br>• **GitHub Issues & PRs:** Issues [#31](https://github.com/Vincenthevinh/UniLib/issues/31), [#32](https://github.com/Vincenthevinh/UniLib/issues/32); PR review and merge authority for [PR #82](https://github.com/Vincenthevinh/UniLib/pull/82), [PR #83](https://github.com/Vincenthevinh/UniLib/pull/83), [PR #84](https://github.com/Vincenthevinh/UniLib/pull/84), [PR #86](https://github.com/Vincenthevinh/UniLib/pull/86). | **In Progress**<br>(V1, V2 Completed) |
| **24127469** | **Nguyễn Thanh Thảo Nguyên** | Business Analyst (BA) | **25%**<br>*(Target; confirmed at S6)* | **Tasks N1–N6 (WBS 2.1.1, 2.1.2, 2.2.1–2.2.6):**<br>• **Task PA2-N1 (S1):** Formulated BA domain inquiries, analyzed copy/loan state interactions, and drafted initial domain glossary ([02-glossary.md](02-glossary.md), [ba-questions.md](notes/ba-questions.md)).<br>• **Task PA2-N2 (S2):** Authored Section 3 Problem Statement & Business Context ([03-problem-statement.md](03-problem-statement.md)).<br>• **Task PA2-N3 (S3):** Construct System Use Case Model (diagram, actor inventory, UC-01 to UC-12 list) and author 6 complete Use Case Specifications (`UC-01`, `UC-03`, `UC-05`, `UC-07`, `UC-08`, `UC-10`).<br>• **Task PA2-N4 (S4):** Finalize all 28 Functional Requirements (`FR-F01-01` to `FR-F07-03`) and 10 Business Rules (`BR-01` to `BR-10`) ([05-functional-requirements.md](05-functional-requirements.md), [07-business-rules.md](07-business-rules.md)).<br>• **Task PA2-N5 (S5):** Lead formal SRS Peer Review Walkthrough; resolve requirements ambiguity items.<br>• **Task PA2-N6 (S6):** Conduct final terminology consistency audit against Glossary; polish grammar and document cohesion.<br>• **GitHub Issues & PRs:** Issues [#20](https://github.com/Vincenthevinh/UniLib/issues/20), [#21](https://github.com/Vincenthevinh/UniLib/issues/21), [#22](https://github.com/Vincenthevinh/UniLib/issues/22), [#23](https://github.com/Vincenthevinh/UniLib/issues/23), [#24](https://github.com/Vincenthevinh/UniLib/issues/24), [#25](https://github.com/Vincenthevinh/UniLib/issues/25), [#26](https://github.com/Vincenthevinh/UniLib/issues/26), [#27](https://github.com/Vincenthevinh/UniLib/issues/27); [PR #82](https://github.com/Vincenthevinh/UniLib/pull/82), [PR #83](https://github.com/Vincenthevinh/UniLib/pull/83), [PR #84](https://github.com/Vincenthevinh/UniLib/pull/84). | **In Progress**<br>(N1, N2 Completed) |
| **24127324** | **Vũ Thị Ánh** | Designer / Software Architect | **25%**<br>*(Target; confirmed at S6)* | **Tasks A1–A6 (WBS 2.2.7, 2.3.1, 2.3.2):**<br>• **Task PA2-A1 (S1):** Decomposed UI screen inventory into 12 screens (`SCR-01` to `SCR-12`) and mapped layout hierarchy ([screen-inventory.md](screen-inventory.md)).<br>• **Task PA2-A2 (S2):** Design low-fidelity wireframes for Reader workflows (`SCR-01`, `SCR-05`, `SCR-06`, `SCR-11`).<br>• **Task PA2-A3 (S3):** Design low-fidelity wireframes for Librarian circulation desk and Administrator consoles (`SCR-02`, `SCR-03`, `SCR-04`, `SCR-07`, `SCR-08`, `SCR-10`, `SCR-12`).<br>• **Task PA2-A4 (S4):** Assemble interactive UI prototype in Figma/Penpot; conduct accessibility evaluation (color contrast $\ge 4.5:1$, keyboard navigation per `NFR-06`).<br>• **Task PA2-A5 (S5):** Conduct UI wireframe consistency inspection against Use Case flows.<br>• **Task PA2-A6 (S6):** Embed high-resolution wireframe assets into documentation; validate layout formatting and visual alignment.<br>• **GitHub Issues & PRs:** Issues [#28](https://github.com/Vincenthevinh/UniLib/issues/28), [#29](https://github.com/Vincenthevinh/UniLib/issues/29), [#30](https://github.com/Vincenthevinh/UniLib/issues/30); [PR #77](https://github.com/Vincenthevinh/UniLib/pull/77), [PR #79](https://github.com/Vincenthevinh/UniLib/pull/79), [PR #86](https://github.com/Vincenthevinh/UniLib/pull/86). | **In Progress**<br>(A1 Completed) |
| **24127228** | **Trần Hà Anh Quân** | Software Developer | **25%**<br>*(Target; confirmed at S6)* | **Tasks Q1–Q6 (WBS 1.3.1, 2.2.7, Tech Baseline):**<br>• **Task PA2-Q1 (S1):** Audited repository skeleton, validated CI workflows, and analyzed technical feasibility baseline constraints.<br>• **Task PA2-Q2 (S2):** Conduct technical concurrency and constraint analysis (PostgreSQL row-level locking for `NFR-05`, JWT token expiration for `NFR-04`, server-side pagination for `NFR-01`).<br>• **Task PA2-Q3 (S3):** Conduct technical metric review for Non-Functional Requirements (`NFR-01` to `NFR-08`).<br>• **Task PA2-Q4 (S4):** Perform database schema and circulation state transition pre-condition audit against BA requirements.<br>• **Task PA2-Q5 (S5):** Formally sign off on technical feasibility and architecture deliverability for PA3 and PA5.<br>• **Task PA2-Q6 (S6):** Verify repository tagging (`pa2-baseline`), branch protection compliance, and PR documentation synchronization.<br>• **GitHub Issues & PRs:** Issues [#28](https://github.com/Vincenthevinh/UniLib/issues/28), [#31](https://github.com/Vincenthevinh/UniLib/issues/31); [PR #2](https://github.com/Vincenthevinh/UniLib/pull/2), [PR #75](https://github.com/Vincenthevinh/UniLib/pull/75); technical review of V1, V2, N4, and V4. | **In Progress**<br>(Q1 Completed) |
| **Total** | **Team T05 (4 members)** | — | **100%** | **24 PA2 Work Packages (Slots S1–S6) across 60 Person-Hours** | **On Track** |

---

## 1.3 Peer Review & Verification Matrix

In accordance with Team Contract §3.5, every section of the SRS is subjected to mandatory peer review prior to baseline sign-off. The cross-review accountability matrix for PA2 deliverables is formalized below:

| Artifact / Section | Section Title | Primary Author | Designated Peer Reviewer | Review Criteria & Scope | Target Slot |
| :--- | :--- | :---: | :---: | :--- | :---: |
| **Section 1** | Member Contribution Assessment | Vinh (PM) | Quân (Dev) | Verify completeness of task evidence, issue links, and equal workload baseline. | **S2 / S6** |
| **Section 2.1** | Purpose & Scope | Vinh (PM) | Quân (Dev) | Verify 100% alignment of out-of-scope items with PA1 §2.4 and requirement elaboration. | **S2** |
| **Section 2.2** | Glossary & ID Registry | Nguyên (BA) | Ánh (Designer) | Check domain consistency across Book Copy states and circulation terms. | **S1** |
| **Section 3** | Problem Statement & Context | Nguyên (BA) | Vinh (PM) | Ensure problem statement captures operational bottlenecks without scope creep. | **S2** |
| **Section 4** | Stakeholders & Users | Vinh (PM) | Quân (Dev) | Validate all 5 stakeholder groups, role descriptions, and $\ge 2$ concerns per group. | **S2** |
| **Section 5.1** | Functional Requirements (F01–F07) | Nguyên (BA) | Quân (Dev) | Verify all 28 FR statements for unambiguity, MoSCoW prioritization, and ID freeze. | **S4** |
| **Section 5.2** | Non-Functional Requirements | Ánh (Architect) | Quân (Dev) | Check quantitative verifiability of metrics for `NFR-01` through `NFR-08`. | **S3** |
| **Section 5.3** | Business Rules (BR-01 to BR-10) | Nguyên (BA) | Vinh (Tester) | Verify domain rules against kickoff decisions (3 loans, 14 days, 72h hold window). | **S4** |
| **Section 5.4** | Acceptance Criteria | Vinh (Tester) | Nguyên (BA) | Confirm testability of all 19 Given-When-Then statements against FRs and BRs. | **S3** |
| **Section 6** | Use Case Model & Actor Inventory | Nguyên (BA) | Ánh (Architect) | Inspect UML use case diagram and actor classification against role definitions. | **S3** |
| **Section 7** | Use Case Specifications (6 Core UCs) | Nguyên (BA) | Vinh (Tester) | Verify step-by-step main flows, alternative paths, and exception handling for core UCs. | **S3** |
| **Section 8** | Screen Wireframes & UI Prototype | Ánh (Designer) | Nguyên (BA) | Inspect UI screen layouts (`SCR-01` to `SCR-12`) against use case requirements. | **S4** |
| **Section 9** | Requirements Traceability Matrix | Vinh (PM/Tester) | Quân (Dev) | Ensure 100% forward traceability from User Needs to FR, UC, SCR, and Test Case IDs. | **S4** |
| **Section 10** | Requirements Review Log | Vinh (PM) | All Members | Record formal inspection findings, defect resolutions, and baseline sign-off. | **S5** |
| **Section 11** | Consolidated AI Usage Log | Vinh (PM) | All Members | Reconcile AI usage disclosures across all team members per course GenAI policy. | **S5** |

---

## 1.4 Slot S6 Contribution Sign-Off Procedure

During the final PA2 review meeting on Tuesday, November 03, 2026, the team will execute the following sign-off protocol:
1. **Evidence Audit:** Review GitHub task board issue completion status, merged PR counts, and committed markdown word counts/diagrams.
2. **Review Attendance & Punctuality Check:** Confirm that all peer reviews were completed within the 24-hour SLA and that internal deadlines were met.
3. **Adjustment Calculation (if applicable):** In the event of missed tasks or unexcused delays, adjust contribution percentages in accordance with Team Contract §3.8.
4. **Unanimous Sign-off:** All four team members will sign the final Member Contribution table in `PA2-SoftwareRequirementsSpecification.docx` prior to final submission.
