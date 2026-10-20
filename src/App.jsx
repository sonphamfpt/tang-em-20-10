import { useState, useRef, useCallback } from 'react';
import { config }    from './config';
import Particles     from './components/Particles';
import MusicPlayer   from './components/MusicPlayer';
import Intro         from './components/Intro';
import Slideshow     from './components/Slideshow';
import Letter        from './components/Letter';

const STEPS = ['intro', 'slideshow', 'letter'];

export default function App() {
  const [step, setStep]           = useState(0);
  const [leaving, setLeaving]     = useState(false);
  const [entering, setEntering]   = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(true);
  const nextStepRef               = useRef(0);

  /* Orchestrate page transition */
  const goTo = useCallback((next) => {
    if (leaving || entering) return;
    nextStepRef.current = next;
    setLeaving(true);              // trigger exit animation

    // After exit completes, swap the page
    setTimeout(() => {
      setLeaving(false);
      setStep(next);
      setEntering(true);           // trigger enter animation

      // Clean up enter class
      setTimeout(() => setEntering(false), 900);
    }, 580);
  }, [leaving, entering]);

  const advance = useCallback(() => {
    // When transitioning from intro or anytime user advances, start music if not playing
    if (!musicPlaying) setMusicPlaying(true);
    goTo(Math.min(step + 1, STEPS.length - 1));
  }, [step, goTo, musicPlaying]);

  const restart = useCallback(() => goTo(0), [goTo]);

  const pageClass = [
    'page',
    leaving  ? 'page-exit'  : '',
    entering ? 'page-enter' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className="grain">
      {/* Ambient floating particles — always present */}
      <Particles />

      {/* Floating music toggle */}
      <MusicPlayer
        musicUrl={config.musicUrl}
        playing={musicPlaying}
        onToggle={() => setMusicPlaying(p => !p)}
      />

      {/* ── Active page ── */}
      <div className={pageClass} style={{ zIndex: 10 }}>
        {step === 0 && (
          <Intro
            recipientName={config.recipientName}
            onNext={advance}
          />
        )}

        {step === 1 && (
          <Slideshow
            photos={config.photos}
            onNext={advance}
          />
        )}

        {step === 2 && (
          <Letter
            letter={config.letter}
            senderName={config.senderName}
            recipientName={config.recipientName}
            startDate={config.startDate}
            onRestart={restart}
          />
        )}
      </div>
    </div>
  );
}
