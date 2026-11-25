'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { TooltipProvider } from '@/components/ui/primitives';

type SiteTheme = 'light' | 'dark';

interface ThemeContextValue {
  siteTheme: SiteTheme;
  toggleSiteTheme: () => void;
  setSiteTheme: (theme: SiteTheme) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  siteTheme: 'light',
  toggleSiteTheme: () => {},
  setSiteTheme: () => {},
});

export function useSiteTheme() {
  return useContext(ThemeContext);
}

export function SiteThemeProvider({ children }: { children: React.ReactNode }) {
  const [siteTheme, setSiteThemeState] = useState<SiteTheme>(() => {
    if (typeof window !== 'undefined') {
      const saved = window.localStorage.getItem('chatforge_site_theme');
      if (saved === 'dark' || saved === 'light') return saved;
    }
    return 'light';
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', siteTheme === 'dark');
  }, [siteTheme]);

  const setSiteTheme = (next: SiteTheme) => {
    setSiteThemeState(next);
    window.localStorage.setItem('chatforge_site_theme', next);
  };

  const toggleSiteTheme = () => {
    setSiteTheme(siteTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ siteTheme, toggleSiteTheme, setSiteTheme }}>
      <TooltipProvider delayDuration={250}>{children}</TooltipProvider>
    </ThemeContext.Provider>
  );
}
