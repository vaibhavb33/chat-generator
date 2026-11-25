import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Camera,
  Flame,
  Hash,
  Image as ImageIcon,
  MessageCircle,
  MessageSquare,
  PhoneCall,
  Send,
  Smartphone,
  Sparkles,
  Users,
} from 'lucide-react';
import type { GeneratorManifest } from '@/core/types';
import { Badge } from '@/components/ui/input';
import { cn } from '@/lib/utils';

function PlatformBadgeIcon({ id }: { id: string }) {
  const cls = 'h-3.5 w-3.5';
  switch (id) {
    case 'whatsapp-chat':
      return <MessageCircle className={cls} aria-hidden="true" />;
    case 'whatsapp-group-chat':
      return <Users className={cls} aria-hidden="true" />;
    case 'instagram-dm':
      return <Camera className={cls} aria-hidden="true" />;
    case 'instagram-story':
      return <Smartphone className={cls} aria-hidden="true" />;
    case 'instagram-post':
      return <ImageIcon className={cls} aria-hidden="true" />;
    case 'imessage':
    case 'android-messages':
      return <MessageSquare className={cls} aria-hidden="true" />;
    case 'telegram-chat':
      return <Send className={cls} aria-hidden="true" />;
    case 'discord-chat':
      return <Hash className={cls} aria-hidden="true" />;
    case 'fake-call-screen':
      return <PhoneCall className={cls} aria-hidden="true" />;
    default:
      return <MessageCircle className={cls} aria-hidden="true" />;
  }
}

function buildPreviewSvgDataUrl(manifest: GeneratorManifest): string {
  const palette: Record<string, { bg1: string; bg2: string; bubble: string; label: string }> = {
    'whatsapp-chat': { bg1: '#059669', bg2: '#0f766e', bubble: '#d9fdd3', label: 'WhatsApp 1:1' },
    'whatsapp-group-chat': { bg1: '#0d9488', bg2: '#047857', bubble: '#d9fdd3', label: 'Group Thread' },
    'instagram-dm': { bg1: '#c026d3', bg2: '#4f46e5', bubble: '#7c3aed', label: 'Instagram DM' },
    'instagram-story': { bg1: '#ec4899', bg2: '#f59e0b', bubble: '#ffffff', label: '9:16 Story' },
    'instagram-post': { bg1: '#9333ea', bg2: '#db2777', bubble: '#f3e8ff', label: 'Feed 4:5' },
    imessage: { bg1: '#2563eb', bg2: '#4f46e5', bubble: '#007aff', label: 'iOS iMessage' },
    'android-messages': { bg1: '#0284c7', bg2: '#1d4ed8', bubble: '#1a73e8', label: 'Material RCS' },
    'telegram-chat': { bg1: '#06b6d4', bg2: '#2563eb', bubble: '#effdde', label: 'Telegram UI' },
    'discord-chat': { bg1: '#4f46e5', bg2: '#312e81', bubble: '#5865f2', label: '#general' },
    'fake-call-screen': { bg1: '#6d28d9', bg2: '#1e3a8a', bubble: '#10b981', label: 'Incoming Call' },
  };
  const colors = palette[manifest.id] ?? palette['whatsapp-chat'];
  const isStory = manifest.capabilities.archetype === 'ephemeral_story';
  const isPost = manifest.capabilities.archetype === 'social_post';
  const isCall = manifest.capabilities.archetype === 'call_screen';

  let innerMarkup = `<rect x="44" y="18" width="192" height="92" rx="14" fill="rgba(255,255,255,0.94)"/>
    <rect x="56" y="32" width="96" height="20" rx="8" fill="#f1f5f9"/>
    <rect x="128" y="60" width="96" height="22" rx="8" fill="${colors.bubble}"/>
    <rect x="56" y="90" width="76" height="8" rx="4" fill="#cbd5e1"/>`;

  if (isStory) {
    innerMarkup = `<rect x="98" y="10" width="84" height="108" rx="14" fill="rgba(15,23,42,0.45)" stroke="rgba(255,255,255,0.45)"/>
      <rect x="108" y="20" width="30" height="3" rx="1.5" fill="#ffffff"/>
      <rect x="142" y="20" width="30" height="3" rx="1.5" fill="rgba(255,255,255,0.4)"/>
      <rect x="108" y="72" width="64" height="28" rx="6" fill="rgba(255,255,255,0.92)"/>`;
  } else if (isPost) {
    innerMarkup = `<rect x="74" y="12" width="132" height="104" rx="12" fill="#ffffff"/>
      <circle cx="90" cy="26" r="7" fill="${colors.bg1}"/>
      <rect x="102" y="23" width="54" height="6" rx="3" fill="#e2e8f0"/>
      <rect x="82" y="40" width="116" height="52" rx="8" fill="${colors.bubble}"/>
      <rect x="82" y="99" width="64" height="6" rx="3" fill="#cbd5e1"/>`;
  } else if (isCall) {
    innerMarkup = `<circle cx="140" cy="40" r="18" fill="rgba(255,255,255,0.24)" stroke="rgba(255,255,255,0.55)"/>
      <rect x="104" y="66" width="72" height="8" rx="4" fill="rgba(255,255,255,0.85)"/>
      <circle cx="116" cy="96" r="11" fill="#f43f5e"/>
      <circle cx="164" cy="96" r="11" fill="#10b981"/>`;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="280" height="128" viewBox="0 0 280 128">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${colors.bg1}"/><stop offset="100%" stop-color="${colors.bg2}"/></linearGradient></defs>
    <rect width="280" height="128" rx="16" fill="url(#g)"/>
    ${innerMarkup}
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function GeneratorCard({ manifest }: { manifest: GeneratorManifest }) {
  const previewSrc = buildPreviewSvgDataUrl(manifest);

  return (
    <Link
      href={manifest.routePath}
      data-testid={`generator-card-${manifest.slug}`}
      className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-700"
    >
      <div className="space-y-3">
        <div
          className={cn(
            'relative overflow-hidden rounded-xl bg-gradient-to-br',
            manifest.accentGradient
          )}
        >
          <img
            src={previewSrc}
            alt={`${manifest.name} preview mockup`}
            className="h-32 w-full object-cover"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/70 dark:text-indigo-400">
            <PlatformBadgeIcon id={manifest.id} />
          </span>
          <Badge variant="outline">{manifest.platformFamily}</Badge>
          {manifest.popular && (
            <Badge variant="accent">
              <Flame className="h-3 w-3" /> Popular
            </Badge>
          )}
          {manifest.recentlyAdded && (
            <Badge variant="success">
              <Sparkles className="h-3 w-3" /> New
            </Badge>
          )}
        </div>

        <div>
          <h3 className="text-base font-semibold text-slate-900 transition-colors group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
            {manifest.name}
          </h3>
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
            {manifest.tagline}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs font-semibold text-indigo-600 dark:border-slate-800 dark:text-indigo-400">
        <span>Create Now</span>
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}
