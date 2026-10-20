import { useCallback, useEffect, useState, type MouseEvent } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import '@fontsource-variable/manrope';
import SiteHeader, { type Language, type PageName } from './components/SiteHeader';
import SiteFooter from './components/SiteFooter';
import HomePage from './pages/HomePage';
import ResearchPage from './pages/ResearchPage';
import PublicationsPage from './pages/PublicationsPage';
import ProjectsPage from './pages/ProjectsPage';
import ProfilePage from './pages/ProfilePage';
import WaterRippleBackground from './WaterRippleBackground';
import '../styles.css';

type Theme = 'light' | 'dark';

function resolvePage(pathname = window.location.pathname): PageName {
  const route = pathname.split('/').filter(Boolean).pop()?.toLowerCase()?.replace(/\.html$/, '');
  if (route === 'research') return 'research';
  if (route === 'publications') return 'publications';
  if (route === 'projects') return 'projects';
  if (route === 'profile') return 'profile';
  return 'home';
}

const pageTitles: Record<Language, Record<PageName, string>> = {
  en: {
    home: 'Khanh Pham Gia | Computer Science & Data Engineering',
    research: 'Research Experience | Khanh Pham Gia',
    publications: 'Publications | Khanh Pham Gia',
    projects: 'Selected Projects | Khanh Pham Gia',
    profile: 'Professional Profile | Khanh Pham Gia',
  },
  vi: {
    home: 'Khanh Phạm Gia | Khoa học máy tính & Kỹ thuật dữ liệu',
    research: 'Kinh nghiệm nghiên cứu | Khanh Phạm Gia',
    publications: 'Công bố khoa học | Khanh Phạm Gia',
    projects: 'Dự án tiêu biểu | Khanh Phạm Gia',
    profile: 'Hồ sơ chuyên môn | Khanh Phạm Gia',
  },
};

function PageContent({ page, theme, language }: { page: PageName; theme: Theme; language: Language }) {
  switch (page) {
    case 'research': return <ResearchPage theme={theme} language={language} />;
    case 'publications': return <PublicationsPage theme={theme} language={language} />;
    case 'projects': return <ProjectsPage theme={theme} language={language} />;
    case 'profile': return <ProfilePage theme={theme} language={language} />;
    default: return <HomePage theme={theme} language={language} />;
  }
}

function App() {
  const [page, setPage] = useState<PageName>(() => resolvePage());
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const savedTheme = localStorage.getItem('profile-theme');
      if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme;
    } catch { /* Use the document theme if storage is unavailable. */ }
    return 'dark';
  });
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const savedLanguage = localStorage.getItem('profile-language');
      if (savedLanguage === 'vi' || savedLanguage === 'en') return savedLanguage;
    } catch { /* English is the default when storage is unavailable. */ }
    return 'en';
  });

  const handleThemeChange = useCallback((nextTheme: Theme) => {
    if (nextTheme === theme) return;
    const updateTheme = () => setTheme(nextTheme);
    const transitionDocument = document as Document & { startViewTransition?: (update: () => void) => { finished: Promise<void> } };
    if (!transitionDocument.startViewTransition || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      updateTheme();
      return;
    }
    try {
      void transitionDocument.startViewTransition(updateTheme).finished.catch(() => updateTheme());
    } catch {
      updateTheme();
    }
  }, [theme]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.lang = language;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'light' ? '#f3f7f8' : '#111a1e');
    document.title = pageTitles[language][page];
    try { localStorage.setItem('profile-theme', theme); } catch { /* Theme remains available for this visit. */ }
    try { localStorage.setItem('profile-language', language); } catch { /* Language remains available for this visit. */ }
  }, [page, theme, language]);

  const handleInternalNavigation = useCallback((event: MouseEvent<HTMLDivElement>) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const target = event.target;
    if (!(target instanceof Element)) return;
    const link = target.closest('a[href]');
    if (!(link instanceof HTMLAnchorElement) || link.target === '_blank' || link.hasAttribute('download')) return;
    const url = new URL(link.href, window.location.href);
    if (url.origin !== window.location.origin || !/^\/(?:|index\.html|(?:research|publications|projects|profile)(?:\.html|\/?)?)$/.test(url.pathname)) return;

    event.preventDefault();
    if (url.pathname === window.location.pathname) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    window.history.pushState({}, '', `${url.pathname}${url.search}${url.hash}`);
    setPage(resolvePage(url.pathname));
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  useEffect(() => {
    const handlePopState = () => setPage(resolvePage());
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <div className="app-shell" onClickCapture={handleInternalNavigation}>
        <WaterRippleBackground theme={theme} />
        <div className="app-content">
          <SiteHeader page={page} theme={theme} language={language} onThemeChange={handleThemeChange} onLanguageChange={setLanguage} />
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={page} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.24, ease: [0.2, 0.7, 0.15, 1] }}>
              <PageContent page={page} theme={theme} language={language} />
            </motion.div>
          </AnimatePresence>
          <SiteFooter language={language} />
        </div>
      </div>
    </MotionConfig>
  );
}

export default App;
