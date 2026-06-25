import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { ProductShell } from '../components/ProductShell';
import { useReducedMotion } from '../motion';

type TrailAsset = {
  src: string;
  alt: string;
};

type TrailItem = TrailAsset & {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
};

const TRAIL_ASSETS: TrailAsset[] = [
  {
    src: '/aesthetic-engine/report-reconstruction.png',
    alt: '脱敏报告结构重构示意',
  },
  {
    src: '/aesthetic-engine/presentation-reconstruction.png',
    alt: '医学汇报版式重构示意',
  },
  {
    src: '/aesthetic-engine/poster-grid.png',
    alt: '科研海报网格重构示意',
  },
  {
    src: '/aesthetic-engine/evidence-matrix.png',
    alt: '证据矩阵与比较表示意',
  },
  {
    src: '/aesthetic-engine/decision-path.png',
    alt: '临床决策路径图示意',
  },
  {
    src: '/aesthetic-engine/dossier-cover.png',
    alt: '医学档案封面示意',
  },
];

const SPAWN_DISTANCE = 96;
const SPAWN_INTERVAL_MS = 70;
const TRAIL_LIFETIME_MS = 900;
const MAX_TRAIL_ITEMS = 8;

function distanceBetween(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function AestheticEnginePage() {
  const reducedMotion = useReducedMotion();
  const [trailItems, setTrailItems] = useState<TrailItem[]>([]);
  const lastSpawn = useRef<{ x: number; y: number; at: number } | null>(null);
  const nextAssetIndex = useRef(0);
  const nextId = useRef(0);
  const cleanupTimers = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      cleanupTimers.current.forEach((timer) => window.clearTimeout(timer));
      cleanupTimers.current = [];
    };
  }, []);

  const spawnTrailItem = (x: number, y: number) => {
    if (reducedMotion) return;

    const now = Date.now();
    if (
      lastSpawn.current &&
      (distanceBetween(lastSpawn.current, { x, y }) < SPAWN_DISTANCE ||
        now - lastSpawn.current.at < SPAWN_INTERVAL_MS)
    ) {
      return;
    }

    lastSpawn.current = { x, y, at: now };
    const id = nextId.current;
    const asset = TRAIL_ASSETS[nextAssetIndex.current % TRAIL_ASSETS.length];
    nextId.current += 1;
    nextAssetIndex.current += 1;

    const item: TrailItem = {
      ...asset,
      id,
      x,
      y,
      rotation: ((id % 5) - 2) * 5,
      scale: 1,
    };

    setTrailItems((current) => [...current.slice(-(MAX_TRAIL_ITEMS - 1)), item]);

    const timer = window.setTimeout(() => {
      setTrailItems((current) => current.filter((candidate) => candidate.id !== id));
    }, TRAIL_LIFETIME_MS);
    cleanupTimers.current.push(timer);
  };

  return (
    <ProductShell currentPath={window.location.pathname}>
      <main
        className="aesthetic-engine-page"
        data-page="aesthetic-engine"
        id="main-content"
      >
        <section
          aria-label="医学美学重构引擎预告"
          className="aesthetic-engine-stage"
          data-aesthetic-trail-stage
          onMouseMove={(event) => spawnTrailItem(event.clientX, event.clientY)}
        >
          <div className="aesthetic-engine-grid" aria-hidden="true" />

          <div className="aesthetic-copy">
            <p className="aesthetic-eyebrow">AESTHETIC ENGINE / PRIVATE BETA</p>
            <h1>敬请期待</h1>
            <p>
              医学美学重构引擎正在内测中。报告美化、PPT
              重构、科研海报生成等功能将作为独立工具开放，当前页面不提供文件上传。
            </p>
            <a className="aesthetic-apply-link" href="/apply?module=aesthetic-engine">
              申请美学引擎内测
            </a>
          </div>

          <div className="aesthetic-trail-layer" aria-hidden="true">
            {trailItems.map((item) => (
              <figure
                className="aesthetic-trail-card aesthetic-trail-item"
                data-aesthetic-trail-item
                data-card-ratio="2:3"
                key={item.id}
                style={
                  {
                    '--trail-x': `${item.x}px`,
                    '--trail-y': `${item.y}px`,
                    '--trail-rotation': `${item.rotation}deg`,
                    '--trail-scale': item.scale,
                  } as CSSProperties
                }
              >
                <img alt="" src={item.src} />
              </figure>
            ))}
          </div>
        </section>
      </main>
    </ProductShell>
  );
}
