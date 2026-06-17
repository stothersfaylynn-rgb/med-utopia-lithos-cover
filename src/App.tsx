import { Menu, Moon, Sun } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { BG_IMAGE_1, BG_IMAGE_2 } from './heroConfig';
import { RevealLayer } from './RevealLayer';

type Point = {
  x: number;
  y: number;
};

const medNavItems = ['首页', '避雷案例', '学术挑战', '专家策展', '美学引擎'];

type Theme = 'dark' | 'light';

export default function App() {
  const mouse = useRef<Point>({ x: -999, y: -999 });
  const smooth = useRef<Point>({ x: -999, y: -999 });
  const rafRef = useRef<number | null>(null);
  const [cursorPos, setCursorPos] = useState<Point>({ x: -999, y: -999 });
  const [theme, setTheme] = useState<Theme>('dark');

  const isDark = theme === 'dark';
  const toggleTheme = () => setTheme((current) => (current === 'dark' ? 'light' : 'dark'));

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mouse.current = { x: event.clientX, y: event.clientY };
    };

    const animate = () => {
      smooth.current.x += (mouse.current.x - smooth.current.x) * 0.1;
      smooth.current.y += (mouse.current.y - smooth.current.y) * 0.1;
      setCursorPos({ x: smooth.current.x, y: smooth.current.y });
      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <div
      className={`min-h-screen ${isDark ? 'bg-[#050708]' : 'bg-[#f6f8f7]'}`}
      data-theme={theme}
      style={{
        fontFamily:
          "'Inter', 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif",
      }}
    >
      <nav className="fixed left-0 right-0 top-0 z-[100] flex items-center justify-between p-4 sm:p-5">
        <div className="flex items-center gap-3">
          <svg
            className={isDark ? 'text-white' : 'text-[#101615]'}
            width="28"
            height="28"
            viewBox="0 0 256 256"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M128 18 226 74v108l-98 56-98-56V74l98-56Zm0 28L54 88v80l74 42 74-42V88l-74-42Zm0 34 42 24v48l-42 24-42-24v-48l42-24Zm0 26-20 12v20l20 12 20-12v-20l-20-12Z" />
          </svg>
          <span
            className={`text-xl font-semibold sm:text-2xl ${
              isDark ? 'text-white' : 'text-[#101615]'
            }`}
          >
            医学理想国
          </span>
        </div>

        <div
          className={`absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-full border px-2 py-2 backdrop-blur-xl md:flex ${
            isDark
              ? 'border-white/20 bg-white/10 shadow-[0_18px_70px_rgba(0,0,0,0.28)]'
              : 'border-[#10201e]/10 bg-white/70 shadow-[0_18px_70px_rgba(20,37,34,0.12)]'
          }`}
        >
          {medNavItems.map((item, index) => (
            <button
              key={item}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                index === 0
                  ? isDark
                    ? 'bg-white/10 text-white'
                    : 'bg-[#101615]/10 text-[#101615]'
                  : isDark
                    ? 'text-white/70 hover:bg-white/10 hover:text-white'
                    : 'text-[#213432]/70 hover:bg-[#101615]/10 hover:text-[#101615]'
              }`}
              type="button"
            >
              {item}
            </button>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <button
            aria-label={isDark ? '切换为白色界面' : '切换为黑色界面'}
            className={`inline-flex h-11 w-11 items-center justify-center rounded-full border backdrop-blur-xl transition-all ${
              isDark
                ? 'border-white/20 bg-white/10 text-white hover:bg-white/20'
                : 'border-[#10201e]/10 bg-white/70 text-[#101615] hover:bg-white'
            }`}
            type="button"
            onClick={toggleTheme}
          >
            {isDark ? <Sun size={18} strokeWidth={2} /> : <Moon size={18} strokeWidth={2} />}
          </button>
          <button
            className={`rounded-full px-6 py-2.5 text-sm font-semibold transition-all ${
              isDark
                ? 'bg-white text-[#0b1110] hover:bg-[#dff7f1] hover:shadow-lg hover:shadow-cyan-300/20'
                : 'bg-[#0f1b19] text-white hover:bg-[#18312d] hover:shadow-lg hover:shadow-[#18312d]/20'
            }`}
            type="button"
          >
            进入理想国
          </button>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <button
            aria-label={isDark ? '切换为白色界面' : '切换为黑色界面'}
            className={`inline-flex h-11 w-11 items-center justify-center rounded-full border backdrop-blur-xl ${
              isDark
                ? 'border-white/20 bg-white/10 text-white'
                : 'border-[#10201e]/10 bg-white/70 text-[#101615]'
            }`}
            type="button"
            onClick={toggleTheme}
          >
            {isDark ? <Sun size={18} strokeWidth={2} /> : <Moon size={18} strokeWidth={2} />}
          </button>

          <button
            className={`inline-flex h-11 w-11 items-center justify-center rounded-full border backdrop-blur-xl ${
              isDark
                ? 'border-white/20 bg-white/10 text-white'
                : 'border-[#10201e]/10 bg-white/70 text-[#101615]'
            }`}
            type="button"
            aria-label="Open menu"
          >
            <Menu size={20} strokeWidth={2} />
          </button>
        </div>
      </nav>

      <section
        className={`relative h-screen w-full overflow-hidden ${
          isDark ? 'bg-black' : 'bg-[#eef4f2]'
        }`}
        style={{ height: '100dvh' }}
      >
        <div
          className={`absolute inset-0 bg-center bg-cover bg-no-repeat z-10 hero-zoom ${
            isDark ? 'opacity-100' : 'opacity-90'
          }`}
          style={{ backgroundImage: `url(${BG_IMAGE_1})` }}
        />

        <RevealLayer image={BG_IMAGE_2} cursorX={cursorPos.x} cursorY={cursorPos.y} />

        <div
          className={`absolute inset-0 z-40 ${
            isDark
              ? 'bg-[radial-gradient(circle_at_50%_36%,rgba(42,211,190,0.08),transparent_32%),linear-gradient(180deg,rgba(0,0,0,0.1),rgba(2,8,8,0.16)_45%,rgba(1,4,4,0.32))]'
              : 'bg-[radial-gradient(circle_at_50%_36%,rgba(35,156,144,0.08),transparent_32%),linear-gradient(180deg,rgba(250,253,252,0.18),rgba(244,248,247,0.24)_45%,rgba(238,244,243,0.38))]'
          }`}
        />

        <div
          className={`medical-grid pointer-events-none absolute inset-0 z-[45] ${
            isDark ? 'opacity-25' : 'opacity-20'
          }`}
        />

        <div
          className="pointer-events-none absolute inset-x-0 top-[14%] z-50 flex flex-col items-center px-5 text-center"
        >
          <h1
            className={`hero-anim hero-reveal text-5xl font-semibold leading-[0.95] sm:text-7xl md:text-8xl ${
              isDark ? 'text-white' : 'text-[#0d1514]'
            }`}
            style={{ animationDelay: '0.22s' }}
          >
            医学理想国
          </h1>
          <p
            className={`hero-anim hero-fade mt-4 max-w-[680px] text-sm font-medium leading-relaxed sm:text-base md:text-lg ${
              isDark ? 'text-white/80' : 'text-[#1b2b29]/75'
            }`}
            style={{ animationDelay: '0.45s' }}
          >
            Let experience, judgment, and talent find their place.
          </p>
          <button
            className={`pointer-events-auto hero-anim hero-fade mt-7 rounded-full border px-7 py-3 text-sm font-semibold transition-all active:scale-95 sm:px-8 ${
              isDark
                ? 'border-white/20 bg-white text-[#0b1110] hover:bg-[#dff7f1] hover:shadow-xl hover:shadow-cyan-300/20'
                : 'border-[#10201e]/10 bg-[#0f1b19] text-white hover:bg-[#18312d] hover:shadow-xl hover:shadow-[#18312d]/20'
            }`}
            style={{ animationDelay: '0.62s' }}
            type="button"
          >
            进入理想国
          </button>
        </div>

        <div
          className={`pointer-events-none absolute bottom-8 left-5 right-5 z-50 flex items-end justify-between gap-6 sm:bottom-10 sm:left-10 sm:right-10 ${
            isDark ? 'text-white/60' : 'text-[#1d302d]/60'
          }`}
          aria-hidden="true"
        >
          <div className="h-px flex-1 bg-current opacity-35" />
          <span className="hidden text-xs font-medium uppercase sm:block">
            Med-Utopia
          </span>
          <div className="h-px flex-1 bg-current opacity-35" />
        </div>
      </section>
    </div>
  );
}
