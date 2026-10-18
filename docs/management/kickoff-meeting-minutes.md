# UniLib — University Library Management System
## Team T05 — PA1 Kickoff & Internal Planning Meeting Minutes

* **Date & Time:** Thursday, October 15, 2026 | 20:30 – 21:45 ICT
* **Location:** Online (Zalo Call & Google Meet)
* **Chair / Note Taker:** Nguyễn Phan Thế Vinh (Team Lead / PM · Tester)
* **Attendees:**
  1. Nguyễn Phan Thế Vinh (Lead / PM · Tester) — Present
  2. Nguyễn Thanh Thảo Nguyên (Business Analyst) — Present
  3. Vũ Thị Ánh (Designer / Architect) — Present
  4. Trần Hà Anh Quân (Developer) — Present
  *(Quorum: 4/4 members present — 100%)*

---

### 1. Objectives of the Meeting
1. Align the entire team on the project scope baselines (6 Must-have features F01–F06) and out-of-scope boundaries approved in PA0.
2. Formulate and agree on specific, verifiable exit criteria for all Waterfall phase gates (PA1 to Final demo).
3. Confirm final main and backup roles for each member as committed in the Team Contract.
4. Establish the 3-level Work Breakdown Structure (WBS) with 2–8 hour work packages.
5. Distribute individual PA1 section ownership, set internal review deadlines, and agree on collaboration workflows.

---

### 2. Key Discussion Points & Decisions

#### 2.1 Scope & Feature Boundary Alignment
* **Must-have Scope (Committed for PA5):**
  * **F01 Authentication & Roles:** Reader, Librarian, Administrator.
  * **F02 Book Catalog Management:** CRUD book titles, ISBN, author, category.
  * **F03 Book Copy Management:** Physical copies tracked with individual IDs/barcodes and Available/Borrowed status.
  * **F04 Search & Browse:** Keyword search across title, author, category, ISBN, and real-time copy availability.
  * **F05 Borrow & Return Management:** Loan checkout, return check-in, due date calculation, copy status updates, and overdue tracking.
  * **F06 Book Reservation:** Title-level reservation queue when all copies are borrowed; state advances to "Ready for Pickup" upon copy return.
* **Strict Out-of-Scope Confirmation:**
  * No e-book reading or DRM.
  * No real payment gateways or fine processing.
  * No physical RFID/hardware barcode scanner integration (copy IDs entered via UI/virtual input).
  * No inter-library loans or AI recommendation engine.
  * No external production email/SMS services (in-app notifications/status displays only).
  * No mobile native apps.

#### 2.2 Phase Gate Exit Criteria
* The team unanimously agreed to the proposed exit criteria for each phase gate:
  * **PA1 (End of W3):** Approved project proposal & plan, protected GitHub repo, populated GitHub Projects board.
  * **PA2 (End of W5):** SRS with detailed specs for F01–F06, Use Case model, wireframes, and RTM baseline.
  * **PA3 (End of W7):** C4 architecture, 3NF PostgreSQL ERD/DDL, REST API specs for F01–F06, UI mockups, and ADRs.
  * **PA4 (End of W8):** Master Test Plan, detailed test cases for F01–F06, automated test setup, and RTM updated with test coverage.
  * **PA5 (End of W10):** Full implementation of F01–F06 on React + Express + PostgreSQL, 100% critical bugs resolved, deployed to Vercel (FE) and Render (BE/DB).
  * **Final (W11):** Live demo of all 6 Must-haves, final slides, team retrospective, and final contribution assessment.

#### 2.3 Role Allocations (Main + Backup)
* **Team Lead / Project Manager:** Main: Nguyễn Phan Thế Vinh | Backup: Trần Hà Anh Quân
* **Business Analyst:** Main: Nguyễn Thanh Thảo Nguyên | Backup: Vũ Thị Ánh
* **Designer / Architect:** Main: Vũ Thị Ánh | Backup: Nguyễn Thanh Thảo Nguyên
* **Developer:** Main: Trần Hà Anh Quân | Backup: Nguyễn Phan Thế Vinh
* **Tester:** Main: Nguyễn Phan Thế Vinh | Backup: Nguyễn Thanh Thảo Nguyên

#### 2.4 PA1 Internal Work Distribution & Deadlines
To comply with the Team Contract rule (internal completion 2 days before official deadlines), the team agreed on the following internal milestones for PA1:
* **Internal Draft Milestone:** Tuesday, Week 3, 23:59 ICT (individual sections completed).
* **Cross-Review & Integration Milestone:** Wednesday, Week 3, 23:59 ICT (peer feedback and fixes).
* **Final Sign-off & Submission Freeze:** Friday, Week 3, 18:00 ICT (submission baseline created).

---

### 3. Action Items & Internal Assignments Table

| Task ID | Work Package / Section | Primary Owner | Peer Reviewer | Internal Deadline | Key Deliverable |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **ACT-01** | Section 1 & Section 4.5 (Roles & Member Assessment) | Vinh | All members | Tue 23:59 (W3) | Contribution percentages and confirmed role matrix |
| **ACT-02** | Section 2.1–2.4 (Vision, Problem, Stakeholders, Scope) | Nguyên | Vinh | Tue 23:59 (W3) | Preliminary problem statement, product positioning, MoSCoW table |
| **ACT-03** | Section 3.1–3.3 (C4 Context, Tech Stack, Environment) | Ánh | Quân | Tue 23:59 (W3) | Preliminary architecture diagram and stack justification |
| **ACT-04** | Section 4.1 & 4.2 (Phase Gates & 3-level WBS) | Vinh | Nguyên | Sun 23:59 (W2) | Exit criteria table and 53 work packages (2–8h) |
| **ACT-05** | Section 4.3 (Effort Estimation & Cost Model) | Vinh | Quân | Tue 23:59 (W3) | Person-hour estimation table and HR budget |
| **ACT-06** | Section 4.4 (Project Schedule & Gantt Baseline) | Ánh | Vinh | Tue 23:59 (W3) | Gantt chart with milestones and critical path |
| **ACT-07** | Section 5 (Risk Management Plan) | Vinh | Ánh | Tue 23:59 (W3) | 5+ identified risks with Probability, Loss, RE, and mitigations |
| **ACT-08** | Section 6 (Tools Setup & GitHub Projects Task Board) | Quân | Vinh | Mon 23:59 (W3) | GitHub repo structure, branch protection, and board populated |
| **ACT-09** | PA1 Final Consolidation, PR & Submission | Vinh | All members | Fri 18:00 (W3) | Baseline Markdown & PDF export submitted |

---

### 4. Working Rules Reminder
* **Communication:** Zalo group for urgent chats; GitHub Issues/PRs for technical discussions.
* **Response SLA:** Maximum 24 hours on all days including weekends.
* **Pull Request Rule:** At least 1 approving review required before merging into `main`.
* **AI Usage Policy:** All AI usage must be recorded with tool name, task purpose, and verification method in Section 7.
