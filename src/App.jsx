import { useState, useEffect } from 'react';
import { config } from './config';
import ParticleCanvas from './components/ParticleCanvas';
import MusicPlayer from './components/MusicPlayer';
import PhotoSlideshow from './components/PhotoSlideshow';
import LoveLetter from './components/LoveLetter';
import Vouchers from './components/Vouchers';

// Steps: 0 = slideshow, 1 = letter, 2 = vouchers
export default function App() {
  const [step, setStep] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  const goTo = (next) => {
    setTransitioning(true);
    setTimeout(() => {
      setStep(next);
      setTransitioning(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 350);
  };

  return (
    <>
      <div className="app-bg" />
      <ParticleCanvas />
      <MusicPlayer />

      <main
        className="app-shell"
        style={{
          opacity: transitioning ? 0 : 1,
          transform: transitioning ? 'translateY(14px)' : 'translateY(0)',
          transition: 'opacity .35s ease, transform .35s ease',
        }}
      >
        {step === 0 && (
          <PhotoSlideshow
            photos={config.photos}
            onFinish={() => goTo(1)}
          />
        )}

        {step === 1 && (
          <LoveLetter
            letter={config.letter}
            senderName={config.senderName}
            recipientName={config.recipientName}
            startDate={config.startDate}
            onFinish={() => goTo(2)}
          />
        )}

        {step === 2 && (
          <Vouchers
            vouchers={config.vouchers}
            onRestart={() => goTo(0)}
          />
        )}
      </main>
    </>
  );
}
