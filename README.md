# UniLib — University Library Management System

Final project for Introduction to Software Engineering course · FIT HCMUS · 2026

[![CI - Test & Lint](https://github.com/Vincenthevinh/UniLib/actions/workflows/ci.yml/badge.svg)](https://github.com/Vincenthevinh/UniLib/actions)
[![Release Demo](https://img.shields.io/badge/Release-v0.3--pa3--demo-blue)](https://github.com/Vincenthevinh/UniLib/releases/tag/v0.3-pa3-demo)
[![PA3 Software Design](https://img.shields.io/badge/PA3-Software%20Design%20v1.0.0-success)](pa/PA3/PA3-SoftwareDesign.docx)

UniLib là Hệ thống Quản lý Thư viện Đại học (University Library Management System) được phát triển bởi **Nhóm T05** (Lớp Nhập môn Công nghệ Phần mềm — HK1/2026-2027, Khoa CNTT, Trường ĐH Khoa học Tự nhiên, ĐHQG-HCM).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + JavaScript (SPA) |
| UI & Styling | TailwindCSS + CSS Grid / Flexbox + Responsive Breakpoints (1024px–1920px) |
| State / Routing | React Context (`AuthContext`) + React Router v6 |
| Backend | Node.js 22 LTS + Express.js (ESM) |
| Database | PostgreSQL 16 + Prisma ORM 6.x |
| Auth & Security | Stateless JWT (HS256) + bcryptjs (salt >= 10) + Helmet + CORS |
| Concurrency Control | PostgreSQL Interactive Transactions + Row-Level Locking (`SELECT FOR UPDATE`) |
| Logging & Errors | Centralized `errorHandler` + structured Error Envelope `{error:{code,message,details}}` |
| Testing | Jest + Supertest (Backend 13 suites, 237 tests) + Vitest (Frontend 8 tests) |
| API Specification | RESTful JSON API (`docs/design/api.md`) |
| Deploy | Vercel (FE Edge CDN) + Render (BE Web Service) + Render Managed PostgreSQL (DB) |

---

## Prerequisites

Make sure the following are installed before getting started:

- [Node.js 20+](https://nodejs.org) (Khuyến nghị: Node.js 22 LTS)
- [Docker Desktop](https://www.docker.com/products/docker-desktop) (để chạy PostgreSQL 16)
- [Git](https://git-scm.com)
- [npm](https://www.npmjs.com) (>= 10.x)

---

## Installation & Local Setup

### 1. Clone the repo

```bash
git clone https://github.com/Vincenthevinh/UniLib.git
cd UniLib
```

### 2. Start the database

Khởi động container PostgreSQL 16 trên cổng host `55432` (tránh xung đột cổng mặc định `5432` trên Windows):

```bash
docker compose up -d db
```

Verify container database đang hoạt động:

```bash
docker compose ps
# unilib_db   running   127.0.0.1:55432->5432/tcp (healthy)
```

*(Tùy chọn: Nếu muốn chạy cả Backend API trong Docker container mà không cần cài Node cục bộ, chạy `docker compose up -d` $\rightarrow$ API lắng nghe tại `http://localhost:18081`).*

### 3. Set up Backend

```bash
cd src/server
copy .env.example .env      # Windows
# cp .env.example .env      # macOS / Linux
npm ci
```

### 4. Set up Frontend

```bash
cd ../client
copy .env.example .env      # Windows
# cp .env.example .env      # macOS / Linux
npm ci
```

*(Lưu ý: File `.env` của client mặc định cấu hình `VITE_USE_MOCK=false` và `VITE_API_BASE_URL=/api` để tự động kết nối qua proxy tới backend thật trên cổng 4000).*

### 5. Migrate database & Seed data

Mở terminal tại thư mục `src/server`:

```bash
cd src/server
npx prisma migrate deploy
npm run db:seed             # hoặc: npm run prisma:seed
```

Sau khi seed dữ liệu hoàn tất, bạn sẽ thấy:

```text
🎉 Seed completed! (9 users, 30 titles, 80 copies, 5 active loans, 2 pending holds)
  Admin:       admin       / UniLibDemo!2026
  Librarian:   librarian1  / UniLibDemo!2026
  Librarian:   librarian2  / UniLibDemo!2026
  Reader:      reader1     / UniLibDemo!2026
  Reader:      reader2..6  / UniLibDemo!2026
```

### 6. Run the servers

Mở **2 terminal riêng biệt**:

```bash
# Terminal 1 — Backend API (Node.js 22 + Express)
cd src/server
npm run dev
# → Server chạy tại: http://localhost:4000
```

```bash
# Terminal 2 — Frontend Client (React 18 + Vite)
cd src/client
npm run dev
# → Client chạy tại: http://localhost:5173
```

*(Hoặc từ thư mục gốc repository, bạn có thể chạy song song: `npm run dev:server` và `npm run dev:client`).*

### 7. Verify

| URL | Expected result |
|---|---|
| http://localhost:4000/api/health | `{"status":"ok","database":"connected","timestamp":"..."}` |
| http://localhost:5173 | Giao diện UniLib React SPA (`SCR-01` Login) |
| http://localhost:5555 | Prisma Studio UI (chạy lệnh `npx prisma studio` tại `src/server`) |

---

## Environment Variables

### `src/server/.env`

```env
PORT=4000
NODE_ENV=development
DATABASE_URL="postgresql://unilib:unilib_dev_only@localhost:55432/unilib?schema=public"
JWT_SECRET=unilib_jwt_development_secret_key_change_in_production
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
CLIENT_ORIGIN=http://localhost:5173
RESERVATION_SWEEP_MS=60000
```

### `src/client/.env`

```env
VITE_USE_MOCK=false
VITE_API_BASE_URL=/api
```

---

## W1 Release Demo Features (F01–F07 Scope)

- **F01 (Authentication & RBAC):** Đăng nhập xác thực tài khoản, cấp phát Bearer JWT, đăng xuất, quản lý người dùng bởi Quản trị viên (`SCR-01`, `SCR-02`).
- **F02 (Catalog Management):** 30 đầu sách mẫu, tạo mới/chỉnh sửa thông tin sách, thống kê số lượng bản sao khả dụng thời gian thực (`SCR-03`, `SCR-06`).
- **F03 (Copy Inventory):** 80 bản sao vật lý, quản lý mã vạch barcode, vị trí kệ sách, ghi nhận tình trạng sách (`SCR-04`).
- **F04 (Search & Browse):** Tìm kiếm đa tiêu chí (tên sách, tác giả, ISBN, thể loại), lọc sách sẵn có, sắp xếp, phân trang phía máy chủ (10 bản ghi/trang, `NFR-01`) (`SCR-05`).
- **F05 (Circulation Desk):** Mượn sách hạn 14 ngày (`BR-02`), tối đa 3 cuốn (`BR-01`), chặn mượn khi có sách quá hạn (`BR-04`); trả sách kiểm tra tình trạng vật lý và tự động gán giữ chỗ (`SCR-07`, `SCR-08`).
- **F06 (Reservation & Holds):** Đặt trước khi sách hết bản sao sẵn có (`BR-05`), xếp hàng chờ FIFO (`BR-07`), tự động cấp chỗ 72 giờ khi sách được trả (`BR-08`), hủy đặt trước (`SCR-09`, `SCR-10`).
- **F07 (Dashboard & Overdue):** Dashboard cá nhân bạn đọc (sách đang mượn, hạn trả, gia hạn `BR-03`, vị trí hàng chờ) và màn hình thủ thư giám sát sách quá hạn (`SCR-11`, `SCR-12`).

### Kịch bản Trải nghiệm Demo 3 Phút Luồng Bạn Đọc (`docs/pa3/demo-script.md`)

1. **0:00–0:30 · Đăng nhập & Điều hướng Phân quyền (`SCR-01`):** Thử sai mật khẩu thấy thông báo chung an toàn (chống dò quét, `AC-F01-02`); đăng nhập bằng `reader1` và tự động vào trang tra cứu sách.
2. **0:30–1:15 · Tra cứu, Lọc & Phân trang (`SCR-05`):** Tìm kiếm theo từ khóa, lọc theo thể loại, bật cờ `Available now`, đổi sắp xếp theo Tiêu đề / Năm và chuyển trang.
3. **1:15–2:00 · Chi tiết Đầu sách & Modal Đặt trước (`SCR-06` $\rightarrow$ `SCR-09`):** Chọn đầu sách hết bản sao (`Available = 0`), xem quy tắc giữ chỗ 72 giờ (`BR-08`), bấm `Confirm Reservation`.
4. **2:00–2:45 · Dashboard Cá nhân (`SCR-11`):** Kiểm tra yêu cầu đặt trước hiển thị đúng số thứ tự hàng chờ `Queue Position: 1` (`BR-07`), kiểm tra hạn trả sách và lý do nút gia hạn `Renew` bị khóa nếu không đủ điều kiện (`BR-03`).
5. **2:45–3:00 · Kiểm chứng Đa Độ phân giải (`NFR-07`):** Kiểm tra giao diện đáp ứng mượt mà trên các độ phân giải `1024px`, `1440px`, `1920px` không lỗi console.

---

## Scripts

### Root (`/`)

```bash
npm test              # Chạy full test suite (13 server suites, 237 tests + client vitest)
npm run lint          # Chạy ESLint kiểm tra cú pháp trên cả server và client
npm run dev:server    # Khởi chạy riêng Backend API dev server
npm run dev:client    # Khởi chạy riêng Frontend Client Vite dev server
```

### Backend (`src/server`)

```bash
npm run dev           # Chạy API server chế độ dev với nodemon (cổng 4000)
npm run start         # Chạy API server chế độ production (node server.js)
npm run db:migrate    # Thực thi các file migration Prisma lên PostgreSQL
npm run db:seed       # Nạp dữ liệu mẫu (9 users, 30 titles, 80 copies, 5 loans)
npm run db:reset      # Reset toàn bộ CSDL và nạp lại seed sạch (Destructive)
npm run test          # Chạy toàn bộ 13 test suites của Backend với Jest
npm run test:db       # Chạy riêng integration test trên DB PostgreSQL (unilib_test)
npm run smoke         # Chạy script kiểm thử smoke 15 kịch bản API trực tiếp
npm run lint          # Kiểm tra chuẩn mã nguồn Backend qua ESLint
npm run lint:fix      # Tự động sửa các lỗi ESLint có thể fix được
```

### Frontend (`src/client`)

```bash
npm run dev           # Chạy Vite development server (cổng 5173)
npm run build         # Build mã nguồn production tối ưu vào thư mục dist/
npm run preview       # Xem trước bản build production tại local
npm run test          # Chạy kiểm thử tự động Frontend với Vitest
npm run lint          # Kiểm tra chuẩn mã nguồn Frontend qua ESLint
```

---

## Project Structure

```text
UniLib/
├── .github/                  CI/CD workflows, issue templates, PR template
├── docs/
│   ├── design/               Tài liệu thiết kế, ADRs, C4, UML, ERD, screens
│   │   ├── a11y/             Ảnh bằng chứng kiểm tra Lighthouse & Color Contrast (A4)
│   │   ├── adr/              4 Quyết định kiến trúc (ADR-001 đến ADR-004)
│   │   ├── c4/               Mô hình C4 Context (L1) và Container (L2)
│   │   ├── screens/          Ảnh chụp các màn hình giao diện SCR-01 đến SCR-12 (A5)
│   │   └── uml/              Domain model, Sequence diagrams, State machines
│   ├── pa3/                  Các phân đoạn tài liệu thiết kế PA3 chi tiết
│   └── management/           Biên bản họp và kế hoạch phân công công việc
├── pa/
│   ├── PA2/                  SRS Baseline v1.0.0 (T05-PA2.docx)
│   └── PA3/                  Hồ sơ Thiết kế Phần mềm hoàn chỉnh:
│                             ├── PA3-SoftwareDesign.docx
│                             └── PA3-SoftwareDesign.pdf
├── src/
│   ├── client/               Frontend Single Page Application (React 18 + Vite)
│   │   ├── src/
│   │   │   ├── api/          API client, endpoints, business error mapper
│   │   │   ├── components/   Shared UI components, Modal, AppHeader
│   │   │   ├── context/      AuthContext (quản lý phiên JWT)
│   │   │   ├── pages/        Giao diện theo vai trò (reader, librarian, admin)
│   │   │   └── styles/       CSS layouts và responsive polish (NFR-07)
│   ├── server/               Backend REST API (Node.js 22 LTS + Express.js)
│   │   ├── config/           Cấu hình biến môi trường và db health check
│   │   ├── prisma/           schema.prisma (5 models), migrations, seed.js
│   │   ├── src/
│   │   │   ├── middlewares/  authenticate, authorize, errorHandler, requestId
│   │   │   └── modules/      auth, users, books, copies, loans, reservations, dashboard
│   │   └── tests/            13 Jest test suites (237 tests)
│   └── V5-W1.md              Báo cáo bàn giao kỹ thuật Gate W1 & Release v0.3
├── docker-compose.yml        Docker orchestration cho PostgreSQL 16 + Express API
└── README.md                 Tài liệu hướng dẫn tổng quan và hướng dẫn chạy demo
```

---

## Test Accounts

Tất cả các tài khoản kiểm thử đều sử dụng mật khẩu chung: **`UniLibDemo!2026`**

| Vai trò | Tên đăng nhập | Màn hình khởi đầu | Trách nhiệm kiểm thử |
|---|---|---|---|
| Quản trị viên | `admin` | `/admin/users` (`SCR-02`) | Quản lý người dùng, phân quyền, kích hoạt/vô hiệu hóa tài khoản |
| Thủ thư | `librarian1` | `/librarian/borrow` (`SCR-07, 08`) | Thực hiện mượn/trả sách, kiểm tra tình trạng sách tại quầy |
| Thủ thư | `librarian2` | `/librarian/catalog` (`SCR-03, 04`) | Biên mục đầu sách mới, quản lý bản sao vật lý, theo dõi quá hạn |
| Bạn đọc | `reader1` | `/reader/catalog` (`SCR-05, 06`) | Tra cứu danh mục, đặt trước sách, xem Dashboard cá nhân |
| Bạn đọc | `reader2` | `/reader/catalog` (`SCR-05, 11`) | Kiểm thử thứ tự hàng đợi FIFO (Vị trí số 2) |
| Bạn đọc | `reader3`..`6` | `/reader/catalog` (`SCR-05, 11`) | Kiểm thử tranh chấp đặt trước nhiều người và chặn mượn do quá hạn |

---

## Git Workflow

```text
main                        ← Nhánh chính sẵn sàng cho production, nhận merge từ PR
feature/V*-W1, Q*-W1        ← Mỗi task/công việc phát triển trên 1 nhánh riêng biệt
```

**Quy trình chuẩn:**

1. Nhận task được phân công trên bảng dự án ([UniLib Project Board](https://github.com/users/Vincenthevinh/projects/1)).
2. Tạo nhánh tính năng từ `main`: `git checkout -b feature/V5-W1-gate-release`.
3. Lập trình và commit thường xuyên theo chuẩn Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`).
4. Đẩy nhánh lên remote và mở Pull Request (PR) vào `main`.
5. PR tự động kích hoạt quy trình CI trên GitHub Actions (chạy kiểm thử Jest, Vitest và linter ESLint).
6. Yêu cầu ít nhất một thành viên phản biện chéo (Peer Review) theo Ma trận Phản biện.
7. Merge vào `main` sau khi tất cả các kiểm tra CI pass và nhận được phê duyệt từ reviewer.

---

## Troubleshooting

**`P1001: Can't reach database server`**
- Đảm bảo container PostgreSQL đang chạy bằng lệnh: `docker compose up -d db`.
- Kiểm tra xem cổng host `55432` có bị chiếm dụng hay không. Kiểm tra chuỗi `DATABASE_URL` trong `src/server/.env` phải trỏ đúng tới `localhost:55432`.

**`Port 4000 already in use`**
- Nếu cổng 4000 bị ứng dụng khác chiếm dụng, bạn có thể đổi `PORT=4001` trong `src/server/.env`, sau đó cập nhật target trong `src/client/vite.config.js` (`target: 'http://localhost:4001'`).

**`Lỗi CORS hoặc không gọi được API từ Frontend`**
- Đảm bảo backend đang chạy tại `http://localhost:4000`.
- Kiểm tra file `src/client/.env` có `VITE_USE_MOCK=false` và `VITE_API_BASE_URL=/api` để Vite dev server tự động chuyển tiếp request tới backend.

**`Prisma schema out of sync hoặc thiếu Migration`**
```bash
cd src/server
npx prisma generate
npx prisma migrate deploy
```
