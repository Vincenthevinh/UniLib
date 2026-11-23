
# UniLib — Backend Server (`src/server`)

Hệ thống Backend REST API cho dự án **UniLib (University Library Management System)**.

Được xây dựng trên nền tảng **Node.js 22 LTS**, **Express.js (ECMAScript Modules - ESM)**, với kiến trúc phân tầng 3-Layer Architecture, hướng đến tích hợp PostgreSQL 16 và Prisma ORM.

---

## 1. Hướng dẫn cài đặt & Khởi chạy

### 1.1. Yêu cầu môi trường

- Node.js >= 20.x (khuyến nghị Node.js 22 LTS).
- npm >= 10.x.

### 1.2. Cài đặt dependencies

Từ thư mục gốc repository:

```bash
cd src/server
npm ci
```

### 1.3. Cấu hình biến môi trường

Tạo file `.env` từ template `.env.example`:

```bash
cp .env.example .env
```

Các biến môi trường:

| Biến | Mô tả | Giá trị đề xuất |
|---|---|---|
| `PORT` | Cổng chạy Backend API | `3001` |
| `NODE_ENV` | Môi trường chạy ứng dụng | `development` |
| `DATABASE_URL` | Chuỗi kết nối PostgreSQL | Theo cấu hình database |
| `JWT_SECRET` | Khóa bí mật dùng để ký JWT | Secret ngẫu nhiên tối thiểu 32 ký tự |
| `JWT_EXPIRES_IN` | Thời hạn JWT | `7d` |
| `CORS_ORIGIN` | Địa chỉ frontend được phép truy cập API | `http://localhost:5173` |
| `CLIENT_ORIGIN` | Địa chỉ frontend client, nếu được sử dụng | `http://localhost:5173` |
| `RESERVATION_SWEEP_MS` | Chu kỳ kiểm tra reservation, nếu được triển khai | `60000` |

**Lưu ý bảo mật:**

- Không sử dụng JWT secret mặc định trong môi trường production.
- Không commit file `.env` chứa thông tin bí mật lên GitHub.
- File `.env.example` chỉ chứa các giá trị mẫu, không chứa credentials thực tế.

### 1.4. Khởi chạy server

**Chế độ phát triển (Hot reload với nodemon):**

```bash
npm run dev
```

**Chế độ thông thường:**

```bash
npm start
```

Backend mặc định lắng nghe tại:

```text
http://localhost:3001
```

Cổng thực tế phụ thuộc vào biến môi trường `PORT` và cấu hình trong source code.

### 1.5. Health Check

Nếu endpoint health check `/api/health` đã được triển khai, có thể kiểm tra bằng:

```bash
curl http://localhost:3001/api/health
```

Response mẫu:

```json
{
  "status": "ok",
  "db": "down"
}
```

Lưu ý: Đây là response minh họa. Trạng thái thực tế phụ thuộc vào implementation của health check và kết nối database.

### 1.6. Kiểm thử & Linter

**Chạy bộ kiểm thử tự động (Jest + Supertest):**

```bash
npm test
```

**Kiểm tra cú pháp và quy chuẩn mã nguồn (ESLint):**

```bash
npm run lint
```

**Tự động sửa các lỗi ESLint có thể khắc phục:**

```bash
npm run lint:fix
```

---

## 2. Cấu trúc thư mục & Quy ước Module

Toàn bộ logic nghiệp vụ được tổ chức theo kiến trúc phân tầng chuẩn (**3-Layer Architecture**):

`Routes (Định tuyến & Parse HTTP)` → `Controller (Điều phối request & HTTP status)` → `Service (Nghiệp vụ, Business Rules & Data access)`.

```text
src/server/
├── .env.example
├── README.md
├── package.json
├── app.js
├── server.js
├── config/
│   └── env.js
├── src/
│   ├── config/
│   │   └── dbHealth.js
│   ├── middlewares/
│   │   ├── requestId.js
│   │   ├── errorHandler.js
│   │   ├── notFound.js
│   │   └── index.js
│   └── modules/
│       ├── auth/
│       ├── users/
│       ├── books/
│       ├── copies/
│       ├── loans/
│       ├── reservations/
│       └── dashboard/
└── tests/
    ├── health.test.js
    ├── errorHandler.test.js
    └── modules.test.js
```

### 2.1. Quy ước tổ chức module

Mỗi module nghiệp vụ nên được tổ chức theo các thành phần:

- **Routes:** Khai báo endpoint, HTTP method và middleware.
- **Controller:** Tiếp nhận request, gọi service và trả HTTP response.
- **Service:** Xử lý business logic và các quy tắc nghiệp vụ.
- **Validation:** Kiểm tra dữ liệu đầu vào.
- **Repository:** Tầng truy cập dữ liệu nếu được tách riêng.

Các tầng cần đảm bảo phân chia trách nhiệm rõ ràng, hạn chế phụ thuộc chéo và thuận tiện cho việc kiểm thử.

---

## 3. Bảng ánh xạ Module với SRS PA2 (F01–F07)

| Module | Feature SRS | Use Cases | Screens | Trách nhiệm chính |
|---|---|---|---|---|
| **`auth`** | F01 (Must) | `UC-01` | `SCR-01` | Xác thực đăng nhập, phát hành JWT token, phân quyền RBAC (Reader, Librarian, Administrator), đăng xuất. |
| **`users`** | F01 (Must) | `UC-02` | `SCR-02` | CRUD tài khoản người dùng, phân quyền, kích hoạt/vô hiệu hóa tài khoản (`ACTIVE`/`INACTIVE`). |
| **`books`** | F02 & F04 (Must) | `UC-03`, `UC-05`, `UC-06` | `SCR-03`, `SCR-05`, `SCR-06` | Quản lý thông tin đầu sách (ISBN, Title, Author), tìm kiếm đa tiêu chí, phân trang server-side (`NFR-01`), thống kê số lượng bản sao khả dụng. |
| **`copies`** | F03 (Must) | `UC-04` | `SCR-04` | Quản lý bản sao vật lý, mã vạch (Barcode), vị trí kệ, cập nhật tình trạng, chặn xóa bản sao đang mượn/đặt trước (`BR-09`). |
| **`loans`** | F05 (Must) | `UC-07`, `UC-08`, `UC-09` | `SCR-07`, `SCR-08`, `SCR-11` | Mượn sách (tối đa 3 cuốn `BR-01`, thời hạn 14 ngày `BR-02`), trả sách, gia hạn 1 lần (`BR-03`), giám sát quá hạn (`BR-04`). |
| **`reservations`** | F06 (Must) | `UC-10`, `UC-11` | `SCR-09`, `SCR-10`, `SCR-11` | Đặt trước khi không còn bản sao khả dụng (`BR-05`), tối đa 2 lượt (`BR-06`), hàng đợi FIFO (`BR-07`), thời hạn nhận sách 72 giờ (`BR-08`). |
| **`dashboard`** | F07 (Should) | `UC-12` | `SCR-11`, `SCR-12` | Bảng điều khiển bạn đọc (sách đang mượn, hạn trả, cảnh báo quá hạn) và bàn điều khiển thủ thư (danh sách quá hạn, thông tin độc giả). |

---

## 4. Quy ước Chuẩn hóa Lỗi (Error Handling Format)

Tất cả các response lỗi từ hệ thống UniLib cần được chuẩn hóa thông qua middleware `errorHandler`.

Định dạng JSON thống nhất:

```json
{
  "error": {
    "code": "STRING_ERROR_CODE",
    "message": "Thông điệp mô tả lỗi thân thiện",
    "details": null
  }
}
```

### 4.1. Bảng mã lỗi thường dùng

| Error Code | HTTP Status | Ý nghĩa |
|---|---:|---|
| `NOT_FOUND` | 404 | Endpoint hoặc tài nguyên không tồn tại. |
| `VALIDATION_ERROR` | 400 | Dữ liệu gửi lên không hợp lệ hoặc thiếu trường bắt buộc. |
| `UNAUTHORIZED` | 401 | Chưa đăng nhập hoặc token không hợp lệ/hết hạn (`NFR-04`). |
| `FORBIDDEN` | 403 | Người dùng không có quyền truy cập endpoint tương ứng (`NFR-04`). |
| `POLICY_CONFLICT` | 409 | Vi phạm quy tắc nghiệp vụ. |
| `STATE_CONFLICT` | 409 | Xung đột trạng thái nghiệp vụ (`BR-01`, `BR-04`, `BR-09`). |
| `INTERNAL_ERROR` | 500 | Lỗi hệ thống ngoài dự kiến. |

### 4.2. An toàn & Bảo mật

- **Không trả về stack trace** hoặc thông tin hạ tầng nội bộ trong JSON response gửi cho client.
- Chi tiết lỗi và stack trace cần được ghi log ở phía server để phục vụ điều tra sự cố.
- Sử dụng `requestId` để liên kết log với từng HTTP request.
- Các endpoint yêu cầu xác thực phải kiểm tra JWT hợp lệ.
- Các endpoint quản trị phải kiểm tra quyền truy cập RBAC.
- Không lưu mật khẩu dưới dạng plaintext.
- Không đưa JWT secret, database credentials hoặc thông tin nhạy cảm vào source code hay Git repository.

---

## 5. Quy ước phát triển & tích hợp

### 5.1. Quy ước API

- Sử dụng RESTful API conventions.
- Sử dụng HTTP methods phù hợp: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`.
- Response trả về JSON thống nhất.
- Sử dụng HTTP status code phù hợp với kết quả xử lý.
- Các endpoint cần xác thực phải sử dụng JWT authentication middleware.

### 5.2. Quy ước Git

- Không commit file `.env`.
- Không commit thư mục `node_modules`.
- Không commit credentials hoặc dữ liệu nhạy cảm.
- Sử dụng branch riêng cho từng feature.
- Tạo Pull Request để review trước khi merge vào branch chính.

### 5.3. Database Integration

Backend được định hướng tích hợp PostgreSQL 16 và Prisma ORM.

Các thành phần database cần được cấu hình và kiểm chứng trong implementation trước khi sử dụng:

- PostgreSQL connection string (`DATABASE_URL`).
- Prisma schema.
- Database migrations.
- Database seed.
- Database health check.

Các lệnh Docker, Prisma migration và seed chỉ được bổ sung vào hướng dẫn sử dụng sau khi repository có đầy đủ cấu hình và scripts tương ứng.

---

## 6. Kiểm thử & chất lượng mã nguồn

Dự án sử dụng Jest và Supertest cho kiểm thử backend.

Các nhóm kiểm thử chính:

| Test file | Nội dung |
|---|---|
| `health.test.js` | Kiểm tra endpoint `/api/health` và `x-request-id`. |
| `errorHandler.test.js` | Kiểm tra định dạng lỗi và việc ngăn rò rỉ stack trace. |
| `modules.test.js` | Kiểm tra các skeleton endpoints của 7 module nghiệp vụ. |

Trước khi tạo Pull Request, thành viên cần:

1. Chạy `npm test`.
2. Chạy `npm run lint`.
3. Kiểm tra các API liên quan đến feature đang phát triển.
4. Đảm bảo không làm ảnh hưởng đến các module khác.
5. Cập nhật README nếu có thay đổi về cấu hình hoặc cách sử dụng.

---

**UniLib — University Library Management System**

Team T05
