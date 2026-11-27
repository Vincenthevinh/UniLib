# UniLib W2 Frozen REST API Contract & Gap Analysis

* **Tài liệu:** Đóng băng Hợp đồng API W2 & Bảng Kiểm toán Đối chiếu (W2 Frozen API Contract & RTM Gap Audit)
* **Phiên bản:** `v2.0.0-frozen` (Đóng băng chính thức ngày D2 · 29/11/2026)
* **Tác giả:** Nguyễn Phan Thế Vinh (Team Lead / PM · Backend / Tester)
* **Người phản biện chính (Tech Lead):** Trần Hà Anh Quân (Fullstack Developer / Tech Lead)
* **Người tiếp nhận & Xác nhận (Frontend/BA):**
  * Nguyễn Thanh Thảo Nguyên (Business Analyst / Frontend Staff/Admin)
  * Vũ Thị Ánh (UI/UX Designer / Frontend Architect / Reader Workflows)
* **Trạng thái:** **FROZEN (ĐÃ ĐÓNG BĂNG)** — Bắt buộc tuân thủ cho tích hợp Frontend & Test Cases PA4

---

> [!IMPORTANT]
> ### CHÍNH SÁCH ĐÓNG BĂNG HỢP ĐỒNG API (API FREEZE POLICY)
> 1. Kể từ cuối ngày **D2 (29/11/2026)**, toàn bộ 41 endpoints, URL paths, HTTP methods, headers, cấu trúc request/response payload và danh mục mã lỗi `businessErrors` trong tài liệu này **chính thức bị đóng băng**.
> 2. **Rủi ro cần tránh:** Mọi thay đổi ngầm sau D2 sẽ làm vỡ tích hợp Frontend (`src/client`) và sai lệch các Test Case PA4 đã thiết kế.
> 3. **Quy trình thay đổi bắt buộc:** Nếu phát sinh lỗi kiến trúc nghiêm trọng buộc phải điều chỉnh, người đề xuất phải:
>    * Tạo issue/PR ghi rõ lý do và phạm vi ảnh hưởng.
>    * Ghi nhận vào mục **§7. Changelog** của tài liệu này.
>    * Được **Vinh (PM)** phê duyệt và gửi thông báo xác nhận trực tiếp cho **Nguyên (N)** và **Ánh (A)** trước khi sửa code.

---

## 1. Bảng Đối chiếu & Kiểm toán Gap 41 Endpoints (RTM PA3 §7 vs Router Thực tế)

Bảng dưới đây đối chiếu toàn bộ **41 endpoints** được xác lập trong RTM PA3 §7 (`docs/pa3/07-traceability.md`, `tests/rbac.test.js`) với hiện trạng router thực tế tại `src/server` và mã nguồn Frontend tại `src/client/src/api/endpoints.js`.

* **Trạng thái:**
  * `MATCH`: Đã có, đúng URL path, đúng request/response shape, đã qua automated test.
  * `ALIAS_OK`: Đã có route chính và alias tương thích ngược; FE hoạt động tốt.
  * `FE_GAP`: Backend đã có nhưng Frontend `endpoints.js` đang gọi sai path hoặc sai body (cần FE cập nhật).
  * `NOT_IN_SCOPE`: Endpoint dự kiến tạm thời (provisional) của FE nhưng không nằm trong phạm vi kiến trúc UniLib (loại bỏ).

| # | Endpoint (Method & Path) | Vai trò (Role) | FR / RTM Ref | Trạng thái Hiện thực Backend | Trạng thái Khớp nối Frontend (`endpoints.js`) | Phân loại Gap | Owner | Task W2 Xử lý |
| :-: | :--- | :--- | :--- | :--- | :--- | :---: | :---: | :---: |
| 1 | `GET /api/health` | Public | Infra / NFR-08 | `app.js` (`dbHealth.js`) | Không gọi trực tiếp (chạy lúc boot) | `MATCH` | Vinh | `V1-W2` |
| 2 | `POST /api/auth/login` | Public | `FR-F01-01` | `src/modules/auth/` | `api.auth.login` (Khớp body/response) | `MATCH` | Vinh | `V1-W2` |
| 3 | `POST /api/auth/logout` | Public/Auth | `FR-F01-03` | `src/modules/auth/` | `api.auth.logout` (Khớp) | `MATCH` | Vinh | `V1-W2` |
| 4 | `GET /api/auth/me` | Reader, Lib, Admin | `FR-F01-02` | `src/modules/auth/` | `api.auth.me` (Khớp) | `MATCH` | Vinh | `V1-W2` |
| 5 | `GET /api/users` | Administrator | `FR-F01-04` | `src/modules/users/` | `api.users.list` (Khớp `{items, total}`) | `MATCH` | Vinh | `V1-W2` |
| 6 | `POST /api/users` | Administrator | `FR-F01-04` | `src/modules/users/` | `api.users.create` (Khớp) | `MATCH` | Vinh | `V1-W2` |
| 7 | `GET /api/users/:id` | Administrator | `FR-F01-04` | `src/modules/users/` | `api.users.get` (Khớp) | `MATCH` | Vinh | `V1-W2` |
| 8 | `PATCH /api/users/:id` | Administrator | `FR-F01-04` | `src/modules/users/` | `api.users.update` (Khớp) | `MATCH` | Vinh | `V1-W2` |
| 9 | `PATCH /api/users/:id/status` | Administrator | `FR-F01-04` | `src/modules/users/` | Chưa tách hàm riêng trong FE (dùng chung `update`) | `MATCH` | Vinh | `V1-W2` / `N1-W2` |
| 10 | `GET /api/books` | Public | `FR-F04-01..04` | `routes/books.js` | `api.books.search` (Khớp `{items, pagination}`) | `MATCH` | Quân | `Q1-W2` |
| 11 | `GET /api/books/:id` | Public | `FR-F02-04`, `F04-03` | `routes/books.js` | `api.books.get` (Khớp `BookDetail`) | `MATCH` | Quân | `Q1-W2` |
| 12 | `POST /api/books` | Librarian | `FR-F02-01` | `routes/books.js` | `api.books.create` (Khớp) | `MATCH` | Quân | `Q1-W2` |
| 13 | `PATCH /api/books/:id` | Librarian | `FR-F02-02` | `routes/books.js` | `api.books.update` (Khớp) | `MATCH` | Quân | `Q1-W2` |
| 14 | `DELETE /api/books/:id` | Librarian | `FR-F02-03` | `routes/books.js` | `api.books.remove` (Khớp) | `MATCH` | Quân | `Q1-W2` |
| 15 | `GET /api/books/:id/copies` | Public | `FR-F03-01`, `F04-03` | `routes/books.js` | `api.copies.list` (Khớp `{items: Copy[]}`) | `MATCH` | Quân | `Q1-W2` |
| 16 | `POST /api/books/:id/copies` | Librarian | `FR-F03-01` | `routes/books.js` | `api.copies.create` (Khớp) | `MATCH` | Quân | `Q1-W2` |
| 17 | `PATCH /api/copies/:id` | Librarian | `FR-F03-02` | `routes/copies.js` | `api.copies.update` (Khớp) | `MATCH` | Quân | `Q1-W2` |
| 18 | `DELETE /api/copies/:id` | Librarian | `FR-F03-04` | `routes/copies.js` | `api.copies.remove` (Khớp HTTP 204) | `MATCH` | Quân | `Q1-W2` |
| 19 | `POST /api/loans/checkout` | Librarian | `FR-F05-01..03` | `src/modules/loans/` | FE gọi `circulation/checkout` + truyền `copyId` | **`FE_GAP`** (Sai path & param) | Vinh | `V1-W2` / `N1-W2` |
| 20 | `POST /api/loans/return` | Librarian | `FR-F05-04..05` | `src/modules/loans/` | FE gọi `circulation/return` + truyền `copyId` | **`FE_GAP`** (Sai path) | Vinh | `V1-W2` / `N1-W2` |
| 21 | `POST /api/loans/:id/renew` | Reader, Librarian | `FR-F05-06` | `src/modules/loans/` | FE gọi `circulation/renew` + body `{loanId}` | **`FE_GAP`** (Sai path & param URL) | Vinh | `V1-W2` / `N1-W2` |
| 22 | `GET /api/loans/overdue` | Librarian | `FR-F05-07`, `F07-03` | `src/modules/loans/` | FE gọi `dashboard/overdue` | `ALIAS_OK` | Vinh | `V1-W2` |
| 23 | `POST /api/reservations` | Reader | `FR-F06-01..02` | `routes/reservations.js` | `api.reservations.create` (Khớp `{titleId}`) | `MATCH` | Quân | `Q1-W2` |
| 24 | `GET /api/reservations/me` | Reader | `FR-F06-03` | `routes/reservations.js` | `api.reservations.mine` (Khớp) | `MATCH` | Quân | `Q1-W2` |
| 25 | `GET /api/reservations/queue` | Librarian | `FR-F06-03..04` | `routes/reservations.js` | `api.reservations.queue` (Khớp `titleId?`) | `MATCH` | Quân | `Q1-W2` |
| 26 | `DELETE /api/reservations/:id` | Reader | `FR-F06-05` | `routes/reservations.js` | `api.reservations.cancel` (Khớp) | `MATCH` | Quân | `Q1-W2` |
| 27 | `GET /api/me/dashboard` | Reader | `FR-F07-01..02` | `app.js` mount trực tiếp | FE gọi `dashboard/reader` | `ALIAS_OK` | Vinh | `V1-W2` |
| 28 | `GET /api/librarian/overdue` | Librarian | `FR-F07-03` | `app.js` mount trực tiếp | FE gọi `dashboard/overdue` | `ALIAS_OK` | Vinh | `V1-W2` |
| 29 | `GET /api/dashboard/reader` | Reader | `FR-F07-01` | `src/modules/dashboard/`| `api.dashboard.reader` (Khớp alias) | `ALIAS_OK` | Vinh | `V1-W2` |
| 30 | `GET /api/dashboard/librarian` | Librarian | `FR-F07-03` | `src/modules/dashboard/`| Chưa wire trên FE (màn hình tổng hợp) | `MATCH` | Vinh | `V1-W2` |
| 31 | `GET /api/dashboard/overdue` | Librarian | `FR-F07-03` | `src/modules/dashboard/`| `api.dashboard.overdue` (Khớp alias) | `ALIAS_OK` | Vinh | `V1-W2` |
| 32 | `POST /api/v1/auth/login` | Public | RTM Compat | `app.js` v1 router | Route tương thích v1 | `MATCH` | Vinh | `V1-W2` |
| 33 | `POST /api/v1/auth/logout` | Public/Auth | RTM Compat | `app.js` v1 router | Route tương thích v1 | `MATCH` | Vinh | `V1-W2` |
| 34 | `GET /api/v1/auth/me` | Reader, Lib, Admin | RTM Compat | `app.js` v1 router | Route tương thích v1 | `MATCH` | Vinh | `V1-W2` |
| 35 | `GET /api/v1/users` | Administrator | RTM Compat | `app.js` v1 router | Route tương thích v1 | `MATCH` | Vinh | `V1-W2` |
| 36 | `POST /api/v1/users` | Administrator | RTM Compat | `app.js` v1 router | Route tương thích v1 | `MATCH` | Vinh | `V1-W2` |
| 37 | `GET /api/v1/users/:id` | Administrator | RTM Compat | `app.js` v1 router | Route tương thích v1 | `MATCH` | Vinh | `V1-W2` |
| 38 | `PATCH /api/v1/users/:id` | Administrator | RTM Compat | `app.js` v1 router | Route tương thích v1 | `MATCH` | Vinh | `V1-W2` |
| 39 | `PATCH /api/v1/users/:id/status` | Administrator | RTM Compat | `app.js` v1 router | Route tương thích v1 | `MATCH` | Vinh | `V1-W2` |
| 40 | `POST /api/v1/books` | Librarian | RTM Compat | `app.js` v1 router | Route tương thích v1 | `MATCH` | Quân | `Q1-W2` |
| 41 | `POST /api/v1/loans/checkout` | Librarian | RTM Compat | `app.js` v1 router | Route tương thích v1 | `MATCH` | Vinh | `V1-W2` |
| * | `GET /api/circulation/eligibility` | *Không tồn tại* | *None* | *Backend không có và không hỗ trợ* | FE `endpoints.js` có method tạm thời | `NOT_IN_SCOPE` | Vinh | `N1-W2` xóa khỏi FE |

### Kết luận Kiểm toán Gap:
1. **100% (41/41) endpoints backend đã được hiện thực và pass kiểm thử RBAC / Unit test.**
2. **3 điểm lệch pha (Gaps) lớn phía Frontend cần khắc phục tại `src/client/src/api/endpoints.js` (Task N1-W2 / A1-W2):**
   * **Gap 1 (`loans.checkout`):** Sửa path từ `circulation/checkout` sang `loans/checkout`. Tham số gửi lên chuẩn là `{ readerId, barcode }` (được quét từ mã vạch sách).
   * **Gap 2 (`loans.return`):** Sửa path từ `circulation/return` sang `loans/return`. Tham số gửi lên là `{ barcode, conditionNotes?, condition? }`.
   * **Gap 3 (`loans.renew`):** Sửa path từ `circulation/renew` (body `{loanId}`) sang `POST /api/loans/:id/renew` (URL param `:id`, body rỗng).
   * **Loại bỏ endpoint ảo:** Xóa bỏ hoàn toàn `api.circulation.eligibility`. Điều kiện hợp lệ được kiểm tra trực tiếp qua thuộc tính `restrictions` trong `GET /api/me/dashboard` hoặc bắt lỗi 422 khi bấm checkout.

---

## 2. Quy chuẩn Chung (Global API Conventions)

### 2.1 Base URL & Content Negotiation
* **Base URL:** `/api` (Production/Dev proxy chuyển tiếp tới `http://localhost:4000/api`).
* **Header bắt buộc đối với request có body:** `Content-Type: application/json`
* **Dung lượng body tối đa:** `50 KiB` (Chống DoS payload lớn).

### 2.2 Cơ chế Xác thực & Phân quyền (Stateless JWT & RBAC)
* Mọi protected endpoint yêu cầu header:
  ```http
  Authorization: Bearer <jwt_token>
  ```
* Payload JWT chuẩn: `{ sub: "<User_UUID>", role: "Reader" | "Librarian" | "Administrator", iat: number, exp: number }`.
* **Quy tắc bảo mật:** Backend **không bao giờ tin cậy** `readerId` gửi từ client đối với các thao tác của Reader (như đặt trước, xem dashboard). `readerId` luôn được trích xuất an toàn từ `req.user.id`.

### 2.3 Cấu trúc Error Envelope Toàn cục
Toàn bộ mã lỗi trả về (4xx, 5xx) tuân thủ cấu trúc chuẩn duy nhất (zero stack leak per `NFR-08`):
```json
{
  "error": {
    "code": "STRING_ERROR_CODE",
    "message": "Thông điệp giải thích ngắn gọn, an toàn cho người dùng",
    "details": null
  }
}
```

### 2.4 Bảng Mã HTTP Status Code
| HTTP Code | Ý nghĩa ngữ cảnh trong UniLib |
| :---: | :--- |
| `200 OK` | Thao tác thành công (`GET`, `PATCH`, `DELETE` trả dữ liệu). |
| `201 Created` | Tạo mới tài nguyên thành công (`POST`). |
| `204 No Content` | Xóa thành công, không trả nội dung body (ví dụ `DELETE /api/copies/:id`). |
| `400 Bad Request` | Payload JSON sai định dạng, thiếu trường bắt buộc hoặc sai kiểu dữ liệu UUID (`VALIDATION_ERROR`). |
| `401 Unauthorized` | Thiếu token, token hết hạn hoặc sai chữ ký (`UNAUTHORIZED`, `INVALID_CREDENTIALS`). |
| `403 Forbidden` | Đã đăng nhập nhưng sai vai trò RBAC (`FORBIDDEN`) hoặc can thiệp dữ liệu người khác. |
| `404 Not Found` | Không tìm thấy bản ghi với ID/barcode tương ứng (`NOT_FOUND`, `BOOK_NOT_FOUND`, `COPY_NOT_FOUND`...). |
| `409 Conflict` | Xung đột toàn vẹn dữ liệu, vi phạm ràng buộc `BR-09` (`TITLE_IN_USE`, `COPY_IN_USE`, `COPY_HAS_HISTORY`, `BARCODE_DUPLICATE`). |
| `422 Unprocessable` | Vi phạm Quy tắc Nghiệp vụ (`BR-01`..`BR-08`) như sách quá hạn, vượt hạn mức mượn/đặt trước... |

---

## 3. Đặc tả Chi tiết Từng Endpoint & Mã Lỗi (Authoritative Specifications)

### 3.1 Phân hệ Xác thực & Quản trị Người dùng (F01 Authentication & RBAC)

#### `POST /api/auth/login`
* **Quyền hạn:** Public
* **Request Body:**
  ```json
  {
    "username": "reader1",
    "password": "UniLibDemo!2026"
  }
  ```
* **Response (200 OK):**
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "11111111-1111-4111-8111-111111111111",
      "username": "reader1",
      "email": "reader1@unilib.edu.vn",
      "fullName": "Nguyễn Văn Bạn Đọc",
      "role": "Reader",
      "isActive": true
    },
    "expiresIn": "24h"
  }
  ```
* **Mã lỗi `businessErrors`:**
  * `400 VALIDATION_ERROR`: Thiếu username hoặc password.
  * `401 INVALID_CREDENTIALS`: Sai username hoặc password (thông báo chung chống dò quét, `AC-F01-02`).
  * `403 ACCOUNT_INACTIVE`: Tài khoản đã bị khóa bởi Quản trị viên (`isActive: false`).

#### `POST /api/auth/logout`
* **Quyền hạn:** Public / Authenticated
* **Request Body:** Không có.
* **Response (200 OK):**
  ```json
  {
    "message": "Logged out successfully"
  }
  ```

#### `GET /api/auth/me`
* **Quyền hạn:** Mọi vai trò đã đăng nhập (Reader, Librarian, Administrator)
* **Headers:** `Authorization: Bearer <token>`
* **Response (200 OK):**
  ```json
  {
    "user": {
      "id": "11111111-1111-4111-8111-111111111111",
      "username": "reader1",
      "email": "reader1@unilib.edu.vn",
      "fullName": "Nguyễn Văn Bạn Đọc",
      "role": "Reader",
      "isActive": true
    }
  }
  ```
* **Mã lỗi:** `401 UNAUTHORIZED`, `403 FORBIDDEN` / `ACCOUNT_INACTIVE`.

#### `GET /api/users`
* **Quyền hạn:** `Administrator`
* **Query Params:** `role` (Reader/Librarian/Administrator), `isActive` (true/false), `search` (tên/email/username), `page` (default 1), `pageSize` (default 10).
* **Response (200 OK):**
  ```json
  {
    "items": [
      {
        "id": "11111111-1111-4111-8111-111111111111",
        "username": "reader1",
        "email": "reader1@unilib.edu.vn",
        "fullName": "Nguyễn Văn Bạn Đọc",
        "role": "Reader",
        "isActive": true,
        "createdAt": "2026-11-23T00:00:00.000Z"
      }
    ],
    "total": 9,
    "page": 1,
    "pageSize": 10
  }
  ```

#### `POST /api/users`
* **Quyền hạn:** `Administrator`
* **Request Body:**
  ```json
  {
    "username": "newlibrarian",
    "email": "librarian_new@unilib.edu.vn",
    "fullName": "Trần Thị Thủ Thư",
    "password": "Password123!",
    "role": "Librarian"
  }
  ```
* **Response (201 Created):** Trả về thông tin user đã tạo (không bao gồm `passwordHash`).
* **Mã lỗi:** `400 VALIDATION_ERROR`, `409 USERNAME_DUPLICATE`, `409 EMAIL_DUPLICATE`.

#### `PATCH /api/users/:id` & `PATCH /api/users/:id/status`
* **Quyền hạn:** `Administrator`
* **Request Body:** `{ "fullName": "...", "email": "...", "role": "...", "isActive": true|false }`
* **Response (200 OK):** User object cập nhật.
* **Mã lỗi:** `404 USER_NOT_FOUND`, `409 EMAIL_DUPLICATE`.

---

### 3.2 Phân hệ Quản lý Danh mục & Kho sách (F02 Catalog & F03 Copy Inventory)

#### `GET /api/books`
* **Quyền hạn:** Public
* **Query Params:**
  * `q`: Từ khóa tìm kiếm tự do (không dấu hoặc có dấu, tìm trên title, author, category, ISBN theo `pg_trgm`).
  * `category`: Lọc chính xác theo thể loại (ví dụ: `Computer Science`, `Literature`...).
  * `available`: `true` (chỉ lấy sách còn ít nhất 1 bản sao sẵn có), `false` / `all` (lấy tất cả).
  * `sort`: `title` (A-Z) hoặc `year` (Năm xuất bản mới nhất trước).
  * `page`: Số trang (1-based, default 1).
  * `pageSize`: Kích thước trang (default 10, tối đa 100, `NFR-01`).
* **Response (200 OK):**
  ```json
  {
    "items": [
      {
        "id": "44444444-4444-4444-8444-444444444444",
        "isbn": "9780132350884",
        "title": "Clean Code",
        "author": "Robert C. Martin",
        "category": "Software Engineering",
        "publisher": "Prentice Hall",
        "publicationYear": 2008,
        "isActive": true,
        "totalCopies": 3,
        "availableCopies": 2,
        "borrowedCopies": 1,
        "reservedCopies": 0,
        "damagedCopies": 0,
        "lostCopies": 0,
        "shelfLocations": ["Kệ A-01", "Kệ A-02"]
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "total": 30,
      "totalPages": 3
    }
  }
  ```

#### `GET /api/books/:id`
* **Quyền hạn:** Public
* **Response (200 OK):** Trả về `BookDetail` bao gồm toàn bộ thông tin đầu sách và mảng `copies: Copy[]`:
  ```json
  {
    "id": "44444444-4444-4444-8444-444444444444",
    "isbn": "9780132350884",
    "title": "Clean Code",
    "author": "Robert C. Martin",
    "category": "Software Engineering",
    "copies": [
      {
        "id": "55555555-5555-4555-8555-555555555555",
        "barcode": "UNI-001-01",
        "status": "Available",
        "shelfLocation": "Kệ A-01",
        "conditionNotes": "Sách mới 100%"
      }
    ]
  }
  ```

#### `POST /api/books`
* **Quyền hạn:** `Librarian`
* **Request Body:** `{ "isbn": "...", "title": "...", "author": "...", "category": "...", "publicationYear": 2024, "publisher": "..." }`
* **Response (201 Created):** `BookDetail`
* **Mã lỗi:** `400 VALIDATION_ERROR`, `409 ISBN_DUPLICATE`.

#### `PATCH /api/books/:id`
* **Quyền hạn:** `Librarian`
* **Request Body:** Cập nhật một phần thuộc tính đầu sách.
* **Mã lỗi:** `404 BOOK_NOT_FOUND`, `409 ISBN_DUPLICATE`.

#### `DELETE /api/books/:id`
* **Quyền hạn:** `Librarian`
* **Quy tắc BR-09:** Chỉ được xóa (soft delete) khi đầu sách **không còn bất kỳ bản sao nào** và **không có lượt đặt trước đang hoạt động**.
* **Mã lỗi:** `409 TITLE_IN_USE` (BR-09: Đầu sách đang có bản sao hoặc hàng chờ).

#### `POST /api/books/:id/copies`
* **Quyền hạn:** `Librarian`
* **Request Body:**
  ```json
  {
    "barcode": "UNI-001-04",
    "shelfLocation": "Kệ A-01",
    "conditionNotes": "Bổ sung quý 4"
  }
  ```
* **Response (201 Created):** Thông tin bản sao vừa tạo.
* **Mã lỗi:** `400 VALIDATION_ERROR`, `404 BOOK_NOT_FOUND`, `409 BARCODE_DUPLICATE`.

#### `PATCH /api/copies/:id`
* **Quyền hạn:** `Librarian`
* **Request Body:** `{ "shelfLocation": "Kệ B-02", "conditionNotes": "Bìa hơi sờn", "status": "Available" | "Damaged" | "Lost" }`
* **Mã lỗi:** `404 COPY_NOT_FOUND`, `409 COPY_IN_USE` (Bản sao đang Borrowed hoặc Reserved thì không được sửa trạng thái tùy tiện).

#### `DELETE /api/copies/:id`
* **Quyền hạn:** `Librarian`
* **Quy tắc BR-09:** Không được xóa bản sao nếu đang `Borrowed` / `Reserved` hoặc đã từng có lịch sử lưu thông (foreign key RESTRICT).
* **Response:** `204 No Content`
* **Mã lỗi:** `409 COPY_IN_USE`, `409 COPY_HAS_HISTORY` (BR-09).

---

### 3.3 Phân hệ Quầy Lưu thông Sách (F05 Circulation Desk)

#### `POST /api/loans/checkout`
* **Quyền hạn:** `Librarian`
* **Request Body:**
  ```json
  {
    "readerId": "11111111-1111-4111-8111-111111111111",
    "barcode": "UNI-001-01"
  }
  ```
  *(Lưu ý: Hỗ trợ fallback nhận `copyId` thay cho `barcode` nếu FE truyền UUID).*
* **Response (201 Created):**
  ```json
  {
    "id": "66666666-6666-4666-8666-666666666666",
    "loanId": "66666666-6666-4666-8666-666666666666",
    "readerId": "11111111-1111-4111-8111-111111111111",
    "copyId": "55555555-5555-4555-8555-555555555555",
    "checkedOutAt": "2026-11-28T08:00:00.000Z",
    "dueAt": "2026-12-12T08:00:00.000Z",
    "dueDate": "2026-12-12T08:00:00.000Z",
    "renewalsCount": 0,
    "status": "ACTIVE",
    "copy": {
      "id": "55555555-5555-4555-8555-555555555555",
      "barcode": "UNI-001-01",
      "status": "Borrowed",
      "titleId": "44444444-4444-4444-8444-444444444444",
      "title": "Clean Code"
    },
    "fulfilledReservation": null
  }
  ```
* **Mã lỗi `businessErrors`:**
  * `400 VALIDATION_ERROR`: Thiếu `readerId` hoặc `barcode`.
  * `404 READER_NOT_FOUND`: Bạn đọc không tồn tại.
  * `404 COPY_NOT_FOUND`: Mã vạch barcode không tồn tại trong kho.
  * `422 READER_INACTIVE`: Tài khoản bạn đọc đang bị khóa.
  * `422 READER_OVERDUE` (BR-04): Bạn đọc đang có ít nhất 1 cuốn sách quá hạn chưa trả $\rightarrow$ chặn mượn toàn bộ.
  * `422 LOAN_LIMIT_EXCEEDED` (BR-01): Bạn đọc đã đạt hạn mức tối đa 3 cuốn đang mượn.
  * `409 COPY_NOT_AVAILABLE`: Sách đang ở trạng thái `Borrowed`, `Damaged` hoặc `Lost`.
  * `409 HOLD_NOT_ELIGIBLE` (BR-08 / F06-06): Bản sao đang được giữ chỗ (Ready hold) cho một bạn đọc khác trên kệ giữ chỗ, hoặc thời hạn nhận sách 72h chưa hết.

#### `POST /api/loans/return`
* **Quyền hạn:** `Librarian`
* **Request Body:**
  ```json
  {
    "barcode": "UNI-001-01",
    "conditionNotes": "Sách nguyên vẹn",
    "condition": "Good"
  }
  ```
* **Response (200 OK):**
  ```json
  {
    "id": "66666666-6666-4666-8666-666666666666",
    "loanId": "66666666-6666-4666-8666-666666666666",
    "copyId": "55555555-5555-4555-8555-555555555555",
    "barcode": "UNI-001-01",
    "returnedAt": "2026-11-28T09:30:00.000Z",
    "returnDate": "2026-11-28T09:30:00.000Z",
    "loanStatus": "RETURNED",
    "copyStatus": "Available",
    "copy": {
      "id": "55555555-5555-4555-8555-555555555555",
      "status": "Available"
    },
    "hold": null
  }
  ```
  *(Nếu có bạn đọc đang đợi trong hàng chờ FIFO `BR-07`, `copyStatus` sẽ tự động chuyển thành `"Reserved"` và `hold` sẽ trả về thông tin Ready hold với hạn nhận 72h theo `BR-08`).*
* **Mã lỗi `businessErrors`:**
  * `404 COPY_NOT_FOUND`: Barcode không tìm thấy.
  * `409 COPY_NOT_BORROWED`: Cuốn sách này hiện không ở trạng thái đang mượn (`copy.status !== 'Borrowed'`).
  * `409 LOAN_ALREADY_RETURNED`: Bản ghi mượn này đã được trả trước đó.

#### `POST /api/loans/:id/renew`
* **Quyền hạn:** `Reader` (chính chủ sở hữu lượt mượn) hoặc `Librarian`
* **URL Param:** `:id` (UUID của lượt mượn `loanId`). Request Body để rỗng `{}`.
* **Response (200 OK):**
  ```json
  {
    "id": "66666666-6666-4666-8666-666666666666",
    "loanId": "66666666-6666-4666-8666-666666666666",
    "dueAt": "2026-12-26T08:00:00.000Z",
    "dueDate": "2026-12-26T08:00:00.000Z",
    "renewedAt": "2026-11-28T10:00:00.000Z",
    "renewalsCount": 1,
    "status": "ACTIVE"
  }
  ```
* **Mã lỗi `businessErrors`:**
  * `403 FORBIDDEN`: Bạn đọc cố tình gia hạn sách của người khác.
  * `404 LOAN_NOT_FOUND`: Không tìm thấy lượt mượn.
  * `409 LOAN_ALREADY_RETURNED`: Lượt mượn đã kết thúc.
  * `422 RENEWAL_LIMIT_EXCEEDED` (BR-03): Mỗi lượt mượn chỉ được gia hạn tối đa **1 lần** (+14 ngày).
  * `422 OVERDUE_RENEWAL_DENIED` (BR-03): Sách đã quá hạn (`dueAt < now`) không được phép gia hạn.
  * `422 PENDING_RESERVATION_EXISTS` (BR-03): Đầu sách này đang có bạn đọc khác xếp hàng đặt trước $\rightarrow$ không được gia hạn.

---

### 3.4 Phân hệ Đặt trước Sách & Hàng đợi Giữ chỗ (F06 Reservations & Holds)

#### `POST /api/reservations`
* **Quyền hạn:** `Reader` only
* **Request Body:**
  ```json
  {
    "titleId": "44444444-4444-4444-8444-444444444444"
  }
  ```
  *(Lưu ý: `readerId` được lấy tự động từ JWT).*
* **Response (201 Created):**
  ```json
  {
    "reservation": {
      "id": "77777777-7777-4777-8777-777777777777",
      "readerId": "11111111-1111-4111-8111-111111111111",
      "titleId": "44444444-4444-4444-8444-444444444444",
      "heldCopyId": null,
      "status": "Pending",
      "createdAt": "2026-11-28T10:30:00.000Z"
    },
    "queuePosition": 1
  }
  ```
* **Mã lỗi `businessErrors`:**
  * `422 COPY_AVAILABLE` (BR-05): Đầu sách vẫn còn ít nhất 1 bản sao sẵn có (`Available`) $\rightarrow$ bạn đọc phải mượn trực tiếp, không được đặt trước.
  * `422 TITLE_ALREADY_BORROWED` (BR-05): Bạn đọc đang mượn cuốn sách này rồi $\rightarrow$ không được đặt thêm bản giữ chỗ.
  * `422 RESERVATION_DUPLICATE`: Bạn đọc đã có một yêu cầu đặt trước đang hoạt động cho đầu sách này.
  * `422 RESERVATION_LIMIT` (BR-06): Bạn đọc đã đạt giới hạn tối đa **2 lượt đặt trước** active (`Pending` hoặc `Ready`).
  * `422 READER_OVERDUE` (BR-04): Bạn đọc đang có sách quá hạn $\rightarrow$ bị khóa quyền đặt trước.
  * `422 NO_CIRCULATING_COPY`: Đầu sách không có bản sao nào được phép lưu thông.

#### `GET /api/reservations/me`
* **Quyền hạn:** `Reader` only
* **Response (200 OK):**
  ```json
  {
    "items": [
      {
        "id": "77777777-7777-4777-8777-777777777777",
        "titleId": "44444444-4444-4444-8444-444444444444",
        "status": "Pending",
        "createdAt": "2026-11-28T10:30:00.000Z",
        "queuePosition": 1,
        "title": {
          "id": "44444444-4444-4444-8444-444444444444",
          "title": "Clean Code",
          "author": "Robert C. Martin",
          "isbn": "9780132350884"
        }
      }
    ]
  }
  ```

#### `GET /api/reservations/queue`
* **Quyền hạn:** `Librarian`
* **Query Params:** `titleId` (tùy chọn)
* **Response (200 OK):** Danh sách hàng chờ đặt trước kèm thông tin bạn đọc và sách.

#### `DELETE /api/reservations/:id`
* **Quyền hạn:** `Reader` (chính chủ đặt trước)
* **Response (200 OK):** Trả về bản ghi reservation với trạng thái `"Cancelled"`.
* **Mã lỗi:** `403 FORBIDDEN`, `404 NOT_FOUND`, `409 RESERVATION_NOT_ACTIVE`.

---

### 3.5 Phân hệ Dashboard & Giám sát Quá hạn (F07 Personal Dashboard & Overdue)

#### `GET /api/me/dashboard` *(Hoặc Alias `GET /api/dashboard/reader`)*
* **Quyền hạn:** `Reader` only
* **Headers:** `Authorization: Bearer <token>`
* **Response (200 OK):**
  ```json
  {
    "readerId": "11111111-1111-4111-8111-111111111111",
    "reader": {
      "id": "11111111-1111-4111-8111-111111111111",
      "fullName": "Nguyễn Văn Bạn Đọc",
      "email": "reader1@unilib.edu.vn"
    },
    "loans": [
      {
        "id": "66666666-6666-4666-8666-666666666666",
        "loanId": "66666666-6666-4666-8666-666666666666",
        "barcode": "UNI-001-01",
        "bookTitle": "Clean Code",
        "author": "Robert C. Martin",
        "checkedOutAt": "2026-11-20T00:00:00.000Z",
        "dueAt": "2026-12-04T00:00:00.000Z",
        "dueDate": "2026-12-04T00:00:00.000Z",
        "renewalsCount": 0,
        "isOverdue": false,
        "lateDays": 0,
        "daysRemaining": 6,
        "canRenew": true,
        "renewBlockReason": null
      }
    ],
    "reservations": [
      {
        "id": "77777777-7777-4777-8777-777777777777",
        "bookTitle": "Design Patterns",
        "status": "Pending",
        "queuePosition": 1,
        "readyAt": null,
        "expiresAt": null
      }
    ],
    "overdueCount": 0,
    "hasOverdue": false,
    "overdueFlags": {
      "hasOverdue": false,
      "overdueCount": 0,
      "maxLateDays": 0,
      "overdueLoanIds": []
    },
    "restrictions": {
      "borrowingBlocked": false,
      "reservingBlocked": false,
      "canBorrow": true,
      "canReserve": true,
      "activeLoansCount": 1,
      "maxActiveLoans": 3,
      "activeReservationsCount": 1,
      "maxActiveReservations": 2,
      "reasons": []
    },
    "alerts": []
  }
  ```

#### `GET /api/librarian/overdue` *(Hoặc Alias `GET /api/dashboard/overdue`, `GET /api/loans/overdue`)*
* **Quyền hạn:** `Librarian`
* **Response (200 OK):**
  ```json
  {
    "items": [
      {
        "id": "66666666-6666-4666-8666-666666666666",
        "loanId": "66666666-6666-4666-8666-666666666666",
        "checkedOutAt": "2026-11-01T00:00:00.000Z",
        "dueAt": "2026-11-15T00:00:00.000Z",
        "dueDate": "2026-11-15T00:00:00.000Z",
        "lateDays": 13,
        "daysOverdue": 13,
        "readerName": "Trần Quá Hạn",
        "readerEmail": "overdue_reader@unilib.edu.vn",
        "readerUsername": "reader_overdue",
        "barcode": "UNI-002-01",
        "bookTitle": "Introduction to Algorithms",
        "reader": {
          "id": "22222222-2222-4222-8222-222222222222",
          "username": "reader_overdue",
          "fullName": "Trần Quá Hạn",
          "email": "overdue_reader@unilib.edu.vn"
        },
        "copy": {
          "id": "55555555-5555-4555-8555-555555555556",
          "barcode": "UNI-002-01",
          "shelfLocation": "Kệ B-03",
          "status": "Borrowed"
        },
        "title": {
          "id": "44444444-4444-4444-8444-444444444445",
          "isbn": "9780262033848",
          "title": "Introduction to Algorithms",
          "author": "CLRS",
          "category": "Computer Science"
        }
      }
    ],
    "total": 1,
    "generatedAt": "2026-11-28T12:00:00.000Z"
  }
  ```

---

## 4. Danh mục Mã Lỗi Nghiệp vụ Tập trung (`businessErrors`)

Frontend sử dụng từ điển mã lỗi này trong `src/client/src/api/businessErrors.js` để hiển thị banner thông báo thân thiện cho người dùng:

| Mã Lỗi (`error.code`) | HTTP Status | Quy tắc | Thông báo Hiển thị Tiếng Việt Đề xuất cho UI |
| :--- | :---: | :---: | :--- |
| `VALIDATION_ERROR` | 400 | - | Vui lòng kiểm tra lại các trường thông tin bắt buộc còn thiếu hoặc sai định dạng. |
| `INVALID_CREDENTIALS` | 401 | AC-F01-02 | Tên đăng nhập hoặc mật khẩu không chính xác. |
| `UNAUTHORIZED` | 401 | NFR-04 | Phiên làm việc đã hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại. |
| `FORBIDDEN` | 403 | NFR-04 | Bạn không có quyền thực hiện thao tác này. |
| `ACCOUNT_INACTIVE` / `READER_INACTIVE` | 403 / 422 | F01 | Tài khoản đang bị vô hiệu hóa. Vui lòng liên hệ Quản trị viên thư viện. |
| `NOT_FOUND` / `*_NOT_FOUND` | 404 | - | Không tìm thấy bản ghi dữ liệu yêu cầu. Vui lòng làm mới danh sách. |
| `ISBN_DUPLICATE` | 409 | F02 | Mã ISBN này đã tồn tại trong danh mục đầu sách. |
| `BARCODE_DUPLICATE` | 409 | F03 | Mã vạch barcode này đã được gán cho một bản sao khác. |
| `TITLE_IN_USE` | 409 | BR-09 | Đầu sách vẫn còn bản sao vật lý hoặc hàng chờ đặt trước, không thể xóa. |
| `COPY_IN_USE` | 409 | BR-09 | Bản sao đang được mượn hoặc giữ chỗ, không thể chỉnh sửa trạng thái hay hủy. |
| `COPY_HAS_HISTORY` | 409 | BR-09 | Bản sao đã có lịch sử lưu thông mượn trả trong quá khứ, không thể xóa khỏi hệ thống. |
| `COPY_NOT_BORROWED` | 409 | F05 | Bản sao không ở trạng thái đang mượn hoặc đã được trả trước đó. |
| `LOAN_ALREADY_RETURNED`| 409 | F05 | Lượt mượn này đã hoàn tất thủ tục trả sách. |
| `HOLD_NOT_ELIGIBLE` | 409 | BR-08 | Bản sao này đang được giữ chỗ cho bạn đọc khác hoặc đã quá hạn nhận sách 72h. |
| `RESERVATION_NOT_ACTIVE`| 409 | F06 | Yêu cầu đặt trước này không còn ở trạng thái hiệu lực. |
| `LOAN_LIMIT_EXCEEDED` | 422 | BR-01 | Bạn đọc đã đạt hạn mức tối đa (3 cuốn sách đang mượn). Cần trả bớt sách trước khi mượn tiếp. |
| `RENEWAL_LIMIT_EXCEEDED`| 422 | BR-03 | Mỗi lượt mượn chỉ được gia hạn tối đa 1 lần (+14 ngày). |
| `OVERDUE_RENEWAL_DENIED`| 422 | BR-03 | Sách đã quá hạn trả, không được phép gia hạn. |
| `PENDING_RESERVATION_EXISTS`| 422 | BR-03 | Đầu sách đang có bạn đọc khác xếp hàng đặt trước, không thể gia hạn. |
| `READER_OVERDUE` | 422 | BR-04 | Bạn đọc đang có sách quá hạn chưa trả. Quyền mượn và đặt trước sách bị tạm khóa. |
| `COPY_AVAILABLE` | 422 | BR-05 | Thư viện vẫn còn bản sao sẵn có trên kệ. Vui lòng mượn trực tiếp, không đặt trước. |
| `TITLE_ALREADY_BORROWED`| 422 | BR-05 | Bạn đọc đang mượn một bản sao của đầu sách này rồi, không được đặt trước thêm. |
| `RESERVATION_LIMIT` | 422 | BR-06 | Bạn đọc đã đạt hạn mức tối đa (2 yêu cầu đặt trước active). |
| `RESERVATION_DUPLICATE`| 422 | F06 | Bạn đọc đã có một yêu cầu đặt trước đang chờ cho cuốn sách này. |
| `NO_CIRCULATING_COPY` | 422 | F06 | Đầu sách này hiện không có bản sao nào lưu thông. |

---

## 5. Hướng dẫn Tích hợp Cụ thể cho Frontend (`src/client`)

Để nối thành công Frontend vào Backend W2 mà không gặp lỗi:

1. **Cập nhật `src/client/src/api/endpoints.js`:**
   ```javascript
   // Thay thế block circulation bằng:
   circulation: {
     // Checkout: gửi readerId và barcode (hoặc copyId fallback)
     checkout: (readerId, barcode) => client.post('loans/checkout', { readerId, barcode }),
     // Return: gửi barcode và tình trạng sách
     checkin: (barcode, condition = 'Good') => client.post('loans/return', { barcode, condition }),
     // Renew: gửi URL param :id
     renew: (loanId) => client.post(`loans/${encodeURIComponent(loanId)}/renew`),
   },
   ```
2. **Loại bỏ gọi `circulation/eligibility`:**
   Trong `Borrow.jsx`, kiểm tra điều kiện mượn trực tiếp từ `reader.restrictions` (nếu đã nạp dashboard) hoặc để backend ném mã lỗi `422` và hiển thị thông báo qua `formatBusinessError(err)`.
3. **Mã vạch trực tiếp tại Quầy Lưu thông:**
   Thủ thư chỉ cần quét/nhập `barcode` tại ô mượn hoặc trả, backend tự động ánh xạ sang bản sao và đầu sách trong 1 transaction an toàn chống race condition.

---

## 6. Nhật ký Thay đổi & Ký duyệt Đóng băng (Changelog & Sign-off)

### Changelog:
* **2026-11-28 (`v2.0.0-frozen`):** Vinh tổng hợp toàn bộ 41 endpoints từ RTM PA3 §7, chuẩn hóa cấu trúc lỗi, làm rõ 3 gap phía FE và đóng băng hợp đồng cho W2.

### Bảng Ký duyệt Nghiệm thu Hợp đồng API:
| Thành viên | Vai trò | Trạng thái Ký duyệt | Ngày xác nhận |
| :--- | :--- | :---: | :---: |
| **Nguyễn Phan Thế Vinh** | Team Lead / PM · Backend / Tester | **ĐÃ DUYỆT & ĐÓNG BĂNG** | 2026-11-28 |
| **Trần Hà Anh Quân** | Tech Lead / Developer phụ trách Catalog, Copy, Reservation | **ĐÃ DUYỆT** | 2026-11-28 |
| **Nguyễn Thanh Thảo Nguyên** | BA / Frontend Staff & Admin Workflows | **ĐÃ NHẬN & XÁC NHẬN** | Trước cuối D2 (29/11) |
| **Vũ Thị Ánh** | UI/UX Designer / Frontend Reader Workflows | **ĐÃ NHẬN & XÁC NHẬN** | Trước cuối D2 (29/11) |
