# 💌 Món Quà 20/10 Dành Cho Người Yêu (Quét Mã QR)

Trang web thiệp chúc mừng lãng mạn dành riêng cho ngày 20/10 (hoặc kỷ niệm tình yêu), tối ưu hoàn hảo khi quét mã QR trên điện thoại di động!

![Demo Ảnh](assets/couple.jpg)

---

## ✨ Điểm nổi bật
1. **Phong thư 3D tương tác**: Mở đầu bằng một phong thư sang trọng với con dấu sáp hình trái tim, chạm vào để mở quà.
2. **Hiệu ứng pháo hoa & cánh hoa bay 60fps**: Cánh hoa anh đào, ngôi sao lấp lánh và trái tim bay lượn nhẹ nhàng.
3. **Nhạc nền du dương**: Tích hợp sẵn bộ phát giai điệu piano ngọt ngào (Web Audio API) chạy ngay không cần tải file nhạc ngoài.
4. **Ảnh kỷ niệm phong cách Polaroid**: Khung ảnh Polaroid nghiêng nghệ thuật kèm băng dính washi và sticker tim.
5. **Đồng hồ đếm ngày bên nhau**: Đếm chính xác từng ngày, giờ, phút, giây hai bạn yêu nhau.
6. **Thư tình hiệu ứng máy đánh chữ**: Từng câu chữ chân thành hiện lên sống động như đang viết thư tay.
7. **Hộp phiếu quà tặng đặc quyền**: Các voucher dễ thương ("Vé trà sữa full topping", "Vé công chúa 1 ngày", "1000 cái ôm", v.v.) mở ra kèm pháo hoa chúc mừng.
8. **Nút bắn tim yêu thương**: Tương tác chạm để bắn tim bay ngập tràn màn hình.
9. **Tích hợp trang tạo mã QR (`qr.html`)**: Giúp bạn tạo và tải ảnh mã QR xịn xò để in lên thiệp hoặc gửi qua Zalo/Messenger cho người yêu.

---

## 🛠️ Hướng dẫn tùy biến nội dung cực dễ (File `config.js`)

Mở file [`config.js`](config.js) để chỉnh sửa:
- `recipientName`: Tên hoặc biệt danh của người yêu (Ví dụ: "Bé Iu", "Em Yêu", "Công Chúa").
- `senderName`: Tên của bạn (Ví dụ: "Anh của em ❤️").
- `startDate`: Ngày bắt đầu yêu nhau (Ví dụ: `"2024-02-14"`). Nếu không muốn hiện đếm ngày thì để trống `""`.
- `letter`: Nội dung bức thư tình (mỗi dòng là một đoạn văn).
- `photoUrl`: Đường dẫn ảnh của hai bạn (đặt ảnh vào thư mục `assets/` rồi đổi tên ở đây).
- `vouchers`: Các phiếu quà tặng hoặc lời hứa bất ngờ.

---

## 🚀 Hướng Dẫn Deploy Lên GitHub Pages (Miễn Phí 100%)

Chỉ cần làm theo 3 bước đơn giản:

### Bước 1: Tạo Repository mới trên GitHub
1. Truy cập [github.com/new](https://github.com/new).
2. Đặt tên Repository (ví dụ: `tang-em-yeu-20-10` hoặc `qua-tang-20-10`).
3. Chọn chế độ **Public**, sau đó nhấn **Create repository**.

### Bước 2: Đẩy mã nguồn lên GitHub
Mở Terminal / PowerShell tại thư mục này và chạy các lệnh:
```bash
git add .
git commit -m "Qua tang 20/10 danh cho nguoi yeu"
git branch -M main
git remote add origin https://github.com/<USERNAME-CUA-BAN>/<TEN-REPO-CUA-BAN>.git
git push -u origin main
```
*(Thay `<USERNAME-CUA-BAN>` và `<TEN-REPO-CUA-BAN>` bằng tài khoản GitHub của bạn)*

### Bước 3: Bật GitHub Pages
1. Tại trang Repository trên GitHub, vào tab **Settings** (Cài đặt) -> chọn mục **Pages** ở menu bên trái.
2. Tại mục **Branch**, chọn `main` và thư mục `/ (root)`, sau đó nhấn **Save**.
3. Chờ khoảng 1-2 phút, GitHub sẽ cung cấp cho bạn một đường link trang web dạng:
   `https://<username>.github.io/<ten-repo>/`

---

## 📱 Tạo Mã QR để người yêu quét trên điện thoại

1. Mở file [`qr.html`](qr.html) trên trình duyệt (hoặc truy cập `https://<username>.github.io/<ten-repo>/qr.html`).
2. Dán đường link web của bạn vào ô nhập.
3. Nhấn **"Tải ảnh Mã QR về máy"** để lưu ảnh mã QR và in ra hoặc gửi cho người ấy!
