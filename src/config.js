// ================================================
//  ĐÂY LÀ FILE CONFIG — CHỈNH SỬA NỘI DUNG Ở ĐÂY
//  Bạn có thể thêm ảnh, tên, lời chúc, voucher...
// ================================================

export const config = {
  // ── Tên gọi ──────────────────────────────────
  senderName:    'Anh yêu',
  recipientName: 'Em yêu của anh',

  // ── Ngày bắt đầu yêu (để đếm số ngày) ───────
  // Để '' để ẩn đồng hồ đếm ngày
  startDate: '2024-02-14',

  // ── SLIDESHOW ẢNH ─────────────────────────────
  // Thêm ảnh của hai bạn vào thư mục public/photos/
  // rồi điền tên file vào dưới đây. Caption tuỳ ý!
  // Nếu chưa có ảnh thật, để mặc định ảnh minh hoạ.
  photos: [
    {
      src:     '/couple.jpg',      // Ảnh mặc định (minh hoạ)
      caption: 'Khoảnh khắc ngọt ngào bên nhau 🌅',
    },
    // Ví dụ thêm ảnh thật:
    // { src: '/photos/anh1.jpg', caption: 'Chuyến đi Đà Lạt tháng 3 🌿' },
    // { src: '/photos/anh2.jpg', caption: 'Sinh nhật em năm ngoái 🎂' },
    // { src: '/photos/anh3.jpg', caption: 'Buổi chiều ở The Coffee House ☕' },
  ],

  // ── Thư tình ─────────────────────────────────
  letter: [
    'Gửi em — cô gái dịu dàng và đáng yêu nhất bước vào cuộc đời anh…',
    'Hôm nay là ngày 20/10, ngày dành riêng cho những người phụ nữ đặc biệt. Với anh, em chính là người phụ nữ tuyệt vời nhất, quý giá nhất.',
    'Cảm ơn em vì những nụ cười tỏa nắng làm bừng sáng cả những ngày tháng êm đềm. Vì đã luôn ở bên cạnh anh, dù là những lúc vui hay những lúc anh im lặng.',
    'Chúc công chúa của anh luôn rạng rỡ, bình an, và nhớ rằng — bất kể lúc nào, anh luôn ở phía sau chở che em.',
    'Yêu em hơn tất cả 💖',
  ],

  // ── Vouchers / Phiếu quà tặng ─────────────────
  vouchers: [
    { icon: '🧋', title: 'Vé Trà Sữa Full Topping',      desc: 'Áp dụng bất kỳ lúc nào em thèm. Ship ngay không cần hỏi.' },
    { icon: '👑', title: 'Vé Công Chúa Cả Ngày',         desc: 'Mọi lời em nói hôm nay đều là mệnh lệnh tối cao!' },
    { icon: '🛵', title: 'Vé Lượn Phố & Ăn Sập Quán',    desc: 'Vi vu hóng gió, ăn tất cả món ngon em thích, không lo béo.' },
    { icon: '🫂', title: 'Vé Ôm Không Giới Hạn',         desc: '1000 cái ôm ấm áp và bờ vai luôn sẵn sàng lắng nghe.' },
    { icon: '🎬', title: 'Vé Xem Phim & Gọi Đồ Ăn',      desc: 'Chọn phim em muốn, anh lo đồ ăn, nằm sofa cả chiều.' },
    { icon: '💍', title: 'Vé Trọn Đời Bên Nhau',         desc: 'Yêu thương, chăm sóc và cùng nhau viết những trang tiếp theo.' },
  ],
};
