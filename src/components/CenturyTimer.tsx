import { useEffect, useRef, useState } from 'react';

const TARGET = Date.now() + 100 * 365.25 * 24 * 60 * 60 * 1000;

const CenturyTimer = () => {
  const [display, setDisplay] = useState('');
  const [glitched, setGlitched] = useState(false);
  const [stopped, setStopped] = useState(false);
  const clicksRef = useRef(0);
  const clickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (stopped) return;
    const tick = () => {
      const diff = TARGET - Date.now();
      const years = Math.floor(diff / (365.25 * 24 * 3600 * 1000));
      const days = Math.floor((diff / (24 * 3600 * 1000)) % 365.25);
      const h = Math.floor((diff / (3600 * 1000)) % 24);
      const m = Math.floor((diff / (60 * 1000)) % 60);
      const s = Math.floor((diff / 1000) % 60);
      setDisplay(`${years}г ${days}д ${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`);
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [stopped]);

  // random glitch
  useEffect(() => {
    if (stopped) return;
    const g = setInterval(() => {
      if (Math.random() > 0.7) {
        setGlitched(true);
        setTimeout(() => setGlitched(false), 1100);
      }
    }, 5000);
    return () => clearInterval(g);
  }, [stopped]);

  const handleClick = () => {
    if (stopped) return;
    clicksRef.current += 1;
    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
    clickTimerRef.current = setTimeout(() => { clicksRef.current = 0; }, 800);
    if (clicksRef.current >= 10) {
      setStopped(true);
    }
  };

  return (
    <div
      onClick={(e) => { e.stopPropagation(); handleClick(); }}
      className="fixed bottom-4 right-4 z-30 cursor-pointer select-none"
    >
      <div className="rounded-sm bg-black/70 glow-border-warm px-4 py-3 font-mono text-right backdrop-blur-sm max-w-[240px]">
        {stopped ? (
          <p className="neon-pink text-xs leading-relaxed animate-fade-in">
            Я НЕ ХОЧУ СТО ЛЕТ. Я ХОЧУ ВЕЧНОСТЬ. НО ДАЖЕ ВЕЧНОСТЬ — ЭТО МАЛО, КОГДА ТЫ РЯДОМ.
          </p>
        ) : (
          <>
            <p className="neon-warm text-[11px] opacity-70 mb-1 leading-snug">«Останься. Проведи со мной следующие сто лет»</p>
            {glitched ? (
              <p className="neon-pink text-sm animate-glitch-text">ОШИБКА: ИРА СТЁРТА</p>
            ) : (
              <p className="neon-warm text-base tracking-wider">{display}</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CenturyTimer;
