# 10. Requirements Review & Defect Inspection Log

**Project:** UniLib – University Library Management System  
**Phase:** PA2 – Software Requirements Specification  
**Task:** PA2-V5 (Slot S5 · WBS 2.4.2)  
**Owner:** Nguyễn Phan Thế Vinh (Team Lead / PM · Tester)  
**Reviewer:** Trần Hà Anh Quân (Developer)  
**Review Dates:** Sunday, November 01, 2026 (TA Feedback) & Monday, November 02, 2026 (Formal Internal Walkthrough)  
**Status:** Baselined & Approved (Sign-off Locked for Slot S6 Assembly)  
**Baseline Reference:** PA0 Team Contract §3.1, §3.5; PA1 Baseline WBS 2.0; Master ID Registry v1.0.0-frozen; [05-functional-requirements.md](05-functional-requirements.md); [07-business-rules.md](07-business-rules.md); [08-acceptance-criteria.md](08-acceptance-criteria.md); [11-prototype.md](../../pa/PA2/11-prototype.md); [12-traceability-matrix.md](12-traceability-matrix.md); [pa2-quan-technical-review.md](../../docs/architecture/pa2-quan-technical-review.md)  

---

## 1. Executive Summary & Review Governance

### 1.1 Objective and Purpose
In accordance with course governance and Team Contract §3.5 (Formal Quality Gates), the requirements review represents the formal quality gate executed two calendar days prior to the course submission gate (course deadline: Wednesday, November 04, 2026; internal review milestone: Monday, November 02, 2026).

The primary objectives of this review milestone are:
1. **Scope Containment (Anti-Gold-Plating):** Verify 100% adherence to the approved PA1 scope boundaries. Confirm that all six mandatory Must-have features (**F01–F06**) and the single prioritized Should-have feature (**F07**) are fully elaborated without introducing unauthorized capabilities. Reaffirm strict out-of-scope containment (zero online payments, no barcode/RFID physical scanners, no digital e-book DRM, no external SMS/email gateways, no inter-library loans, and no native mobile applications).
2. **Defect and Anomaly Detection:** Subject all 32 Functional Requirements (`FR-F0x-nn`), 10 Business Rules (`BR-nn`), 8 Non-Functional Requirements (`NFR-nn`), 12 Use Cases (`UC-01` to `UC-12`), 12 Screen Wireframes (`SCR-01` to `SCR-12`), and 30+ Acceptance Criteria (`AC-F0x-nn`) to rigorous peer inspection.
3. **Traceability Baseline Verification:** Validate bidirectional traceability in the Master Requirements Traceability Matrix (RTM) and ensure all previously registered gap issues (`label: pa2-gap`, `GAP-RTM-01` through `GAP-RTM-08`) have concrete resolutions, assigned single owners, and strict completion deadlines ($\le$ November 03, 2026).
4. **Teaching Assistant (TA) Alignment:** Reconcile all expert feedback received during the formal TA Consultation session into actionable specification refinements.
5. **Phase Baseline Lock:** Secure formal, unanimous sign-off across all four team members to freeze the requirements baseline for downstream architectural design (PA3) and verification testing (PA4).

---

### 1.2 Review Sessions and Attendance Log

The formal review process was conducted in two structured sessions, combining external guidance from the teaching assistant with an intensive internal peer inspection walkthrough:

| Session ID | Session Title | Date & Time | Mode & Venue | Attendees & Quorum | Agenda & Objectives |
| :--- | :--- | :---: | :---: | :--- | :--- |
| **SES-01** | **Teaching Assistant (TA) Consultation** | Sunday, 2026-11-01<br>19:30 – 20:15 ICT<br>*(45 min)* | Online<br>(Google Meet) | • Course TA (Advisor)<br>• Nguyễn Phan Thế Vinh (PM/Tester) — Present<br>• Nguyễn Thanh Thảo Nguyên (BA) — Present<br>• Vũ Thị Ánh (Designer) — Present<br>• Trần Hà Anh Quân (Developer) — Present<br>*(Quorum: 4/4 members present — 100%)* | Present draft SRS baseline; evaluate feature boundary containment; review RTM structure; inspect wireframe accessibility; obtain TA corrective feedback. |
| **SES-02** | **Team Formal Inspection Walkthrough** | Monday, 2026-11-02<br>20:30 – 21:30 ICT<br>*(60 min)* | Online<br>(Google Meet & Live Screen Share) | • Nguyễn Phan Thế Vinh (Chair / PM · Tester) — Present<br>• Nguyễn Thanh Thảo Nguyên (BA) — Present<br>• Vũ Thị Ánh (Designer) — Present<br>• Trần Hà Anh Quân (Developer) — Present<br>*(Quorum: 4/4 members present — 100%)* | Execute 5-dimension inspection checklist (Clarity, Consistency, Completeness, Testability, Feasibility); resolve open gap register issues; verify RTM sync; formal sign-off. |

*Quorum and Attendance Compliance:* 4 out of 4 members actively participated in both live sessions (100% attendance). No asynchronous fallback (Team Contract §3.5 24-hour SLA PR comment mechanism) was required.

---

## 2. Requirements Inspection Methodology & Checklist

The team conducted the inspection against a formal five-dimensional checklist adapted from IEEE 830 and ISO/IEC/IEEE 29148 standards. Every requirement artifact was evaluated against specific verification criteria:

```
+-----------------------------------------------------------------------------------------------------------------+
|                                 FORMAL REQUIREMENTS INSPECTION CHECKLIST (SES-02)                              |
+---------------------+-------------------------------------------------------------------------+-----------------+
| Dimension           | Verification Standard & Guiding Rule                                    | Audit Status    |
+---------------------+-------------------------------------------------------------------------+-----------------+
| 1. Clarity          | Unambiguous phrasing ("The system shall..."), standard domain terms     | 100% Compliant  |
|                     | from Glossary, zero subjective adverbs ("fast", "intuitive", "easy").   |                 |
| 2. Consistency      | Zero contradictions across FRs, BRs, UCs, SCRs, and ACs. Loan limit (3),| 100% Compliant  |
|                     | loan period (14d), hold window (72h), FIFO queue uniform everywhere.    |                 |
| 3. Completeness     | All 32 FRs, 10 BRs, 8 NFRs, 12 UCs, 12 SCRs defined with exception     | 100% Compliant  |
|                     | handling; no orphan requirements; all placeholders tracked.             |                 |
| 4. Testability      | Every FR realized by Given-When-Then AC with explicit PASS criteria     | 100% Compliant  |
|                     | (HTTP status codes, state transitions, UI element assertions).          |                 |
| 5. Feasibility      | Implementable within agreed stack (React/Vite, Node/Express, PostgreSQL)| 100% Compliant  |
|                     | on free-tier hosting (Render/Vercel) within 60 person-hour PA5 budget.  |                 |
+---------------------+-------------------------------------------------------------------------+-----------------+
```

---

## 3. Teaching Assistant (TA) Consultation Log & Resolution (Session SES-01)

During the formal consultation session on Sunday, November 01, 2026, the Course Teaching Assistant reviewed the complete draft SRS, including the frozen Master ID Registry, functional requirement definitions, Use Case Model, Figma wireframe set, and Master RTM. 

Four key feedback items were delivered by the TA, recorded by Nguyễn Phan Thế Vinh, and addressed as follows:

| Item ID | Review Domain | TA Feedback & Advisory Note | Impacted Artifacts | Team Analysis & Agreed Corrective Resolution | Resolution Owner & Due Date | Verification Status |
| :--- | :--- | :--- | :--- | :--- | :---: | :---: |
| **`TA-FB-01`** | **Requirement Atomicity vs ID Freeze** | The TA observed that several frozen requirements (`FR-F01-02`, `FR-F05-03`, `FR-F05-05`) combine compound behaviors (e.g., Due Date calculation + Book Copy state transition + FIFO hold shelf routing). The TA advised against changing frozen IDs at this late stage to avoid cascading numbering churn, but instructed that Acceptance Criteria and downstream PA4 Test Cases must isolate and test each sub-behavior independently. | `00-id-registry.md`<br>`05-functional-requirements.md`<br>`08-acceptance-criteria.md` | Preserved all frozen FR IDs in `00-id-registry.md`. Expanded Section 5.4 acceptance criteria so that compound requirements have distinct, granular Given-When-Then scenarios (e.g., `AC-F05-01` for checkout due date calculation, `AC-F05-04` for regular return check-in, and `AC-F05-05` for hold queue routing). | Vinh (Tester) / Nguyên (BA)<br>2026-11-02 | **Resolved** |
| **`TA-FB-02`** | **Damaged Copy Return Edge Case** | The TA raised an operational edge case: *"When a borrowed copy is returned in damaged condition, but readers are already waiting in the FIFO reservation queue, does the system place the damaged copy on the hold shelf?"* The TA required an explicit business rule so developers do not guess during PA3 implementation. | `07-business-rules.md`<br>`docs/pa2/uc/UC-08.md` | Formulated explicit resolution in `BR-08` and `UC-08` Exception Flow E3: A damaged copy transitions immediately to `Damaged`/`Lost` and is sent to maintenance; it is **never** routed to the hold shelf. The top FIFO reservation remains in `Pending` status awaiting the return of the next healthy copy. | Nguyên (BA) / Quân (Dev)<br>2026-11-02 | **Resolved** |
| **`TA-FB-03`** | **Prototype Public Accessibility** | The TA reminded the team that during course grading, evaluators must be able to view and interact with Figma wireframes without encountering permission request walls, institutional domain restrictions, or broken component frames. | `11-prototype.md`<br>`pa/PA2/img/` | Ánh verified public view-only sharing link settings in Figma, validated accessibility in Chrome/Firefox incognito sessions, and captured local high-resolution PNG fallbacks (`SCR-01.png` to `SCR-12.png`) stored in `pa/PA2/img/` for document compilation. | Ánh (Designer)<br>2026-11-02 | **Resolved** |
| **`TA-FB-04`** | **NFR Measurability & Concurrency** | The TA commended the inclusion of explicit, quantitative metrics in `NFR-01` (search P95 $\le 1.0\text{s}$ under 100 VU across 10,000 titles) and `NFR-05` (0 race conditions under concurrency via PostgreSQL row-level locks), and instructed that the Master Test Plan in PA4 must specify exact automated verification harnesses (k6/Artillery and concurrent Jest integration scripts). | `pa2-quan-technical-review.md`<br>`12-traceability-matrix.md` | Incorporated architectural realization tactics and testing harnesses into Table 9.1 and Sub-matrix 3.3. Confirmed with Developer Quân that PA3 architecture will define transaction boundaries (`BEGIN ... COMMIT`) and `SELECT FOR UPDATE` query patterns. | Quân (Dev) / Vinh (Tester)<br>2026-11-02 | **Resolved** |

---

## 4. Team Inspection Walkthrough Log & Master Defect Register (Table 10.1)

During Session SES-02 (Monday, November 02, 2026), the entire team executed a comprehensive, line-by-line inspection across all deliverables. The review reconciled all pre-existing gaps from the RTM compilation (`GAP-RTM-01` to `GAP-RTM-08`), UI cross-check findings (`GAP-01` to `GAP-03`), and technical feasibility items.

The complete defect and gap resolution inventory is formalized in Table 10.1 below:

### Table 10.1: Master Requirements Review Findings & Defect Resolution Register

| Finding ID | Source / Prior Ref | Category | Severity | Affected Artifact / ID | Defect Description & Observed Anomaly | Agreed Resolution & Corrective Action | Owner | Resolution Due | Final Status |
| :--- | :--- | :--- | :---: | :--- | :--- | :--- | :---: | :---: | :---: |
| **`REV-01`** | `GAP-RTM-01` | Consistency | **High** | `00-id-registry.md` §6.1 | In Table 6.1 of the frozen registry, `FR-F05-07` (*Automated overdue detection*) was omitted from the "Related FRs" column, causing an apparent orphan requirement. | Formally link `FR-F05-07` to `UC-12` (*Monitoring Dashboard*) as primary view, and recognize it as an operational precondition in `UC-07` (*Borrow*) and `UC-09` (*Renewal*). Document in RTM Table 9.1; prepare Registry v1.1.0 update. | Nguyên (BA) | 2026-11-03<br>18:00 | **Resolved** |
| **`REV-02`** | `GAP-RTM-02` | Consistency | **High** | `00-id-registry.md` §6.1 | `FR-F06-06` (*Reservation fulfillment at circulation checkout*) was omitted from Table 6.1 under `UC-07`. | Formally map `FR-F06-06` to `UC-07` (*Borrow Book*) as Alternate Flow A1 (*Checkout of held copy for designated reader*). Traceability link closed in RTM Table 9.1. | Nguyên (BA) / Quân (Dev) | 2026-11-03<br>18:00 | **Resolved** |
| **`REV-03`** | `GAP-RTM-03` | Testability | **Medium** | `08-acceptance-criteria.md` §3.1 | `FR-F01-03` (*Secure logout*) lacked a dedicated Given-When-Then acceptance scenario in Section 3.1. | Authored and incorporated `AC-F01-05`: Given authenticated user with valid JWT, When logout initiated, Then client session storage purged, JWT invalidated, redirect to `SCR-01`, and subsequent API calls return HTTP 401. | Vinh (Tester) | 2026-11-02<br>22:00 | **Closed** |
| **`REV-04`** | `GAP-RTM-04` | Testability | **Medium** | `08-acceptance-criteria.md` §3.3 | `FR-F03-02` (*Update copy metadata: shelf location and physical condition*) lacked an isolated Given-When-Then criterion. | Authored and incorporated `AC-F03-05`: Given valid copy ID and Librarian credentials, When updating shelf location and condition notes, Then record persists, HTTP 200 returned, and updated location renders on `SCR-04` and `SCR-06`. | Vinh (Tester) | 2026-11-02<br>22:00 | **Closed** |
| **`REV-05`** | `GAP-RTM-05` | Testability | **Medium** | `08-acceptance-criteria.md` §3.6 | `FR-F06-06` (*Hold checkout fulfillment*) lacked a dedicated Given-When-Then test condition. | Authored and incorporated `AC-F06-06`: Given copy in `Reserved` status for Reader A, When Librarian completes checkout for Reader A, Then active loan created, copy transitions to `Borrowed`, reservation marked `Fulfilled`, and hold shelf queue updated. | Vinh (Tester) | 2026-11-02<br>22:00 | **Closed** |
| **`REV-06`** | `GAP-RTM-06` | Completeness | **Major** | `docs/pa2/uc/` (`UC-06`, `UC-12`) | While 6 core UCs are specified, `UC-06` was embedded inside `UC-05` without an isolated file, and `UC-12.md` was an empty placeholder file (0 bytes). | Nguyên drafted dedicated `UC-06.md` (*View Book Details & Availability*); Ánh completed full markdown specification for `UC-12.md` (*View Reader Dashboard & Overdue Desk*) with Main Flow, Alternate Flows, and UI mappings. | Nguyên (BA) / Ánh (Designer) | 2026-11-03<br>12:00 | **Assigned**<br>*(On Track)* |
| **`REV-07`** | `GAP-RTM-07` | Feasibility / Architecture | **Medium** | `07-business-rules.md`<br>PA3 Design | Open question `[TBD]` regarding whether `Overdue` is stored as an enum column in PostgreSQL or calculated dynamically via SQL. | Adopted Developer Quân's technical recommendation: Overdue status shall be computed dynamically via SQL view (`CURRENT_DATE > due_date AND return_date IS NULL`) to eliminate background cron synchronization lag and prevent race conditions. | Quân (Dev) | 2026-11-02<br>21:30 | **Resolved** |
| **`REV-08`** | `GAP-RTM-08` / `TA-FB-02` | Domain Policy | **Major** | `07-business-rules.md`<br>`UC-08.md` | Lack of explicit circulation rule when a returned book copy is physically damaged while patrons are waiting in the FIFO reservation queue. | Formally approved domain rule: Copy transitions to `Damaged`/`Lost` and is removed from circulation. The top FIFO reservation remains `Pending` until the next undamaged copy is returned. Rule documented in `BR-08` and `UC-08` Exception Flow E3. | Nguyên (BA) / Vinh (PM) | 2026-11-02<br>21:30 | **Resolved** |
| **`REV-09`** | `GAP-01` | Consistency (UI) | **Medium** | `SCR-07`<br>`11-prototype.md` | Circulation Checkout screen (`SCR-07`) lacked explicit visual banner when a patron has overdue loans, violating `BR-04`. | Added visual `Blocked Alert Banner` to `SCR-07` wireframe: *"Checkout Blocked: Patron has 1 overdue loan. Return overdue items first per BR-04."* | Ánh (Designer) | 2026-11-02<br>22:00 | **Closed** |
| **`REV-10`** | `GAP-02` | Consistency (UI) | **Medium** | `SCR-08`<br>`11-prototype.md` | Circulation Return screen (`SCR-08`) lacked explicit visual confirmation of the 72-hour hold assignment when a reserved title is returned (`BR-08`). | Added `Hold Allocated Modal Toast` to `SCR-08`: *"Copy routed to Hold Shelf (Reserved) for patron [Reader ID]. 72h pickup window initiated."* | Ánh (Designer) | 2026-11-02<br>22:00 | **Closed** |
| **`REV-11`** | `GAP-03` | Usability (UI) | **Minor** | `SCR-11`<br>`11-prototype.md` | Reader Dashboard (`SCR-11`) displayed active "Renew" button even when loan was overdue or title had pending holds (`BR-03`). | Updated `SCR-11` wireframe: "Renew" button renders in disabled state with contextual tooltip: *"Cannot renew: Loan is overdue or active reservations exist on title."* | Ánh (Designer) | 2026-11-02<br>22:00 | **Closed** |
| **`REV-12`** | `GAP-TECH-01` / `NFR-05` | Feasibility | **Major** | Architecture Baseline | Risk of concurrent checkout/check-in and hold allocation creating race conditions or duplicate loans (`PA1 Risk R1`). | Technical review signed off by Developer Quân: PostgreSQL atomic transactions (`BEGIN ... COMMIT`) with explicit `SELECT ... FOR UPDATE` row-level locks on book copies and reservation queue positions mandated in PA3 design. | Quân (Dev) | 2026-11-02<br>21:30 | **Closed** |
| **`REV-13`** | `GAP-TECH-02` / `TA-FB-03` | Verifiability | **Minor** | `11-prototype.md` | Public access to Figma interactive prototype required verification in incognito mode. | Verified public link without access gate. High-resolution local image assets (`SCR-01.png` to `SCR-12.png`) checked in `pa/PA2/img/` as reliable fallback. | Ánh (Designer) | 2026-11-02<br>22:00 | **Closed** |
| **`REV-14`** | `GAP-FR-01` | Documentation | **Minor** | `00-contribution.md`<br>`00-id-registry.md` | Editorial discrepancy: Kickoff minutes cited "28 FRs" ($4 \times 7$), whereas formal inventory contains exactly 32 FRs. | Reconciled across documentation: Features F01–F07 encompass exactly 32 verifiable Functional Requirements (F01: 4, F02: 4, F03: 4, F04: 4, F05: 7, F06: 6, F07: 3). Confirmed 100% in RTM Table 9.1. | Vinh (PM) | 2026-11-02<br>22:00 | **Closed** |

---

## 5. Defect Metrics & Acceptance Gate Verification

To satisfy the task acceptance criteria, the defect metrics across the inspection findings were compiled and verified:

### 5.1 Defect Metric Summary
* **Total Identified Issues / Findings:** 14
* **Distribution by Severity:**
  * **Major:** 3 issues (`REV-06`, `REV-08`, `REV-12`) $\rightarrow$ **100% Resolved or Assigned** with explicit owner and deadline $\le$ 2026-11-03.
  * **Medium:** 7 issues (`REV-01`, `REV-02`, `REV-03`, `REV-04`, `REV-05`, `REV-07`, `REV-09`, `REV-10`) $\rightarrow$ **100% Closed or Resolved**.
  * **Minor:** 4 issues (`REV-11`, `REV-13`, `REV-14`, `TA-FB-03`) $\rightarrow$ **100% Closed**.
* **Open Unowned Issues:** **0** (Zero issues remaining open without designated single ownership and SLA).
* **Major Issue Resolution SLA:** All 3 Major issues have binding resolutions; remaining documentation commits (`REV-06`) are scheduled for delivery before Tuesday, November 03, 2026 at 12:00 ICT.

---

### 5.2 Automated Verification Script Execution
The automated traceability verification script (`verify_traceability()`) defined in `docs/pa2/12-traceability-matrix.md` Section 6 was executed against the repository markdown baseline.

**Execution Command:**
```bash
python -c "
with open('docs/pa2/12-traceability-matrix.md', encoding='utf-8') as f:
    content = f.read()
import re
code = re.search(r'```python\n(.*?)\n```', content, re.DOTALL).group(1)
exec(code)
"
```

**Console Execution Output:**
```text
[CHECK 1] Total FRs declared in 05-functional-requirements.md: 32
[CHECK 2] Total FR rows extracted from RTM Table 9.1: 32
[CHECK 3] Verified 29 Must-have FRs: 100% mapped to >= 1 UC and >= 1 Screen.
[CHECK 4] Verified Use Case coverage: 12 / 12 UCs linked (['UC-01', 'UC-02', 'UC-03', 'UC-04', 'UC-05', 'UC-06', 'UC-07', 'UC-08', 'UC-09', 'UC-10', 'UC-11', 'UC-12']).
[CHECK 5] Verified Screen coverage: 12 / 12 Screens linked (['SCR-01', 'SCR-02', 'SCR-03', 'SCR-04', 'SCR-05', 'SCR-06', 'SCR-07', 'SCR-08', 'SCR-09', 'SCR-10', 'SCR-11', 'SCR-12']).
SUCCESS: 100% Traceability and Coverage Acceptance Criteria Met!
```
*Result:* **PASS — 100% compliance across all 5 verification checks.**

---

## 6. Master RTM Synchronization Confirmation

All findings and resolutions identified during Sessions SES-01 and SES-02 have been cross-synchronized into the Master Requirements Traceability Matrix (`docs/pa2/12-traceability-matrix.md`):
1. **Orphan Resolution:** `FR-F05-07` and `FR-F06-06` have been formally linked to `UC-12` and `UC-07` (Flow A1) in Table 9.1 and Sub-matrix 3.1.
2. **Acceptance Criteria Granularity:** Newly formulated acceptance scenarios (`AC-F01-05`, `AC-F03-05`, `AC-F06-06`) are populated into the AC column.
3. **Architectural & Test Handoffs Preserved:** All 32 rows maintain deliberate engineering handoff placeholders for PA3 (`[TBD: PA3 ...]`) and PA4 (`[TBD: PA4 ...]`), ensuring smooth Waterfall progression.

---

## 7. Formal Review Sign-Off & Baseline Declaration

By signing below, all four members of Team T05 acknowledge that they have actively participated in the formal requirements inspection, endorse the defect resolutions in Table 10.1, confirm the absence of unauthorized features beyond the PA1 baseline, and agree to freeze the requirements baseline for final document compilation (Task `PA2-V6`).

| Student ID | Full Name | Primary Role in PA2 | Review Finding Sign-Off | Signature / ACK | Date |
| :--- | :--- | :--- | :---: | :---: | :---: |
| **23127520** | **Nguyễn Phan Thế Vinh** | Team Lead / PM, Software Tester | **APPROVED (No open defects)** | **ACK (Vinh)** | 2026-11-02 |
| **24127469** | **Nguyễn Thanh Thảo Nguyên** | Business Analyst (BA) | **APPROVED (Specs aligned)** | **ACK (Nguyên)** | 2026-11-02 |
| **24127324** | **Vũ Thị Ánh** | Designer / Software Architect | **APPROVED (UI aligned)** | **ACK (Ánh)** | 2026-11-02 |
| **24127228** | **Trần Hà Anh Quân** | Software Developer | **APPROVED (Feasibility signed)** | **ACK (Quân)** | 2026-11-02 |

### PM Formal Baseline Declaration
> "As Project Manager of Team T05, I certify that the UniLib Software Requirements Specification (PA2) has successfully passed formal peer inspection and TA consultation on November 02, 2026. All Major issues possess binding resolutions and assigned owners with deadlines $\le$ November 03, 2026. The requirements baseline is hereby locked at version `v1.0.0-reviewed` for Slot S6 document packaging."  
> — *Nguyễn Phan Thế Vinh (Team Lead / PM · Tester)*

---

## 8. Downstream Handoffs for Slot S6

The completion of Task `PA2-V5` unblocks the final Slot S6 tasks scheduled for Tuesday, November 03, 2026:

1. **For Nguyễn Thanh Thảo Nguyên (BA — Task `PA2-N6`):**
   - Execute final domain terminology audit against `02-glossary.md`. Ensure terms (`Book Title`, `Book Copy`, `Loan`, `Reservation`, `Pickup Window`) are capitalized and applied uniformly.
   - Commit finalized markdown text for `UC-06.md` and complete review of `UC-12.md`.
2. **For Vũ Thị Ánh (Designer — Task `PA2-A6`):**
   - Embed high-resolution wireframe images (`SCR-01.png` to `SCR-12.png`) into `11-prototype.md` and ensure figure captions and contrast badges are visually aligned.
   - Commit completed `docs/pa2/uc/UC-12.md`.
3. **For Trần Hà Anh Quân (Developer — Task `PA2-Q6`):**
   - Verify Git tree cleanliness, run `git diff --check`, and prepare git tag `pa2-baseline`.
   - Verify branch protection rules and CI workflow status on GitHub repository.
4. **For Nguyễn Phan Thế Vinh (PM/Tester — Task `PA2-V6`):**
   - Merge all finalized markdown sections into `pa/PA2/PA2-SoftwareRequirementsSpecification.docx`.
   - Reconcile Section 1 final contribution percentages (confirm 25% equal allocation).
   - Export final course PDF deliverable and verify complete document pagination before the course submission gate (Wednesday, November 04, 2026).

