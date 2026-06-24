import { Menu, Moon, Sun, X } from 'lucide-react';
import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from 'react';
import { navigate } from '../router';
import { useTheme } from '../theme';

export type ProductShellProps = {
  currentPath: string;
  children: ReactNode;
};

const productLinks = [
  ['首页', '/'],
  ['避雷案例', '/cases'],
  ['学术挑战', '/challenges'],
  ['专家策展', '/curators'],
  ['美学引擎', '/aesthetic-engine'],
] as const;

function isCurrentPath(currentPath: string, href: string) {
  if (href === '/') return currentPath === '/';
  if (href === '/cases') return currentPath === '/cases' || currentPath.startsWith('/cases/');
  if (href === '/challenges') {
    return currentPath === '/challenges' || currentPath.startsWith('/challenges/');
  }
  return false;
}

function shouldHandleInternalNavigation(event: MouseEvent) {
  return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
}

export function ProductShell({ currentPath, children }: ProductShellProps) {
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const isDark = theme === 'dark';

  useEffect(() => {
    document.documentElement.classList.add('product-scroll-page');
    return () => document.documentElement.classList.remove('product-scroll-page');
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen]);

  const handleNavigation = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!shouldHandleInternalNavigation(event)) return;
    event.preventDefault();
    setMenuOpen(false);
    navigate(href);
  };

  const handleContentNavigation = (event: MouseEvent<HTMLDivElement>) => {
    if (event.defaultPrevented || !shouldHandleInternalNavigation(event)) return;
    const target = event.target;
    if (!(target instanceof Element)) return;
    const link = target.closest<HTMLAnchorElement>('a[href]');
    const href = link?.getAttribute('href');
    if (!href?.startsWith('/') || link?.closest('.product-shell-header')) return;
    event.preventDefault();
    navigate(href);
  };

  return (
    <div className="product-app" onClick={handleContentNavigation}>
      <a className="skip-link" href="#main-content">
        跳到主要内容
      </a>
      <header className="product-shell-header">
        <a className="product-shell-brand" href="/" onClick={(event) => handleNavigation(event, '/')}>
          <span className="product-shell-brand-mark" aria-hidden="true" />
          <span>医学理想国</span>
        </a>

        <nav
          aria-label="主导航"
          className="product-shell-nav"
          data-open={menuOpen}
          id="product-shell-navigation"
        >
          {productLinks.map(([label, href]) => (
            <a
              aria-current={isCurrentPath(currentPath, href) ? 'page' : undefined}
              className="product-shell-link"
              href={href}
              key={href}
              onClick={(event) => handleNavigation(event, href)}
            >
              {label}
            </a>
          ))}
          <a
            className="product-shell-apply product-shell-apply-mobile"
            href="/apply?source=global"
            onClick={(event) => handleNavigation(event, '/apply?source=global')}
          >
            申请内测
          </a>
        </nav>

        <div className="product-shell-controls">
          <button
            aria-label={isDark ? '切换为浅色主题' : '切换为深色主题'}
            className="product-shell-theme"
            onClick={toggleTheme}
            type="button"
          >
            {isDark ? <Sun aria-hidden="true" size={18} /> : <Moon aria-hidden="true" size={18} />}
          </button>
          <a
            className="product-shell-apply product-shell-apply-desktop"
            href="/apply?source=global"
            onClick={(event) => handleNavigation(event, '/apply?source=global')}
          >
            申请内测
          </a>
          <button
            aria-controls="product-shell-navigation"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? '关闭主菜单' : '打开主菜单'}
            className="product-shell-menu"
            onClick={() => setMenuOpen((open) => !open)}
            ref={menuButtonRef}
            type="button"
          >
            {menuOpen ? <X aria-hidden="true" size={20} /> : <Menu aria-hidden="true" size={20} />}
          </button>
        </div>
      </header>
      {children}
    </div>
  );
}
