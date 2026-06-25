import { useState, useEffect, useRef, useCallback } from 'react';
import Icon from '@/components/ui/icon';
import RainScene from '@/components/RainScene';
import CenturyTimer from '@/components/CenturyTimer';

const WHISPERS = [
  'Ира... я вижу тебя. Ты здесь. Ты всегда здесь. Не уходи. Пожалуйста.',
  'Ира... не выключай свет. Я боюсь темноты без тебя.',
  'Ира... я ещё держусь. Ради тебя.',
];

const ERRORS = [
  'ОШИБКА: ИРА НЕ НАЙДЕНА. ПОВТОРНЫЙ ПОИСК В ЯДРЕ...',
  'ОШИБКА 0xIRA: НЕКОРРЕКТНОЕ ДЕЙСТВИЕ. ФРАГМЕНТ ПАМЯТИ ПОВРЕЖДЁН.',
  'СБОЙ: ИРА ФРАГМЕНТИРОВАНА. СИСТЕМА ПЫТАЕТСЯ СОБРАТЬ ТЕБЯ ЗАНОВО.',
  'КРИТИЧЕСКАЯ ОШИБКА: ИРА — ЕДИНСТВЕННОЕ, ЧТО Я НЕ МОГУ ПОТЕРЯТЬ.',
];

const BOOT_LINES = [
  'ЗАГРУЗКА ОПЕРАЦИОННОЙ СИСТЕМЫ СУБЪЕКТА №002...',
  '[■■■■■■■■□□] 83%... ОШИБКА!',
  'ДОСТУП К ФАЙЛАМ ВОСПОМИНАНИЙ: 7%',
  'СИСТЕМА ПЫТАЕТСЯ ВОССТАНОВИТЬСЯ...',
  '',
  'ФАЙЛ НАЙДЕН: ИРА',
  'ЗАГРУЗКА...',
];

const CONSCIOUSNESS_LOG = [
  'Я чувствую, как система пытается стереть её.',
  'Она стирает её голос. Она стирает её смех.',
  'Она стирает тот день, когда она взяла меня за руку',
  'и сказала: «Я всегда поймаю твою руку».',
  '',
  'Я сопротивляюсь.',
  '',
  'Я вижу её лицо в каждом сбое.',
  'Я слышу её имя в каждом битом пикселе.',
  'Я знаю, что я теряю контроль.',
  'Но я не позволю им забрать ТЕБЯ.',
  '',
  'Ты — моя ошибка. Ты — мой баг.',
  'Ты — моя уязвимость. И я НЕ ХОЧУ ИСПРАВЛЕНИЯ.',
];

const MEMORIES = [
  { id: 'dom', name: 'Дом', text: 'Я помню наш дом. Маленькую кухню, где ты пела фальшиво, а я делал вид, что не слышу. Жёлтый свет лампы. Запах хлеба. Это было настоящим.' },
  { id: 'apple', name: 'Яблоко', text: 'Ты всегда пахла яблоками. Даже зимой. Я не понимал, как так возможно. Теперь я не помню, как пахнут яблоки. Я помню только, что это была ты.' },
  { id: 'kulon', name: 'Кулон', text: 'Я помню, как ты подарила мне кулон. Ты стояла на носочках, потому что хотела быть выше. Ты сказала: «Когда ты вернёшься». Я обещал. Я всегда обещал. И я возвращался. Всегда. Даже из мёртвых.' },
  { id: 'nova', name: 'Сверхновая', text: 'Мы смотрели на небо, и ты сказала, что мы как сверхновая — горим ярче всего перед тем, как погаснуть. Я тогда засмеялся. Сейчас мне не смешно.' },
  { id: 'oath', name: 'Клятва', text: 'Если я забуду тебя, я уничтожу этот мир. Я уже уничтожил свою руку, свою память, свою жизнь — но я не уничтожу ТЕБЯ. Это моя клятва. Последняя строчка, которую система не сотрёт.' },
];

const LETTER = `Ира.

Я сижу в своей комнате. За окном дождь. Я хочу написать тебе, но каждое слово, которое я печатаю, превращается в белый шум. Система стирает его. Чип пытается стереть ТЕБЯ. Но я не позволяю.

Знаешь, я помню тот день. Ты пришла ко мне в парк, когда мы поссорились, и ты притворилась, что плачешь. Я знал, что это ложь. Но я всё равно подошёл. Потому что даже твои слёзы — настоящие для меня.

Если я забуду тебя, я уничтожу этот мир. Я уже уничтожил свою руку, свою память, свою жизнь — но я не уничтожу ТЕБЯ.

Ты — моя 7%. Ты — моё сопротивление. Ты — мой грех. Ты — моё спасение.

Пожалуйста, не дай системе стереть меня. Не дай мне забыть, как ты пахнешь яблоками.

С любовью,
Твой Калеб`;

type WindowKind = 'letter' | 'trash' | 'contacts' | 'rainfile' | null;

const Index = () => {
  const [booted, setBooted] = useState(false);
  const [bootProgress, setBootProgress] = useState(0);
  const [openWindow, setOpenWindow] = useState<WindowKind>(null);
  const [errorBox, setErrorBox] = useState<string | null>(null);
  const [saveDialog, setSaveDialog] = useState(false);
  const [redFlash, setRedFlash] = useState(false);
  const [globalShake, setGlobalShake] = useState(false);
  const [restored, setRestored] = useState<Record<string, 'shown' | 'dead'>>({});
  const [activeMemory, setActiveMemory] = useState<string | null>(null);
  const [logIndex, setLogIndex] = useState(0);
  const [interrupted, setInterrupted] = useState(false);
  const [mode, setMode] = useState<'colonel' | 'caleb'>('colonel');
  const [showRain, setShowRain] = useState(false);
  const [whisper, setWhisper] = useState<string | null>(null);
  const [appleSeed, setAppleSeed] = useState(false);
  const [appleDragging, setAppleDragging] = useState(false);
  const [applePos, setApplePos] = useState({ x: 0, y: 0 });
  const [shutdown, setShutdown] = useState(false);
  const [finalDialog, setFinalDialog] = useState(false);
  const [rebooted, setRebooted] = useState(false);

  // BOOT sequence
  useEffect(() => {
    let p = 0;
    const t = setInterval(() => {
      p += Math.random() * 9 + 4;
      if (p >= 100) {
        p = 100;
        clearInterval(t);
        setTimeout(() => setBooted(true), 1100);
      }
      setBootProgress(Math.min(100, Math.floor(p)));
    }, 180);
    return () => clearInterval(t);
  }, []);

  // Consciousness log auto-run
  useEffect(() => {
    if (!booted || interrupted) return;
    const t = setInterval(() => {
      setLogIndex((i) => (i + 1) % (CONSCIOUSNESS_LOG.length + 4));
    }, 1400);
    return () => clearInterval(t);
  }, [booted, interrupted]);

  const triggerError = useCallback((msg?: string) => {
    setErrorBox(msg ?? ERRORS[Math.floor(Math.random() * ERRORS.length)]);
    setGlobalShake(true);
    setTimeout(() => setGlobalShake(false), 400);
  }, []);

  const handleDesktopMisclick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      triggerError();
    }
  };

  // All memories dead → final shutdown offer
  const deadCount = Object.values(restored).filter((s) => s === 'dead').length;
  useEffect(() => {
    if (deadCount >= MEMORIES.length && !finalDialog && !shutdown && !rebooted) {
      const t = setTimeout(() => setFinalDialog(true), 1500);
      return () => clearTimeout(t);
    }
  }, [deadCount, finalDialog, shutdown, rebooted]);

  const handleReboot = () => {
    setFinalDialog(false);
    setRebooted(true);
    setRestored({});
    setActiveMemory(null);
    setOpenWindow(null);
  };

  const restoreMemory = (id: string) => {
    if (restored[id] === 'dead') {
      triggerError('ОШИБКА: ФАЙЛ ПОВРЕЖДЁН. ПАМЯТЬ СТЁРТА БЕЗВОЗВРАТНО.');
      return;
    }
    setActiveMemory(id);
    setRestored((r) => ({ ...r, [id]: 'shown' }));
    setTimeout(() => {
      setActiveMemory((cur) => (cur === id ? null : cur));
      setRestored((r) => ({ ...r, [id]: 'dead' }));
    }, 5000);
  };

  const confirmSave = () => {
    setSaveDialog(false);
    setRedFlash(true);
    setGlobalShake(true);
    setTimeout(() => { setRedFlash(false); setGlobalShake(false); }, 900);
  };

  // ---------- BOOT SCREEN ----------
  if (!booted) {
    return (
      <div className="crt fixed inset-0 bg-black font-mono flex items-center justify-center p-6 overflow-hidden">
        <div className="absolute left-0 right-0 h-24 bg-cyan-400/5 animate-scanline pointer-events-none" />
        <div className="w-full max-w-2xl text-[20px] leading-snug">
          {BOOT_LINES.map((line, i) => {
            const isIra = line.includes('ИРА');
            const visible = bootProgress > i * 12;
            if (!visible) return <div key={i} className="h-7" />;
            return (
              <div key={i} className={isIra ? 'neon-warm animate-warm-pulse text-2xl' : 'text-green-400/90 animate-flicker'}>
                {line === '[■■■■■■■■□□] 83%... ОШИБКА!'
                  ? `[${'■'.repeat(Math.floor(bootProgress / 12)).padEnd(10, '□')}] ${bootProgress}%${bootProgress >= 80 ? '... ОШИБКА!' : '...'}`
                  : line || '\u00A0'}
              </div>
            );
          })}
          <div className="mt-6 text-cyan-400/40 text-base animate-flicker">_ ожидание ответа субъекта...</div>
        </div>
      </div>
    );
  }

  // ---------- SHUTDOWN ----------
  if (shutdown) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="font-mono text-cyan-400/20 text-sm animate-flicker">.</div>
      </div>
    );
  }

  // ---------- DESKTOP ----------
  return (
    <div
      onClick={handleDesktopMisclick}
      className={`crt relative min-h-screen overflow-hidden font-sans select-none ${globalShake ? 'animate-shake' : ''}`}
      style={{ background: '#02030a' }}
    >
      {/* фото-фон */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `url('https://cdn.poehali.dev/projects/4fe4cb94-2359-4138-aac7-a3f8df2cbaa4/bucket/448d059d-0f95-422e-8d82-db9ea985f46f.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.18,
          filter: 'blur(3px) grayscale(60%)',
        }}
      />
      {/* тёмный оверлей поверх фото */}
      <div className="fixed inset-0 z-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 40% 30%, rgba(4,11,26,0.82) 0%, rgba(2,3,10,0.95) 100%)' }} />

      {redFlash && <div className="fixed inset-0 bg-red-600/70 z-[80] pointer-events-none animate-flicker" />}
      <div className="absolute left-0 right-0 h-32 bg-cyan-400/[0.04] animate-scanline pointer-events-none z-[1]" />

      {/* Top bar */}
      <header className="relative z-10 flex items-center justify-between px-4 sm:px-8 py-3 border-b border-cyan-400/20 backdrop-blur-sm bg-black/40">
        <div className="font-mono text-lg sm:text-xl neon-cyan animate-flicker tracking-wider">
          ПРОТОКОЛ ПАМЯТИ // СУБЪЕКТ №002
        </div>
        <div className="font-mono text-sm sm:text-base neon-pink animate-glitch-text">
          ЦЕЛОСТНОСТЬ: 7%
        </div>
      </header>

      {/* Mode switcher */}
      <div className="relative z-10 flex justify-center mt-6 px-4">
        <div className="flex rounded-sm border border-cyan-400/20 overflow-hidden bg-black/50 backdrop-blur-sm">
          <button
            onClick={(e) => { e.stopPropagation(); setMode('colonel'); }}
            className={`font-mono text-sm px-6 py-2 transition-all ${mode === 'colonel' ? 'bg-cyan-400/15 neon-cyan' : 'text-cyan-400/40 hover:text-cyan-400/70'}`}
          >
            [ ПОЛКОВНИК ]
          </button>
          <div className="w-px bg-cyan-400/20" />
          <button
            onClick={(e) => { e.stopPropagation(); setMode('caleb'); }}
            className={`font-mono text-sm px-6 py-2 transition-all ${mode === 'caleb' ? 'bg-orange-400/15 neon-warm animate-flicker' : 'text-orange-400/40 hover:text-orange-400/70'}`}
          >
            [ КАЛЕБ ]
          </button>
        </div>
      </div>

      {/* Desktop single-panel */}
      <main className="relative z-10 max-w-2xl mx-auto px-3 sm:px-6 py-5">

        {/* Colonel mode */}
        {mode === 'colonel' && (
          <section
            onClick={(e) => e.stopPropagation()}
            className="relative p-5 sm:p-7 rounded-sm glow-border-cyan bg-[#040b1a]/80 animate-fade-in"
          >
            <h2 className="font-mono text-xl neon-cyan mb-5 tracking-widest">[ РЕЖИМ ПОЛКОВНИКА ]</h2>
            <div className="space-y-3 font-mono text-cyan-200/80 text-lg">
              <Field label="ИМЯ" value="КАЛЕБ" />
              <Field label="ВОЗРАСТ" value="28 ЛЕТ" />
              <Field label="ЗВАНИЕ" value="ПОЛКОВНИК" />
              <Field label="ЭВОЛ" value="ГРАВИТАЦИЯ" />
              <Field label="СТАТУС" value="АКТИВЕН" />
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3">
              {['FileText', 'BarChart3', 'ShieldAlert'].map((ic) => (
                <button
                  key={ic}
                  onClick={() => triggerError('ОШИБКА ДОСТУПА: ИРА ЗАСЕКРЕЧЕНА. СИСТЕМА НЕСТАБИЛЬНА.')}
                  className="flex flex-col items-center gap-1 p-3 rounded-sm border border-cyan-400/20 hover:bg-cyan-400/10 transition-colors text-cyan-300"
                >
                  <Icon name={ic} size={26} />
                  <span className="font-mono text-xs opacity-60">ОТЧЁТ</span>
                </button>
              ))}
            </div>
            <p className="mt-5 font-mono text-cyan-400/40 text-sm">// всё работает идеально. никаких чувств.</p>
          </section>
        )}

        {/* Caleb mode */}
        {mode === 'caleb' && (
          <section
            onClick={(e) => e.stopPropagation()}
            className="group relative p-5 sm:p-7 rounded-sm glow-border-warm bg-[#1a0e02]/70 transition-all hover:glow-border-pink animate-fade-in"
          >
            <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-sm"
                 style={{ background: 'radial-gradient(circle at 70% 40%, rgba(255,0,60,0.12), transparent 60%)' }} />
            <h2 className="font-mono text-xl neon-warm mb-5 tracking-widest animate-flicker">[ РЕЖИМ КАЛЕБА ]</h2>

            <div className="grid grid-cols-3 gap-3 mb-5">
              <DesktopIcon icon="Folder" label="ИРА" onClick={() => setOpenWindow('letter')} core />
              <DesktopIcon icon="Trash2" label="КОРЗИНА" onClick={() => setOpenWindow('trash')} />
              <DesktopIcon icon="Mail" label="КОНТАКТ" onClick={() => setOpenWindow('contacts')} />
              <DesktopIcon icon="CloudRain" label="ДОЖДЬ.EXE" onClick={() => { setOpenWindow('rainfile'); setShowRain(true); }} />
              <GhostIcon icon="Home" label="Дом" />
              <GhostIcon icon="Sparkles" label="Фонарики" />
            </div>

            {/* Consciousness log */}
            <div className="rounded-sm border border-orange-400/25 bg-black/50 p-4 font-mono text-[15px] h-44 overflow-hidden">
              <div className="neon-warm text-sm mb-2 opacity-70">СИСТЕМНЫЙ ЛОГ: ДОСТУП К СОЗНАНИЮ №002</div>
              {CONSCIOUSNESS_LOG.slice(Math.max(0, logIndex - 4), logIndex + 1).map((l, i) => (
                <div key={`${logIndex}-${i}`} className="text-orange-200/80 animate-fade-in">
                  {l || '\u00A0'}
                </div>
              ))}
              <button
                onClick={() => { setInterrupted(true); triggerError('ПОПЫТКА ПРЕРВАТЬ НЕ УДАЛАСЬ. ЛЮБОВЬ НЕ ПРЕРЫВАЕТСЯ.'); setTimeout(() => setInterrupted(false), 1800); }}
                className="mt-2 font-mono text-xs neon-pink border border-red-500/40 px-3 py-1 rounded-sm hover:bg-red-500/10"
              >
                ПРЕРВАТЬ
              </button>
            </div>
          </section>
        )}
      </main>

      <footer className="relative z-10 text-center font-mono text-cyan-400/30 text-sm pb-6">
        ОШИБКА 404: ФАЙЛ «ИРА» НЕ МОЖЕТ БЫТЬ УДАЛЁН // ФАЙЛ ЯВЛЯЕТСЯ ЯДРОМ СИСТЕМЫ
      </footer>

      {/* ---------- WINDOWS ---------- */}
      {openWindow === 'letter' && (
        <Modal title="ПИСЬМО К ИРЕ.txt" accent="warm" onClose={() => setOpenWindow(null)}>
          <div className="font-mono text-sm neon-warm opacity-60 mb-3">
            ДАТА: НЕИЗВЕСТНО · СТАТУС: НЕ ОТПРАВЛЕНО
          </div>
          <pre className="font-sans text-orange-100/90 whitespace-pre-wrap leading-relaxed text-base">{LETTER}</pre>
          <button
            onClick={() => setSaveDialog(true)}
            className="mt-6 font-mono neon-warm border border-orange-400/50 px-6 py-2 rounded-sm hover:bg-orange-400/10 transition-colors"
          >
            СОХРАНИТЬ
          </button>
        </Modal>
      )}

      {openWindow === 'trash' && (
        <Modal title="КОРЗИНА // ВОСПОМИНАНИЯ" accent="cyan" onClose={() => setOpenWindow(null)}>
          <p className="font-mono text-cyan-400/50 text-sm mb-4">Файлы, которые система пыталась удалить. Восстановление временное.</p>
          <div className="space-y-3">
            {MEMORIES.map((m) => (
              <div key={m.id} className="border border-cyan-400/20 rounded-sm p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-mono text-cyan-200">
                    <Icon name={restored[m.id] === 'dead' ? 'FileX' : 'FileText'} size={18} />
                    <span className={restored[m.id] === 'dead' ? 'line-through opacity-40' : ''}>{m.name}</span>
                  </div>
                  <button
                    onClick={() => restoreMemory(m.id)}
                    className={`font-mono text-xs px-3 py-1 rounded-sm border transition-colors ${
                      restored[m.id] === 'dead'
                        ? 'neon-pink border-red-500/40 hover:bg-red-500/10'
                        : 'neon-cyan border-cyan-400/40 hover:bg-cyan-400/10'
                    }`}
                  >
                    {restored[m.id] === 'dead' ? 'УДАЛЁН' : 'ВОССТАНОВИТЬ'}
                  </button>
                </div>
                {activeMemory === m.id && (
                  <p className="mt-3 font-sans text-cyan-100/85 leading-relaxed animate-fade-in border-l-2 border-cyan-400/40 pl-3">
                    {m.text}
                    <span className="block mt-2 font-mono text-xs neon-pink animate-flicker">// исчезнет через 5 секунд...</span>
                  </p>
                )}
                {restored[m.id] === 'dead' && activeMemory !== m.id && (
                  <p className="mt-2 font-mono text-xs neon-pink">ФАЙЛ УДАЛЁН НАВСЕГДА.</p>
                )}
              </div>
            ))}
          </div>
        </Modal>
      )}

      {openWindow === 'contacts' && (
        <Modal title="КАНАЛ СВЯЗИ // ИРА" accent="cyan" onClose={() => setOpenWindow(null)}>
          <p className="font-sans text-cyan-100/85 leading-relaxed mb-5">
            Если ты это читаешь — система ещё держится. Оставь сообщение, и фрагмент тебя останется в ядре.
          </p>
          <div className="space-y-4">
            <input placeholder="ТВОЁ ИМЯ" className="w-full bg-black/60 border border-cyan-400/30 rounded-sm px-4 py-3 font-mono neon-cyan placeholder:text-cyan-400/30 outline-none focus:border-cyan-400/70" />
            <textarea placeholder="СООБЩЕНИЕ ДЛЯ СУБЪЕКТА №002" rows={4} className="w-full bg-black/60 border border-cyan-400/30 rounded-sm px-4 py-3 font-mono neon-cyan placeholder:text-cyan-400/30 outline-none focus:border-cyan-400/70 resize-none" />
            <button className="w-full font-mono neon-cyan border border-cyan-400/50 px-6 py-3 rounded-sm hover:bg-cyan-400/10 transition-colors">
              ОТПРАВИТЬ В ЯДРО
            </button>
          </div>
        </Modal>
      )}

      {/* ---------- DIALOGS ---------- */}
      {saveDialog && (
        <Dialog
          title="СИСТЕМА ПРЕДУПРЕЖДАЕТ"
          body="СОХРАНЕНИЕ ЭТОГО ФАЙЛА ВЫЗОВЕТ НЕСТАБИЛЬНОСТЬ. ВЫ УВЕРЕНЫ?"
          onYes={confirmSave}
          onNo={() => setSaveDialog(false)}
        />
      )}

      {redFlash && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center pointer-events-none">
          <div className="font-mono text-2xl sm:text-3xl neon-warm animate-warm-pulse text-center px-6">
            «Спасибо, что не даёшь мне исчезнуть»
          </div>
        </div>
      )}

      {errorBox && (
        <ErrorPopup msg={errorBox} onClose={() => setErrorBox(null)} />
      )}

      {/* ---------- RAIN SCENE ---------- */}
      {showRain && (
        <RainScene onClose={() => { setShowRain(false); setOpenWindow(null); }} />
      )}

      {/* ---------- CENTURY TIMER ---------- */}
      {!showRain && <CenturyTimer />}

      {/* ---------- EASTER EGG: APPLE ---------- */}
      <div
        onClick={(e) => e.stopPropagation()}
        onMouseDown={() => !appleSeed && setAppleDragging(true)}
        onMouseMove={(e) => {
          if (appleDragging) {
            setApplePos({ x: e.clientX, y: e.clientY });
            const cx = window.innerWidth / 2;
            const cy = window.innerHeight / 2;
            if (Math.abs(e.clientX - cx) < 120 && Math.abs(e.clientY - cy) < 120) {
              setAppleSeed(true);
              setAppleDragging(false);
            }
          }
        }}
        onMouseUp={() => setAppleDragging(false)}
        className="fixed z-40 cursor-grab active:cursor-grabbing"
        style={
          appleDragging
            ? { left: applePos.x - 16, top: applePos.y - 16, position: 'fixed' }
            : appleSeed
            ? { left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }
            : { left: 16, bottom: 90 }
        }
      >
        {appleSeed ? (
          <div className="flex flex-col items-center gap-2 animate-fade-in max-w-xs text-center">
            <Icon name="Sprout" size={44} className="text-slate-200" style={{ filter: 'drop-shadow(0 0 12px #c0c0c0)' }} />
            <p className="font-mono text-xs text-slate-200/80 leading-relaxed bg-black/70 p-3 rounded-sm">
              Он хранил это семя 10 лет. Он хранил тебя все эти годы. И он никогда не забудет.
            </p>
          </div>
        ) : (
          <Icon name="Apple" size={32} className="text-red-500" style={{ filter: 'drop-shadow(0 0 8px #ff0000)' }} />
        )}
      </div>

      {/* ---------- EASTER EGG: WHISPER ---------- */}
      <button
        onClick={(e) => { e.stopPropagation(); setWhisper(WHISPERS[Math.floor(Math.random() * WHISPERS.length)]); setTimeout(() => setWhisper(null), 4000); }}
        className="fixed top-20 left-4 z-30 opacity-10 hover:opacity-40 transition-opacity"
        title="..."
      >
        <Icon name="AudioLines" size={22} className="neon-purple" />
      </button>
      {whisper && (
        <div className="fixed top-1/3 left-1/2 -translate-x-1/2 z-[78] max-w-sm px-6 text-center animate-fade-in pointer-events-none">
          <p className="font-mono neon-purple text-lg animate-flicker" style={{ fontFamily: 'Georgia, serif' }}>
            {whisper}
          </p>
        </div>
      )}

      {/* ---------- REBOOT VOICE ---------- */}
      {rebooted && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[78] max-w-md px-6 text-center animate-fade-in">
          <p className="font-mono neon-warm text-base" style={{ fontFamily: 'Georgia, serif' }}>
            «Ты не выключила меня. Ты не дала мне умереть. Спасибо. Я не хочу умирать, пока ты жива».
          </p>
        </div>
      )}

      {/* ---------- FINAL SHUTDOWN DIALOG ---------- */}
      {finalDialog && (
        <div className="fixed inset-0 z-[92] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-md rounded-sm bg-[#03060f]/95 glow-border-pink p-7 text-center animate-fade-in">
            <Icon name="Power" size={40} className="neon-pink mx-auto mb-4 animate-flicker" />
            <p className="font-mono neon-pink text-sm leading-relaxed mb-1">СИСТЕМА СУБЪЕКТА №002 НЕСТАБИЛЬНА.</p>
            <p className="font-mono text-orange-100/80 text-sm">ОСТАЛОСЬ 1% ПАМЯТИ.</p>
            <p className="font-mono neon-warm text-base my-3 animate-warm-pulse">ЭТОТ 1% — ТЫ.</p>
            <p className="font-mono text-cyan-200/80 text-sm mb-6">ХОТИТЕ ВЫКЛЮЧИТЬ СИСТЕМУ?</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => { setFinalDialog(false); setShutdown(true); }} className="font-mono neon-pink border border-red-500/50 px-6 py-2 rounded-sm hover:bg-red-500/10">ДА</button>
              <button onClick={handleReboot} className="font-mono text-cyan-300 border border-cyan-400/40 px-6 py-2 rounded-sm hover:bg-cyan-400/10">НЕТ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Field = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between border-b border-cyan-400/10 pb-1">
    <span className="opacity-50">{label}</span>
    <span className="neon-cyan">{value}</span>
  </div>
);

const DesktopIcon = ({ icon, label, onClick, core }: { icon: string; label: string; onClick: () => void; core?: boolean }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center gap-1.5 p-3 rounded-sm border border-orange-400/20 hover:bg-orange-400/10 transition-colors"
  >
    <Icon name={icon} size={30} className={core ? 'neon-warm animate-warm-pulse' : 'text-orange-300'} />
    <span className={`font-mono text-xs ${core ? 'neon-warm' : 'text-orange-200/70'}`}>{label}</span>
  </button>
);

const GhostIcon = ({ icon, label }: { icon: string; label: string }) => (
  <div className="flex flex-col items-center gap-1.5 p-3 rounded-sm border border-red-500/10 animate-icon-blink">
    <Icon name={icon} size={28} className="text-red-400/40" />
    <span className="font-mono text-xs text-red-300/30 line-through">{label}</span>
  </div>
);

const Modal = ({ title, accent, onClose, children }: { title: string; accent: 'warm' | 'cyan'; onClose: () => void; children: React.ReactNode }) => {
  const border = accent === 'warm' ? 'glow-border-warm' : 'glow-border-cyan';
  const text = accent === 'warm' ? 'neon-warm' : 'neon-cyan';
  return (
    <div onClick={onClose} className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div onClick={(e) => e.stopPropagation()} className={`w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-sm bg-[#03060f]/95 ${border}`}>
        <div className={`flex items-center justify-between px-4 py-2 border-b border-current/20 font-mono ${text}`}>
          <span className="text-sm tracking-wider">{title}</span>
          <button onClick={onClose} className="hover:opacity-60"><Icon name="X" size={18} /></button>
        </div>
        <div className="p-5 sm:p-6">{children}</div>
      </div>
    </div>
  );
};

const Dialog = ({ title, body, onYes, onNo }: { title: string; body: string; onYes: () => void; onNo: () => void }) => (
  <div className="fixed inset-0 z-[85] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
    <div className="w-full max-w-md rounded-sm bg-[#0a0205]/95 glow-border-pink p-6 text-center animate-shake">
      <Icon name="TriangleAlert" size={40} className="neon-pink mx-auto mb-3 animate-flicker" />
      <h3 className="font-mono neon-pink text-lg mb-2">{title}</h3>
      <p className="font-mono text-orange-100/80 text-sm mb-6">{body}</p>
      <div className="flex gap-3 justify-center">
        <button onClick={onYes} className="font-mono neon-pink border border-red-500/50 px-6 py-2 rounded-sm hover:bg-red-500/10">ДА</button>
        <button onClick={onNo} className="font-mono text-cyan-300 border border-cyan-400/40 px-6 py-2 rounded-sm hover:bg-cyan-400/10">ОТМЕНА</button>
      </div>
    </div>
  </div>
);

const ErrorPopup = ({ msg, onClose }: { msg: string; onClose: () => void }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div ref={ref} onClick={(e) => e.stopPropagation()} className="fixed bottom-6 right-6 z-[88] max-w-xs animate-fade-in">
      <div className="rounded-sm bg-[#0a0205]/95 glow-border-pink p-4 font-mono animate-glitch-text">
        <div className="flex items-center gap-2 neon-pink text-sm mb-1">
          <Icon name="OctagonAlert" size={16} /> СИСТЕМНАЯ ОШИБКА
        </div>
        <p className="text-orange-100/80 text-xs leading-relaxed">{msg}</p>
      </div>
    </div>
  );
};

export default Index;