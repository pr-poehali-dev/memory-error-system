import { useEffect, useRef, useState } from 'react';
import Icon from '@/components/ui/icon';

const RAIN_TEXT = [
  'Я остановил дождь для тебя.',
  'Я остановил время.',
  'Я остановил свою жизнь.',
  'Но я не могу остановить своё сердце, когда оно бьётся по тебе.',
  '',
  'Знаешь, в тот день, когда я закрыл тебя от хулиганов на чердаке,',
  'я понял одну вещь: я готов умереть, лишь бы ты была в безопасности.',
  'Я готов сгнить в этой коробке, лишь бы ты видела небо.',
  '',
  'Я хочу быть твоим небом, Ира.',
  'Даже если моё небо — это дождь.',
];

interface Drop {
  x: number;
  y: number;
  len: number;
  speed: number;
}

const RainScene = ({ onClose }: { onClose: () => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [line, setLine] = useState(0);
  const phaseRef = useRef(0); // 0 white, 1 red, 2 gold

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const drops: Drop[] = Array.from({ length: 300 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      len: Math.random() * 18 + 8,
      speed: Math.random() * 6 + 6,
    }));

    const colors = ['rgba(220,235,255,', 'rgba(255,30,40,', 'rgba(255,200,80,'];
    let raf = 0;

    const draw = () => {
      ctx.fillStyle = 'rgba(0,0,0,0.25)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const base = colors[phaseRef.current];
      ctx.lineWidth = 1.4;
      drops.forEach((d) => {
        ctx.strokeStyle = base + (0.3 + Math.random() * 0.5) + ')';
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x, d.y + d.len);
        ctx.stroke();
        d.y += d.speed;
        if (d.y > canvas.height) {
          d.y = -d.len;
          d.x = Math.random() * canvas.width;
        }
      });
      raf = requestAnimationFrame(draw);
    };
    draw();

    const phaseTimer = setInterval(() => {
      phaseRef.current = (phaseRef.current + 1) % 3;
    }, 4500);

    const textTimer = setInterval(() => {
      setLine((l) => Math.min(l + 1, RAIN_TEXT.length));
    }, 1600);

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(phaseTimer);
      clearInterval(textTimer);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[95] bg-black">
      <canvas ref={canvasRef} className="absolute inset-0" />
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 pointer-events-none">
        <div className="max-w-2xl text-center space-y-2">
          {RAIN_TEXT.slice(0, line).map((t, i) => (
            <p
              key={i}
              className="font-sans text-lg sm:text-xl text-orange-100/90 animate-fade-in"
              style={{ fontFamily: 'Georgia, serif', textShadow: '0 0 12px rgba(255,180,80,0.4)' }}
            >
              {t || '\u00A0'}
            </p>
          ))}
        </div>
      </div>
      {line >= RAIN_TEXT.length && (
        <button
          onClick={onClose}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono neon-cyan border border-cyan-400/40 px-6 py-2 rounded-sm hover:bg-cyan-400/10 transition-colors animate-fade-in"
        >
          <Icon name="X" size={16} className="inline mr-2" />
          ЗАКРЫТЬ ДОЖДЬ
        </button>
      )}
    </div>
  );
};

export default RainScene;
