# URL Architecture, Redirects & Indexation Mapping

**Prepared by:** Senior Technical SEO Specialist  
**Date:** November 25, 2026  

---

## 1. Indexable Canonical URL Tree

```text
https://chatforge.studio
├── /                                                   [SSG | Index | Priority 1.0]
├── /generators                                         [SSR | Index | Priority 0.9]
│   ├── /whatsapp-chat                                  [SSG | Index | Priority 0.9]
│   ├── /whatsapp-group-chat                            [SSG | Index | Priority 0.9]
│   ├── /instagram-dm                                   [SSG | Index | Priority 0.9]
│   ├── /instagram-story                                [SSG | Index | Priority 0.9]
│   ├── /instagram-post                                 [SSG | Index | Priority 0.9]
│   ├── /imessage                                       [SSG | Index | Priority 0.9]
│   ├── /android-messages                               [SSG | Index | Priority 0.9]
│   ├── /telegram-chat                                  [SSG | Index | Priority 0.9]
│   ├── /discord-chat                                   [SSG | Index | Priority 0.9]
│   └── /fake-call-screen                               [SSG | Index | Priority 0.9]
└── /blog                                               [SSG | Index | Priority 0.8]
    ├── /how-to-spot-fake-whatsapp-screenshots          [SSG | Index | Priority 0.75]
    └── /are-fake-chat-generators-legal-and-safe        [SSG | Index | Priority 0.75]
```

## 2. Non-Indexable / Disallowed Utility Routes

| Route Pattern | Directive | Rationale |
|:---|:---|:---|
| `/offline` | `robots: { index: false, follow: false }` + `robots.txt Disallow` | PWA offline shell fallback; no search value |
| `/api/*` | `robots.txt Disallow: /api/` | Internal API/sync namespace |
| `/studio/*` | `robots.txt Disallow: /studio/` | Editor-only / prop-mode workspace routes without public editorial content |
| `/generators/[slug]?*` | Self-referencing canonical `/generators/[slug]` | Prevents query-parameter duplication from `?q=` or preset flags |

## 3. Configured 301 Permanent Redirects (`next.config.ts`)

| Legacy / Alias Path | Permanent 301 Destination | Purpose |
|:---|:---|:---|
| `/generators/whatsapp` | `/generators/whatsapp-chat` | Captures shortened slug guesses |
| `/generators/fake-whatsapp-chat-generator` | `/generators/whatsapp-chat` | Consolidates verbose legacy keyword slugs |
| `/generators/iphone-imessage` | `/generators/imessage` | Consolidates iPhone alias to canonical `/imessage` |
| `/generators/text-message` | `/generators/imessage` | Consolidates generic text-message alias |
| `/generators/sms` | `/generators/android-messages` | Maps SMS shorthand to Android Messages RCS/SMS |
| `/generators/telegram` | `/generators/telegram-chat` | Captures shortened Telegram slug |
| `/generators/discord` | `/generators/discord-chat` | Captures shortened Discord slug |
| `/generators/call-screen` | `/generators/fake-call-screen` | Captures shortened call screen slug |
| `/directory` & `/tools` | `/generators` | Consolidates alternative hub paths |
