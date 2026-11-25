# UniLib – University Library Management System

[![CI - Test & Lint](https://github.com/Vincenthevinh/UniLib/actions/workflows/ci.yml/badge.svg)](https://github.com/Vincenthevinh/UniLib/actions)
[![Release Demo](https://img.shields.io/badge/Release-v0.3--pa3--demo-blue)](https://github.com/Vincenthevinh/UniLib/releases/tag/v0.3-pa3-demo)
[![PA3 Software Design](https://img.shields.io/badge/PA3-Software%20Design%20v1.0.0-success)](pa/PA3/PA3-SoftwareDesign.docx)

UniLib là Hệ thống Quản lý Thư viện Đại học (University Library Management System) được phát triển bởi **Nhóm T05** (Lớp Nhập môn Công nghệ Phần mềm — HK1/2026-2027, Khoa CNTT, Trường ĐH Khoa học Tự nhiên, ĐHQG-HCM).

---

## 1. Thành viên Nhóm T05 & Phân công Đóng góp (100%)

| MSSV | Họ và tên | Vai trò chính | Tỷ lệ đóng góp | Bằng chứng thực hiện & Bàn giao |
| :---: | :--- | :--- | :---: | :--- |
| **23127520** | **Nguyễn Phan Thế Vinh** | Team Lead / PM · Backend / Tester | **25%** | Handoff V1–V5 (`src/V1-W1.md`..`V5-W1.md`), PR #88, #113; Bộ test 13 suites (237 tests) |
| **24127228** | **Trần Hà Anh Quân** | Fullstack Developer / Tech Lead | **25%** | Handoff Q1–Q5 (`src/Q1-W1.md`..`Q5-W1.md`), PR #111; C4 Diagrams, 3NF DBML/ERD, Prisma, Seed |
| **24127469** | **Nguyễn Thanh Thảo Nguyên** | Business Analyst (BA) | **25%** | Handoff N1–N4 (`src/N1-W1.md`..`N4-W1.md`); Domain Model, Class Specs C1–C8, Patterns |
| **24127324** | **Vũ Thị Ánh** | UI/UX Designer / Frontend Architect | **25%** | Handoff A1–A5 (`src/A1-W1.md`..`A5-W1.md`); Screen Flow SCR-01..12, Specs, Client React SPA |

---

## 2. Phạm vi Chức năng (Đóng băng theo SRS PA2)

Hệ thống tập trung hiện thực hóa trọn vẹn 7 phân hệ chức năng nghiệp vụ (F01–F07) đã được đóng băng tại tài liệu PA2 (`pa/PA2/T05-PA2.docx`):
- **F01 (Authentication & RBAC):** Đăng nhập xác thực người dùng, cấp phát JWT stateless, phân quyền 3 vai trò (`Reader`, `Librarian`, `Administrator`), quản lý tài khoản (`SCR-01`, `SCR-02`).
- **F02 (Book Catalog Management):** Biên mục đầu sách (ISBN, Tên sách, Tác giả, Thể loại, Năm xuất bản), thống kê số lượng bản sao khả dụng thời gian thực (`SCR-03`, `SCR-06`).
- **F03 (Book Copy Inventory):** Quản lý bản sao vật lý theo mã vạch barcode, vị trí kệ, tình trạng sách (`Available`, `Borrowed`, `Reserved`, `Damaged`, `Lost`) (`SCR-04`).
- **F04 (Search & Browse):** Tra cứu sách đa tiêu chí (keyword, thể loại, tình trạng còn sách), sắp xếp, phân trang phía máy chủ 10 kết quả/trang (`NFR-01`) (`SCR-05`).
- **F05 (Circulation Desk):** Quy trình mượn sách 14 ngày (`BR-02`), tối đa 3 cuốn (`BR-01`), chặn mượn khi có sách quá hạn (`BR-04`); quy trình trả sách và tự động kích hoạt gán giữ chỗ (`SCR-07`, `SCR-08`).
- **F06 (Reservation & Hold Shelf):** Đặt trước khi đầu sách hết bản sao (`BR-05`), xếp hàng chờ FIFO (`BR-07`), tự động phân bổ giữ chỗ 72 giờ (`BR-08`) (`SCR-09`, `SCR-10`).
- **F07 (Dashboard & Overdue Monitoring):** Bảng điều khiển cá nhân bạn đọc (sách đang mượn, hạn trả, gia hạn `BR-03`, vị trí hàng chờ) và màn hình thủ thư giám sát sách quá hạn liên hệ bạn đọc (`SCR-11`, `SCR-12`).

*Lưu ý:* Các tính năng thanh toán tiền phạt, quét RFID phần cứng, mượn liên thư viện, đọc e-book và gợi ý AI nằm ngoài phạm vi đã cam kết.

---

## 3. Kiến trúc & Công nghệ (Tech Stack)

- **Frontend Client:** React 18 · Vite · React Router v6 · Tailwind CSS / Custom CSS · Vitest.
- **Backend API:** Node.js 22 LTS · Express.js (ESM) · Layered Modular Monolith · Jest & Supertest.
- **Cơ sở dữ liệu:** PostgreSQL 16 · Prisma ORM 6.x · Interactive Transactions & Row-Level Locking (`SELECT FOR UPDATE`).
- **Bảo mật:** Mật khẩu băm Bcrypt (salt rounds $\ge 10$, `NFR-03`), Bearer JWT stateless (`NFR-04`), Helmet, Strict CORS.

---

## 4. Hướng dẫn Khởi chạy Bản Demo (Release Demo v0.3-pa3-demo)

### 4.1. Khởi chạy bằng Docker Compose (Khuyến nghị — 1 Lệnh duy nhất)

```bash
# 1. Clone repository
git clone https://github.com/Vincenthevinh/UniLib.git
cd UniLib

# 2. Khởi động PostgreSQL 16 và Backend API container
docker compose up --build -d

# 3. Kiểm tra sức khỏe hệ thống Backend API
curl http://127.0.0.1:18081/api/health
# Kết quả mong đợi: {"status":"ok","database":"connected","timestamp":"..."}

# 4. Khởi chạy Frontend React/Vite Client
cd src/client
npm install
npm run dev
```

* Truy cập giao diện ứng dụng tại: `http://localhost:5173`
* Backend API lắng nghe tại: `http://localhost:18081` (Port nội bộ container: `3001`)
* PostgreSQL 16 lắng nghe tại: `localhost:55432` (Port nội bộ container: `5432`)

### 4.2. Khởi chạy cục bộ không dùng Docker (Local Node.js & PostgreSQL)

```bash
# 1. Cài đặt toàn bộ dependencies
npm install
cd src/server && npm install
cd ../client && npm install
cd ../..

# 2. Thiết lập biến môi trường Server
# Sao chép src/server/.env.example sang src/server/.env và điền DATABASE_URL phù hợp
cd src/server
npm run db:migrate
npm run db:seed
npm run dev

# 3. Khởi chạy Client (Mở terminal mới)
cd src/client
npm run dev
```

---

## 5. Tài khoản Demo & Kịch bản Trải nghiệm (Demo Script)

### 5.1. Danh sách Tài khoản Kiểm thử (Mật khẩu chung: `UniLibDemo!2026`)

| Tên đăng nhập | Vai trò | Màn hình đích | Trách nhiệm kiểm thử |
| :--- | :---: | :---: | :--- |
| `admin` | Administrator | `/admin/users` | Quản trị tài khoản, cấp quyền, khóa/mở tài khoản (`SCR-02`) |
| `librarian1` | Librarian | `/librarian/borrow` | Quầy lưu thông mượn/trả, quản lý biên mục và quá hạn (`SCR-03, 04, 07, 08, 12`) |
| `librarian2` | Librarian | `/librarian/catalog` | Biên mục sách mới và bản sao vật lý |
| `reader1` | Reader | `/reader/catalog` | Tra cứu sách, đặt trước sách, xem Dashboard cá nhân (`SCR-05, 06, 09, 11`) |
| `reader2`..`reader6` | Reader | `/reader/catalog` | Kiểm thử hàng đợi FIFO nhiều người và kiểm thử cấm mượn do quá hạn |

### 5.2. Kịch bản Demo 3 Phút Luồng Bạn Đọc (Reader Flow)

1. **0:00 – 0:30 · Đăng nhập & Điều hướng Phân quyền (`SCR-01`):**
   - Đăng nhập thử với sai mật khẩu $\rightarrow$ hệ thống trả thông báo bảo mật `Invalid username/email or password` (chống dò tài khoản `AC-F01-02`).
   - Đăng nhập bằng `reader1` / `UniLibDemo!2026` $\rightarrow$ tự động điều hướng vào `/reader/catalog`.
2. **0:30 – 1:15 · Tra cứu, Lọc & Phân trang Sách (`SCR-05`):**
   - Nhập từ khóa tìm kiếm (Tên sách/Tác giả/ISBN), chọn Thể loại (`Category`), bật bộ lọc `Available now`.
   - Kiểm tra sắp xếp theo Tiêu đề / Năm xuất bản và chuyển trang (10 bản ghi/trang `NFR-01`).
3. **1:15 – 2:00 · Chi tiết Đầu sách & Đặt trước Giữ chỗ (`SCR-06` $\rightarrow$ `SCR-09`):**
   - Chọn đầu sách hết bản sao sẵn có (`Available = 0`) $\rightarrow$ nút `Reserve Book` sáng lên (`BR-05`).
   - Bấm `Reserve Book` mở Modal `SCR-09`, hiển thị quy định giữ chỗ 72 giờ (`BR-08`), bấm `Confirm Reservation`.
4. **2:00 – 2:45 · Dashboard Cá nhân, Gia hạn & Hàng đợi FIFO (`SCR-11`):**
   - Vào `/reader/dashboard`, kiểm tra yêu cầu đặt trước hiển thị đúng số thứ tự hàng chờ `Queue Position: 1` (`BR-07`).
   - Xem danh sách sách đang mượn, kiểm tra nút `Renew` tự động vô hiệu hóa kèm lý do nếu không đủ điều kiện (`BR-03`).
5. **2:45 – 3:00 · Kiểm chứng Đáp ứng Giao diện Đa Độ phân giải (`NFR-07`):**
   - Kiểm tra hiển thị liền mạch trên các kích thước màn hình `1024px`, `1440px`, `1920px` không vỡ khung hình.

---

## 6. Hướng dẫn Kiểm thử Tự động (Automated Test Suites)

Hệ thống hỗ trợ 100% kiểm thử tự động độc lập và ổn định:

```bash
# 1. Chạy toàn bộ test suites (Server 13 suites, 237 tests + Client Vitest 8 tests)
npm test

# 2. Chạy riêng bộ test Backend (Jest + Supertest)
npm run test:server

# 3. Chạy riêng bộ test Frontend (Vitest)
npm run test:client

# 4. Kiểm tra quy chuẩn mã nguồn linter (ESLint)
npm run lint
```

---

## 7. Cấu trúc Thư mục Dự án

```text
UniLib/
├── .github/                  CI/CD workflows, issue templates, PR template
├── docs/
│   ├── design/               Tài liệu thiết kế, ADRs, C4, UML, ERD và màn hình UI
│   │   ├── adr/              4 Quyết định kiến trúc (ADR-001 đến ADR-004)
│   │   ├── c4/               Mô hình C4 Level 1 (Context) & Level 2 (Container)
│   │   ├── uml/              Domain Model, Sequence Diagrams, State Machines
│   │   └── screens/          Ảnh chụp các màn hình giao diện SCR-01 đến SCR-12
│   ├── pa3/                  Các phân đoạn tài liệu thiết kế PA3 chi tiết
│   └── management/           Biên bản họp và phân công công việc
├── pa/
│   ├── PA2/                  SRS Baseline đã đóng băng v1.0.0 (T05-PA2.docx)
│   └── PA3/                  Hồ sơ Thiết kế Phần mềm hoàn chỉnh:
│                             • PA3-SoftwareDesign.docx
│                             • PA3-SoftwareDesign.pdf
├── src/
│   ├── client/               Frontend Single Page Application (React 18 + Vite)
│   ├── server/               Backend REST API (Node.js 22 LTS + Express.js)
│   ├── V1-W1.md..V4-W1.md   Báo cáo bàn giao kỹ thuật của Vinh (Lead/Backend)
│   ├── Q1-W1.md..Q5-W1.md   Báo cáo bàn giao kỹ thuật của Quân (Tech Lead/Data)
│   ├── N1-W1.md..N4-W1.md   Báo cáo bàn giao kỹ thuật của Nguyên (BA/Staff UI)
│   ├── A1-W1.md..A5-W1.md   Báo cáo bàn giao kỹ thuật của Ánh (UI/UX Architect)
│   └── V5-W1.md              Báo cáo tổng kết bàn giao Gate W1 & Release v0.3
├── docker-compose.yml        Docker orchestration cho PostgreSQL 16 + Express API
└── README.md                 Tài liệu hướng dẫn tổng quan và hướng dẫn chạy demo
```

---

## 8. Giấy phép & Cam kết Đồ án

Dự án được thực hiện nghiêm túc cho mục đích học thuật theo đề cương môn học Nhập môn Công nghệ Phần mềm. Mọi đóng góp, mã nguồn và tài liệu đều tuân thủ Quy định Liêm chính Học thuật của Trường Đại học Khoa học Tự nhiên, ĐHQG-HCM.
