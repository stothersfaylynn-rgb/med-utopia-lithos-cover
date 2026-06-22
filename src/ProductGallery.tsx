import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { galleryWorks, topNavItems } from './galleryContent';
import { useReducedMotion } from './motion';
import { ParticleField } from './ParticleField';

type Point = {
  x: number;
  y: number;
};

const initialPointer: Point = { x: -999, y: -999 };

const workDestinations: Record<string, string> = {
  避雷案例: '/cases',
  专家点评: '/cases/acute-aortic-dissection-triage#expert-commentary',
};

const topNavDestinations: Record<string, string> = {
  案例库: '/cases',
  申请内测: '/apply?source=work',
};

function canUseNativeScroll() {
  return typeof navigator === 'undefined' || !navigator.userAgent.includes('jsdom');
}

function clampIndex(index: number) {
  return Math.min(Math.max(index, 0), galleryWorks.length - 1);
}

function getRelativeSlot(index: number, activeIndex: number) {
  return index - activeIndex;
}

function getSlotClass(relativeSlot: number) {
  if (relativeSlot === 0) return 'is-current';
  if (relativeSlot === -1) return 'is-above';
  if (relativeSlot === 1) return 'is-below';
  return 'is-deep';
}

function formatViewportOffset(value: number, unit: 'vw' | 'vh') {
  const normalized = Math.abs(value) < 0.01 ? 0 : Number(value.toFixed(2));
  return `${normalized}${unit}`;
}

type ProductGalleryProps = {
  onGoHome: () => void;
};

export function ProductGallery({ onGoHome }: ProductGalleryProps) {
  const mouse = useRef<Point>(initialPointer);
  const smooth = useRef<Point>(initialPointer);
  const rafRef = useRef<number | null>(null);
  const [cursorPos, setCursorPos] = useState<Point>(initialPointer);
  const [activeIndex, setActiveIndex] = useState(0);
  const reducedMotion = useReducedMotion();
  const activeWork = galleryWorks[activeIndex];

  const stageStyle = useMemo(() => {
    const viewportWidth =
      typeof window === 'undefined' || window.innerWidth === 0 ? 1440 : window.innerWidth;
    const viewportHeight =
      typeof window === 'undefined' || window.innerHeight === 0 ? 900 : window.innerHeight;
    const x = cursorPos.x < 0 ? 0 : (cursorPos.x / viewportWidth - 0.5) * 22;
    const y = cursorPos.y < 0 ? 0 : (cursorPos.y / viewportHeight - 0.5) * -14;
    const panX = cursorPos.x < 0 ? 0 : (cursorPos.x / viewportWidth - 0.5) * 34;
    const panY = cursorPos.y < 0 ? 0 : (cursorPos.y / viewportHeight - 0.5) * 28;
    const spiralCurrentX = 0;
    const spiralCurrentY = 0;

    return {
      '--tilt-x': `${y.toFixed(2)}deg`,
      '--tilt-y': `${x.toFixed(2)}deg`,
      '--scene-pan-x': `${panX.toFixed(2)}px`,
      '--scene-pan-y': `${panY.toFixed(2)}px`,
      '--cursor-x': `${cursorPos.x}px`,
      '--cursor-y': `${cursorPos.y}px`,
      '--accent': activeWork.accent,
      '--accent-shadow': activeWork.shadow,
      '--gallery-progress': activeIndex,
      '--vertical-progress': activeIndex,
      '--scroll-progress': activeIndex,
      '--spiral-progress': activeIndex,
      '--spiral-current-x': formatViewportOffset(spiralCurrentX, 'vw'),
      '--spiral-current-y': formatViewportOffset(spiralCurrentY, 'vh'),
    } as CSSProperties;
  }, [activeIndex, activeWork.accent, activeWork.shadow, cursorPos.x, cursorPos.y]);

  useEffect(() => {
    if (reducedMotion) return undefined;

    const handleMouseMove = (event: MouseEvent) => {
      mouse.current = { x: event.clientX, y: event.clientY };
    };

    const animate = () => {
      smooth.current.x += (mouse.current.x - smooth.current.x) * 0.09;
      smooth.current.y += (mouse.current.y - smooth.current.y) * 0.09;
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
  }, [reducedMotion]);

  useEffect(() => {
    document.documentElement.classList.add('work-scroll-page');
    if (canUseNativeScroll()) {
      window.scrollTo(0, 0);
    }

    return () => {
      document.documentElement.classList.remove('work-scroll-page');
    };
  }, []);

  useEffect(() => {
    if (reducedMotion) return undefined;

    const updateFromScroll = () => {
      const viewportHeight = window.innerHeight || 900;
      const nextIndex = clampIndex(Math.round(window.scrollY / (viewportHeight * 0.92)));
      setActiveIndex(nextIndex);
    };

    window.addEventListener('scroll', updateFromScroll, { passive: true });
    updateFromScroll();
    return () => window.removeEventListener('scroll', updateFromScroll);
  }, [reducedMotion]);

  return (
    <div className="work-scroll-document relative bg-black text-white">
      <main
        className="gallery-stage long-gallery horizontal-cards spiral-stair-gallery sticky top-0 h-screen w-full overflow-hidden bg-black text-white"
        data-active-category={activeWork.category}
        data-page="work"
        data-theme="dark"
        style={stageStyle}
      >
        <div className="gallery-void absolute inset-0 z-0" />
        <ParticleField accent={activeWork.accent} activeIndex={activeIndex} pointer={cursorPos} />

        <div className="stage-fog pointer-events-none absolute inset-0 z-30" />
        <div className="data-ribbon ribbon-left" aria-hidden="true" />
        <div className="data-ribbon ribbon-floor" aria-hidden="true" />
        <div className="stage-sculpture" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div className="stage-noise pointer-events-none absolute inset-0 z-[90]" />

        <header className="pointer-events-none fixed left-0 right-0 top-0 z-[110] flex items-center justify-between px-5 py-5 sm:px-8">
          <button
            className="brand-mark pointer-events-auto hidden items-center gap-3 border-0 bg-transparent sm:flex"
            type="button"
            onClick={onGoHome}
          >
            <span className="brand-glyph" aria-hidden="true" />
            <span className="text-[13px] uppercase text-white/70">医学理想国</span>
          </button>

          <nav
            aria-label="主导航"
            className="glass-nav pointer-events-auto ml-auto flex items-center gap-1 rounded-full px-2 py-2"
          >
            {reducedMotion
              ? galleryWorks.map((work, index) => (
                  <button
                    aria-pressed={activeIndex === index}
                    className="nav-chip"
                    data-work-selector
                    key={work.category}
                    onClick={() => setActiveIndex(index)}
                    type="button"
                  >
                    {work.category}
                  </button>
                ))
              : topNavItems.map((item) => {
                  const href = topNavDestinations[item];

                  return href ? (
                    <a className="nav-chip no-underline" href={href} key={item}>
                      {item}
                    </a>
                  ) : (
                    <button className="nav-chip" disabled key={item} type="button">
                      {item}
                    </button>
                  );
                })}
          </nav>
        </header>

        <section
          aria-label="向下滚动浏览横版功能长页"
          className="gallery-camera pointer-events-none absolute inset-0 z-50"
        >
          <div className="gallery-depth">
            {galleryWorks.map((work, index) => {
              const relativeSlot = getRelativeSlot(index, activeIndex);
              const slotClass = getSlotClass(relativeSlot);
              const destination = workDestinations[work.category];

              return (
                <article
                  className={`work-slab ${slotClass}`}
                  key={work.category}
                  style={
                    {
                      '--slab-accent': work.accent,
                      '--slab-shadow': work.shadow,
                      '--relative-slot': relativeSlot,
                    } as CSSProperties
                  }
                  onMouseEnter={reducedMotion ? undefined : () => setActiveIndex(index)}
                >
                  <div className="slab-orbit" aria-hidden="true" />
                  {destination ? (
                    <a
                      aria-label={`进入${work.title}`}
                      className="absolute inset-0 z-20 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                      href={destination}
                      onFocus={() => setActiveIndex(index)}
                    >
                      <span className="sr-only">进入{work.title}</span>
                    </a>
                  ) : null}
                  <div className="slab-content">
                    <span className="work-signal">{work.signal}</span>
                    <h1>{work.title}</h1>
                    <p className="work-kicker">{work.kicker}</p>
                    <p className="work-meta">{work.meta}</p>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="dossier-layer" aria-label={`${activeWork.category}补充信息`}>
            <aside className="work-dossier left-dossier">
              <span>{activeWork.leftDossier.label}</span>
              <h2>{activeWork.leftDossier.title}</h2>
              <ul>
                {activeWork.leftDossier.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </aside>
            <aside className="work-dossier right-dossier">
              <span>{activeWork.rightDossier.label}</span>
              <h2>{activeWork.rightDossier.title}</h2>
              <ul>
                {activeWork.rightDossier.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </aside>
          </div>
        </section>

        <div className="scroll-rail pointer-events-none fixed right-4 top-1/2 z-[120] -translate-y-1/2">
          <span />
        </div>

        <div className="mobile-crop-label pointer-events-none fixed bottom-5 right-5 z-[120] text-[10px] uppercase text-white/45 sm:hidden">
          scroll space
        </div>
      </main>
      <div className="work-scroll-spacer" aria-hidden="true" />
    </div>
  );
}
