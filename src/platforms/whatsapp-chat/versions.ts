import type { OsPlatformVariant } from '@/core/types';

export type WhatsAppUiVersion = 'ios_modern' | 'android_modern' | 'android_classic';

export interface WhatsAppVersionConfig {
  id: WhatsAppUiVersion;
  label: string;
  os: 'ios' | 'android';
  description: string;
  headerBgLight: string;
  headerBgDark: string;
  headerTextLight: string;
  headerTextDark: string;
  headerBorderLight: string;
  darkBgOnLightHeader: boolean;
  showMoreOverflowIcon: boolean;
  backIconStyle: 'chevron' | 'arrow';
  composerStyle: 'ios_plus_bar' | 'android_pill_fab';
  outgoingBubbleLight: string;
  outgoingBubbleDark: string;
  incomingBubbleLight: string;
  incomingBubbleDark: string;
  accentHex: string;
  sendButtonClass: string;
}

export const WHATSAPP_VERSION_CONFIGS: Record<WhatsAppUiVersion, WhatsAppVersionConfig> = {
  ios_modern: {
    id: 'ios_modern',
    label: 'iOS (WhatsApp 2025/2026)',
    os: 'ios',
    description: 'Translucent light/dark nav bar, iOS back chevron, Video & Voice icons, bottom + composer.',
    headerBgLight: '#F6F6F6',
    headerBgDark: '#1C1C1E',
    headerTextLight: '#0F172A',
    headerTextDark: '#FFFFFF',
    headerBorderLight: 'border-b border-black/10',
    darkBgOnLightHeader: false,
    showMoreOverflowIcon: false,
    backIconStyle: 'chevron',
    composerStyle: 'ios_plus_bar',
    outgoingBubbleLight: '#D9FDD3',
    outgoingBubbleDark: '#005C4B',
    incomingBubbleLight: '#FFFFFF',
    incomingBubbleDark: '#202C33',
    accentHex: '#1DAA61',
    sendButtonClass: 'bg-[#1DAA61]',
  },
  android_modern: {
    id: 'android_modern',
    label: 'Android Material (2025/2026)',
    os: 'android',
    description: 'Clean white/dark Material top bar, Back arrow + 3-dot menu, Paperclip & green Mic FAB.',
    headerBgLight: '#FFFFFF',
    headerBgDark: '#0B141A',
    headerTextLight: '#111B21',
    headerTextDark: '#E9EDEF',
    headerBorderLight: 'border-b border-black/10',
    darkBgOnLightHeader: false,
    showMoreOverflowIcon: true,
    backIconStyle: 'arrow',
    composerStyle: 'android_pill_fab',
    outgoingBubbleLight: '#D9FDD3',
    outgoingBubbleDark: '#005C4B',
    incomingBubbleLight: '#FFFFFF',
    incomingBubbleDark: '#202C33',
    accentHex: '#1DAA61',
    sendButtonClass: 'bg-[#1DAA61]',
  },
  android_classic: {
    id: 'android_classic',
    label: 'Android Classic Teal',
    os: 'android',
    description: 'Traditional deep-teal WhatsApp Android header bar (#008069) with classic Material composer.',
    headerBgLight: '#008069',
    headerBgDark: '#1F2C34',
    headerTextLight: '#FFFFFF',
    headerTextDark: '#E9EDEF',
    headerBorderLight: '',
    darkBgOnLightHeader: true,
    showMoreOverflowIcon: true,
    backIconStyle: 'arrow',
    composerStyle: 'android_pill_fab',
    outgoingBubbleLight: '#E7FFDB',
    outgoingBubbleDark: '#005C4B',
    incomingBubbleLight: '#FFFFFF',
    incomingBubbleDark: '#202C33',
    accentHex: '#00A884',
    sendButtonClass: 'bg-[#00A884]',
  },
};

export function resolveWhatsAppVersionConfig(
  version: WhatsAppUiVersion | undefined,
  osVariant: OsPlatformVariant
): WhatsAppVersionConfig {
  if (version && WHATSAPP_VERSION_CONFIGS[version]) {
    return WHATSAPP_VERSION_CONFIGS[version];
  }
  return osVariant === 'android'
    ? WHATSAPP_VERSION_CONFIGS.android_modern
    : WHATSAPP_VERSION_CONFIGS.ios_modern;
}
