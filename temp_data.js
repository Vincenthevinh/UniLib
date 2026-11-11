// UniLib PA2 plan data — the single source of truth for every task, slot and owner shown on the dashboard.
// Edit this file to change the plan; app.js only renders it.

window.PLAN = {
  project: "UniLib – University Library Management System",
  team: "T05 · 2 girls 2 cúp",
  phase: "PA2 — Software Requirements Specification",
  start: "22/10/2026",
  internalDeadline: "02/11/2026",
  submit: "04/11/2026",

  owners: {
    "Vinh": { color: "blue", full: "Nguyễn Phan Thế Vinh", role: "Team lead / PM · Tester", lane: "PM, Acceptance & Traceability", backup: "Quân" },
    "Nguyên": { color: "green", full: "Nguyễn Thanh Thảo Nguyên", role: "Business Analyst", lane: "Requirements & Use Case Specs", backup: "Ánh" },
    "Ánh": { color: "violet", full: "Vũ Thị Ánh", role: "Designer", lane: "Wireframes & Prototype", backup: "Nguyên" },
    "Quân": { color: "orange", full: "Trần Hà Anh Quân", role: "Developer", lane: "Repo, UC Model, NFR & Tech Specs", backup: "Vinh" }
  },

  slots: [
    { id: "S1", label: "S1 · Thứ 5–6", dates: "22–23/10", focus: "Đọc tài liệu & Kickoff" },
    { id: "S2", label: "S2 · Thứ 7–Thứ 2", dates: "24–26/10", focus: "Nền tảng SRS" },
    { id: "S3", label: "S3 · Thứ 3–5", dates: "27–29/10", focus: "Requirements core" },
    { id: "S4", label: "S4 · Thứ 6–7", dates: "30–31/10", focus: "Use case specs & prototype" },
    { id: "S5", label: "S5 · CN–Thứ 2", dates: "01–02/11", focus: "Traceability & review" },
    { id: "S6", label: "S6 · Thứ 3–4", dates: "03–04/11", focus: "Baseline & nộp PA2" }
  ],

  // Shared reading pack referenced by tasks (keys used in task.reading).
  docs: {
    PA0: "PA0 – Project Idea & Team Contract (scope, roles, Work Standards §3.5, AI policy §3.6)",
    PA1: "PA1 – Project Proposal & Plan (Scope F01–F07, out-of-scope, glossary, stakeholders, gate PA2, WBS 2.x)",
    PA2T: "PA2 – SRS template (cấu trúc section, ví dụ FR/NFR/UC, yêu cầu ≥ 6 UC specs)",
    REG: "docs/pa2/00-id-registry.md (ID đã freeze: F, FR, NFR, BR, UC, SCR, AC)",
    BR: "docs/pa2/07-business-rules.md (BR-01…)",
    FR: "docs/pa2/05-functional-requirements.md",
    UC: "docs/pa2/09-use-case-model.md (diagram, actors, UC list)",
    WF: "Figma file UniLib-PA2 (wireframes SCR-01…SCR-12)"
  },

  tasks: [
    // ───────────── S1 · Đọc tài liệu & Kickoff ─────────────
    {
      id: "PA2-V1", slot: "S1", owner: "Vinh", type: "pm", hours: 2.5,
      title: "Đọc tài liệu, kickoff PA2 & freeze ID Registry",
      reading: ["PA0", "PA1", "PA2T"],
      goal: "Cả nhóm bắt đầu PA2 trên cùng một baseline: hiểu rõ phải nộp gì, ai sở hữu section nào, và dùng chung một bộ ID để 4 người viết song song mà không phải chờ nhau.",
      scope: [
        "Đọc lại PA0, PA1 (Scope, gate PA2, WBS 2.x) và toàn bộ template PA2 trước kickoff",
        "Kickoff online Thứ 6 23/10 · 20:00 (timebox 60 phút) với đầu vào từ N1, A1, Q1",
        "Chốt 2 open items của PA1: giới hạn loan/reader và thời hạn giữ sách đặt trước",
        "Freeze ID Registry: F01–F07, FR-F0x-nn, NFR-nn, BR-nn, UC-01…UC-12, SCR-01…SCR-12, AC-F0x-nn",
        "Gán 1 owner + 1 reviewer cho mỗi section SRS; tạo 24 issue trên GitHub Projects"
      ],
      deliverables: [
        "docs/pa2/00-id-registry.md (bảng ID + changelog)",
        "Biên bản kickoff + decision log (loan limit, pickup window)",
        "GitHub Projects: 24 issue có owner, due date, label slot S1–S6",
        "Mục kickoff trong weekly status report 23/10 23:59"
      ],
      ac: [
        "4/4 thành viên tick checklist “đã đọc tài liệu” trước khi họp",
        "Danh sách UC-01…UC-12 và SCR-01…SCR-12 được cả nhóm ACK và freeze",
        "Mỗi section SRS có đúng 1 owner + 1 reviewer, không section nào bị bỏ trống",
        "Open items có quyết định ghi rõ người chốt, lý do và ngày",
        "Thay đổi ID sau freeze chỉ qua PM và ghi changelog"
      ],
      verify: [
        "Mỗi thành viên comment “ACK” trên issue ID Registry",
        "Đối chiếu UC list với 6 Must-have F01–F06 — mỗi feature ≥ 1 UC",
        "Spot-check board: 24/24 issue có owner và due date"
      ],
      deps: "Đầu vào cùng slot: N1 (câu hỏi BA), A1 (screen inventory), Q1 (skeleton repo). Đầu ra: unblock toàn bộ task S2 trở đi.",
      risks: "Kickoff kéo dài hoặc không chốt được → áp dụng tie-break rule trong Team Contract, PM chốt sau khi nghe ý kiến.",
      files: ["docs/pa2/00-id-registry.md", "docs/pa2/meetings/2026-10-23-kickoff.md"]
    },
    {
      id: "PA2-N1", slot: "S1", owner: "Nguyên", type: "read", hours: 1.5,
      title: "Đọc tài liệu BA & lập danh sách câu hỏi domain",
      reading: ["PA0", "PA1", "PA2T"],
      goal: "Nắm chắc domain thư viện và các giả định trong PA1 để đưa ra các câu hỏi cần chốt ngay tại kickoff, tránh phải viết lại requirement về sau.",
      scope: [
        "Đọc glossary, assumptions và items for clarification trong PA1",
        "Đọc yêu cầu section Problem Statement, FR, Business Rules, UC specs trong template PA2",
        "Liệt kê câu hỏi domain: loan limit, pickup window, gia hạn, xóa title còn copy, trạng thái Maintenance",
        "Đề xuất đáp án mặc định cho từng câu hỏi để PM chốt nhanh"
      ],
      deliverables: [
        "docs/pa2/notes/ba-questions.md (câu hỏi + đề xuất mặc định)",
        "Bảng phân rã F01–F07 → nhóm FR dự kiến (input cho ID Registry)"
      ],
      ac: [
        "Mỗi câu hỏi có đề xuất mặc định và ảnh hưởng tới feature nào",
        "Bao phủ đủ 2 open items PA1 và ≥ 3 câu hỏi về trạng thái Copy/Loan/Reservation",
        "Gửi trước kickoff ít nhất 2 giờ"
      ],
      verify: [
        "PM xác nhận đã nhận và đưa vào agenda kickoff",
        "Đối chiếu với out-of-scope PA1 — không đề xuất feature mới"
      ],
      deps: "Không phụ thuộc. Đầu ra cho PA2-V1 (kickoff) và PA2-N3 (business rules).",
      risks: "Đặt câu hỏi mở rộng scope (fine, email) → luôn đối chiếu out-of-scope của PA1.",
      files: ["docs/pa2/notes/ba-questions.md"]
    },
    {
      id: "PA2-A1", slot: "S1", owner: "Ánh", type: "read", hours: 1.5,
      title: "Đọc tài liệu UX & đề xuất screen inventory",
      reading: ["PA1", "PA2T"],
      goal: "Hiểu nhu cầu của Reader, Librarian, Administrator và yêu cầu section Prototype/Mockups để đề xuất danh sách màn hình SCR-01…SCR-12 dùng chung cho cả nhóm.",
      scope: [
        "Đọc Stakeholders & Scope trong PA1, section Prototype/Mockups trong template PA2",
        "Đề xuất danh sách màn hình theo actor, map sơ bộ màn hình ↔ feature",
        "Chuẩn bị Figma file UniLib-PA2 với page Reader / Librarian / Admin",
        "Ghi chú yêu cầu accessibility tối thiểu: contrast, label, keyboard"
      ],
      deliverables: [
        "Screen inventory SCR-01…SCR-12 (tên, actor, feature) gửi PM trước kickoff",
        "Figma file UniLib-PA2 đã tạo sẵn khung trang, share quyền view cho team"
      ],
      ac: [
        "Mỗi feature F01–F06 có ≥ 1 màn hình",
        "Không có màn hình ngoài scope (thanh toán, e-book, mobile app)",
        "Link Figma truy cập được bởi 4/4 thành viên"
      ],
      verify: [
        "Đối chiếu inventory với UC list dự kiến của N1/Q1",
        "Mở link Figma bằng tài khoản thành viên khác"
      ],
      deps: "Không phụ thuộc. Đầu ra cho PA2-V1 (freeze SCR IDs) và PA2-A2/A3.",
      risks: "Thiết kế quá sớm ở mức hi-fi → PA2 chỉ cần low-fidelity; hi-fi thuộc PA3.",
      files: ["Figma: UniLib-PA2", "docs/pa2/notes/screen-inventory.md"]
    },
    {
      id: "PA2-Q1", slot: "S1", owner: "Quân", type: "code", hours: 2,
      title: "Đọc tài liệu kỹ thuật & dựng skeleton docs/pa2 trong repo",
      reading: ["PA1", "PA2T"],
      goal: "Mỗi section SRS nằm trong một file riêng có owner, nên 4 người cùng viết song song qua pull request mà không bị merge conflict.",
      scope: [
        "Đọc Architecture, Tech Stack, Constraints trong PA1 và template PA2",
        "Tạo thư mục docs/pa2/ với 1 file Markdown cho mỗi section, header ghi owner/reviewer/status",
        "Thêm PR template (checklist: đúng ID, đã self-review, có reviewer) và label pa2",
        "Thêm script gộp file theo thứ tự thành SRS-draft.md (đơn giản, không cần CI)"
      ],
      deliverables: [
        "docs/pa2/00…14-*.md skeleton + docs/pa2/uc/ cho từng UC spec",
        ".github/pull_request_template.md",
        "scripts/build-srs.sh (hoặc npm script) gộp SRS-draft.md",
        "Hướng dẫn ngắn trong docs/pa2/README.md"
      ],
      ac: [
        "Mỗi section template PA2 có đúng 1 file tương ứng",
        "Header mỗi file có Owner / Reviewer / Status (Draft → Review → Baseline)",
        "Chạy script gộp ra 1 file đúng thứ tự section của template",
        "Branch protection main yêu cầu ≥ 1 review vẫn hoạt động"
      ],
      verify: [
        "Chạy script trên máy sạch sau git clone",
        "Mở thử 1 PR nháp để kiểm tra template và review rule"
      ],
      deps: "Không phụ thuộc. Đầu ra cho tất cả task viết docs từ S2.",
      risks: "Đặt tên file không khớp ID Registry → cập nhật ngay sau kickoff V1.",
      files: ["docs/pa2/", ".github/pull_request_template.md", "scripts/build-srs.sh"]
    },

    // ───────────── S2 · Nền tảng SRS ─────────────
    {
      id: "PA2-V2", slot: "S2", owner: "Vinh", type: "docs", hours: 2,
      title: "Introduction, Purpose & Scope, Stakeholders, Contribution",
      reading: ["PA1", "PA2T", "REG"],
      goal: "Hoàn thành các section mở đầu của SRS: người đọc biết tài liệu dùng để làm gì, phạm vi tới đâu và ai quan tâm đến hệ thống.",
      scope: [
        "Purpose & Scope: mục đích tài liệu, in-scope F01–F07, out-of-scope, intended readers",
        "Stakeholders: mở rộng từ PA1 (Sponsor, Reader, Librarian, Admin, Dev team) + interests/concerns",
        "Khung bảng Member Contribution Assessment (điền % ở S6)",
        "Giữ nhất quán thuật ngữ với glossary (N2) qua ID Registry"
      ],
      deliverables: [
        "docs/pa2/01-introduction.md",
        "docs/pa2/04-stakeholders.md",
        "docs/pa2/00-contribution.md (khung, cột Evidence có link issue)"
      ],
      ac: [
        "Out-of-scope khớp 100% với PA1 (không thêm, không bớt)",
        "Mỗi stakeholder có description + ≥ 2 interests/concerns",
        "Intended readers nêu rõ cách mỗi nhóm đọc tài liệu"
      ],
      verify: [
        "Reviewer Quân đối chiếu với PA1 §2.3–2.4",
        "Không còn placeholder <…> trong file"
      ],
      deps: "Cần V1 (ID Registry). Không chặn task khác.",
      risks: "Copy nguyên PA1 → phải elaborate thêm góc nhìn requirements.",
      files: ["docs/pa2/01-introduction.md", "docs/pa2/04-stakeholders.md", "docs/pa2/00-contribution.md"]
    },
    {
      id: "PA2-N2", slot: "S2", owner: "Nguyên", type: "docs", hours: 3,
      title: "Glossary & Problem Statement",
      reading: ["PA1", "PA2T", "REG"],
      goal: "Mở rộng Problem Statement từ PA1 và chuẩn hóa thuật ngữ, để các section sau dùng chung một ngôn ngữ và không hiểu nhầm trạng thái Copy/Loan/Reservation.",
      scope: [
        "Glossary: Book Title, Book Copy, Loan, Reservation, Overdue, Hold/Ready, Due date, Role, Reader…",
        "Problem Statement: business context, current problems, goals, operating environment",
        "Design & implementation constraints (React, Express, PostgreSQL, trình duyệt, scope boundary)",
        "Đánh dấu thuật ngữ trạng thái làm chuẩn cho BR và UC specs"
      ],
      deliverables: [
        "docs/pa2/02-glossary.md (≥ 15 thuật ngữ)",
        "docs/pa2/03-problem-statement.md"
      ],
      ac: [
        "Mỗi trạng thái Copy (Available/Borrowed/Reserved/Maintenance) có định nghĩa duy nhất",
        "Goals đo được hoặc quan sát được (vd: tra cứu availability không cần hỏi thủ thư)",
        "Constraints không mâu thuẫn với PA1"
      ],
      verify: [
        "Reviewer Ánh đọc chéo, đánh dấu thuật ngữ khó hiểu",
        "Tìm trong các file docs/pa2 — không dùng từ đồng nghĩa lệch glossary"
      ],
      deps: "Cần V1 (decision log). Đầu ra cho N3 (FR/BR) — chỉ là tham chiếu, không chặn.",
      risks: "Problem statement chung chung → nêu cụ thể vấn đề của thư viện đại học.",
      files: ["docs/pa2/02-glossary.md", "docs/pa2/03-problem-statement.md"]
    },
    {
      id: "PA2-A2", slot: "S2", owner: "Ánh", type: "design", hours: 4,
      title: "Wireframes luồng Reader (SCR-01…SCR-05)",
      reading: ["PA1", "PA2T", "REG", "WF"],
      goal: "Có wireframe low-fidelity cho toàn bộ hành trình của Reader, để BA và Developer hình dung được luồng khi viết use case.",
      scope: [
        "SCR-01 Login (dùng chung 3 role)",
        "SCR-02 Search & Browse (title/author/category/ISBN, filter, pagination, availability tag)",
        "SCR-03 Book detail & availability (số copy available, nút Reserve)",
        "SCR-04 Reservation confirm / queue position",
        "SCR-05 My Loans & Reservations (due date, overdue, trạng thái đặt trước)"
      ],
      deliverables: [
        "Figma page Reader với 5 frame đặt tên đúng SCR-ID",
        "Annotation trên mỗi frame: UC liên quan, state loading/empty/error"
      ],
      ac: [
        "Tên frame khớp ID Registry",
        "Mỗi màn hình có empty state và error state cơ bản",
        "Search có đủ 4 tiêu chí tìm kiếm theo F04",
        "Nút Reserve chỉ hiện khi 0 copy Available (theo BR đã chốt)"
      ],
      verify: [
        "Click-through thử hành trình search → detail → reserve → my loans",
        "Reviewer Nguyên xác nhận luồng khớp với F04/F06"
      ],
      deps: "Cần V1 (SCR IDs). Độc lập với FR — làm song song với N2/Q2.",
      risks: "Sa đà hi-fi → giữ grayscale, chỉ layout và nội dung.",
      files: ["Figma: UniLib-PA2 / Reader"]
    },
    {
      id: "PA2-Q2", slot: "S2", owner: "Quân", type: "code", hours: 3,
      title: "Use Case Diagram (PlantUML), Actors & Use Case List",
      reading: ["PA1", "PA2T", "REG"],
      goal: "Viết use case model dưới dạng diagram-as-code, có version trong repo, để mọi thay đổi đều review được qua PR và không phải vẽ lại bằng tay.",
      scope: [
        "Vẽ Use Case Diagram bằng PlantUML: Reader, Librarian, Administrator, system boundary",
        "Dùng đúng include/extend/generalisation (vd: UC-05 include UC-06; UC-10 extend UC-06)",
        "Bảng Actors và Use Case List (ID, tên, primary actor, priority, related FR group)",
        "Render PNG/SVG để nhúng vào SRS"
      ],
      deliverables: [
        "docs/pa2/diagrams/use-case.puml + use-case.svg",
        "docs/pa2/09-use-case-model.md (actors + UC list)"
      ],
      ac: [
        "12 UC khớp 100% với ID Registry",
        "Mỗi Must-have F01–F06 có ≥ 1 UC; F07 đánh priority Should",
        "Không có association giữa các actor với nhau, không vẽ luồng tuần tự",
        "File .puml render không lỗi"
      ],
      verify: [
        "Render bằng PlantUML CLI hoặc extension VS Code",
        "Reviewer Vinh kiểm tra include/extend đúng ngữ nghĩa"
      ],
      deps: "Cần V1 (UC IDs). Cột Related FR ghi theo nhóm FR-F0x-* nên không phải chờ N3.",
      risks: "Lạm dụng include/extend → chỉ dùng khi có hành vi dùng chung thật.",
      files: ["docs/pa2/diagrams/use-case.puml", "docs/pa2/09-use-case-model.md"]
    },

    // ───────────── S3 · Requirements core ─────────────
    {
      id: "PA2-V3", slot: "S3", owner: "Vinh", type: "test", hours: 3.5,
      title: "Acceptance Criteria Given/When/Then cho F01–F06",
      reading: ["PA1", "PA2T", "REG"],
      goal: "Viết acceptance criteria từ góc nhìn Tester, để PA4 chuyển thẳng thành acceptance test case và nhóm đã nghĩ đến case biên ngay từ PA2.",
      scope: [
        "Viết ≥ 3 AC cho mỗi Must-have F01–F06 theo dạng Given / When / Then",
        "Bao gồm happy path, negative path và boundary (vd: loan thứ 6 khi limit = 5)",
        "Đánh ID AC-F0x-nn theo Registry",
        "Ghi chú chỗ cần BR (link BR ID nếu đã có, hoặc TBD để đối chiếu ở V4)"
      ],
      deliverables: [
        "docs/pa2/08-acceptance-criteria.md (≥ 18 AC)"
      ],
      ac: [
        "Mỗi AC kiểm chứng được, có kết quả mong đợi cụ thể",
        "Mỗi feature có ≥ 1 negative case và ≥ 1 role/permission case",
        "Không có AC mô tả cách implement (chỉ mô tả hành vi)"
      ],
      verify: [
        "Họp nội bộ Thứ 5 29/10 20:30: đọc nhanh AC F05/F06 cùng Nguyên",
        "Self-check: mỗi AC trả lời được “test PASS khi nào?”"
      ],
      deps: "Cần V1 (decision log). Dựa trên feature PA1 nên không chờ N3; đối chiếu với FR ở V4.",
      risks: "AC lệch FR → V4 sẽ reconcile, không chặn tiến độ.",
      files: ["docs/pa2/08-acceptance-criteria.md"]
    },
    {
      id: "PA2-N3", slot: "S3", owner: "Nguyên", type: "docs", hours: 5,
      title: "Functional Requirements F01–F07 & Business Rules",
      reading: ["PA1", "PA2T", "REG", "UC"],
      goal: "Viết requirement có thể đánh số, ưu tiên và truy vết; đây là xương sống của SRS mà UC specs, RTM và test PA4 đều tham chiếu.",
      scope: [
        "FR dạng “The system shall …”, nhóm theo F01–F07, ID FR-F0x-nn",
        "Mỗi FR có MoSCoW priority và source (PA0/PA1, stakeholder, quyết định kickoff)",
        "Business rules BR-nn: loan 14 ngày, loan limit, FIFO reservation, pickup window, ISBN unique, không xóa title còn copy đang mượn…",
        "Ghi rõ source của BR (chính sách thư viện / quyết định team)"
      ],
      deliverables: [
        "docs/pa2/05-functional-requirements.md (≈ 30–40 FR)",
        "docs/pa2/07-business-rules.md (≥ 10 BR)"
      ],
      ac: [
        "100% FR có ID, priority và source",
        "Mỗi FR chỉ diễn tả 1 hành vi (atomic), không có từ mơ hồ (“nhanh”, “dễ dùng”)",
        "BR không mâu thuẫn với decision log và glossary",
        "Có FR cho chuyển trạng thái Copy khi borrow/return/reserve"
      ],
      verify: [
        "Họp nội bộ Thứ 5 29/10: walkthrough FR F05/F06 với Vinh và Quân",
        "Reviewer Ánh kiểm tra FR có màn hình tương ứng"
      ],
      deps: "Cần V1 + N2 (thuật ngữ). Đầu ra BR cho N4/Q4 ở S4 — task phụ thuộc cứng duy nhất của lane spec, nên được xếp trước 1 slot.",
      risks: "Task nặng nhất của Nguyên → push draft BR trước Thứ 4 28/10 để Quân xem sớm.",
      files: ["docs/pa2/05-functional-requirements.md", "docs/pa2/07-business-rules.md"]
    },
    {
      id: "PA2-A3", slot: "S3", owner: "Ánh", type: "design", hours: 4.5,
      title: "Wireframes Librarian & Admin (SCR-06…SCR-12)",
      reading: ["PA1", "PA2T", "REG", "WF"],
      goal: "Hoàn tất wireframe cho các nghiệp vụ quầy thủ thư và quản trị, để toàn bộ use case Must-have có màn hình minh họa.",
      scope: [
        "SCR-06 Catalog list & Book title form (add/edit/delete)",
        "SCR-07 Copy inventory theo title (copy ID, status)",
        "SCR-08 Circulation desk – Check-out (chọn reader + copy, due date tự tính)",
        "SCR-09 Check-in / Return",
        "SCR-10 Overdue loans list",
        "SCR-11 Reservation queue theo title",
        "SCR-12 User & role management (Admin)"
      ],
      deliverables: [
        "Figma page Librarian & Admin với 7 frame đúng SCR-ID",
        "Annotation: UC liên quan, validation message, confirm dialog cho thao tác xóa"
      ],
      ac: [
        "Form có label rõ ràng và chỉ ra trường bắt buộc",
        "Thao tác nguy hiểm (xóa title/copy, khóa user) có confirm",
        "Check-out hiển thị lỗi khi copy không Available hoặc reader vượt limit"
      ],
      verify: [
        "Click-through: catalog → copy → check-out → check-in → overdue",
        "Reviewer Quân xác nhận dữ liệu trên màn hình khả thi với stack"
      ],
      deps: "Cần V1 (SCR IDs). Chạy song song với N3; chỉ cập nhật nhỏ nếu BR thay đổi.",
      risks: "Nhiều màn hình → dùng component lặp lại (table, form, badge) để tiết kiệm thời gian.",
      files: ["Figma: UniLib-PA2 / Librarian & Admin"]
    },
    {
      id: "PA2-Q3", slot: "S3", owner: "Quân", type: "docs", hours: 3,
      title: "Non-Functional Requirements đo được",
      reading: ["PA1", "PA2T", "REG"],
      goal: "Viết NFR có metric và điều kiện cụ thể kèm cách kiểm chứng, để PA4/PA5 test được thật chứ không chỉ là khẩu hiệu.",
      scope: [
        "Performance: vd search ≤ 2 s ở P95 với 20 user đồng thời, catalog 5.000 title",
        "Security: password hash bcrypt, JWT hết hạn, RBAC trên mọi API, không lộ stack trace",
        "Data integrity: borrow/return atomic, không có 2 loan active cho cùng 1 copy",
        "Usability/Accessibility, Compatibility (Chrome/Firefox/Edge/Safari), Maintainability"
      ],
      deliverables: [
        "docs/pa2/06-non-functional-requirements.md (≥ 8 NFR, cột “How it will be verified”)"
      ],
      ac: [
        "100% NFR có metric + điều kiện + phương pháp verify",
        "Không có NFR vượt khả năng hạ tầng free-tier đã nêu ở PA1",
        "Mỗi NFR security/integrity map tới ≥ 1 FR hoặc BR"
      ],
      verify: [
        "Reviewer Vinh (Tester) xác nhận từng NFR đều viết được test",
        "Đối chiếu ràng buộc Render/Vercel free-tier trong PA1"
      ],
      deps: "Cần V1. Độc lập với FR/BR (tham chiếu theo ID).",
      risks: "Metric phi thực tế → chọn ngưỡng đo được trên máy local + seed data.",
      files: ["docs/pa2/06-non-functional-requirements.md"]
    },

    // ───────────── S4 · Use case specs & prototype ─────────────
    {
      id: "PA2-V4", slot: "S4", owner: "Vinh", type: "test", hours: 2.5,
      title: "Requirements Traceability Matrix (RTM) baseline",
      reading: ["REG", "FR", "UC", "WF"],
      goal: "Mỗi requirement đều truy vết được tới use case và màn hình; RTM được để sẵn cột Design (PA3) và Test cases (PA4) để mở rộng ở các PA sau.",
      scope: [
        "Lập RTM: Req ID → UC → Screen → Design element (PA3) → Test cases (PA4)",
        "Gắn AC-ID của V3 vào FR tương ứng, xử lý các mục TBD",
        "Đánh dấu FR mồ côi (không UC/không màn hình) và UC không có FR",
        "Gửi danh sách gap cho owner trước buổi review"
      ],
      deliverables: [
        "docs/pa2/12-traceability-matrix.md",
        "Danh sách gap (issue có label pa2-gap) giao owner xử lý"
      ],
      ac: [
        "100% FR Must-have có ≥ 1 UC và ≥ 1 Screen",
        "100% UC có ≥ 1 FR",
        "Cột PA3/PA4 tồn tại và để trống có chủ đích"
      ],
      verify: [
        "Script hoặc đếm thủ công: số FR trong RTM = số FR trong file FR",
        "Weekly status report Thứ 6 30/10 ghi số gap còn mở"
      ],
      deps: "Cần N3 (FR), Q2 (UC list), A2/A3 (SCR). Gap phát hiện được giao lại, không chặn người khác.",
      risks: "FR còn thay đổi → RTM là bản sống, chốt lần cuối ở V5.",
      files: ["docs/pa2/12-traceability-matrix.md"]
    },
    {
      id: "PA2-N4", slot: "S4", owner: "Nguyên", type: "docs", hours: 2.5,
      title: "UC Specifications: UC-01 Login, UC-03 Manage book titles",
      reading: ["PA2T", "REG", "FR", "BR", "WF"],
      goal: "Đặc tả chi tiết hai use case nền tảng (xác thực và catalog) theo đúng mẫu, với các bước được đánh số.",
      scope: [
        "Điền đủ bảng: ID, name, description, actors, priority, related FR, trigger, pre/post-conditions",
        "Main flow đánh số; alternative flows A1…; exception flows E1…",
        "Business rules và NFR constraints tham chiếu theo ID",
        "UC-01: sai mật khẩu, tài khoản bị khóa, logout; UC-03: ISBN trùng, xóa title còn copy"
      ],
      deliverables: [
        "docs/pa2/uc/UC-01.md",
        "docs/pa2/uc/UC-03.md"
      ],
      ac: [
        "Mỗi spec có ≥ 1 alternative và ≥ 1 exception flow",
        "Mọi bước tham chiếu màn hình SCR-ID khi có tương tác UI",
        "Related requirements khớp RTM"
      ],
      verify: [
        "Reviewer Ánh walkthrough spec trên wireframe SCR-01/SCR-06",
        "Vinh check pre/post-condition test được"
      ],
      deps: "Cần N3 (FR/BR, slot trước) và A2/A3 (SCR, slot trước). Không chờ ai trong cùng slot.",
      risks: "Spec quá dài → tập trung vào hành vi hệ thống, không mô tả UI chi tiết.",
      files: ["docs/pa2/uc/UC-01.md", "docs/pa2/uc/UC-03.md"]
    },
    {
      id: "PA2-A4", slot: "S4", owner: "Ánh", type: "design", hours: 3,
      title: "Interactive prototype, Screen list & accessibility check",
      reading: ["PA2T", "REG", "WF"],
      goal: "Biến wireframe thành prototype click được cho các use case chính và hoàn thành section Prototype/Mockups của SRS.",
      scope: [
        "Nối frame trong Figma prototype: Reader flow và Circulation flow",
        "Bảng Screen ↔ Related UC ↔ Mockup link trong SRS",
        "Kiểm tra accessibility cơ bản: contrast ≥ 4.5:1, mọi input có label, thứ tự tab hợp lý",
        "Export PNG các màn hình chính để nhúng vào SRS"
      ],
      deliverables: [
        "Link prototype Figma (public view)",
        "docs/pa2/11-prototype.md (screen list + link + ghi chú a11y)",
        "docs/pa2/img/SCR-*.png"
      ],
      ac: [
        "Prototype đi được hết luồng search → reserve và check-out → check-in",
        "12/12 màn hình có trong screen list với UC liên quan",
        "Checklist a11y có kết quả PASS/FAIL cho từng màn hình"
      ],
      verify: [
        "Thành viên khác (Quân) tự click prototype mà không cần hướng dẫn",
        "Dùng plugin contrast checker trên Figma"
      ],
      deps: "Cần A2/A3 (slot trước). Độc lập với UC specs cùng slot.",
      risks: "Link Figma bị private → kiểm tra bằng trình duyệt ẩn danh.",
      files: ["docs/pa2/11-prototype.md", "docs/pa2/img/"]
    },
    {
      id: "PA2-Q4", slot: "S4", owner: "Quân", type: "docs", hours: 4,
      title: "UC Specs: UC-04 Copies, UC-07 Check-out, UC-08 Check-in",
      reading: ["PA2T", "REG", "FR", "BR", "WF"],
      goal: "Đặc tả các use case lưu thông có rủi ro trạng thái cao nhất bằng góc nhìn developer, để Copy/Loan/Reservation luôn nhất quán.",
      scope: [
        "UC-04 Manage book copies: thêm copy, đổi trạng thái Maintenance, không xóa copy đang Borrowed",
        "UC-07 Check-out: kiểm tra copy Available, loan limit, tự tính due date 14 ngày",
        "UC-08 Check-in: đóng loan, đánh dấu overdue, chuyển copy sang Reserved nếu có hàng đợi (FIFO)",
        "Bảng state transition Copy/Loan/Reservation đính kèm (phục vụ PA3 schema)"
      ],
      deliverables: [
        "docs/pa2/uc/UC-04.md, UC-07.md, UC-08.md",
        "docs/pa2/diagrams/state-transitions.md (Mermaid stateDiagram)"
      ],
      ac: [
        "Mỗi spec có main/alternative/exception flow đánh số",
        "Mọi chuyển trạng thái trong flow đều có trong bảng state transition",
        "Exception khi 2 thủ thư check-out cùng copy được mô tả rõ"
      ],
      verify: [
        "Reviewer Nguyên đối chiếu với BR",
        "Vinh đọc thử: mỗi exception flow sinh được ≥ 1 test case"
      ],
      deps: "Cần N3 (BR, slot trước) và A3 (SCR-07…09). Không chờ ai trong cùng slot.",
      risks: "Lấn sang thiết kế DB → chỉ mô tả trạng thái nghiệp vụ, schema để PA3.",
      files: ["docs/pa2/uc/UC-04.md", "docs/pa2/uc/UC-07.md", "docs/pa2/uc/UC-08.md", "docs/pa2/diagrams/state-transitions.md"]
    },

    // ───────────── S5 · Traceability & review ─────────────
    {
      id: "PA2-V5", slot: "S5", owner: "Vinh", type: "review", hours: 2.5,
      title: "Requirements Review & đóng gap trước deadline nội bộ",
      reading: ["PA2T", "REG", "FR", "UC"],
      goal: "Tổ chức buổi review requirements chính thức để tìm và xử lý vấn đề trước khi chốt baseline, đúng deadline nội bộ (2 ngày trước hạn nộp).",
      scope: [
        "Thứ CN 01/11: trình draft SRS ở buổi họp TA 19:30 và ghi nhận feedback",
        "Thứ 2 02/11 20:30: walkthrough 60 phút với 4 thành viên theo checklist (rõ ràng, nhất quán, đầy đủ, test được, khả thi)",
        "Ghi Issue / Requirement(s) / Resolution vào bảng review",
        "Cập nhật RTM lần cuối sau khi chốt các resolution"
      ],
      deliverables: [
        "docs/pa2/13-requirements-review.md (người tham gia, ngày, issue, resolution)",
        "RTM cập nhật, các issue pa2-gap được đóng hoặc giao owner"
      ],
      ac: [
        "4/4 thành viên tham gia hoặc gửi review bằng văn bản",
        "Mọi issue mức Major có resolution và owner, hạn xử lý ≤ 03/11",
        "Feedback của TA được ghi lại và xử lý"
      ],
      verify: [
        "Đếm issue Open = 0 hoặc có owner + hạn",
        "Chạy script gộp SRS-draft không lỗi"
      ],
      deps: "Cần tất cả task S1–S4 ở trạng thái Review. Đầu ra cho N6/A6/Q6 và V6.",
      risks: "Thiếu người → review bất đồng bộ qua PR comment trong 24 giờ.",
      files: ["docs/pa2/13-requirements-review.md"]
    },
    {
      id: "PA2-N5", slot: "S5", owner: "Nguyên", type: "docs", hours: 3,
      title: "UC Specs: UC-05 Search (+UC-06), UC-10 Reserve, UC-11 Cancel",
      reading: ["PA2T", "REG", "FR", "BR", "WF"],
      goal: "Hoàn tất các use case phía Reader cho tìm kiếm và đặt trước, để đạt yêu cầu ≥ 6 UC specs cho toàn bộ Must-have.",
      scope: [
        "UC-05 Search & browse (include UC-06 View book detail & availability)",
        "UC-10 Place reservation: chỉ khi 0 copy Available, không đặt trùng, vị trí FIFO",
        "UC-11 Cancel reservation: cập nhật hàng đợi, giải phóng copy Reserved cho người kế tiếp",
        "Cross-check flow với UC-08 của Quân (copy chuyển Reserved khi trả sách)"
      ],
      deliverables: [
        "docs/pa2/uc/UC-05.md, UC-10.md, UC-11.md"
      ],
      ac: [
        "Đúng mẫu template, các bước đánh số",
        "Hành vi reservation nhất quán với bảng state transition của Q4",
        "Tham chiếu BR pickup window và FIFO theo ID"
      ],
      verify: [
        "Reviewer Quân đối chiếu với UC-08 và state-transitions.md",
        "Walkthrough trên prototype luồng reserve của Ánh"
      ],
      deps: "Cần N3, Q4 (state transitions, slot trước), A4 (prototype). Kết quả được đưa vào review V5.",
      risks: "Lệch logic với UC-08 → giải quyết ngay trong PR review chéo, không đợi buổi họp.",
      files: ["docs/pa2/uc/UC-05.md", "docs/pa2/uc/UC-10.md", "docs/pa2/uc/UC-11.md"]
    },
    {
      id: "PA2-A5", slot: "S5", owner: "Ánh", type: "docs", hours: 2,
      title: "UC-12 My Loans spec & kiểm tra nhất quán UI ↔ UC",
      reading: ["PA2T", "REG", "UC", "WF"],
      goal: "Người thiết kế dashboard Reader đặc tả luôn use case đó (Should-have), đồng thời bảo đảm mọi bước có UI trong UC specs đều có màn hình.",
      scope: [
        "UC-12 View my loans & reservations (F07, Should) theo mẫu",
        "Đọc các UC spec đã có, đánh dấu bước UI chưa có trên wireframe",
        "Cập nhật nhỏ wireframe/prototype cho khớp UC (thông báo lỗi, trạng thái)",
        "Ghi các gap vào bảng review của V5"
      ],
      deliverables: [
        "docs/pa2/uc/UC-12.md",
        "Danh sách mismatch UI ↔ UC (đã sửa / chuyển review)"
      ],
      ac: [
        "UC-12 đúng mẫu, priority Should",
        "100% bước UI trong UC specs có SCR tương ứng",
        "Thay đổi wireframe được ghi lại trong 11-prototype.md"
      ],
      verify: [
        "Reviewer Nguyên kiểm tra UC-12",
        "Click lại prototype sau khi chỉnh"
      ],
      deps: "Cần A4 và các UC spec của S4. Chạy song song với N5/Q5.",
      risks: "Sửa wireframe lan rộng → chỉ sửa chỗ lệch hành vi, phần thẩm mỹ để PA3.",
      files: ["docs/pa2/uc/UC-12.md", "docs/pa2/11-prototype.md"]
    },
    {
      id: "PA2-Q5", slot: "S5", owner: "Quân", type: "docs", hours: 2.5,
      title: "UC Specs: UC-02 Users & roles, UC-09 Overdue + feasibility review",
      reading: ["PA2T", "REG", "FR", "BR"],
      goal: "Hoàn tất use case còn lại cho Admin và overdue, đồng thời rà soát tính khả thi kỹ thuật của FR/NFR trước buổi review.",
      scope: [
        "UC-02 Manage user accounts & roles (Admin): tạo, khóa, đổi role, không tự khóa chính mình",
        "UC-09 View overdue loans (Librarian): lọc, sắp xếp theo số ngày trễ",
        "Rà soát FR/NFR: đánh dấu mục không khả thi trong PA5 hoặc mơ hồ với developer",
        "Gửi danh sách vấn đề kỹ thuật vào bảng review V5"
      ],
      deliverables: [
        "docs/pa2/uc/UC-02.md, UC-09.md",
        "Feasibility notes (issue gắn label pa2-review)"
      ],
      ac: [
        "Hai spec đúng mẫu, có exception flow",
        "Mỗi vấn đề feasibility có đề xuất sửa cụ thể",
        "Tổng số UC specs ≥ 11 (yêu cầu tối thiểu là 6)"
      ],
      verify: [
        "Reviewer Vinh kiểm tra phần RBAC trong UC-02 khớp AC F01",
        "Nguyên phản hồi các feasibility notes trước 02/11"
      ],
      deps: "Cần N3 (FR/BR) và Q3. Độc lập với N5/A5 cùng slot.",
      risks: "Đề xuất cắt scope → chỉ đề xuất, quyết định thuộc buổi review.",
      files: ["docs/pa2/uc/UC-02.md", "docs/pa2/uc/UC-09.md"]
    },

    // ───────────── S6 · Baseline & nộp PA2 ─────────────
    {
      id: "PA2-V6", slot: "S6", owner: "Vinh", type: "pm", hours: 2.5,
      title: "Compile SRS, AI Usage Log, Contribution & nộp PA2",
      reading: ["PA2T", "PA0"],
      goal: "Đóng gói SRS hoàn chỉnh thành baseline requirements chính thức và nộp đúng hạn 04/11.",
      scope: [
        "Chạy script gộp, chuẩn hóa format, cập nhật TOC, export PDF/DOCX theo template",
        "AI Usage Log: thu thập từ 4 thành viên (tool, mục đích, cách verify)",
        "Điền Member Contribution % (tổng 100%) với link issue/PR làm evidence",
        "Kiểm tra cuối theo Gate checklist và nộp bài"
      ],
      deliverables: [
        "SRS-PA2-T05.pdf/.docx",
        "docs/pa2/14-ai-usage-log.md",
        "docs/pa2/00-contribution.md đã điền",
        "Bài nộp trên hệ thống của môn học"
      ],
      ac: [
        "Đủ mọi section trong template, không còn placeholder",
        "AI log có ≥ 1 dòng cho mỗi thành viên có dùng AI",
        "Contribution tổng 100%, mỗi dòng có evidence link",
        "Nộp trước 04/11 23:59"
      ],
      verify: [
        "Một thành viên khác (Quân) đọc bản PDF cuối và tick Gate checklist",
        "So sánh mục lục với template PA2"
      ],
      deps: "Cần V5 và N6/A6/Q6 xong trước sáng 04/11.",
      risks: "Lỗi format khi export → chuẩn bị bản export thử từ 03/11.",
      files: ["docs/pa2/14-ai-usage-log.md", "docs/pa2/00-contribution.md", "SRS-PA2-T05.pdf"]
    },
    {
      id: "PA2-N6", slot: "S6", owner: "Nguyên", type: "review", hours: 1,
      title: "Xử lý review issues & khóa requirements baseline",
      reading: ["REG", "FR", "BR"],
      goal: "Đóng mọi review issue thuộc phần BA để FR, BR và glossary trở thành baseline cho PA3.",
      scope: [
        "Sửa FR/BR/glossary/UC theo resolution của V5",
        "Đổi status các file sang Baseline",
        "Báo PM các thay đổi ID (nếu có) để cập nhật RTM"
      ],
      deliverables: ["PR “pa2-baseline: BA sections” đã merge"],
      ac: ["0 review issue mở thuộc phần BA", "Status header = Baseline"],
      verify: ["Reviewer Ánh approve PR", "RTM không còn tham chiếu ID cũ"],
      deps: "Cần V5.",
      risks: "Sửa phát sinh ngoài resolution → ghi lại cho PA3, không sửa thêm.",
      files: ["docs/pa2/02,03,05,07-*.md", "docs/pa2/uc/"]
    },
    {
      id: "PA2-A6", slot: "S6", owner: "Ánh", type: "design", hours: 1,
      title: "Chốt wireframes & export hình cho SRS",
      reading: ["WF"],
      goal: "Hình ảnh mockup trong SRS khớp với bản prototype cuối cùng.",
      scope: [
        "Áp dụng resolution của V5 lên wireframe",
        "Export lại PNG các màn hình đã đổi, cập nhật 11-prototype.md",
        "Đặt link prototype ở chế độ view công khai"
      ],
      deliverables: ["docs/pa2/img/SCR-*.png cập nhật", "PR “pa2-baseline: prototype” đã merge"],
      ac: ["Hình trong SRS = trạng thái prototype cuối", "Link mở được ở chế độ ẩn danh"],
      verify: ["Vinh mở link khi compile", "So sánh nhanh tên file và SCR-ID"],
      deps: "Cần V5.",
      risks: "Quên export lại → dùng checklist SCR-01…12.",
      files: ["docs/pa2/img/", "docs/pa2/11-prototype.md"]
    },
    {
      id: "PA2-Q6", slot: "S6", owner: "Quân", type: "code", hours: 1,
      title: "Fix review, render diagram & tag pa2-baseline",
      reading: ["UC"],
      goal: "Repo phản ánh đúng baseline PA2 và có tag để PA3 bắt đầu từ một điểm cố định.",
      scope: [
        "Sửa NFR/UC specs theo resolution V5",
        "Render lại use-case.svg và state diagram",
        "Sau khi Vinh nộp: tạo git tag pa2-baseline + GitHub release ghi chú"
      ],
      deliverables: ["PR “pa2-baseline: tech sections” đã merge", "Tag pa2-baseline"],
      ac: ["Diagram trong SRS khớp file .puml", "Tag trỏ đúng commit đã nộp"],
      verify: ["git clone sạch + chạy script gộp SRS", "Vinh xác nhận commit hash"],
      deps: "Cần V5; tag sau V6.",
      risks: "Commit sau khi nộp → tag theo commit nộp, thay đổi mới để PA3.",
      files: ["docs/pa2/diagrams/", "docs/pa2/06-*.md"]
    }
  ]
};
