export type SupportedLocaleCode =
  | 'en'
  | 'hi'
  | 'es'
  | 'pt'
  | 'fr'
  | 'de'
  | 'ar'
  | 'id';

export interface LocaleConfig {
  code: SupportedLocaleCode;
  hreflang: string;
  label: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
  published: boolean; // Only emit hreflang alternates for live, human-reviewed localized routes
  uiStrings: {
    online: string;
    typing: string;
    today: string;
    delivered: string;
    read: string;
    messagePlaceholder: string;
  };
}

export const SITE_BASE_URL = 'https://chatforge.studio';

export const LOCALES: Record<SupportedLocaleCode, LocaleConfig> = {
  en: {
    code: 'en',
    hreflang: 'en',
    label: 'English',
    nativeName: 'English',
    direction: 'ltr',
    published: true,
    uiStrings: {
      online: 'online',
      typing: 'typing...',
      today: 'Today',
      delivered: 'Delivered',
      read: 'Read',
      messagePlaceholder: 'Message',
    },
  },
  hi: {
    code: 'hi',
    hreflang: 'hi',
    label: 'Hindi',
    nativeName: 'हिन्दी',
    direction: 'ltr',
    published: false,
    uiStrings: {
      online: 'ऑनलाइन',
      typing: 'टाइप कर रहे हैं...',
      today: 'आज',
      delivered: 'डिलीवर किया गया',
      read: 'पढ़ा गया',
      messagePlaceholder: 'संदेश',
    },
  },
  es: {
    code: 'es',
    hreflang: 'es',
    label: 'Spanish',
    nativeName: 'Español',
    direction: 'ltr',
    published: false,
    uiStrings: {
      online: 'en línea',
      typing: 'escribiendo...',
      today: 'Hoy',
      delivered: 'Entregado',
      read: 'Leído',
      messagePlaceholder: 'Mensaje',
    },
  },
  pt: {
    code: 'pt',
    hreflang: 'pt-BR',
    label: 'Portuguese',
    nativeName: 'Português',
    direction: 'ltr',
    published: false,
    uiStrings: {
      online: 'online',
      typing: 'digitando...',
      today: 'Hoje',
      delivered: 'Entregue',
      read: 'Lida',
      messagePlaceholder: 'Mensagem',
    },
  },
  fr: {
    code: 'fr',
    hreflang: 'fr',
    label: 'French',
    nativeName: 'Français',
    direction: 'ltr',
    published: false,
    uiStrings: {
      online: 'en ligne',
      typing: 'en train d’écrire...',
      today: "Aujourd'hui",
      delivered: 'Distribué',
      read: 'Lu',
      messagePlaceholder: 'Message',
    },
  },
  de: {
    code: 'de',
    hreflang: 'de',
    label: 'German',
    nativeName: 'Deutsch',
    direction: 'ltr',
    published: false,
    uiStrings: {
      online: 'online',
      typing: 'schreibt...',
      today: 'Heute',
      delivered: 'Zugestellt',
      read: 'Gelesen',
      messagePlaceholder: 'Nachricht',
    },
  },
  ar: {
    code: 'ar',
    hreflang: 'ar',
    label: 'Arabic',
    nativeName: 'العربية',
    direction: 'rtl',
    published: false,
    uiStrings: {
      online: 'متصل الآن',
      typing: 'يكتب...',
      today: 'اليوم',
      delivered: 'تم التسليم',
      read: 'تمت القراءة',
      messagePlaceholder: 'رسالة',
    },
  },
  id: {
    code: 'id',
    hreflang: 'id',
    label: 'Indonesian',
    nativeName: 'Bahasa Indonesia',
    direction: 'ltr',
    published: false,
    uiStrings: {
      online: 'online',
      typing: 'mengetik...',
      today: 'Hari ini',
      delivered: 'Terkirim',
      read: 'Dibaca',
      messagePlaceholder: 'Pesan',
    },
  },
};

export const PUBLISHED_LOCALES = Object.values(LOCALES).filter((l) => l.published);

export function buildHreflangAlternates(pathname: string): Record<string, string> {
  const normalized = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const languages: Record<string, string> = {};

  for (const locale of PUBLISHED_LOCALES) {
    const url =
      locale.code === 'en'
        ? `${SITE_BASE_URL}${normalized}`
        : `${SITE_BASE_URL}/${locale.code}${normalized === '/' ? '' : normalized}`;
    languages[locale.hreflang] = url;
  }

  languages['x-default'] = `${SITE_BASE_URL}${normalized}`;
  return languages;
}

export function getLocaleConfig(code?: string): LocaleConfig {
  if (code && code in LOCALES) {
    return LOCALES[code as SupportedLocaleCode];
  }
  return LOCALES.en;
}
