# Báo cáo Bàn giao Kỹ thuật W2 (Handoff Report W2) — [TASK_ID]

> **Quy định sử dụng:** Mọi thành viên nhóm T05 (Vinh, Quân, Nguyên, Ánh) khi hoàn thành bất kỳ task nào trong tuần W2 (D1 28/11 → D7 04/12) **bắt buộc** phải tạo file bàn giao tương ứng theo mẫu này tại thư mục `src/W2/<TASK_ID>.md` (ví dụ: `src/W2/V1-W2.md`, `src/W2/Q1-W2.md`, `src/W2/N1-W2.md`, `src/W2/A1-W2.md`).
> File này là **minh chứng duy nhất (Evidence)** được dẫn link trực tiếp vào bảng Đánh giá Đóng góp Thành viên (§1 Member Contribution Assessment) của tài liệu báo cáo PA4 (`pa/PA4/PA4-TestPlan-TestCases.docx`).

---

## Thông tin Chung (Metadata)

* **Mã công việc (Task ID):** `[Mã_Task, ví dụ: V1-W2, Q1-W2, N1-W2, A1-W2]`
* **Tên công việc:** `[Tên ngắn gọn, rõ ràng theo kế hoạch W2]`
* **Thời gian thực hiện:** `[Ngày bắt đầu] → [Ngày kết thúc] · [Số giờ code + Số giờ docs]`
* **Người thực hiện (Owner):** `[Họ tên thành viên — MSSV — Vai trò]`
* **Người phản biện (Peer Reviewer):** `[Họ tên thành viên review chéo — MSSV]`
* **Trạng thái:** `[Hoàn thành 100% / Chờ Review / Partial / Blocked]`
* **Tài liệu căn cứ & Phụ thuộc (Dependencies):**
  * Yêu cầu: `[FR-xxx, BR-xxx, NFR-xxx, Use Case, Screen ID liên quan]`
  * Task tiền đề: `[Các task W1 hoặc W2 phải hoàn thành trước]`
  * Branch Git & PR: `[Tên branch] · [PR #link]`

---

## 1. Mục tiêu Công việc (Goal)

* [Mục tiêu 1: Nêu rõ kết quả cần đạt về mặt tính năng/mã nguồn]
* [Mục tiêu 2: Nêu rõ kết quả cần đạt về mặt tài liệu/test case PA4]
* [Mục tiêu 3: Điều kiện nghiệm thu (Acceptance Criteria)]

---

## 2. Chi tiết Triển khai & Kết quả (Implementation & Results)

### 2.1 Mã nguồn & Kỹ thuật (Code Implementation)
* **Kiến trúc & Phân tầng:** [Mô tả thay đổi tại router, controller, service, middleware hoặc React component/hook]
* **Logic xử lý cốt lõi:** [Mô tả chi tiết thuật toán, transactional boundary, locking order, validation, error mapping]
* **Khớp nối API Contract:** [Xác nhận việc tuân thủ docs/api/contract-w2.md, các endpoint và payload đã nối]

### 2.2 Tài liệu PA4 (Documentation Contribution)
* [Mô tả phần mục tài liệu PA4 đã soạn thảo hoặc cập nhật: Mục số mấy, file markdown nguồn nào trong docs/pa4/]

---

## 3. Danh sách File Thay đổi / Tạo mới (File Changes)

| Đường dẫn file | Loại thay đổi (`Tạo mới` / `Cập nhật` / `Xóa`) | Mô tả chi tiết thay đổi |
| :--- | :---: | :--- |
| `path/to/file1` | Tạo mới | Mô tả nội dung file |
| `path/to/file2` | Cập nhật | Thêm logic X, sửa lỗi Y |

---

## 4. Bằng chứng Kiểm chứng (Verification Evidence)

### 4.1 Lệnh chạy & Quy trình Kiểm thử (How to Run & Verify)
```bash
# Ghi lại các câu lệnh chính xác để người phản biện có thể chạy lại
cd src/server
npm test
```

### 4.2 Kết quả Kiểm thử Thực tế (Automated & Manual Test Output)
* **Kết quả Unit / Integration Test:**
  * Lần chạy 1: `[Số test suite passed/total, số tests passed/total, thời gian chạy]`
  * Lần chạy 2: `[Số test suite passed/total, số tests passed/total, thời gian chạy]`
* **Kiểm tra Linter:** `npm run lint` → `0 errors, 0 warnings`
* **Xác minh chức năng thực tế (Smoke / Manual):** [Mô tả kịch bản test bằng Postman/curl hoặc trên UI trình duyệt]

---

## 5. Vấn đề Tồn đọng & Rủi ro (Pending Issues & Risks)

* **Tồn đọng (Limitations):** [Các trường hợp biên chưa cover, tính năng phụ hoãn lại, hoặc cần mock]
* **Rủi ro (Risks):** [Rủi ro ảnh hưởng tới các thành viên khác, rủi ro vỡ API contract, rủi ro deadline]
* **Biện pháp giảm thiểu (Mitigation):** [Giải pháp xử lý hoặc ghi chú cho người nhận bàn giao]

---

## 6. Người Tiếp nhận & Chuyển giao (Consumer & Downstream Handoff)

* **Thành viên nhận tiếp theo (Consumer):** `[Tên thành viên: Vinh / Quân / Nguyên / Ánh]`
* **Đầu vào chuyển giao cho họ:** `[Endpoint nào đã sẵn sàng / Mock nào cần thay / Props nào cần truyền]`
* **Lưu ý đặc biệt khi tích hợp:** [Token header, định dạng ngày tháng ISO, query param...]

---

## 7. Nhật ký Sử dụng AI (AI Usage Log)

> Tuân thủ chính sách liêm chính học thuật FIT HCMUS và hướng dẫn PA4: Mọi sự hỗ trợ từ công cụ GenAI (ChatGPT, Claude, Gemini, Copilot...) đều phải được kê khai trung thực.

| # | Công cụ AI | Tác vụ / Mục đích sử dụng | Câu lệnh chính (Prompt tóm tắt) | Đánh giá & Hiệu chỉnh của con người (How verified/changed) |
| :-: | :--- | :--- | :--- | :--- |
| 1 | `[Ví dụ: Gemini 2.5 Pro / Claude 3.5 Sonnet]` | `[Ví dụ: Sinh khung mã nguồn controller / Soạn thảo bảng gap]` | `"[Mô tả ngắn gọn yêu cầu prompt]"` | `[Đã rà soát lại từng dòng code, chạy Jest test xác minh, sửa các lỗi shape payload]"` |

---

## 8. Ký xác nhận & Nghiệm thu (Review & Sign-off)

* **Người thực hiện ký tên:** `[Họ tên] — Ngày [DD/MM/YYYY]`
* **Người phản biện xác nhận:** `[Họ tên] — Đã review code & docs qua PR #[số_PR] — Đạt yêu cầu`
