# 11. Consolidated AI Usage Log

**Project:** UniLib – University Library Management System  
**Phase:** PA2 – Software Requirements Specification  
**Task:** PA2-V6 (Slot S6 · WBS 2.4.2)  
**Compiler & PM:** Nguyễn Phan Thế Vinh (Team Lead / PM · Tester)  
**Reviewer:** Trần Hà Anh Quân (Developer)  
**Baseline Reference:** Course GenAI Policy; PA0 Team Contract §3.6; PA1 AI Usage Log; `docs/ai-usage/pa2-q1-q6-quan.md`  
**Date:** Tuesday, November 03, 2026 · 21:00 ICT  

---

## 11.1 AI Policy Governance & Academic Integrity Statement

In compliance with the Course GenAI Policy and Team Contract §3.6 (*Use of AI Tools*):
1. **Permitted Use:** Team members are permitted to utilize Generative AI tools (e.g., ChatGPT, Claude, Gemini, GitHub Copilot) for brainstorming, initial structural drafting, language refinement, consistency auditing, and technical review assistance.
2. **Prohibited Blind Adoption:** Direct copy-pasting of AI-generated content without rigorous human verification, critical appraisal, and domain contextualization is strictly prohibited and constitutes an academic integrity violation.
3. **Mandatory Human Verification:** Every piece of AI-assisted content in this SRS was cross-checked against:
   - Approved PA0/PA1 scope boundaries and out-of-scope constraints (no e-books, no online payments, no hardware barcode/RFID scanners, no SMS/email APIs).
   - Master ID Registry (`pa/PA2/00-id-registry.md` v1.0.0-frozen).
   - Domain Business Rules (`BR-01` to `BR-10`) locked during the PA2 Kickoff meeting.
   - Formal inspection results from the Teaching Assistant (TA) Consultation (`SES-01`) and Team Walkthrough (`SES-02`).
4. **Accountability:** The Team Lead maintains the consolidated log. Each team member has reviewed, confirmed, and signed off on their individual disclosure entry below.

---

## 11.2 Member AI Usage Disclosure Register

The table below provides a comprehensive record of all generative AI tool usage across all four team members for Phase PA2:

| # | Member Name & Role | Tool(s) Used | Task / Purpose in PA2 | How Output Was Verified, Refined, and Changed |
| :-: | :--- | :--- | :--- | :--- |
| **1** | **Nguyễn Phan Thế Vinh**<br>*(Team Lead / PM · Tester)*<br>`23127520` | • Claude 3.5 Sonnet<br>• ChatGPT (GPT-4o) | • Structuring the Master Requirements Traceability Matrix (RTM) schema and bidirectional mapping logic (Task `PA2-V4`).<br>• Drafting 30 Given-When-Then Acceptance Criteria statements (`AC-F01-01` to `AC-F07-02`) with boundary conditions (Task `PA2-V3`).<br>• Synthesizing TA consultation feedback (`TA-FB-01` to `TA-FB-04`) and structuring the formal Defect Inspection Log (Task `PA2-V5`).<br>• Formatting scripts for consolidating multi-file Markdown chapters into the final submission DOCX and PDF (Task `PA2-V6`). | • Manually verified every requirement ID against `00-id-registry.md` v1.0.0-frozen to ensure zero ID discrepancies or orphan items.<br>• Filtered out generic or untestable AI acceptance scenarios; injected explicit domain boundary values (3 max loans per `BR-01`, 14-day loan duration per `BR-02`, 72-hour hold shelf window per `BR-08`).<br>• Ensured Given-When-Then scenarios contain deterministic verification criteria (specific HTTP status codes 200/401/403/409, copy state transitions, UI element assertions) as required by QA standards for PA4 test planning.<br>• Reconciled defect severity classifications in Table 10.1 with team consensus from Session `SES-02`. |
| **2** | **Nguyễn Thanh Thảo Nguyên**<br>*(Business Analyst · BA)*<br>`24127469` | • ChatGPT (GPT-4o)<br>• Google Gemini 1.5 Pro | • Formulating domain inquiry questions regarding copy state lifecycle and hold queue behaviors (Task `PA2-N1`).<br>• Brainstorming operational root causes and problem consequences for the Problem Statement & Business Context (Task `PA2-N2`).<br>• Generating initial draft templates for Use Case specifications (`UC-01` to `UC-11`) including main, alternative, and exception flows (Task `PA2-N3`).<br>• Refining grammar, passive voice consistency, and formal IEEE 830 requirement phrasing ("The system shall...") across all 32 FR statements (Task `PA2-N4`, `PA2-N6`). | • Audited all draft Use Cases against domain constraints; eliminated AI hallucinations that proposed automated online fine payments or external email reminders (strictly out-of-scope per PA1 §2.4).<br>• Modified checkout and return flows to strictly enforce FIFO queue progression (`BR-07`) and the 72-hour hold shelf expiration rule (`BR-08`).<br>• Added explicit exception flow `E3` in `UC-08` addressing returned damaged copies, ensuring damaged items transition to `Damaged`/`Lost` and never route to waiting patrons (per TA feedback `TA-FB-02`).<br>• Standardized all terminology against `02-glossary.md` (e.g., distinguishing "Book Title" from "Book Copy"). |
| **3** | **Vũ Thị Ánh**<br>*(Designer / Software Architect)*<br>`24127324` | • ChatGPT (GPT-4o)<br>• Claude 3.5 Sonnet | • Brainstorming screen inventory hierarchy and decomposing complex circulation desk workflows into discrete UI views (Task `PA2-A1`).<br>• Formulating accessibility verification guidelines (WCAG 2.1 AA / Lighthouse contrast ratio $\ge 4.5:1$, visible focus indicators, keyboard tab order) (Task `PA2-A4`).<br>• Drafting specification text for `UC-12` (Reader Dashboard & Overdue Desk) and screen inventory mapping (Task `PA2-A4`, `PA2-A6`).<br>• Structuring CSS and layout parameters for responsive viewport consistency (1024px to 1920px per `NFR-07`). | • Cross-referenced AI UI suggestions with actual Figma wireframe components; separated the single "Circulation Desk" into dedicated Checkout (`SCR-07`) and Return (`SCR-08`) screens to reduce librarian cognitive load.<br>• Added explicit error banners and alert modals (`GAP-01`, `GAP-02`, `GAP-03`) to wireframes: blocked borrowing banner when patron has overdue loans (`BR-04`), and 72-hour hold confirmation toast upon return of reserved copies (`BR-08`).<br>• Audited Figma color palettes with Stark plugin to guarantee true contrast ratio compliance rather than relying on AI estimates.<br>• Verified all 12 wireframe PNG exports (`SCR-01.png` to `SCR-12.png`) against actual use case interactions. |
| **4** | **Trần Hà Anh Quân**<br>*(Software Developer)*<br>`24127228` | • Claude 3.5 Sonnet<br>• GitHub Copilot | • Technical feasibility and risk analysis for concurrent circulation transactions (Task `PA2-Q2`, `PA2-Q4`).<br>• Formulating the PostgreSQL row-level locking strategy (`SELECT FOR UPDATE`) within `BEGIN ... COMMIT` blocks to prevent race conditions during checkout and hold routing (Task `PA2-Q2`).<br>• Reviewing Non-Functional Requirements measurability and designing automated test verification harnesses (k6 / Artillery load profiles, Jest concurrency tests) (Task `PA2-Q3`).<br>• Generating Git tagging and CI verification checklists (Task `PA2-Q6`). | • Critically assessed AI concurrency recommendations; rejected optimistic locking because high-contention hold shelf transitions require deterministic serializability, mandating pessimistic row-level locks on book copy and reservation records.<br>• Verified that `NFR-01` parameters (P95 $\le 1.0\text{s}$ under 100 VU across 10,000 records) are realistic on free-tier PostgreSQL hosting (Render) by indexing ISBN and foreign keys.<br>• Confirmed that repository code remains an uncommitted planning skeleton (`src/.gitkeep`), ensuring no premature implementation was introduced in PA2.<br>• Fully documented developer findings in `docs/architecture/pa2-quan-technical-review.md` and `docs/ai-usage/pa2-q1-q6-quan.md`. |

---

## 11.3 Individual Member Confirmation & Signatures

Each team member hereby certifies that:
1. All AI tools utilized during Phase PA2 have been fully and truthfully disclosed above.
2. All generated content was critically reviewed, tested, and modified to fit project constraints.
3. The member understands and takes full intellectual ownership of their submitted work packages.

| Student ID | Full Name | Primary Role | AI Disclosure Confirmation | Date |
| :---: | :--- | :--- | :---: | :---: |
| **23127520** | **Nguyễn Phan Thế Vinh** | Team Lead / PM · Tester | **Confirmed & Signed** | 2026-11-03 |
| **24127469** | **Nguyễn Thanh Thảo Nguyên** | Business Analyst (BA) | **Confirmed & Signed** | 2026-11-03 |
| **24127324** | **Vũ Thị Ánh** | Designer / Software Architect | **Confirmed & Signed** | 2026-11-03 |
| **24127228** | **Trần Hà Anh Quân** | Software Developer | **Confirmed & Signed** | 2026-11-03 |

