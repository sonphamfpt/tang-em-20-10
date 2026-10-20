// ==========================================
// CẤU HÌNH THÔNG TIN DÀNH CHO NGƯỜI YÊU (20/10)
// Bạn có thể chỉnh sửa các nội dung dưới đây tùy thích!
// ==========================================

const LOVE_CONFIG = {
    // Tên / Biệt danh của người yêu
    recipientName: "Bé Iu Của Anh",
    senderName: "Anh yêu của em ❤️",
    
    // Tiêu đề ngày lễ
    badgeTitle: "✨ Happy Vietnamese Women's Day 20/10 ✨",
    mainHeading: "Chúc Mừng Ngày 20/10!",

    // Ngày bắt đầu yêu nhau (Định dạng: YYYY-MM-DD)
    // Nếu để trống thì sẽ tự động ẩn phần đếm ngày
    startDate: "2024-02-14", 

    // Ảnh hiển thị (mặc định dùng ảnh cặp đôi ngọt ngào trong assets/couple.jpg)
    // Bạn có thể thay bằng ảnh thật của hai bạn bằng cách chép ảnh vào thư mục assets/ và đổi tên ở đây
    photoUrl: "assets/couple.jpg",
    photoCaption: "Khoảnh khắc ngọt ngào bên em 💕",

    // Thư tình / Lời chúc (sẽ gõ hiệu ứng máy đánh chữ cực mượt mà)
    letter: [
        "Gửi em — cô gái đáng yêu và dịu dàng nhất bước vào cuộc đời anh...",
        "Hôm nay là ngày 20/10, ngày đặc biệt dành riêng cho một nửa thế giới xinh đẹp, và với anh, em chính là người phụ nữ tuyệt vời nhất, quý giá nhất.",
        "Cảm ơn em vì đã luôn ở bên cạnh anh, mang đến những nụ cười tỏa nắng làm bừng sáng cả những ngày tháng êm đềm.",
        "Chúc cô công chúa của anh luôn rạng rỡ, bình an, gặp nhiều may mắn và luôn được nâng niu, yêu thương thật nhiều. Hãy nhớ rằng bất kể lúc nào, anh cũng luôn ở phía sau chở che và ủng hộ em.",
        "Yêu em nhiều hơn cả ngày hôm qua, và ít hơn ngày mai! 💖"
    ],

    // Danh sách "Phiếu quà tặng / Lời hứa đặc biệt" để người yêu chạm vào mở quà
    vouchers: [
        {
            icon: "🧋",
            title: "Vé Trà Sữa Full Topping",
            desc: "Áp dụng bất kỳ lúc nào em thèm. Anh ship tận nơi hoặc đưa em đi uống liền!",
            code: "MILKTEA-VIP-INFINITY"
        },
        {
            icon: "👑",
            title: "Vé Công Chúa 1 Ngày",
            desc: "Mọi lời em nói hôm nay là mệnh lệnh, anh tuân theo không được cãi nửa lời!",
            code: "QUEEN-FOR-A-DAY"
        },
        {
            icon: "🛵",
            title: "Vé Lượn Phố & Ăn Sập Quán",
            desc: "Cùng em vi vu hóng gió đêm, ăn tất cả món ngon em thích không lo béo.",
            code: "RIDE-NIGHT-FOOD"
        },
        {
            icon: "🫂",
            title: "Vé Ôm Ấm Áp Không Giới Hạn",
            desc: "1000 cái ôm ấm áp và bờ vai sẵn sàng lắng nghe mọi tâm sự mỗi khi em mệt mỏi.",
            code: "WARM-HUG-UNLIMITED"
        },
        {
            icon: "🥺",
            title: "Vé Miễn Trừ Giận Dỗi",
            desc: "Dùng để hòa giải tức thì nếu anh lỡ làm em hờn dỗi hoặc buồn lòng.",
            code: "FORGIVE-ME-LOVE"
        },
        {
            icon: "💍",
            title: "Vé Trọn Đời Bên Nhau",
            desc: "Cam kết yêu thương, chăm sóc và cùng em viết tiếp những câu chuyện tương lai.",
            code: "FOREVER-AND-ALWAYS"
        }
    ],

    // Nhạc nền (Tự động phát giai điệu piano ngọt ngào, hoặc bạn có thể chèn link mp3)
    musicUrl: "" // Để trống để dùng bộ phát nhạc piano synth lãng mạn tích hợp sẵn không cần tải file!
};
