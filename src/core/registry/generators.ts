import type { GeneratorManifest } from '@/core/types';
import { WHATSAPP_CHAT_CONFIG } from '@/platforms/whatsapp-chat/config';
import { WHATSAPP_GROUP_CHAT_CONFIG } from '@/platforms/whatsapp-group-chat/config';
import { INSTAGRAM_DM_CONFIG } from '@/platforms/instagram-dm/config';
import { INSTAGRAM_STORY_CONFIG } from '@/platforms/instagram-story/config';
import { INSTAGRAM_POST_CONFIG } from '@/platforms/instagram-post/config';
import { IMESSAGE_CONFIG } from '@/platforms/imessage/config';
import { ANDROID_MESSAGES_CONFIG } from '@/platforms/android-messages/config';
import { TELEGRAM_CHAT_CONFIG } from '@/platforms/telegram-chat/config';
import { DISCORD_CHAT_CONFIG } from '@/platforms/discord-chat/config';
import { FAKE_CALL_CONFIG } from '@/platforms/fake-call-screen/config';

export const GENERATOR_MANIFESTS: GeneratorManifest[] = [
  WHATSAPP_CHAT_CONFIG,
  WHATSAPP_GROUP_CHAT_CONFIG,
  INSTAGRAM_DM_CONFIG,
  INSTAGRAM_STORY_CONFIG,
  INSTAGRAM_POST_CONFIG,
  IMESSAGE_CONFIG,
  ANDROID_MESSAGES_CONFIG,
  TELEGRAM_CHAT_CONFIG,
  DISCORD_CHAT_CONFIG,
  FAKE_CALL_CONFIG,
];

export const GENERATOR_MAP = Object.fromEntries(
  GENERATOR_MANIFESTS.map((m) => [m.id, m])
) as Record<string, GeneratorManifest>;

export function getGeneratorBySlug(slug: string): GeneratorManifest | undefined {
  return GENERATOR_MANIFESTS.find((g) => g.slug === slug || g.routeSlug === slug);
}

export function getGeneratorByRouteSlug(routeSlug: string): GeneratorManifest | undefined {
  return GENERATOR_MANIFESTS.find((g) => g.routeSlug === routeSlug);
}

export function getGeneratorHref(idOrSlug: string): string {
  const found = GENERATOR_MAP[idOrSlug] ?? getGeneratorBySlug(idOrSlug);
  return found ? found.routePath : '/generators';
}
