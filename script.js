/* ===================================================
   ROMANTIC 20/10 GREETING - JAVASCRIPT LOGIC & EFFECTS
   =================================================== */

(function () {
    'use strict';

    // DOM Elements
    const bgCanvas = document.getElementById('bg-canvas');
    const ctx = bgCanvas.getContext('2d');
    const envelopeScreen = document.getElementById('envelopeScreen');
    const contentScreen = document.getElementById('contentScreen');
    const envelope = document.getElementById('envelope');
    const waxSeal = document.getElementById('waxSeal');
    const musicToggle = document.getElementById('musicToggle');
    const musicDisc = document.getElementById('musicDisc');
    const musicLabel = document.getElementById('musicLabel');
    const btnLoveBomb = document.getElementById('btnLoveBomb');
    const heartTally = document.getElementById('heartTally');
    const btnReopen = document.getElementById('btnReopen');
    const polaroidCard = document.getElementById('polaroidCard');

    // Modal elements
    const voucherModal = document.getElementById('voucherModal');
    const modalOverlay = document.getElementById('modalOverlay');
    const modalIcon = document.getElementById('modalIcon');
    const modalTitle = document.getElementById('modalTitle');
    const modalDesc = document.getElementById('modalDesc');
    const modalCode = document.getElementById('modalCode');
    const btnModalClose = document.getElementById('btnModalClose');

    let isOpened = false;
    let isMusicPlaying = false;
    let audioContext = null;
    let musicInterval = null;
    let customAudio = null;
    let heartCount = 99;

    // ===================================================
    // 1. POPULATE CONTENT FROM CONFIG
    // ===================================================
    function applyConfig() {
        if (typeof LOVE_CONFIG === 'undefined') return;

        // Names & Headings
        const introTag = document.getElementById('introRecipientTag');
        if (introTag) introTag.textContent = `Gửi ${LOVE_CONFIG.recipientName}`;

        const badgeTitle = document.getElementById('badgeTitle');
        if (badgeTitle && LOVE_CONFIG.badgeTitle) badgeTitle.textContent = LOVE_CONFIG.badgeTitle;

        const mainHeading = document.getElementById('mainHeading');
        if (mainHeading && LOVE_CONFIG.mainHeading) mainHeading.textContent = LOVE_CONFIG.mainHeading;

        const letterRecipient = document.getElementById('letterRecipient');
        if (letterRecipient) letterRecipient.textContent = LOVE_CONFIG.recipientName;

        const senderSignature = document.getElementById('senderSignature');
        if (senderSignature && LOVE_CONFIG.senderName) senderSignature.textContent = LOVE_CONFIG.senderName;

        // Photo & Caption
        const loverPhoto = document.getElementById('loverPhoto');
        if (loverPhoto && LOVE_CONFIG.photoUrl) loverPhoto.src = LOVE_CONFIG.photoUrl;

        const photoCaption = document.getElementById('photoCaption');
        if (photoCaption && LOVE_CONFIG.photoCaption) photoCaption.textContent = LOVE_CONFIG.photoCaption;

        // Vouchers
        renderVouchers();

        // Days Counter
        setupCounter();
    }

    // ===================================================
    // 2. ROMANTIC AMBIENT PARTICLES (SAKURA & HEARTS)
    // ===================================================
    let particles = [];
    const PARTICLE_COUNT = 38;

    function resizeCanvas() {
        bgCanvas.width = window.innerWidth;
        bgCanvas.height = window.innerHeight;
    }

    class RomanticParticle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * bgCanvas.width;
            this.y = Math.random() * -bgCanvas.height;
            this.size = Math.random() * 12 + 8;
            this.speedY = Math.random() * 1.2 + 0.8;
            this.speedX = Math.sin(Math.random() * Math.PI) * 1 - 0.5;
            this.rotation = Math.random() * 360;
            this.rotSpeed = (Math.random() - 0.5) * 2;
            this.opacity = Math.random() * 0.5 + 0.3;
            // Types: 0: Sakura petal, 1: Heart, 2: Sparkle star
            this.type = Math.random() > 0.4 ? 0 : (Math.random() > 0.5 ? 1 : 2);
            this.sway = Math.random() * 2;
            this.swaySpeed = Math.random() * 0.02 + 0.01;
            this.swayPhase = Math.random() * Math.PI * 2;
        }

        update() {
            this.y += this.speedY;
            this.swayPhase += this.swaySpeed;
            this.x += Math.sin(this.swayPhase) * this.sway + this.speedX;
            this.rotation += this.rotSpeed;

            if (this.y > bgCanvas.height + 20) {
                this.reset();
                this.y = -20;
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate((this.rotation * Math.PI) / 180);
            ctx.globalAlpha = this.opacity;

            if (this.type === 0) {
                // Sakura Petal
                ctx.fillStyle = '#ffb3c6';
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.bezierCurveTo(-this.size / 2, -this.size / 2, -this.size / 2, this.size / 2, 0, this.size);
                ctx.bezierCurveTo(this.size / 2, this.size / 2, this.size / 2, -this.size / 2, 0, 0);
                ctx.fill();
            } else if (this.type === 1) {
                // Floating Mini Heart
                ctx.fillStyle = '#ff4d6d';
                ctx.beginPath();
                const d = this.size * 0.6;
                ctx.moveTo(0, d / 4);
                ctx.quadraticCurveTo(0, 0, d / 4, 0);
                ctx.quadraticCurveTo(d / 2, 0, d / 2, d / 4);
                ctx.quadraticCurveTo(d / 2, 0, (3 * d) / 4, 0);
                ctx.quadraticCurveTo(d, 0, d, d / 4);
                ctx.quadraticCurveTo(d, d / 2, (3 * d) / 4, (3 * d) / 4);
                ctx.lineTo(d / 2, d);
                ctx.lineTo(0, (3 * d) / 4);
                ctx.fill();
            } else {
                // Sparkle Star
                ctx.fillStyle = '#ffd166';
                ctx.beginPath();
                ctx.arc(0, 0, this.size * 0.2, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        }
    }

    function initParticles() {
        resizeCanvas();
        particles = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const p = new RomanticParticle();
            p.y = Math.random() * bgCanvas.height;
            particles.push(p);
        }
        animateParticles();
    }

    function animateParticles() {
        ctx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }
        requestAnimationFrame(animateParticles);
    }

    window.addEventListener('resize', resizeCanvas);

    // ===================================================
    // 3. ROMANTIC MELODY GENERATOR (WEB AUDIO API)
    // ===================================================
    // Plays a sweet, ethereal music box / soft piano melody without needing external audio files!
    function initMelodySynth() {
        if (LOVE_CONFIG.musicUrl && LOVE_CONFIG.musicUrl.trim() !== '') {
            // Use custom audio file
            if (!customAudio) {
                customAudio = new Audio(LOVE_CONFIG.musicUrl);
                customAudio.loop = true;
            }
            return;
        }

        // Web Audio API Synth
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        if (!audioContext) {
            audioContext = new AudioCtx();
        }
    }

    // Romantic chord progression (Canon in D / River Flows in You inspired frequencies)
    const melodyNotes = [
        // Chord 1 (D major)
        587.33, 440.00, 293.66, 739.99,
        // Chord 2 (A major)
        440.00, 329.63, 659.25, 554.37,
        // Chord 3 (B minor)
        493.88, 369.99, 587.33, 739.99,
        // Chord 4 (F# minor)
        369.99, 277.18, 554.37, 659.25,
        // Chord 5 (G major)
        392.00, 293.66, 587.33, 783.99,
        // Chord 6 (D major)
        293.66, 440.00, 587.33, 739.99,
        // Chord 7 (G major)
        392.00, 493.88, 587.33, 783.99,
        // Chord 8 (A major)
        440.00, 554.37, 659.25, 880.00
    ];

    let noteIndex = 0;

    function playSynthTone(freq) {
        if (!audioContext) return;
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }

        const now = audioContext.currentTime;

        // Primary bell / piano tone (Sine + Triangle blend)
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();

        // Soft filter for warm acoustic feel
        const filter = audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1400, now);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        // Envelope: gentle bell curve
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.14, now + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(audioContext.destination);

        osc.start(now);
        osc.stop(now + 1.9);
    }

    function startMusic() {
        if (isMusicPlaying) return;

        if (LOVE_CONFIG.musicUrl && LOVE_CONFIG.musicUrl.trim() !== '') {
            if (!customAudio) customAudio = new Audio(LOVE_CONFIG.musicUrl);
            customAudio.play().then(() => {
                isMusicPlaying = true;
                updateMusicUI(true);
            }).catch(e => console.log('Audio autoplay prevented:', e));
            return;
        }

        initMelodySynth();
        if (audioContext && audioContext.state === 'suspended') {
            audioContext.resume();
        }

        isMusicPlaying = true;
        updateMusicUI(true);

        // Play musical notes gently every 480ms
        musicInterval = setInterval(() => {
            const freq = melodyNotes[noteIndex];
            playSynthTone(freq);
            noteIndex = (noteIndex + 1) % melodyNotes.length;
        }, 480);
    }

    function stopMusic() {
        if (!isMusicPlaying) return;
        isMusicPlaying = false;
        updateMusicUI(false);

        if (customAudio) {
            customAudio.pause();
        }

        if (musicInterval) {
            clearInterval(musicInterval);
            musicInterval = null;
        }
    }

    function toggleMusic() {
        if (isMusicPlaying) {
            stopMusic();
        } else {
            startMusic();
        }
    }

    function updateMusicUI(playing) {
        if (playing) {
            musicDisc.classList.add('spinning');
            musicLabel.textContent = 'Đang phát';
            musicToggle.style.borderColor = 'var(--primary)';
        } else {
            musicDisc.classList.remove('spinning');
            musicLabel.textContent = 'Phát nhạc';
            musicToggle.style.borderColor = 'rgba(255, 255, 255, 0.25)';
        }
    }

    // ===================================================
    // 4. OPENING ENVELOPE & CELEBRATION EFFECTS
    // ===================================================
    function triggerConfetti() {
        if (typeof confetti !== 'function') return;

        // Big initial burst
        confetti({
            particleCount: 80,
            spread: 90,
            origin: { y: 0.6 },
            colors: ['#ff4d6d', '#ff758f', '#ffd166', '#ffffff', '#ffb3c1']
        });

        // Heart shaped confetti shower
        setTimeout(() => {
            confetti({
                particleCount: 45,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#ff4d6d', '#c9184a', '#ffb3c1']
            });
            confetti({
                particleCount: 45,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#ff4d6d', '#ffd166', '#ff758f']
            });
        }, 300);
    }

    function openEnvelope() {
        if (isOpened) return;
        isOpened = true;

        // Sound & Animation
        startMusic();
        envelope.classList.add('opening');
        triggerConfetti();

        // Switch screens smoothly
        setTimeout(() => {
            envelopeScreen.classList.add('hidden');
            contentScreen.classList.remove('hidden');
            window.scrollTo({ top: 0, behavior: 'smooth' });

            // Trigger typing effect for the love letter
            typeLoveLetter();
        }, 900);
    }

    function reopenLetter() {
        isOpened = false;
        contentScreen.classList.add('hidden');
        envelope.classList.remove('opening');
        envelopeScreen.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // ===================================================
    // 5. TYPEWRITER EFFECT FOR THE LOVE LETTER
    // ===================================================
    let isTyping = false;
    function typeLoveLetter() {
        const letterBody = document.getElementById('letterBody');
        if (!letterBody) return;
        letterBody.innerHTML = '';
        isTyping = true;

        const lines = (LOVE_CONFIG.letter && LOVE_CONFIG.letter.length > 0)
            ? LOVE_CONFIG.letter
            : ["Chúc em ngày 20/10 ngập tràn hạnh phúc và tình yêu!"];

        let lineIndex = 0;
        let charIndex = 0;
        let currentP = document.createElement('p');
        letterBody.appendChild(currentP);

        const cursor = document.createElement('span');
        cursor.className = 'type-cursor';
        letterBody.appendChild(cursor);

        function typeNextChar() {
            if (!isTyping) return;

            if (lineIndex < lines.length) {
                const currentLine = lines[lineIndex];

                if (charIndex < currentLine.length) {
                    currentP.textContent += currentLine.charAt(charIndex);
                    charIndex++;
                    // Natural typing speed variance
                    const delay = Math.random() * 25 + 25;
                    setTimeout(typeNextChar, delay);
                } else {
                    // Line finished, prepare next paragraph
                    lineIndex++;
                    charIndex = 0;
                    if (lineIndex < lines.length) {
                        currentP = document.createElement('p');
                        letterBody.insertBefore(currentP, cursor);
                        setTimeout(typeNextChar, 350);
                    } else {
                        // Finished all lines!
                        cursor.remove();
                        isTyping = false;
                    }
                }
            }
        }

        setTimeout(typeNextChar, 400);
    }

    // ===================================================
    // 6. DAYS COUNTER SYSTEM
    // ===================================================
    function setupCounter() {
        const counterCard = document.getElementById('counterCard');
        if (!LOVE_CONFIG.startDate || LOVE_CONFIG.startDate.trim() === '') {
            if (counterCard) counterCard.style.display = 'none';
            return;
        }

        const startDate = new Date(LOVE_CONFIG.startDate);
        if (isNaN(startDate.getTime())) {
            if (counterCard) counterCard.style.display = 'none';
            return;
        }

        function updateCounter() {
            const now = new Date();
            const diffMs = now - startDate;

            if (diffMs < 0) {
                if (counterCard) counterCard.style.display = 'none';
                return;
            }

            const totalSeconds = Math.floor(diffMs / 1000);
            const days = Math.floor(totalSeconds / (3600 * 24));
            const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;

            const daysEl = document.getElementById('daysCount');
            const hoursEl = document.getElementById('hoursCount');
            const minEl = document.getElementById('minutesCount');
            const secEl = document.getElementById('secondsCount');

            if (daysEl) daysEl.textContent = days;
            if (hoursEl) hoursEl.textContent = hours;
            if (minEl) minEl.textContent = minutes;
            if (secEl) secEl.textContent = seconds;
        }

        updateCounter();
        setInterval(updateCounter, 1000);
    }

    // ===================================================
    // 7. VOUCHERS / SURPRISE CARDS
    // ===================================================
    function renderVouchers() {
        const grid = document.getElementById('vouchersGrid');
        if (!grid || !LOVE_CONFIG.vouchers) return;
        grid.innerHTML = '';

        LOVE_CONFIG.vouchers.forEach((voucher, idx) => {
            const card = document.createElement('div');
            card.className = 'voucher-card';
            card.setAttribute('data-index', idx);
            card.innerHTML = `
                <div class="voucher-icon-wrap">${voucher.icon}</div>
                <div class="voucher-info">
                    <h3 class="voucher-title">${voucher.title}</h3>
                    <p class="voucher-desc">${voucher.desc}</p>
                </div>
                <div class="voucher-action-pill">Mở quà ✨</div>
            `;

            card.addEventListener('click', () => openVoucherModal(voucher));
            grid.appendChild(card);
        });
    }

    function openVoucherModal(voucher) {
        modalIcon.textContent = voucher.icon;
        modalTitle.textContent = voucher.title;
        modalDesc.textContent = voucher.desc;
        modalCode.textContent = voucher.code;

        voucherModal.classList.remove('hidden');

        // Confetti burst for voucher activation
        if (typeof confetti === 'function') {
            confetti({
                particleCount: 50,
                spread: 70,
                origin: { y: 0.5 },
                colors: ['#ffd166', '#06d6a0', '#ff4d6d']
            });
        }
    }

    function closeVoucherModal() {
        voucherModal.classList.add('hidden');
    }

    // ===================================================
    // 8. INTERACTIVE LOVE BOMB (FLYING HEARTS)
    // ===================================================
    function spawnFlyingHeart(x, y) {
        const heart = document.createElement('div');
        heart.className = 'flying-heart';
        
        const hearts = ['💖', '💕', '💗', '💓', '✨', '🌸', '❤️'];
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        
        heart.style.left = `${x}px`;
        heart.style.top = `${y}px`;
        
        const dx = (Math.random() - 0.5) * 140;
        const rot = (Math.random() - 0.5) * 40;
        heart.style.setProperty('--dx', `${dx}px`);
        heart.style.setProperty('--rot', `${rot}deg`);

        document.body.appendChild(heart);

        setTimeout(() => {
            heart.remove();
        }, 1600);
    }

    function triggerLoveBomb(e) {
        heartCount++;
        heartTally.textContent = heartCount;

        const rect = btnLoveBomb.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

        for (let i = 0; i < 7; i++) {
            setTimeout(() => {
                spawnFlyingHeart(x + (Math.random() - 0.5) * 60, y + (Math.random() - 0.5) * 20);
            }, i * 60);
        }
    }

    // ===================================================
    // 9. EVENT LISTENERS
    // ===================================================
    function bindEvents() {
        // Envelope click / tap
        waxSeal.addEventListener('click', (e) => {
            e.stopPropagation();
            openEnvelope();
        });
        envelope.addEventListener('click', openEnvelope);

        // Music control
        musicToggle.addEventListener('click', toggleMusic);

        // Reopen button
        if (btnReopen) {
            btnReopen.addEventListener('click', reopenLetter);
        }

        // Love bomb
        if (btnLoveBomb) {
            btnLoveBomb.addEventListener('click', triggerLoveBomb);
        }

        // Polaroid heart tap
        if (polaroidCard) {
            polaroidCard.addEventListener('click', (e) => {
                spawnFlyingHeart(e.clientX, e.clientY);
                if (typeof confetti === 'function') {
                    confetti({
                        particleCount: 20,
                        spread: 50,
                        origin: {
                            x: e.clientX / window.innerWidth,
                            y: e.clientY / window.innerHeight
                        }
                    });
                }
            });
        }

        // Modal close
        if (btnModalClose) btnModalClose.addEventListener('click', closeVoucherModal);
        if (modalOverlay) modalOverlay.addEventListener('click', closeVoucherModal);

        // Click on screen for cute mini hearts
        document.addEventListener('click', (e) => {
            // Only if not tapping interactive controls
            if (e.target.closest('button') || e.target.closest('.voucher-card') || e.target.closest('.music-toggle') || e.target.closest('.envelope')) {
                return;
            }
            spawnFlyingHeart(e.clientX, e.clientY);
        });
    }

    // Initialize on page load
    document.addEventListener('DOMContentLoaded', () => {
        applyConfig();
        initParticles();
        bindEvents();
    });

})();
