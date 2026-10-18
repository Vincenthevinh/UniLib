**Introduction to Software Engineering**

**Table of Contents**  
**[Objectives	1](#objectives)**  
[**1**	**Team Information	2**](#team-information)  
[**2**	**Project Idea Overview	3**](#project-idea-overview)  
[2.1	Project Name and One-Sentence Pitch	3](#project-name-and-one-sentence-pitch)  
[2.2	Problem and Motivation	3](#problem-and-motivation)  
[2.3	Target Users	3](#target-users)  
[2.4	Main Features	3](#main-features)  
[2.5	Similar Products	4](#similar-products)  
[2.6	Platform and Technology Ideas	4](#platform-and-technology-ideas)  
[2.7	Feasibility, Scope and Open Questions	4](#feasibility,-scope-and-open-questions)  
[**3**	**Team Contract	5**](#team-contract)  
[3.1	Goals and Expectations	5](#goals-and-expectations)  
[3.2	Communication	5](#communication)  
[3.3	Meetings	5](#meetings)  
[3.4	Roles and Responsibilities	5](#roles-and-responsibilities)  
[3.5	Work Standards	5](#work-standards)  
[3.6	Use of AI Tools	6](#use-of-ai-tools)  
[3.7	Decision Making	6](#decision-making)  
[3.8	Handling Conflicts and Missed Work	6](#handling-conflicts-and-missed-work)  
[3.9	Signatures	6](#signatures)  
[**4**	**AI Usage Log	7**](#ai-usage-log)

**Project Idea & Team Contract**

# **Objectives** {#objectives}

This document focus on the following topics:

* Describing the project idea at a high level so the teaching staff can approve it  
* Agreeing on how the team will work together (team contract)  
* PA0 is not graded, but it is required before the team starts PA1

1. # **Team Information** {#team-information}

| *Item* | Value |
| :---- | :---- |
| *Team ID* | T05 |
| *Team name* | 2 girls 2 cúp |
| *Team lead* | Nguyễn Phan Thế Vinh |
| *Communication channel* | *https\://zalo.me/g/k90myeounyyvc30vq49v* |

| Student ID | Full name | Email | Main role | Backup role |
| :---- | :---- | :---- | :---- | :---- |
| 23127520 | Nguyễn Phan Thế Vinh | nptvinh23@clc.fitus.edu.vn | *\<Team lead / PM\>* | Trần Hà Anh Quân |
| 24127469 | Nguyễn Thanh Thảo Nguyên | nttnguyen2410@clc.fitus.edu.vn | *\<Business analyst\>* | Vũ Thị Ánh |
| 24127324 | Vũ Thị Ánh | vtanh2425@clc.fitus.edu.vn | *\<Designer\>* | Nguyễn Thanh Thảo Nguyên |
| 24127228 | Trần Hà Anh Quân | thaquan2418@clc.fitus.edu.vn | *\<Developer\>* | Nguyễn Phan Thế Vinh |
| 23127520 | Nguyễn Phan Thế Vinh | nptvinh23@clc.fitus.edu.vn | *\<Tester\>* | Nguyễn Thanh Thảo Nguyên |

*\[Roles may change later; confirm the final assignment in PA1. Every role needs one main person and one backup.\]*

2. # **Project Idea Overview** {#project-idea-overview}

*\[About 1–2 pages. Keep it high level; detailed requirements come in PA2.\]*

1. ## **Project Name and One-Sentence Pitch** {#project-name-and-one-sentence-pitch}

*\[e.g., “CineGo – a web app that lets students book cheap cinema tickets in under one minute.”\]*  
**UniLib – University Library Management System.** A web-based library management system that allows readers to search and reserve books, while helping librarians manage books, physical copies, borrowing, returns, overdue records, and library users.

2. ## **Problem and Motivation** {#problem-and-motivation}

*\[What problem does the system solve? Who has this problem today, and how do they handle it now?\]*  
Many small or university libraries still rely on spreadsheets, paper records, or separate tools. This makes it difficult to know which books are available, who is borrowing a specific physical copy, when an item is due, which loans are overdue, and which books are most frequently borrowed. Readers may also need to ask a librarian just to check availability. UniLib centralizes these activities in one web system so book, copy, user, loan, reservation, and overdue information can be tracked consistently.

3. ## **Target Users** {#target-users}

| User group | What they need from the system |
| :---- | :---- |
| Reader / Student | Search and browse books, check availability, reserve a title, and view current borrowed books. |
| Librarian | Manage books and physical copies; process borrowing and returns; manage reservations and overdue loans. |
| Administrator | Manage user accounts, roles/permissions, and basic system configuration. |

   4. ## **Main Features** {#main-features}

*\[List 5–10 main features. Mark the ones you consider Must-have; only Must-have features must be fully implemented by PA5.\]*

| \# | Feature | Short description | Must-have? |
| ----- | :---- | :---- | ----- |
| 1 | User Authentication & Roles | Login and role-based access for Reader, Librarian, and Administrator. | Yes |
| 2 | Book Catalog Management | Add, edit, and remove book-title information. | Yes |
| 3 | Book Copy Management | Track each physical copy and its Available/Borrowed status. | Yes |
| 4 | Search & Browse Books | Search by title, author, category, or ISBN and view availability. | Yes |
| 5 | Borrow & Return Management | Create/close loans, assign due dates, and update copy status. | Yes |
| 6 | Book Reservation | Reserve a book title when no copy is currently available. | Yes |

5. ## **Similar Products** {#similar-products}

*\[Name 1–3 existing products or systems and explain how your idea is different or simpler.\]*  
Koha and FOLIO are full-featured open-source library systems with broad modules such as cataloging/inventory, circulation, users, holds, reporting, and more. UniLib is intentionally smaller: it focuses on the essential workflow of a university or small academic library—catalog management, physical-copy tracking, borrowing, returning, reservations, and overdue monitoring—so the scope remains suitable for a student project.

6. ## **Platform and Technology Ideas** {#platform-and-technology-ideas}

*\[Web, mobile or desktop? Preferred languages, frameworks and database (not final).\]*  
Platform: web application. Proposed stack: React for the frontend; Node.js \+ Express for the REST API; PostgreSQL for the database; Git \+ GitHub for version control; GitHub Projects for task management. A simple deployment can use Vercel for the frontend and Render for the backend/database. These are initial technology ideas and may be adjusted in PA1.

7. ## **Feasibility, Scope and Open Questions** {#feasibility,-scope-and-open-questions}

*\[Can a team of 4–5 students build the Must-have features in about three weeks of coding (weeks 8–10)? List what is out of scope, the main risks and the questions you want the TA to answer.\]*  
**Feasibility:** The seven Must-have features are achievable for a 4–5 student team if the team keeps the workflow focused and avoids production-scale integrations.  
	**Out of scope:** e-book reading/DRM, real online payments, RFID or real barcode-scanner integration, inter-library loans, AI recommendations, production SMS/email notification, a mobile app, and large-scale distributed deployment.  
	**Main risks to confirm as a team:** scope growth, keeping Book Copy/Loan/Reservation states consistent, and integration/deployment time.  
	**Open questions for the TA:** whether the proposed seven Must-have features are an appropriate PA5 scope, and whether reservation may stop at a “Ready” state without implementing real email/SMS delivery.

3. # **Team Contract** {#team-contract}

*\[Discuss each item as a team and write down what you agree. The contract is reviewed when a conflict occurs and is used as evidence when the teaching staff adjust individual contribution factors.\]*

1. ## **Goals and Expectations** {#goals-and-expectations}

*\[What grade is the team aiming for? How many hours per week will each member spend on the project?\]*  
The team aims to achieve a grade of 9.0/10 or higher. Each member is expected to contribute approximately 6–8 hours per week to the project and complete assigned tasks on time.

2. ## **Communication** {#communication}

* *Main channel for discussion: https\://zalo.me/g/k90myeounyyvc30vq49v*  
* *Expected response time to messages: within 24 hours on everyday (even on weekends)*  
* *Where decisions and files are kept: GitHub repository for source code/version history; GitHub Projects for tasks. Shared document location:* 

*https\://drive.google.com/drive/folders/1-NMRq6h4VBSVVoRcVZeJGs6eGcY52l-b?usp=drive\_link*

3. ## **Meetings**  {#meetings}

* *Weekly status meeting with the TA: Online at 19:30 Sunday*  
* *Internal team meetings: Thursday, 20:30*  
* *Attendance rule: inform the team in advance if you cannot attend; missed meetings are recorded in the weekly status report*  
* *Weekly status report deadline chosen by the team: 23:59 Friday*

  4. ## **Roles and Responsibilities** {#roles-and-responsibilities}

*\[Refer to the team table above; add any extra responsibilities (e.g., who sets up CI, who prepares the presentation).\]*  
Use the main/backup role assignments in the Team Information table. Every role should have one main owner and one backup, and the final allocation will be confirmed in PA1. Feature/document ownership and any extra duties such as CI setup or presentation preparation should be assigned on the task board.

5. ## **Work Standards** {#work-standards}

* *Internal deadline: each member finishes their part 2 days before a PA deadline*  
* *Quality: every document section and pull request is reviewed by at least one other member*  
* *Tools: every task is on the task board with an owner and due date; code goes through pull requests*

  6. ## **Use of AI Tools** {#use-of-ai-tools}

*\[Agree how the team uses AI tools (which tools, for what, how outputs are reviewed) and who keeps the AI usage log for each PA. The course GenAI policy applies.\]*  
The team may use ChatGPT or similar AI tools for brainstorming, drafting, code assistance, explanation, and review. AI output must be checked against the project requirements, edited by the responsible member, and never submitted blindly. Any reused external code must have its license/source checked, and every member must understand the work they submit.  
The team leader is responsible for maintaining the AI usage log for each PA. All team members must report their AI usage and provide the necessary details to ensure the log is accurate and complete.

7. ## **Decision Making** {#decision-making}

*\[How are decisions made (consensus, majority vote, team lead decides after discussion)? Who breaks a tie?\]*  
Proposed rule: try to reach consensus first. If consensus cannot be reached, use a majority vote after discussion. Tie-break rule: If a vote results in a tie, the team will discuss the issue again and try to reach a consensus. If no agreement can be reached, the team leader will make the final decision after considering all members' opinions.

8. ## **Handling Conflicts and Missed Work** {#handling-conflicts-and-missed-work}

* *Step 1: talk directly with the member and agree on a fix and a new date*  
* *Step 2: discuss in a team meeting and record it in the weekly status report*  
* *Step 3: inform the TA; the issue is taken into account in the individual contribution factor*

*If urgent work is blocked, the team may reassign the task after discussion and record the change on the task board/status report.*

* *\<Add or change steps as the team agrees\>*

  9. ## **Signatures** {#signatures}

*\[By signing, each member agrees to follow this contract.\]*

| Student ID | Full name | Signature | Date |
| :---- | :---- | ----- | :---- |
| 23127520 | Nguyễn Phan Thế Vinh | Vinh | 12/10/2026 |
| 24127469 | Nguyễn Thanh Thảo Nguyên |       Nguyên | 12/10/2026 |
| 24127228 | Trần Hà Anh Quân |   Quân | 12/10/2026 |
| 24127324 | Vũ Thị Ánh | Ánh | 12/10/2026 |

4. # **AI Usage Log** {#ai-usage-log}

*\[Required in every PA (course GenAI policy). List each significant use of AI tools. Write “No AI tools were used” if none. Undisclosed AI use is treated as an academic integrity violation.\]*

| \# | Member | Tool | Task / purpose | How the output was verified and changed |
| :---- | :---- | :---- | :---- | :---- |
| 1 | Trần Hà Anh Quân | ChatGPT | Support brainstorming for the UniLib project and assist with drafting technical ideas, main features, and implementation-related content for the PA0 document  | The output was reviewed against the course template and discussed with the team. Technical suggestions were adjusted to match the agreed project scope and the developer's responsibilities.  |
| 2 | Nguyễn Phan Thế Vinh | ChatGPT | Support Quan brainstorming for the UniLib project and implement content for the PA0 document. | Every member reaches a consensus after the team ‘s internal meeting. |
| 3 | Vũ Thị Ánh | ChatGPT, Gemini  | Define target user needs and assist in drafting the main features for the PA0 document.  | Reviewed with the team to filter out redundant features and refine the scope for a student library project.  |
| 4 | Nguyễn Thanh Thảo Nguyên | ChatGPT, Gemini | Assisted in drafting user roles, business rules, and refining team contract rules.  | Reviewed the content from a Business Analyst perspective, corrected logical flows, and edited the text to meet academic standards.  |

