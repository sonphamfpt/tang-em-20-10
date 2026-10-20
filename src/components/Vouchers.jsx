import { useState } from 'react';
import styles from './Vouchers.module.css';

function VoucherModal({ voucher, onClose }) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalIcon}>{voucher.icon}</div>
        <h3 className={styles.modalTitle}>{voucher.title}</h3>
        <p className={styles.modalDesc}>{voucher.desc}</p>
        <div className={styles.stamp}>ĐÃ KÍCH HOẠT ✔</div>
        <button className={styles.closeBtn} onClick={onClose}>
          Em nhận quà này nha! 🥰
        </button>
      </div>
    </div>
  );
}

export default function Vouchers({ vouchers, onRestart }) {
  const [active, setActive] = useState(null);
  const [opened, setOpened] = useState(new Set());

  const open = (i) => {
    setActive(i);
    setOpened(prev => new Set(prev).add(i));
  };

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <div className={styles.badge}>🎁 QUÀ TẶNG ĐẶC BIỆT</div>
        <h2 className={styles.title}>Hộp Phiếu Yêu Thương</h2>
        <p className={styles.sub}>Chạm vào từng phiếu để kích hoạt đặc quyền của em!</p>
      </header>

      <div className={styles.grid}>
        {vouchers.map((v, i) => (
          <button
            key={i}
            className={`${styles.card} ${opened.has(i) ? styles.opened : ''}`}
            onClick={() => open(i)}
            aria-label={`Mở phiếu: ${v.title}`}
          >
            <div className={styles.cardGlow} />
            <span className={styles.cardIcon}>{v.icon}</span>
            <div className={styles.cardInfo}>
              <h3 className={styles.cardTitle}>{v.title}</h3>
              <p className={styles.cardDesc}>{v.desc}</p>
            </div>
            <span className={styles.cardArrow}>{opened.has(i) ? '✅' : '→'}</span>
          </button>
        ))}
      </div>

      <footer className={styles.footer}>
        <div className={styles.roses}>🌹 🌷 🌸 🌺 💐</div>
        <p className={styles.footerText}>Thiết kế bằng cả trái tim 💖</p>
        <button className={styles.restartBtn} onClick={onRestart}>
          💌 Xem lại từ đầu
        </button>
      </footer>

      {active !== null && (
        <VoucherModal
          voucher={vouchers[active]}
          onClose={() => setActive(null)}
        />
      )}
    </div>
  );
}
