# UniLib — Backend Server (`src/server`)

Hệ thống Backend REST API cho dự án **UniLib (University Library Management System)**.  
Được xây dựng trên nền tảng **Node.js 22 LTS**, **Express.js (ECMAScript Modules - ESM)**, sẵn sàng kết nối **PostgreSQL 16** với **Prisma ORM**.

---

## 1. Hướng dẫn cài đặt & Khởi chạy

### 1.1 Yêu cầu môi trường
* Node.js $\ge$ 20.x (khuyến nghị Node.js 22 LTS)
* npm $\ge$ 10.x

### 1.2 Cài đặt dependencies
```bash
cd src/server
npm ci
```

### 1.3 Cấu hình biến môi trường
Tạo file `.env` từ template `.env.example`:
```bash
cp .env.example .env
```
Các biến môi trường mặc định:
* `PORT`: Cổng dịch vụ (mặc định: `4000`)
* `NODE_ENV`: Môi trường (`development`, `test`, `production`)
* `DATABASE_URL`: Chuỗi kết nối PostgreSQL 16
* `JWT_SECRET`: Khóa ký JWT
* `CORS_ORIGIN`: Địa chỉ frontend client (`http://localhost:5173`)

### 1.4 Khởi chạy server
* **Chế độ phát triển (Hot reload với nodemon):**
  ```bash
  npm run dev
  ```
  Server sẽ lắng nghe tại `http://localhost:4000`.

* **Chế độ production:**
  ```bash
  npm start
  ```

### 1.5 Kiểm tra Health Check
```bash
curl http://localhost:4000/api/health
```
Phản hồi mẫu:
```json
{
  "status": "ok",
  "db": "down"
}
```
*(Ghi chú: Endpoint luôn trả HTTP 200 ngay cả khi chưa kết nối database hoặc trên máy sạch sau `npm ci`).*

### 1.6 Kiểm thử & Linter
```bash
# Chạy bộ test tự động (Jest + Supertest)
npm test

# Kiểm tra cú pháp và quy chuẩn mã nguồn (ESLint)
npm run lint
```

---

## 2. Cấu trúc thư mục & Quy ước Module

Toàn bộ logic nghiệp vụ được tổ chức theo kiến trúc phân tầng chuẩn (**3-Layer Architecture**):  
`Routes (Định tuyến & Parse HTTP)` $\rightarrow$ `Controller (Điều phối request & HTTP status)` $\rightarrow$ `Service (Nghiệp vụ, Business Rules & Data access)`.

```text
src/server/
├── .env.example            # Template biến môi trường
├── README.md               # Tài liệu hướng dẫn backend
├── package.json            # Cấu hình dependencies & scripts (type: module)
├── app.js                  # Cấu hình Express app, middleware, mount routers
├── server.js               # Điểm khởi chạy HTTP server, graceful shutdown
├── config/
│   └── env.js              # Parse, validate & freeze biến môi trường
├── src/
│   ├── config/
│   │   └── dbHealth.js     # Kiểm tra kết nối database resiliency
│   ├── middlewares/        # Middlewares dùng chung
│   │   ├── requestId.js    # Gán x-request-id duy nhất
│   │   ├── errorHandler.js # Bắt lỗi toàn cục, chuẩn hóa format lỗi
│   │   ├── notFound.js     # Bắt 404 cho route không tồn tại
│   │   └── index.js
│   └── modules/            # 7 Module nghiệp vụ theo SRS PA2 (F01–F07)
│       ├── auth/           # F01: Đăng nhập, JWT session, me, logout
│       ├── users/          # F01: Quản trị tài khoản, phân quyền, trạng thái
│       ├── books/          # F02 & F04: Danh mục đầu sách, tìm kiếm & duyệt sách
│       ├── copies/         # F03: Quản lý bản sao vật lý, mã vạch, vị trí kệ
│       ├── loans/          # F05: Mượn sách, trả sách, gia hạn, kiểm tra quá hạn
│       ├── reservations/   # F06: Đặt trước sách (Hold queue FIFO 72h)
│       └── dashboard/      # F07: Bảng điều khiển bạn đọc & thủ thư
└── tests/                  # Bộ test tự động (Jest + Supertest)
    ├── health.test.js      # Kiểm tra /api/health và x-request-id
    ├── errorHandler.test.js# Kiểm tra format lỗi và chặn rò rỉ stack trace
    └── modules.test.js     # Kiểm tra skeleton endpoints của 7 module
```

---

## 3. Bảng ánh xạ Module với SRS PA2 (F01–F07)

| Module | Feature SRS | Use Cases | Screens | Trách nhiệm chính |
| :--- | :---: | :---: | :---: | :--- |
| **`auth`** | F01 *(Must)* | `UC-01` | `SCR-01` | Xác thực đăng nhập, phát hành JWT token, phân quyền RBAC (Reader, Librarian, Administrator), đăng xuất. |
| **`users`** | F01 *(Must)* | `UC-02` | `SCR-02` | CRUD tài khoản người dùng, kích hoạt/vô hiệu hóa tài khoản (`ACTIVE`/`INACTIVE`). |
| **`books`** | F02 & F04 *(Must)* | `UC-03`, `UC-05`, `UC-06` | `SCR-03`, `SCR-05`, `SCR-06` | Quản lý thông tin đầu sách (ISBN, Title, Author), tìm kiếm đa tiêu chí, phân trang server-side (`NFR-01`), thống kê số lượng bản sao khả dụng. |
| **`copies`** | F03 *(Must)* | `UC-04` | `SCR-04` | Quản lý bản sao vật lý, mã vạch (Barcode), vị trí kệ, cập nhật tình trạng, chặn xóa bản sao đang mượn/đặt trước (`BR-09`). |
| **`loans`** | F05 *(Must)* | `UC-07`, `UC-08`, `UC-09` | `SCR-07`, `SCR-08`, `SCR-11` | Mượn sách (tối đa 3 cuốn `BR-01`, thời hạn 14 ngày `BR-02`), trả sách (điều phối giữ chỗ `BR-08`), gia hạn 1 lần (`BR-03`), giám sát quá hạn (`BR-04`). |
| **`reservations`** | F06 *(Must)* | `UC-10`, `UC-11` | `SCR-09`, `SCR-10`, `SCR-11` | Đặt trước khi 0 bản sao khả dụng (`BR-05`), tối đa 2 lượt (`BR-06`), hàng đợi FIFO (`BR-07`), thời hạn nhận sách 72 giờ (`BR-08`). |
| **`dashboard`** | F07 *(Should)* | `UC-12` | `SCR-11`, `SCR-12` | Bảng điều khiển bạn đọc (sách đang mượn, hạn trả, cảnh báo quá hạn) và bàn điều khiển thủ thư (danh sách quá hạn, thông tin độc giả). |

---

## 4. Quy ước Chuẩn hóa Lỗi (Error Handling Format)

Tất cả các response lỗi từ hệ thống UniLib **bắt buộc** trả về định dạng JSON thống nhất qua middleware `errorHandler`:

```json
{
  "error": {
    "code": "STRING_ERROR_CODE",
    "message": "Thông điệp mô tả lỗi thân thiện",
    "details": null
  }
}
```

### 4.1 Bảng mã lỗi thường dùng
* `NOT_FOUND` (404): Endpoint hoặc tài nguyên không tồn tại.
* `VALIDATION_ERROR` (400): Dữ liệu gửi lên không hợp lệ hoặc thiếu trường bắt buộc.
* `UNAUTHORIZED` (401): Chưa đăng nhập hoặc token không hợp lệ / hết hạn (`NFR-04`).
* `FORBIDDEN` (403): Người dùng không có quyền truy cập endpoint tương ứng (`NFR-04`).
* `POLICY_CONFLICT` / `STATE_CONFLICT` (409): Xung đột trạng thái nghiệp vụ (vi phạm `BR-01`, `BR-04`, `BR-09`).
* `INTERNAL_ERROR` (500): Lỗi hệ thống ngoài dự kiến.

### 4.2 An toàn & Bảo mật
* **Tuyệt đối không lộ `stack` trace** hoặc thông tin hạ tầng nội bộ ra JSON phản hồi cho client.
* Chi tiết stack trace được ghi log tập trung tại server-side kèm theo `requestId` để phục vụ điều tra sự cố.
