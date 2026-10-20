import { useState, useEffect, useRef } from 'react';
import styles from './PhotoSlideshow.module.css';

export default function PhotoSlideshow({ photos, onFinish }) {
  const [current, setCurrent] = useState(0);
  const [phase, setPhase] = useState('enter');   // enter | show | exit
  const [captionVisible, setCaptionVisible] = useState(false);
  const [uploadedPhotos, setUploadedPhotos] = useState(photos);
  const [showUpload, setShowUpload] = useState(false);
  const fileInputRef = useRef(null);
  const timerRef = useRef(null);

  const total = uploadedPhotos.length;

  // Orchestrate each slide
  useEffect(() => {
    setPhase('enter');
    setCaptionVisible(false);
    let cancelled = false;

    // Show caption after image enters
    const t1 = setTimeout(() => { if (!cancelled) setCaptionVisible(true); }, 600);

    // Start exit phase before advancing
    const t2 = setTimeout(() => { if (!cancelled) setPhase('exit'); }, 3800);

    // Advance or finish
    const t3 = setTimeout(() => {
      if (cancelled) return;
      if (current < total - 1) {
        setCurrent(c => c + 1);
      } else {
        timerRef.current = setTimeout(() => { if (!cancelled) onFinish(); }, 500);
      }
    }, 4400);

    return () => { cancelled = true; clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [current, total]);


  useEffect(() => () => clearTimeout(timerRef.current), []);

  // Handle user photo upload
  const handleUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    const newPhotos = files.map(f => ({
      src: URL.createObjectURL(f),
      caption: f.name.replace(/\.[^/.]+$/, ''), // use filename without extension as caption
    }));
    setUploadedPhotos(prev => [...newPhotos, ...prev]);
    setCurrent(0);
    setShowUpload(false);
  };

  const photo = uploadedPhotos[current];

  return (
    <div className={styles.root}>
      {/* Upload overlay button */}
      {showUpload ? (
        <div className={styles.uploadPanel}>
          <p className={styles.uploadTitle}>Thêm ảnh của hai bạn 📸</p>
          <p className={styles.uploadSub}>Chọn nhiều ảnh cùng lúc để tạo slideshow</p>
          <label className={styles.uploadLabel} htmlFor="photo-upload">
            Chọn ảnh từ máy
          </label>
          <input
            id="photo-upload"
            type="file"
            accept="image/*"
            multiple
            className={styles.uploadInput}
            ref={fileInputRef}
            onChange={handleUpload}
          />
          <button className={styles.cancelBtn} onClick={() => setShowUpload(false)}>
            Huỷ
          </button>
        </div>
      ) : (
        <>
          {/* Step indicators */}
          <div className={styles.dots} aria-label="Tiến trình slideshow">
            {uploadedPhotos.map((_, i) => (
              <span
                key={i}
                className={`${styles.dot} ${i === current ? styles.dotActive : ''} ${i < current ? styles.dotDone : ''}`}
              />
            ))}
          </div>

          {/* Main photo */}
          <div className={`${styles.slide} ${styles[phase]}`}>
            <div className={styles.imgWrapper}>
              <img
                src={photo.src}
                alt={photo.caption}
                className={styles.img}
              />
              <div className={styles.imgOverlay} />
            </div>

            {/* Caption */}
            <div className={`${styles.caption} ${captionVisible ? styles.captionIn : ''}`}>
              <span className={styles.captionText}>{photo.caption}</span>
            </div>
          </div>

          {/* Counter & upload button */}
          <div className={styles.bottomBar}>
            <span className={styles.counter}>{current + 1} / {total}</span>
            <button
              className={styles.addPhotoBtn}
              onClick={() => setShowUpload(true)}
              aria-label="Thêm ảnh"
            >
              + Thêm ảnh của em
            </button>
            {current < total - 1 && (
              <button
                className={styles.skipBtn}
                onClick={() => setCurrent(c => c + 1)}
                aria-label="Ảnh tiếp theo"
              >
                Tiếp →
              </button>
            )}
            {current === total - 1 && (
              <button
                className={styles.skipBtn}
                onClick={onFinish}
                aria-label="Đọc thư"
              >
                Đọc thư 💌
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
