# API & Engine Contracts Specification

**Document Status:** Phase 2 Specification (Pending Approval)  
**Scope:** Internal Client-Side Engine Contracts + Optional Backend HTTP Route Handlers

---

## 1. Architecture Note on API Surface

Because core mockup rendering, PNG/HTML/PDF export, script parsing, undo/redo, and local persistence execute **100% in the browser**, the application has two API layers:
1. **Client-Side Engine APIs (TypeScript Modules):** Always available offline and without authentication.
2. **Optional HTTP REST Route Handlers (`/api/*`):** Next.js App Router endpoints used only for opt-in cloud sync, template delivery, AI script generation, and Stripe payments.

---

## 2. Client-Side Engine Contracts

### 2.1 Platform Registry API (`src/core/registry/`)

```typescript
export interface PlatformCapabilities {
  archetype: ArchetypeKind;
  supportsGroupChat: boolean;
  supportsDarkMode: boolean;
  supportsDimMode?: boolean;
  supportsOsSwitch: boolean; // iOS vs Android toggle
  supportsReadReceipts: boolean;
  supportsTypingIndicator: boolean;
  supportsReactions: boolean;
  supportsReplyQuotes: boolean;
  supportsStatusBar: boolean;
  supportedMessageTypes: MessageType[];
  supportedAspectRatios?: Array<'9:16' | '4:5' | '1:1' | '16:9'>;
  maxRecommendedParticipants?: number;
}

export interface PlatformManifest {
  id: string; // e.g. 'whatsapp-chat'
  name: string; // e.g. 'WhatsApp Chat'
  family: string; // e.g. 'whatsapp', 'instagram', 'apple', 'telegram', 'discord', 'system'
  category: 'messaging' | 'social_post' | 'story' | 'call_notification' | 'ai_chat' | 'b2b';
  capabilities: PlatformCapabilities;
  seo: {
    slug: string;
    primaryKeyword: string;
    badgeLabel?: string; // e.g. 'New', 'Popular'
  };
  loadRenderer: () => Promise<{ default: React.ComponentType<PlatformRendererProps> }>;
  loadTokens: () => Promise<PlatformTokenSet>;
}

export interface PlatformRendererProps {
  conversation: Conversation;
  participantsById: Record<string, Participant>;
  theme: PlatformTheme;
  assetsById: Record<string, string>; // Resolved ObjectURLs or URLs
  timelineState?: {
    visibleMessageCount: number;
    isTypingVisible: boolean;
    activeCallSeconds?: number;
  };
  interactive?: {
    onMessageClick?: (messageId: string) => void;
    onPropAdvance?: () => void;
  };
}
```

### 2.2 Export Engine API (`src/core/export/`)

```typescript
export interface ExportResult {
  blob: Blob;
  filename: string;
  mimeType: string;
  widthPx: number;
  heightPx: number;
  durationMs: number;
}

export interface IExportEngine {
  exportStaticImage(
    targetElement: HTMLElement,
    settings: ExportSettings,
    projectTitle: string
  ): Promise<ExportResult>;

  exportCarouselZip(
    targetElement: HTMLElement,
    settings: ExportSettings,
    projectTitle: string
  ): Promise<ExportResult>;

  exportSemanticHtml(
    project: Project,
    options: { includeInlineCss: boolean; platformFlavor: 'generic' | 'ao3_workskin' }
  ): Promise<{ html: string; css: string }>;

  exportPdf(
    targetElement: HTMLElement,
    projectTitle: string,
    monochrome: boolean
  ): Promise<ExportResult>;
}
```

### 2.3 Script-Paste Parser & Project File API (`src/core/engine/`)

```typescript
export interface ParsedScriptResult {
  participants: Array<{ name: string; isSelf: boolean }>;
  messages: Array<{
    senderName: string;
    type: MessageType;
    text: string;
    durationSeconds?: number;
    timestampHint?: string;
  }>;
  warnings: string[];
}

export function parseScreenplayText(rawText: string, selfNameHint?: string): ParsedScriptResult;
export function exportProjectBundle(project: Project, assets: Record<string, Blob>): Promise<Blob>;
export function importProjectBundle(file: File): Promise<{ project: Project; assets: Record<string, Blob> }>;
```

---

## 3. Optional HTTP Route Handlers (`/api/*`)

All server endpoints return standard JSON envelopes:
```json
// Success
{ "ok": true, "data": { ... } }

// Error
{ "ok": false, "error": { "code": "UNAUTHORIZED", "message": "...", "details": {} } }
```

### 3.1 `GET /api/health`
- **Auth:** Public
- **Response (`200`):** `{ "ok": true, "data": { "status": "healthy", "version": "1.0.0" } }`

### 3.2 `GET /api/templates`
- **Auth:** Public (cached at Edge via `Cache-Control: s-maxage=3600`)
- **Query Params:** `?category=customer_support&archetype=chat_thread&locale=en`
- **Response (`200`):**
  ```json
  {
    "ok": true,
    "data": {
      "templates": [
        {
          "id": "tpl_wa_support_01",
          "slug": "ecommerce-delivery-delay",
          "title": "Delivery Update & Refund Support",
          "category": "customer_support",
          "supportedArchetypes": ["chat_thread"],
          "roles": [...],
          "scriptMessages": [...]
        }
      ]
    }
  }
  ```

### 3.3 `GET /api/sync/projects` & `POST /api/sync/projects`
- **Auth:** Required (Supabase JWT Cookie / Bearer token)
- **`GET` Query Params:** `?since=2026-11-24T00:00:00Z` (delta sync)
- **`POST` Request Body:**
  ```json
  {
    "projects": [
      {
        "id": "uuid",
        "title": "Product Launch DM",
        "platformId": "instagram-dm",
        "archetype": "chat_thread",
        "schemaVersion": 1,
        "clientSyncVersion": 4,
        "updatedAt": "2026-11-25T01:00:00Z",
        "payload": { ... }
      }
    ]
  }
  ```
- **Conflict Resolution:** Optimistic concurrency via `sync_version`. If server `sync_version > clientSyncVersion`, returns `409 CONFLICT` with server copy so UI can offer "Keep Local" vs "Load Cloud".

### 3.4 `POST /api/sync/assets/presign`
- **Auth:** Required
- **Purpose:** Generates a signed upload URL (or signed download URL) for Supabase Storage `user-assets` bucket when syncing custom avatars/images.
- **Request Body:** `{ "assetId": "uuid", "mimeType": "image/webp", "byteSize": 42190, "sha256": "..." }`
- **Validation:** Enforces `byteSize <= 10MB` and allowed image/audio MIME types (`image/png`, `image/jpeg`, `image/webp`, `audio/mpeg`, `audio/webm`).

### 3.5 `POST /api/ai/generate-script`
- **Auth:** Optional (Free tier: IP + rate-limit or auth free quota of 3/day; Pro: unlimited within fair-use)
- **Request Body:**
  ```json
  {
    "platformId": "whatsapp-group-chat",
    "prompt": "3 friends planning a surprise birthday party and accidentally adding the birthday person",
    "tone": "comedic",
    "messageCount": 14,
    "locale": "en"
  }
  ```
- **Response (`200`):**
  ```json
  {
    "ok": true,
    "data": {
      "roles": [
        { "roleKey": "host", "defaultName": "Maya", "isSelf": true },
        { "roleKey": "friend_1", "defaultName": "Sam", "isSelf": false },
        { "roleKey": "birthday", "defaultName": "Jordan", "isSelf": false }
      ],
      "scriptMessages": [...]
    }
  }
  ```
- **Guardrails:** Rejects prompts requesting financial scams, impersonation of real named private individuals for harassment, or CSAM/abuse; enforces strict JSON schema validation on LLM output before returning.

### 3.6 `POST /api/billing/checkout` & `POST /api/webhooks/stripe`
- **Auth:** `checkout` requires Authenticated User; `webhooks/stripe` verifies `Stripe-Signature` HMAC header.
- **`POST /api/billing/checkout` Request:** `{ "plan": "pass_7d" | "creator_pro_monthly" | "agency_pro_monthly" | "lifetime" }`
- **Behavior:**
  - `pass_7d`: Stripe `mode: 'payment'` (non-renewing one-time pass; sets `entitlements.expires_at = now() + interval '7 days'`). Directly satisfies Phase 1 user feedback against forced auto-renewals.
  - `creator_pro_monthly` / `agency_pro_monthly`: Stripe `mode: 'subscription'` with self-serve Stripe Billing Portal (`1-click cancel`).
  - `lifetime`: Stripe `mode: 'payment'`.

---

## 4. Security & Rate Limiting Summary

| Endpoint | Rate Limit | Validation |
|:---|:---|:---|
| `/api/ai/generate-script` | Free: 3 req/day; Pro: 60 req/hr | Zod schema + safety classifier + max token cap |
| `/api/sync/*` | 120 req/min per user | Supabase JWT + RLS + Zod `Project` payload check (`max 2MB` JSON) |
| `/api/sync/assets/presign` | 30 req/min per user | MIME allowlist + 10MB cap |
| `/api/billing/checkout` | 10 req/min per user | Strict Price ID allowlist on server (never trust client price) |
