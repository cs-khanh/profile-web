import { useState, type ReactNode } from 'react';

export type PageName = 'home' | 'research' | 'publications' | 'projects' | 'profile';
export type Language = 'vi' | 'en';
type Theme = 'light' | 'dark';

const links: { label: Record<Language, string>; href: string; page: PageName }[] = [
  { label: { en: 'Home', vi: 'Trang chủ' }, href: '/', page: 'home' },
  { label: { en: 'Research', vi: 'Nghiên cứu' }, href: '/research/', page: 'research' },
  { label: { en: 'Publications', vi: 'Công bố' }, href: '/publications/', page: 'publications' },
  { label: { en: 'Projects', vi: 'Dự án' }, href: '/projects/', page: 'projects' },
  { label: { en: 'Profile', vi: 'Hồ sơ' }, href: '/profile/', page: 'profile' },
];

export default function SiteHeader({ page, theme, language, onThemeChange, onLanguageChange }: {
  page: PageName;
  theme: Theme;
  language: Language;
  onThemeChange: (theme: Theme) => void;
  onLanguageChange: (language: Language) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigation: ReactNode = links.map(({ label, href, page: linkPage }) => (
    <a className={page === linkPage ? 'active' : undefined} href={href} aria-current={page === linkPage ? 'page' : undefined} key={linkPage} onClick={() => setMenuOpen(false)}>{label[language]}</a>
  ));

  return (
    <header className={`global-header${menuOpen ? ' menu-open' : ''}`}>
      <nav className="global-nav" aria-label={language === 'vi' ? 'Điều hướng chính' : 'Main navigation'}>{navigation}</nav>
      <div className="header-actions">
        <div className="language-switch" role="group" aria-label={language === 'vi' ? 'Chọn ngôn ngữ' : 'Choose language'}>
          <button type="button" aria-label="Chuyển sang tiếng Việt" aria-pressed={language === 'vi'} onClick={() => onLanguageChange('vi')}>
            <svg className="flag-icon" viewBox="0 0 24 16" aria-hidden="true"><rect width="24" height="16" rx="1" fill="#da251d" /><path d="m12 3 1.05 3.17h3.33l-2.7 1.96 1.03 3.18L12 9.35l-2.71 1.96 1.03-3.18-2.7-1.96h3.34L12 3Z" fill="#ffde00" /></svg> VI
          </button>
          <span className="language-divider" aria-hidden="true">|</span>
          <button type="button" aria-label="Switch to English" aria-pressed={language === 'en'} onClick={() => onLanguageChange('en')}>
            <svg className="flag-icon" viewBox="0 0 24 16" aria-hidden="true"><rect width="24" height="16" rx="1" fill="#1b3f8b" /><path d="m0 0 24 16M24 0 0 16" stroke="#fff" stroke-width="3.4" /><path d="m0 0 24 16M24 0 0 16" stroke="#c8102e" stroke-width="1.35" /><path d="M12 0v16M0 8h24" stroke="#fff" stroke-width="5" /><path d="M12 0v16M0 8h24" stroke="#c8102e" stroke-width="2.2" /></svg> EN
          </button>
        </div>
        <div className="theme-switch" role="group" aria-label={language === 'vi' ? 'Chọn giao diện' : 'Choose color theme'}>
          <button type="button" aria-label={language === 'vi' ? 'Chuyển sang giao diện sáng' : 'Switch to light theme'} title={language === 'vi' ? 'Giao diện sáng' : 'Light theme'} aria-pressed={theme === 'light'} onClick={() => onThemeChange('light')}>
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="3.6" /><path d="M12 2v2.1m0 15.8V22M4.93 4.93l1.48 1.48m11.18 11.18 1.48 1.48M2 12h2.1m15.8 0H22M4.93 19.07l1.48-1.48M17.59 6.41l1.48-1.48" /></svg>
          </button>
          <button type="button" aria-label={language === 'vi' ? 'Chuyển sang giao diện tối' : 'Switch to dark theme'} title={language === 'vi' ? 'Giao diện tối' : 'Dark theme'} aria-pressed={theme === 'dark'} onClick={() => onThemeChange('dark')}>
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20.2 15.1A8.6 8.6 0 0 1 8.9 3.8 8.7 8.7 0 1 0 20.2 15.1Z" /><path d="m15.8 4.1.4 1.3 1.3.4-1.3.4-.4 1.3-.4-1.3-1.3-.4 1.3-.4.4-1.3Z" /></svg>
          </button>
        </div>
        <button className="menu-toggle" type="button" aria-label={menuOpen ? (language === 'vi' ? 'Đóng menu điều hướng' : 'Close navigation menu') : (language === 'vi' ? 'Mở menu điều hướng' : 'Open navigation menu')} title={menuOpen ? (language === 'vi' ? 'Đóng menu' : 'Close menu') : (language === 'vi' ? 'Mở menu' : 'Open menu')} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen((open) => !open)}>
          {menuOpen
            ? <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
            : <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 7h17M3.5 12h17M3.5 17h17" /></svg>}
        </button>
      </div>
      <nav className="mobile-nav" id="mobile-navigation" aria-label={language === 'vi' ? 'Điều hướng di động' : 'Mobile navigation'} hidden={!menuOpen}>{navigation}</nav>
    </header>
  );
}
