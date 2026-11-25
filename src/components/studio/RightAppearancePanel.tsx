'use client';

import React, { useState } from 'react';
import { ImagePlus, RotateCcw, ShieldCheck } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/primitives';
import { Button } from '@/components/ui/button';
import { LOCALES, getLocaleConfig, type SupportedLocaleCode } from '@/core/i18n/locales';
import { GENERATOR_MAP } from '@/core/registry/generators';
import { validateImageFileUpload } from '@/core/security/validation';
import { getActiveConversation, useStudioStore } from '@/core/store/useStudioStore';
import {
  WHATSAPP_VERSION_CONFIGS,
  type WhatsAppUiVersion,
} from '@/platforms/whatsapp-chat/versions';
import type { ColorSchemeMode, DeviceFramePreset, OsPlatformVariant } from '@/core/types';

export function RightAppearancePanel({
  onExportJson,
  onImportJsonFile,
}: {
  onExportJson: () => void;
  onImportJsonFile: (file: File) => void;
}) {
  const project = useStudioStore((s) => s.project);
  const updateTheme = useStudioStore((s) => s.updateTheme);
  const updateStatusBar = useStudioStore((s) => s.updateStatusBar);
  const updateHeaderState = useStudioStore((s) => s.updateHeaderState);
  const setDeviceFrame = useStudioStore((s) => s.setDeviceFrame);
  const setSafetyBadge = useStudioStore((s) => s.setSafetyBadge);
  const [wallpaperError, setWallpaperError] = useState<string | null>(null);

  const conv = getActiveConversation(project);
  const manifest = GENERATOR_MAP[project.platformId];
  const isWhatsApp =
    project.platformId === 'whatsapp-chat' ||
    project.platformId === 'whatsapp-group-chat';

  const handleWallpaperUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setWallpaperError(null);
    try {
      const safeDataUrl = await validateImageFileUpload(file);
      updateTheme({ wallpaper: { kind: 'image', value: safeDataUrl } });
    } catch (err) {
      setWallpaperError(err instanceof Error ? err.message : 'Invalid wallpaper image.');
    }
  };

  return (
    <div className="space-y-5 p-3.5 text-xs">
      {/* Theme & OS */}
      <section className="space-y-2.5">
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          Theme & Platform Style
        </h3>

        {manifest?.capabilities.supportsDarkMode && (
          <div className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2.5 dark:border-slate-800">
            <span className="font-medium text-slate-800 dark:text-slate-200">
              Dark Mode Preview
            </span>
            <Switch
              aria-label="Toggle mockup dark mode"
              checked={project.theme.colorScheme === 'dark'}
              onCheckedChange={(checked) =>
                updateTheme({ colorScheme: (checked ? 'dark' : 'light') as ColorSchemeMode })
              }
            />
          </div>
        )}

        {isWhatsApp ? (
          <div className="space-y-2.5">
            <label className="block space-y-1">
              <span className="font-medium text-slate-600 dark:text-slate-400">
                WhatsApp Version &amp; OS
              </span>
              <select
                aria-label="WhatsApp UI version"
                value={
                  project.theme.uiVersion ??
                  (project.theme.osVariant === 'android'
                    ? 'android_modern'
                    : 'ios_modern')
                }
                onChange={(e) => {
                  const nextVersion = e.target.value as WhatsAppUiVersion;
                  const cfg = WHATSAPP_VERSION_CONFIGS[nextVersion];
                  updateTheme({
                    uiVersion: nextVersion,
                    osVariant: cfg.os,
                  });
                  updateStatusBar({
                    notchStyle: cfg.os === 'android' ? 'punch_hole' : 'dynamic_island',
                  });
                }}
                className="flex h-9 w-full rounded-lg border border-slate-200 bg-white px-2.5 text-xs dark:border-slate-700 dark:bg-slate-900"
              >
                {Object.values(WHATSAPP_VERSION_CONFIGS).map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.label}
                  </option>
                ))}
              </select>
            </label>

            <div className="grid grid-cols-2 gap-2">
              <label className="block space-y-1">
                <span className="font-medium text-slate-600 dark:text-slate-400">
                  Bubble Style
                </span>
                <select
                  aria-label="WhatsApp bubble style"
                  value={project.theme.bubbleStyle}
                  onChange={(e) =>
                    updateTheme({
                      bubbleStyle: e.target.value as typeof project.theme.bubbleStyle,
                    })
                  }
                  className="flex h-9 w-full rounded-lg border border-slate-200 bg-white px-2 text-xs dark:border-slate-700 dark:bg-slate-900"
                >
                  <option value="native">Classic Tail</option>
                  <option value="whatsapp_modern_pill">Soft Pill</option>
                  <option value="whatsapp_high_contrast">High Contrast</option>
                </select>
              </label>

              <label className="block space-y-1">
                <span className="font-medium text-slate-600 dark:text-slate-400">
                  Text Size
                </span>
                <select
                  aria-label="Chat text size"
                  value={String(project.theme.typography.fontScale)}
                  onChange={(e) =>
                    updateTheme({
                      typography: {
                        ...project.theme.typography,
                        fontScale: Number(e.target.value) || 1,
                      },
                    })
                  }
                  className="flex h-9 w-full rounded-lg border border-slate-200 bg-white px-2 text-xs dark:border-slate-700 dark:bg-slate-900"
                >
                  <option value="0.88">Small (0.88x)</option>
                  <option value="1">Default (1x)</option>
                  <option value="1.12">Large (1.12x)</option>
                  <option value="1.25">Extra Large (1.25x)</option>
                </select>
              </label>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-800">
              <span className="font-medium text-slate-800 dark:text-slate-200">
                E2E Encryption Banner
              </span>
              <Switch
                aria-label="Toggle encryption notice"
                checked={conv.headerState.isEncryptedNoticeVisible ?? true}
                onCheckedChange={(checked) =>
                  updateHeaderState({ isEncryptedNoticeVisible: checked })
                }
              />
            </div>

            <div className="space-y-1.5">
              <label className="block space-y-1">
                <span className="font-medium text-slate-600 dark:text-slate-400">
                  Chat Wallpaper
                </span>
                <select
                  aria-label="Chat wallpaper preset"
                  value={
                    project.theme.wallpaper.kind === 'default_pattern'
                      ? 'default_pattern'
                      : project.theme.wallpaper.kind === 'image'
                        ? 'custom_image'
                        : project.theme.wallpaper.value
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === 'default_pattern') {
                      updateTheme({
                        wallpaper: { kind: 'default_pattern', value: '#EFEAE2' },
                      });
                    } else if (val !== 'custom_image') {
                      updateTheme({ wallpaper: { kind: 'solid', value: val } });
                    }
                  }}
                  className="flex h-9 w-full rounded-lg border border-slate-200 bg-white px-2.5 text-xs dark:border-slate-700 dark:bg-slate-900"
                >
                  <option value="default_pattern">Classic Doodle Pattern</option>
                  <option value="#EFEAE2">Warm Sand (#EFEAE2)</option>
                  <option value="#D9FDD3">Mint Tint (#D9FDD3)</option>
                  <option value="#E0F2FE">Sky Calm (#E0F2FE)</option>
                  <option value="#F8FAFC">Clean White (#F8FAFC)</option>
                  {project.theme.wallpaper.kind === 'image' && (
                    <option value="custom_image">Custom Uploaded Image</option>
                  )}
                </select>
              </label>

              <div className="flex items-center gap-2">
                <label className="inline-flex h-8 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 text-[11px] font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                  <ImagePlus className="h-3.5 w-3.5" />
                  <span>Upload Wallpaper</span>
                  <input
                    type="file"
                    accept="image/*"
                    aria-label="Upload custom wallpaper"
                    onChange={handleWallpaperUpload}
                    className="sr-only"
                  />
                </label>
                {project.theme.wallpaper.kind !== 'default_pattern' && (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      updateTheme({
                        wallpaper: { kind: 'default_pattern', value: '#EFEAE2' },
                      })
                    }
                  >
                    <RotateCcw className="h-3 w-3" />
                  </Button>
                )}
              </div>
              {wallpaperError && (
                <p role="alert" className="text-[11px] font-medium text-rose-600">
                  {wallpaperError}
                </p>
              )}
            </div>
          </div>
        ) : (
          manifest?.capabilities.supportsOsSwitch && (
            <label className="block space-y-1">
              <span className="font-medium text-slate-600 dark:text-slate-400">
                OS Skin Variant
              </span>
              <select
                aria-label="OS Skin Variant"
                value={project.theme.osVariant}
                onChange={(e) =>
                  updateTheme({ osVariant: e.target.value as OsPlatformVariant })
                }
                className="flex h-9 w-full rounded-lg border border-slate-200 bg-white px-2.5 text-xs dark:border-slate-700 dark:bg-slate-900"
              >
                <option value="ios">iOS (Dynamic Island)</option>
                <option value="android">Android (Material / Punch-Hole)</option>
                <option value="generic_filmsafe">Film-Safe Generic (No Trademarks)</option>
              </select>
            </label>
          )
        )}

        {project.platformId === 'instagram-dm' && (
          <div className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-800">
            <span className="font-medium text-slate-800 dark:text-slate-200">
              Vanish Mode Header
            </span>
            <Switch
              aria-label="Toggle Instagram vanish mode"
              checked={conv.headerState.isVanishMode ?? false}
              onCheckedChange={(checked) => updateHeaderState({ isVanishMode: checked })}
            />
          </div>
        )}

        {project.platformId === 'imessage' && (
          <label className="block space-y-1">
            <span className="font-medium text-slate-600 dark:text-slate-400">
              Bubble Color Mode
            </span>
            <select
              aria-label="iMessage bubble style"
              value={project.theme.bubbleStyle}
              onChange={(e) =>
                updateTheme({
                  bubbleStyle: e.target.value as 'imessage_blue' | 'sms_green',
                })
              }
              className="flex h-9 w-full rounded-lg border border-slate-200 bg-white px-2.5 text-xs dark:border-slate-700 dark:bg-slate-900"
            >
              <option value="imessage_blue">Blue (iMessage)</option>
              <option value="sms_green">Green (SMS Text)</option>
            </select>
          </label>
        )}

        <label className="block space-y-1">
          <span className="font-medium text-slate-600 dark:text-slate-400">
            Device Frame
          </span>
          <select
            aria-label="Customize device frame"
            value={project.exportSettings.deviceFrame}
            onChange={(e) => setDeviceFrame(e.target.value as DeviceFramePreset)}
            className="flex h-9 w-full rounded-lg border border-slate-200 bg-white px-2.5 text-xs dark:border-slate-700 dark:bg-slate-900"
          >
            <option value="iphone_16_pro">iPhone Bezel</option>
            <option value="pixel_9">Android Pixel Bezel</option>
            <option value="browser_window">Desktop Browser Card</option>
            <option value="none">Clean Screen Only</option>
          </select>
        </label>
      </section>

      {/* Header, Network & Battery Settings */}
      <section className="space-y-2.5 border-t border-slate-200 pt-4 dark:border-slate-800">
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          Status Bar, Network & Battery
        </h3>

        {project.archetype === 'chat_thread' && (
          <div className="space-y-1.5">
            <label className="block space-y-1">
              <span className="font-medium text-slate-600 dark:text-slate-400">
                Online Status / Last Seen
              </span>
              <Input
                aria-label="Contact status or last seen"
                value={conv.headerState.statusText ?? ''}
                onChange={(e) => updateHeaderState({ statusText: e.target.value })}
                placeholder="online"
                className="h-8 text-xs"
              />
            </label>
            <div className="flex flex-wrap gap-1">
              {[
                { label: 'Online', value: 'online' },
                { label: 'Typing...', value: 'typing...' },
                { label: 'Recording', value: 'recording audio...' },
                { label: 'Last Seen', value: 'last seen today at 9:41 AM' },
              ].map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => updateHeaderState({ statusText: preset.value })}
                  className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 cursor-pointer"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-800">
          <span className="font-medium text-slate-800 dark:text-slate-200">
            Show Top Status Bar
          </span>
          <Switch
            aria-label="Show top status bar"
            checked={project.theme.statusBar.visible}
            onCheckedChange={(visible) => updateStatusBar({ visible })}
          />
        </div>

        {project.theme.statusBar.visible && (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <label className="space-y-1">
                <span className="text-[11px] text-slate-500">Clock</span>
                <Input
                  value={project.theme.statusBar.timeLabel}
                  onChange={(e) => updateStatusBar({ timeLabel: e.target.value })}
                  className="h-8 text-xs"
                />
              </label>
              <label className="space-y-1">
                <span className="text-[11px] text-slate-500">Battery %</span>
                <Input
                  type="number"
                  min={1}
                  max={100}
                  value={project.theme.statusBar.batteryPercent}
                  onChange={(e) =>
                    updateStatusBar({
                      batteryPercent: Math.max(
                        1,
                        Math.min(100, Number(e.target.value) || 50)
                      ),
                    })
                  }
                  className="h-8 text-xs"
                />
              </label>
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              <label className="space-y-1">
                <span className="text-[10px] text-slate-500">Network</span>
                <select
                  aria-label="Carrier network label"
                  value={project.theme.statusBar.carrierLabel ?? '5G'}
                  onChange={(e) => updateStatusBar({ carrierLabel: e.target.value })}
                  className="h-8 w-full rounded-lg border border-slate-200 bg-white px-1.5 text-[11px] dark:border-slate-700 dark:bg-slate-900"
                >
                  <option value="5G">5G</option>
                  <option value="LTE">LTE</option>
                  <option value="4G">4G</option>
                  <option value="">None</option>
                </select>
              </label>
              <label className="space-y-1">
                <span className="text-[10px] text-slate-500">Signal</span>
                <select
                  aria-label="Cellular signal bars"
                  value={project.theme.statusBar.signalBars}
                  onChange={(e) =>
                    updateStatusBar({
                      signalBars: Number(e.target.value) as 0 | 1 | 2 | 3 | 4,
                    })
                  }
                  className="h-8 w-full rounded-lg border border-slate-200 bg-white px-1.5 text-[11px] dark:border-slate-700 dark:bg-slate-900"
                >
                  <option value={4}>4 bars</option>
                  <option value={3}>3 bars</option>
                  <option value={2}>2 bars</option>
                  <option value={1}>1 bar</option>
                  <option value={0}>No signal</option>
                </select>
              </label>
              <label className="space-y-1">
                <span className="text-[10px] text-slate-500">Wi-Fi</span>
                <select
                  aria-label="Wi-Fi signal"
                  value={project.theme.statusBar.wifiBars}
                  onChange={(e) =>
                    updateStatusBar({
                      wifiBars: Number(e.target.value) as 0 | 1 | 2 | 3,
                    })
                  }
                  className="h-8 w-full rounded-lg border border-slate-200 bg-white px-1.5 text-[11px] dark:border-slate-700 dark:bg-slate-900"
                >
                  <option value={3}>Connected</option>
                  <option value={0}>Off</option>
                </select>
              </label>
            </div>
          </div>
        )}
      </section>

      {/* Typography & RTL */}
      <section className="space-y-2.5 border-t border-slate-200 pt-4 dark:border-slate-800">
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          Localization & Safety
        </h3>

        <label className="block space-y-1">
          <span className="font-medium text-slate-600 dark:text-slate-400">
            Mockup Language
          </span>
          <select
            aria-label="Mockup UI language"
            value={project.theme.typography.locale}
            onChange={(e) => {
              const cfg = getLocaleConfig(e.target.value as SupportedLocaleCode);
              updateTheme({
                typography: {
                  ...project.theme.typography,
                  locale: cfg.code,
                  direction: cfg.direction,
                },
              });
              updateHeaderState({ statusText: cfg.uiStrings.online });
            }}
            className="flex h-9 w-full rounded-lg border border-slate-200 bg-white px-2.5 text-xs dark:border-slate-700 dark:bg-slate-900"
          >
            {Object.values(LOCALES).map((loc) => (
              <option key={loc.code} value={loc.code}>
                {loc.label} ({loc.nativeName})
              </option>
            ))}
          </select>
        </label>

        <div className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-800">
          <span className="font-medium text-slate-800 dark:text-slate-200">
            RTL Layout (Arabic / Hebrew)
          </span>
          <Switch
            aria-label="Toggle RTL layout"
            checked={project.theme.typography.direction === 'rtl'}
            onCheckedChange={(rtl) =>
              updateTheme({
                typography: {
                  ...project.theme.typography,
                  direction: rtl ? 'rtl' : 'ltr',
                },
              })
            }
          />
        </div>

        <div className="flex items-center justify-between rounded-xl border border-blue-200 bg-blue-50/50 px-3 py-2 dark:border-blue-900/50 dark:bg-blue-950/20">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
            <span className="font-medium text-slate-800 dark:text-slate-200">
              &ldquo;Simulated&rdquo; Label
            </span>
          </div>
          <Switch
            aria-label="Toggle simulated disclosure label"
            checked={project.theme.safetyBadge.enabled}
            onCheckedChange={setSafetyBadge}
          />
        </div>
      </section>

      {/* Project File Portability */}
      <section className="space-y-2 border-t border-slate-200 pt-4 dark:border-slate-800">
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          Project File Backup
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <Button type="button" variant="outline" size="sm" onClick={onExportJson}>
            Save .JSON
          </Button>
          <label className="inline-flex h-8 cursor-pointer items-center justify-center rounded-md border border-slate-200 bg-white px-3 text-xs font-medium text-slate-900 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
            Load .JSON
            <input
              type="file"
              accept=".json,application/json"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onImportJsonFile(file);
                e.target.value = '';
              }}
              className="sr-only"
            />
          </label>
        </div>
      </section>
    </div>
  );
}
