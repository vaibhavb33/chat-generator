'use client';

import { create } from 'zustand';
import type {
  ChatListRow,
  Conversation,
  DeviceFramePreset,
  DeviceType,
  EditableElementSelection,
  ExportFormat,
  Message,
  MessageType,
  Participant,
  PlatformTheme,
  PostCarouselSlide,
  Project,
  ReadReceiptStatus,
  ScreenViewMode,
  StoryElement,
  Template,
} from '@/core/types';
import { createDefaultTheme, createSeedProject } from '@/core/engine/seedData';
import { parseScreenplayText } from '@/core/engine/scriptParser';
import {
  deleteCustomTemplateFromIndexedDb,
  deleteProjectFromIndexedDb,
  listCustomTemplates,
  listSavedProjects,
  loadLatestProjectForPlatform,
  saveCustomTemplateToIndexedDb,
  saveProjectToIndexedDb,
} from '@/core/storage/indexedDb';
import type { TemplateCategory } from '@/core/types';
import { GENERATOR_MAP } from '@/core/registry/generators';

export type SaveStatus = 'saved' | 'unsaved' | 'saving' | 'error';
export type PreviewSyncStatus = 'active' | 'updating' | 'updated' | 'paused';
export type EditorLeftTab =
  | 'contact'
  | 'messages'
  | 'participants'
  | 'media'
  | 'templates'
  | 'animation'
  | 'appearance'
  | 'timeline';

const MAX_HISTORY = 50;

export interface StudioStore {
  project: Project;
  renderedProject: Project;
  past: Project[];
  future: Project[];
  savedProjects: Project[];
  customTemplates: Template[];
  saveStatus: SaveStatus;
  lastSavedAt: string | null;
  isHydrating: boolean;
  mutationVersion: number;
  errorMessage: string | null;

  ui: {
    selectedMessageId: string | null;
    selectedElement: EditableElementSelection | null;
    activeTab: EditorLeftTab;
    mobileDrawerOpen: boolean;
    editorOpen: boolean;
    previewZoom: number;
    livePreviewEnabled: boolean;
    previewSyncStatus: PreviewSyncStatus;
    isTimelineOpen: boolean;
    isPlayingTimeline: boolean;
    timelineVisibleCount: number;
    previewMode: boolean;
    isTypingPreview: boolean;
  };

  initPlatform: (platformId: string) => Promise<void>;
  switchPlatformInPlace: (platformId: string) => void;
  setProjectTitle: (title: string) => void;
  saveNow: () => Promise<void>;
  refreshSavedProjects: () => Promise<void>;
  duplicateCurrentProject: () => Promise<Project>;
  renameSavedProject: (projectId: string, newTitle: string) => Promise<void>;
  restoreProjectById: (projectId: string) => Promise<void>;
  deleteSavedProject: (projectId: string) => Promise<void>;
  setDeviceType: (device: DeviceType) => void;
  setAppearance: (mode: 'light' | 'dark') => void;
  setScreenViewMode: (mode: ScreenViewMode) => void;
  upsertChatListRow: (row: ChatListRow) => void;
  deleteChatListRow: (rowId: string) => void;
  setSelectedElement: (el: EditableElementSelection | null) => void;
  setPreviewZoom: (zoom: number) => void;
  setEditorOpen: (open: boolean) => void;
  resetToSeed: () => void;
  clearAllMessages: () => void;
  loadProject: (project: Project) => void;

  undo: () => void;
  redo: () => void;

  addMessage: (input: {
    id?: string;
    senderId: string;
    type?: MessageType;
    text: string;
    timestampLabel?: string;
    readStatus?: ReadReceiptStatus;
    forwardedLabel?: 'none' | 'forwarded' | 'frequently_forwarded';
    voiceDurationSeconds?: number;
    imageDataUrl?: string;
    replyToMessageId?: string;
    callOutcome?: 'answered' | 'missed' | 'declined' | 'cancelled';
    callMedia?: 'voice' | 'video';
    storyAuthorHandle?: string;
    docFileName?: string;
    locationPlace?: string;
    locationAddress?: string;
    contactName?: string;
    contactPhone?: string;
    isPinned?: boolean;
    commentLikes?: number;
    messageEffect?: Message['messageEffect'];
    linkUrl?: string;
    linkTitle?: string;
    linkDomain?: string;
    reactions?: Message['reactions'];
  }) => void;
  updateMessage: (messageId: string, patch: Partial<Message>) => void;
  duplicateMessage: (messageId: string) => void;
  switchMessageSender: (messageId: string, nextSenderId?: string) => void;
  deleteMessage: (messageId: string) => void;
  moveMessage: (messageId: string, direction: 'up' | 'down') => void;
  toggleMessageReaction: (messageId: string, emoji: string) => void;

  upsertParticipant: (participant: Participant) => void;
  deleteParticipant: (participantId: string) => void;
  moveParticipant: (participantId: string, direction: 'up' | 'down') => void;
  toggleGroupAdmin: (participantId: string) => void;
  setGroupCreator: (participantId: string) => void;
  loadTenMemberGroupDemo: () => void;
  setSelfParticipant: (participantId: string) => void;
  updateHeaderState: (patch: Partial<Conversation['headerState']>) => void;
  updateGroupMeta: (patch: Partial<NonNullable<Conversation['groupMeta']>>) => void;
  updatePostMeta: (patch: Partial<NonNullable<Conversation['postMeta']>>) => void;
  addPostCarouselSlide: (slide: PostCarouselSlide) => void;
  deletePostCarouselSlide: (slideIndex: number) => void;
  updatePostCarouselSlide: (
    slideIndex: number,
    patch: Partial<PostCarouselSlide>
  ) => void;
  setActivePostCarouselSlide: (index: number) => void;
  reorderPostCarouselSlide: (
    slideIndex: number,
    direction: 'up' | 'down'
  ) => void;
  toggleCommentPin: (messageId: string) => void;
  toggleCommentLike: (messageId: string) => void;
  updateStorySlide: (
    slideIndex: number,
    patch: Partial<NonNullable<Conversation['storyMeta']>['slides'][number]>
  ) => void;
  setActiveStorySlide: (index: number) => void;
  addStorySlide: () => void;
  deleteStorySlide: (slideIndex: number) => void;
  addStoryElement: (slideIndex: number, element: StoryElement) => void;
  updateStoryElement: (
    slideIndex: number,
    elementId: string,
    patch: Partial<StoryElement>
  ) => void;
  deleteStoryElement: (slideIndex: number, elementId: string) => void;
  duplicateStoryElement: (slideIndex: number, elementId: string) => void;
  reorderStoryElement: (
    slideIndex: number,
    elementId: string,
    direction: 'up' | 'down'
  ) => void;
  updateStoryMeta: (patch: Partial<NonNullable<Conversation['storyMeta']>>) => void;
  updateCallMeta: (patch: Partial<NonNullable<Conversation['callMeta']>>) => void;

  updateTheme: (patch: Partial<PlatformTheme>) => void;
  updateStatusBar: (patch: Partial<PlatformTheme['statusBar']>) => void;
  setDeviceFrame: (frame: DeviceFramePreset) => void;
  setExportFormat: (format: ExportFormat) => void;
  setExportScale: (scale: 1 | 2 | 3) => void;
  setExportQuality: (quality: number) => void;
  setExportAspectRatio: (ratio: 'device' | '9:16' | '4:5' | '1:1') => void;
  setBackgroundMode: (mode: 'platform' | 'transparent' | 'solid') => void;
  setCustomDimensions: (enabled: boolean, widthPx?: number, heightPx?: number) => void;
  setSafetyBadge: (enabled: boolean) => void;

  applyTemplate: (template: Template) => void;
  saveCurrentAsTemplate: (
    title: string,
    category: TemplateCategory,
    description: string
  ) => Promise<Template>;
  duplicateTemplate: (template: Template) => Promise<Template>;
  updateCustomTemplate: (template: Template) => Promise<void>;
  deleteCustomTemplate: (templateId: string) => Promise<void>;
  importScreenplay: (rawText: string) => { importedCount: number; warnings: string[] };

  setSelectedMessageId: (id: string | null) => void;
  setActiveTab: (tab: StudioStore['ui']['activeTab']) => void;
  setMobileDrawerOpen: (open: boolean) => void;
  setTimelineOpen: (open: boolean) => void;
  setPreviewMode: (preview: boolean) => void;
  setTypingPreview: (typing: boolean) => void;
  setLivePreviewEnabled: (enabled: boolean) => void;
  forceUpdatePreview: () => void;
  markPreviewRendered: (version: number) => void;
  playTimeline: () => void;
  pauseTimeline: () => void;
  resetTimeline: () => void;
  stepTimelineForward: () => void;
  setTimelineDelayMs: (ms: number) => void;
  updateVideoOptions: (
    patch: Partial<NonNullable<Project['timeline']['videoOptions']>>
  ) => void;
  clearError: () => void;
}

let autoSaveTimer: ReturnType<typeof setTimeout> | null = null;

function updateActiveConversation(
  project: Project,
  updater: (conv: Conversation) => Conversation
): Project {
  return {
    ...project,
    updatedAt: new Date().toISOString(),
    conversations: project.conversations.map((c) =>
      c.id === project.activeConversationId ? updater(c) : c
    ),
  };
}

export function getActiveConversation(project: Project): Conversation {
  return (
    project.conversations.find((c) => c.id === project.activeConversationId) ??
    project.conversations[0]
  );
}

export const useStudioStore = create<StudioStore>((set, get) => {
  const initialSeed = createSeedProject('whatsapp-chat');

  const commitMutation = (mutator: (prev: Project) => Project) => {
    const { project, past, mutationVersion, ui } = get();
    const nextProject = mutator(project);
    const nextPast = [...past, project].slice(-MAX_HISTORY);
    const nextVersion = mutationVersion + 1;

    set({
      project: nextProject,
      renderedProject: ui.livePreviewEnabled ? nextProject : get().renderedProject,
      past: nextPast,
      future: [],
      saveStatus: 'unsaved',
      mutationVersion: nextVersion,
      ui: {
        ...ui,
        previewSyncStatus: ui.livePreviewEnabled ? 'updating' : 'paused',
      },
    });

    if (autoSaveTimer) clearTimeout(autoSaveTimer);
    autoSaveTimer = setTimeout(() => {
      void get().saveNow();
    }, 350);
  };

  return {
    project: initialSeed,
    renderedProject: initialSeed,
    past: [],
    future: [],
    savedProjects: [],
    customTemplates: [],
    saveStatus: 'saved',
    lastSavedAt: null,
    isHydrating: false,
    mutationVersion: 0,
    errorMessage: null,

    ui: {
      selectedMessageId: null,
      selectedElement: null,
      activeTab: 'messages',
      mobileDrawerOpen: false,
      editorOpen: true,
      previewZoom: 1,
      livePreviewEnabled: true,
      previewSyncStatus: 'active',
      isTimelineOpen: false,
      isPlayingTimeline: false,
      timelineVisibleCount: 999,
      previewMode: false,
      isTypingPreview: false,
    },

    initPlatform: async (platformId) => {
      const startMutationVersion = get().mutationVersion;
      const startPlatformId = get().project.platformId;
      if (startPlatformId !== platformId) {
        const nextSeed = createSeedProject(platformId);
        set({
          project: nextSeed,
          renderedProject: nextSeed,
          isHydrating: true,
          errorMessage: null,
          past: [],
          future: [],
        });
      } else {
        set({ isHydrating: true, errorMessage: null });
      }
      try {
        const stored = await loadLatestProjectForPlatform(platformId);
        const initial = stored ?? createSeedProject(platformId);
        const [allSaved, allCustomTemplates] = await Promise.all([
          listSavedProjects(),
          listCustomTemplates(),
        ]);

        // Never overwrite edits made by the user while IndexedDB was loading
        if (
          get().mutationVersion !== startMutationVersion &&
          startPlatformId === platformId
        ) {
          set({
            savedProjects: allSaved,
            customTemplates: allCustomTemplates,
            isHydrating: false,
          });
          return;
        }

        set({
          project: initial,
          renderedProject: initial,
          past: [],
          future: [],
          savedProjects: allSaved,
          customTemplates: allCustomTemplates,
          saveStatus: 'saved',
          lastSavedAt: initial.updatedAt,
          isHydrating: false,
          ui: {
            ...get().ui,
            selectedMessageId: null,
            timelineVisibleCount: 999,
            isPlayingTimeline: false,
            previewSyncStatus: get().ui.livePreviewEnabled ? 'active' : 'paused',
          },
        });
      } catch (err) {
        const fallback = createSeedProject(platformId);
        set({
          project: fallback,
          renderedProject: fallback,
          isHydrating: false,
          saveStatus: 'error',
          errorMessage:
            err instanceof Error ? err.message : 'Unable to load local draft.',
        });
      }
    },

    switchPlatformInPlace: (platformId) => {
      const manifest = GENERATOR_MAP[platformId];
      if (!manifest) return;
      const seedForTarget = createSeedProject(platformId);
      const current = get().project;
      const currentConv = getActiveConversation(current);

      const canPreserveDialogue =
        current.archetype === 'chat_thread' &&
        manifest.capabilities.archetype === 'chat_thread' &&
        currentConv.messages.length > 0;

      commitMutation((prev) => {
        if (!canPreserveDialogue) {
          return {
            ...seedForTarget,
            id: `proj_${platformId}_${Date.now()}`,
            cast: prev.cast.length > 0 ? prev.cast : seedForTarget.cast,
          };
        }
        return {
          ...prev,
          platformId,
          archetype: manifest.capabilities.archetype,
          title: `${manifest.shortName} Draft`,
          theme: {
            ...createDefaultTheme(platformId),
            colorScheme: prev.theme.colorScheme,
            safetyBadge: prev.theme.safetyBadge,
          },
          conversations: prev.conversations.map((c) =>
            c.id === prev.activeConversationId
              ? {
                ...c,
                platformId,
                mode:
                  platformId === 'whatsapp-group-chat' || platformId === 'discord-chat'
                    ? 'group'
                    : 'direct',
                groupMeta:
                  platformId === 'whatsapp-group-chat' || platformId === 'discord-chat'
                    ? c.groupMeta ?? {
                      groupName:
                        platformId === 'discord-chat'
                          ? '#general'
                          : 'Group Conversation',
                      showSenderNamesInBubbles: true,
                      showSenderAvatarsInBubbles: true,
                    }
                    : undefined,
              }
              : c
          ),
        };
      });
    },

    setProjectTitle: (title) =>
      commitMutation((prev) => ({
        ...prev,
        title,
        updatedAt: new Date().toISOString(),
      })),

    saveNow: async () => {
      const { project } = get();
      set({ saveStatus: 'saving' });
      try {
        await saveProjectToIndexedDb(project);
        const allSaved = await listSavedProjects();
        set({
          saveStatus: 'saved',
          savedProjects: allSaved,
          lastSavedAt: new Date().toISOString(),
        });
      } catch (err) {
        set({
          saveStatus: 'error',
          errorMessage:
            err instanceof Error ? err.message : 'Failed to save draft locally.',
        });
      }
    },

    refreshSavedProjects: async () => {
      const allSaved = await listSavedProjects();
      set({ savedProjects: allSaved });
    },

    duplicateCurrentProject: async () => {
      const { project } = get();
      const now = new Date().toISOString();
      const copy: Project = {
        ...JSON.parse(JSON.stringify(project)),
        id: `proj_${project.platformId}_${Date.now()}`,
        title: `${project.title} (Copy)`,
        createdAt: now,
        updatedAt: now,
      };
      await saveProjectToIndexedDb(copy);
      const allSaved = await listSavedProjects();
      set({
        project: copy,
        renderedProject: get().ui.livePreviewEnabled ? copy : get().renderedProject,
        past: [],
        future: [],
        savedProjects: allSaved,
        saveStatus: 'saved',
        lastSavedAt: now,
      });
      return copy;
    },

    restoreProjectById: async (projectId) => {
      const allSaved = await listSavedProjects();
      const found = allSaved.find((p) => p.id === projectId);
      if (!found) return;
      await saveProjectToIndexedDb(found);
      set({
        project: found,
        renderedProject: found,
        past: [],
        future: [],
        savedProjects: allSaved,
        saveStatus: 'saved',
        lastSavedAt: found.updatedAt,
        ui: {
          ...get().ui,
          selectedMessageId: null,
          timelineVisibleCount: 999,
          previewSyncStatus: get().ui.livePreviewEnabled ? 'active' : 'paused',
        },
      });
    },

    deleteSavedProject: async (projectId) => {
      await deleteProjectFromIndexedDb(projectId);
      const allSaved = await listSavedProjects();
      set({ savedProjects: allSaved });
    },

    renameSavedProject: async (projectId, newTitle) => {
      const trimmed = newTitle.trim();
      if (!trimmed) return;
      const allSaved = await listSavedProjects();
      const target = allSaved.find((p) => p.id === projectId);
      if (target) {
        const updated = { ...target, title: trimmed, updatedAt: new Date().toISOString() };
        await saveProjectToIndexedDb(updated);
      }
      const nextSaved = await listSavedProjects();
      set((s) => ({
        savedProjects: nextSaved,
        project:
          s.project.id === projectId
            ? { ...s.project, title: trimmed, updatedAt: new Date().toISOString() }
            : s.project,
      }));
    },

    setDeviceType: (device) => {
      commitMutation((prev) => {
        const isIphone = device === 'iphone';
        const nextOsVariant = isIphone ? 'ios' : 'android';
        const nextUiVersion = isIphone ? 'ios_modern' : 'android_modern';
        const nextNotch = isIphone ? 'dynamic_island' : 'punch_hole';
        const nextFrame: DeviceFramePreset =
          prev.exportSettings.deviceFrame === 'none'
            ? 'none'
            : isIphone
              ? 'iphone_16_pro'
              : 'pixel_9';

        return {
          ...prev,
          updatedAt: new Date().toISOString(),
          theme: {
            ...prev.theme,
            deviceType: device,
            osVariant: nextOsVariant,
            uiVersion: nextUiVersion,
            statusBar: {
              ...prev.theme.statusBar,
              visible: true,
              notchStyle: nextNotch,
            },
          },
          exportSettings: {
            ...prev.exportSettings,
            deviceFrame: nextFrame,
          },
          conversations: prev.conversations.map((c) => {
            if (c.id !== prev.activeConversationId) return c;
            const nextCallMeta = c.callMeta
              ? {
                  ...c.callMeta,
                  deviceMode: (isIphone ? 'ios' : 'android') as 'ios' | 'android',
                  callPlatform:
                    c.callMeta.callPlatform === 'ios-phone' ||
                    c.callMeta.callPlatform === 'android-phone'
                      ? ((isIphone ? 'ios-phone' : 'android-phone') as 'ios-phone' | 'android-phone')
                      : c.callMeta.callPlatform,
                  callStateLabel:
                    c.callMeta.callPlatform === 'ios-phone' ||
                    c.callMeta.callPlatform === 'android-phone'
                      ? isIphone
                        ? 'iPhone Call'
                        : 'Android Phone Call'
                      : c.callMeta.callStateLabel,
                }
              : undefined;
            const nextDiscordLayout =
              prev.platformId === 'discord-chat' &&
              c.headerState.discordLayout === 'desktop_server'
                ? ('mobile_chat' as const)
                : c.headerState.discordLayout;
            return {
              ...c,
              callMeta: nextCallMeta,
              headerState: {
                ...c.headerState,
                discordLayout: nextDiscordLayout,
                backButtonLabel: isIphone
                  ? c.headerState.backButtonLabel || 'Messages'
                  : undefined,
              },
            };
          }),
        };
      });
    },

    setAppearance: (mode) => {
      commitMutation((prev) => ({
        ...prev,
        updatedAt: new Date().toISOString(),
        theme: {
          ...prev.theme,
          colorScheme: mode,
        },
      }));
    },

    setScreenViewMode: (screenViewMode) => {
      commitMutation((prev) =>
        updateActiveConversation(prev, (conv) => ({
          ...conv,
          headerState: {
            ...conv.headerState,
            screenViewMode,
          },
        }))
      );
    },

    upsertChatListRow: (row) => {
      commitMutation((prev) =>
        updateActiveConversation(prev, (conv) => {
          const list = conv.chatListItems ?? [];
          const exists = list.some((r) => r.id === row.id);
          return {
            ...conv,
            chatListItems: exists
              ? list.map((r) => (r.id === row.id ? row : r))
              : [row, ...list],
          };
        })
      );
    },

    deleteChatListRow: (rowId) => {
      commitMutation((prev) =>
        updateActiveConversation(prev, (conv) => ({
          ...conv,
          chatListItems: (conv.chatListItems ?? []).filter((r) => r.id !== rowId),
        }))
      );
    },

    resetToSeed: () => {
      const platformId = get().project.platformId;
      commitMutation(() => createSeedProject(platformId));
    },

    clearAllMessages: () => {
      commitMutation((prev) =>
        updateActiveConversation(prev, (conv) => ({
          ...conv,
          messages: [],
        }))
      );
    },

    loadProject: (loaded) => {
      commitMutation(() => ({
        ...loaded,
        updatedAt: new Date().toISOString(),
      }));
    },

    undo: () => {
      const { past, project, future, ui, mutationVersion } = get();
      if (past.length === 0) return;
      const previous = past[past.length - 1];
      set({
        project: previous,
        renderedProject: ui.livePreviewEnabled ? previous : get().renderedProject,
        past: past.slice(0, -1),
        future: [project, ...future].slice(0, MAX_HISTORY),
        saveStatus: 'unsaved',
        mutationVersion: mutationVersion + 1,
        ui: {
          ...ui,
          previewSyncStatus: ui.livePreviewEnabled ? 'updating' : 'paused',
        },
      });
    },

    redo: () => {
      const { past, project, future, ui, mutationVersion } = get();
      if (future.length === 0) return;
      const next = future[0];
      set({
        project: next,
        renderedProject: ui.livePreviewEnabled ? next : get().renderedProject,
        past: [...past, project].slice(-MAX_HISTORY),
        future: future.slice(1),
        saveStatus: 'unsaved',
        mutationVersion: mutationVersion + 1,
        ui: {
          ...ui,
          previewSyncStatus: ui.livePreviewEnabled ? 'updating' : 'paused',
        },
      });
    },

    addMessage: (input) => {
      const id = input.id ?? `msg_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
      const msgType = input.type ?? 'text';
      const attachments: Message['attachments'] = [];

      if (msgType === 'voice_note') {
        attachments.push({
          id: `att_${id}`,
          kind: 'voice_note',
          durationSeconds: input.voiceDurationSeconds ?? 12,
          voiceNoteMeta: {
            waveformPeaks: [
              0.3, 0.7, 0.5, 0.9, 0.65, 0.4, 0.85, 0.6, 0.5, 0.95, 0.7, 0.45,
              0.8, 0.55, 0.35, 0.6,
            ],
            playbackSpeed: '1x',
            isListened: false,
          },
        });
      } else if (msgType === 'audio') {
        attachments.push({
          id: `att_${id}`,
          kind: 'audio',
          durationSeconds: input.voiceDurationSeconds ?? 38,
          audioMeta: {
            trackTitle: input.docFileName || input.text || 'Audio-Track.mp3',
            artistName: 'Voice Recording',
          },
        });
      } else if (msgType === 'video_preview') {
        attachments.push({
          id: `att_${id}`,
          kind: 'video_preview',
          durationSeconds: input.voiceDurationSeconds ?? 18,
          previewDataUrl: input.imageDataUrl,
          caption: input.text,
        });
      } else if (msgType === 'gif') {
        attachments.push({
          id: `att_${id}`,
          kind: 'gif',
          previewDataUrl: input.imageDataUrl,
          caption: input.text,
          gifMeta: {
            providerLabel: 'GIF',
            isLooping: true,
          },
        });
      } else if (msgType === 'sticker') {
        attachments.push({
          id: `att_${id}`,
          kind: 'sticker',
          caption: input.text || '🎉',
        });
      } else if (msgType === 'image') {
        attachments.push({
          id: `att_${id}`,
          kind: 'image',
          previewDataUrl: input.imageDataUrl,
          caption: input.text,
        });
      } else if (msgType === 'document') {
        attachments.push({
          id: `att_${id}`,
          kind: 'document',
          fileName: input.docFileName || input.text || 'Project-Brief-v2.pdf',
          fileSizeBytes: 1420000,
          pageCount: 8,
        });
      } else if (msgType === 'location') {
        attachments.push({
          id: `att_${id}`,
          kind: 'location',
          locationMeta: {
            latitude: 37.7749,
            longitude: -122.4194,
            placeName: input.locationPlace || input.text || 'Market Street Studio',
            address: input.locationAddress || 'San Francisco, CA',
            isLiveLocation: true,
          },
        });
      } else if (msgType === 'contact_card') {
        attachments.push({
          id: `att_${id}`,
          kind: 'contact_card',
          contactCardMeta: {
            fullName: input.contactName || input.text || 'Maya Lin',
            phoneOrHandle: input.contactPhone || '+1 (415) 555-0194',
          },
        });
      } else if (msgType === 'story_reply') {
        attachments.push({
          id: `att_${id}`,
          kind: 'story_reply',
          storyReplyMeta: {
            authorHandle: input.storyAuthorHandle || '@mayalin.creates',
            storyLabel: `Replied to ${input.storyAuthorHandle || '@mayalin.creates'}'s story`,
          },
        });
      } else if (msgType === 'shared_post') {
        attachments.push({
          id: `att_${id}`,
          kind: 'shared_post',
          sharedPostMeta: {
            authorHandle: input.storyAuthorHandle || '@creator.studio',
            captionSnippet: input.text || 'Check out this new mockup reel!',
            isReel: true,
          },
        });
      } else if (msgType === 'link_preview' || input.linkUrl) {
        attachments.push({
          id: `att_${id}`,
          kind: 'link_preview',
          linkPreviewMeta: {
            url: input.linkUrl || `https://${input.linkDomain || 'apple.com'}`,
            title: input.linkTitle || input.text || 'Apple Special Event',
            domain: input.linkDomain || 'apple.com',
            previewDataUrl: input.imageDataUrl,
            description: input.text || 'Explore the innovative world of Apple.',
          },
        });
      }

      const isSystemRow =
        msgType === 'system' ||
        msgType === 'date_separator' ||
        msgType === 'unread_divider';

      const newMessage: Message = {
        id,
        senderId: isSystemRow ? 'system' : input.senderId,
        type: msgType,
        text: input.text,
        forwardedLabel:
          !isSystemRow && input.forwardedLabel && input.forwardedLabel !== 'none'
            ? input.forwardedLabel
            : undefined,
        replyToMessageId: input.replyToMessageId || undefined,
        timestampLabel:
          input.timestampLabel ??
          new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
        attachments,
        reactions: input.reactions ?? [],
        isPinned: input.isPinned,
        commentLikes: input.commentLikes,
        messageEffect: input.messageEffect,
        readReceipt: { status: input.readStatus ?? 'read' },
        callEvent:
          msgType === 'call_event'
            ? {
              media: input.callMedia ?? 'voice',
              outcome: input.callOutcome ?? 'missed',
              durationLabel:
                input.callOutcome === 'answered' ? '4 mins' : undefined,
            }
            : undefined,
        pollData:
          msgType === 'poll'
            ? {
              question: input.text || 'Where should we meet?',
              allowMultiple: false,
              options: [
                { id: 'opt_1', label: 'Studio Downtown', voteCount: 4, votedBySelf: true },
                { id: 'opt_2', label: 'Coffee Bar', voteCount: 2 },
              ],
            }
            : undefined,
      };

      commitMutation((prev) =>
        updateActiveConversation(prev, (conv) => ({
          ...conv,
          messages: [...conv.messages, newMessage],
        }))
      );
    },

    updateMessage: (messageId, patch) => {
      commitMutation((prev) =>
        updateActiveConversation(prev, (conv) => ({
          ...conv,
          messages: conv.messages.map((m) =>
            m.id === messageId ? { ...m, ...patch } : m
          ),
        }))
      );
    },

    duplicateMessage: (messageId) => {
      commitMutation((prev) =>
        updateActiveConversation(prev, (conv) => {
          const idx = conv.messages.findIndex((m) => m.id === messageId);
          if (idx === -1) return conv;
          const orig = conv.messages[idx];
          const clone: Message = {
            ...JSON.parse(JSON.stringify(orig)),
            id: `msg_dup_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          };
          const next = [...conv.messages];
          next.splice(idx + 1, 0, clone);
          return { ...conv, messages: next };
        })
      );
    },

    switchMessageSender: (messageId, nextSenderId) => {
      commitMutation((prev) =>
        updateActiveConversation(prev, (conv) => {
          const speakers = prev.cast.map((p) => p.id);
          if (speakers.length === 0) return conv;
          return {
            ...conv,
            messages: conv.messages.map((m) => {
              if (m.id !== messageId || m.senderId === 'system') return m;
              if (nextSenderId && speakers.includes(nextSenderId)) {
                return { ...m, senderId: nextSenderId };
              }
              const currIdx = speakers.indexOf(m.senderId);
              const nextIdx = currIdx === -1 ? 0 : (currIdx + 1) % speakers.length;
              return { ...m, senderId: speakers[nextIdx] };
            }),
          };
        })
      );
    },

    deleteMessage: (messageId) => {
      commitMutation((prev) =>
        updateActiveConversation(prev, (conv) => ({
          ...conv,
          messages: conv.messages.filter((m) => m.id !== messageId),
        }))
      );
    },

    moveMessage: (messageId, direction) => {
      commitMutation((prev) =>
        updateActiveConversation(prev, (conv) => {
          const idx = conv.messages.findIndex((m) => m.id === messageId);
          if (idx === -1) return conv;
          const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
          if (targetIdx < 0 || targetIdx >= conv.messages.length) return conv;
          const nextMsgs = [...conv.messages];
          const [removed] = nextMsgs.splice(idx, 1);
          nextMsgs.splice(targetIdx, 0, removed);
          return { ...conv, messages: nextMsgs };
        })
      );
    },

    toggleMessageReaction: (messageId, emoji) => {
      commitMutation((prev) =>
        updateActiveConversation(prev, (conv) => ({
          ...conv,
          messages: conv.messages.map((m) => {
            if (m.id !== messageId) return m;
            const existing = m.reactions.find((r) => r.emoji === emoji);
            if (existing) {
              return {
                ...m,
                reactions: m.reactions.filter((r) => r.emoji !== emoji),
              };
            }
            return {
              ...m,
              reactions: [
                ...m.reactions,
                { emoji, participantIds: [conv.selfParticipantId], count: 1 },
              ],
            };
          }),
        }))
      );
    },

    upsertParticipant: (participant) => {
      commitMutation((prev) => {
        const exists = prev.cast.some((p) => p.id === participant.id);
        const nextCast = exists
          ? prev.cast.map((p) => (p.id === participant.id ? participant : p))
          : [...prev.cast, participant];

        const active = getActiveConversation(prev);
        const hasParticipant = active.participantIds.includes(participant.id);

        return {
          ...prev,
          updatedAt: new Date().toISOString(),
          cast: nextCast,
          conversations: prev.conversations.map((c) =>
            c.id === prev.activeConversationId && !hasParticipant
              ? { ...c, participantIds: [...c.participantIds, participant.id] }
              : c
          ),
        };
      });
    },

    deleteParticipant: (participantId) => {
      commitMutation((prev) => {
        const active = getActiveConversation(prev);
        if (active.selfParticipantId === participantId || prev.cast.length <= 2) {
          return prev;
        }
        return {
          ...prev,
          updatedAt: new Date().toISOString(),
          cast: prev.cast.filter((p) => p.id !== participantId),
          conversations: prev.conversations.map((c) =>
            c.id === prev.activeConversationId
              ? {
                ...c,
                participantIds: c.participantIds.filter((id) => id !== participantId),
              }
              : c
          ),
        };
      });
    },

    setSelfParticipant: (participantId) => {
      commitMutation((prev) =>
        updateActiveConversation(prev, (conv) => ({
          ...conv,
          selfParticipantId: participantId,
        }))
      );
    },

    moveParticipant: (participantId, direction) => {
      commitMutation((prev) => {
        const idx = prev.cast.findIndex((p) => p.id === participantId);
        if (idx === -1) return prev;
        const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
        if (targetIdx < 0 || targetIdx >= prev.cast.length) return prev;
        const nextCast = [...prev.cast];
        const [moved] = nextCast.splice(idx, 1);
        nextCast.splice(targetIdx, 0, moved);
        const orderedIds = nextCast.map((p) => p.id);
        return {
          ...prev,
          updatedAt: new Date().toISOString(),
          cast: nextCast,
          conversations: prev.conversations.map((c) =>
            c.id === prev.activeConversationId
              ? { ...c, participantIds: orderedIds }
              : c
          ),
        };
      });
    },

    toggleGroupAdmin: (participantId) => {
      commitMutation((prev) => ({
        ...prev,
        updatedAt: new Date().toISOString(),
        cast: prev.cast.map((p) =>
          p.id === participantId
            ? {
              ...p,
              isAdmin: !p.isAdmin,
              roleLabel: !p.isAdmin ? 'Admin' : undefined,
            }
            : p
        ),
      }));
    },

    setGroupCreator: (participantId) => {
      commitMutation((prev) => ({
        ...prev,
        updatedAt: new Date().toISOString(),
        cast: prev.cast.map((p) => ({
          ...p,
          isGroupCreator: p.id === participantId,
          isAdmin: p.id === participantId ? true : p.isAdmin,
          roleLabel: p.id === participantId ? 'Creator' : p.roleLabel === 'Creator' ? 'Admin' : p.roleLabel,
        })),
      }));
    },

    loadTenMemberGroupDemo: () => {
      commitMutation((prev) => {
        const demoMembers: Participant[] = [
          { id: 'part_self', displayName: 'You', handle: '@you.studio', avatarFallbackColor: '#4F46E5', nameColorHex: '#4F46E5', verifiedBadge: 'none', isSelfDefault: true, isAdmin: true, isGroupCreator: true, roleLabel: 'Creator' },
          { id: 'part_maya', displayName: 'Maya Lin', handle: '@maya.creative', avatarFallbackColor: '#059669', nameColorHex: '#059669', verifiedBadge: 'none', isAdmin: true, roleLabel: 'Admin' },
          { id: 'part_daniel', displayName: 'Daniel Ortiz', handle: '@daniel.o', avatarFallbackColor: '#2563EB', nameColorHex: '#2563EB', verifiedBadge: 'none' },
          { id: 'part_priya', displayName: 'Priya Nair', handle: '@priya.ux', avatarFallbackColor: '#D97706', nameColorHex: '#D97706', verifiedBadge: 'none' },
          { id: 'part_lucas', displayName: 'Lucas Meyer', handle: '@lucas.m', avatarFallbackColor: '#DB2777', nameColorHex: '#DB2777', verifiedBadge: 'none' },
          { id: 'part_hana', displayName: 'Hana Sato', handle: '@hana.film', avatarFallbackColor: '#7C3AED', nameColorHex: '#7C3AED', verifiedBadge: 'none' },
          { id: 'part_omar', displayName: 'Omar Hassan', handle: '@omar.dev', avatarFallbackColor: '#0284C7', nameColorHex: '#0284C7', verifiedBadge: 'none' },
          { id: 'part_chloe', displayName: 'Chloe Grant', handle: '@chloe.g', avatarFallbackColor: '#DC2626', nameColorHex: '#DC2626', verifiedBadge: 'none' },
          { id: 'part_noah', displayName: 'Noah Brooks', handle: '@noah.audio', avatarFallbackColor: '#0D9488', nameColorHex: '#0D9488', verifiedBadge: 'none' },
          { id: 'part_sofia', displayName: 'Sofia Costa', handle: '@sofia.art', avatarFallbackColor: '#9333EA', nameColorHex: '#9333EA', verifiedBadge: 'none' },
        ];
        const demoMsgs: Message[] = [
          { id: 'g10_date', senderId: 'system', type: 'date_separator', text: 'Today', timestampLabel: '', attachments: [], reactions: [], readReceipt: { status: 'none' } },
          { id: 'g10_sys1', senderId: 'system', type: 'system', text: 'You created group "Launch Crew 2026 🚀"', timestampLabel: '', attachments: [], reactions: [], readReceipt: { status: 'none' } },
          { id: 'g10_sys2', senderId: 'system', type: 'system', text: 'Sofia Costa joined using this group\'s invite link', timestampLabel: '', attachments: [], reactions: [], readReceipt: { status: 'none' } },
          { id: 'g10_m1', senderId: 'part_maya', type: 'text', text: 'Morning everyone! All 10 leads are now in the room — shoot kicks off at 3 PM.', timestampLabel: '9:10 AM', attachments: [], reactions: [{ emoji: '🔥', participantIds: ['part_daniel', 'part_priya'], count: 4 }], readReceipt: { status: 'read' } },
          { id: 'g10_m2', senderId: 'part_daniel', type: 'text', text: 'Final deck PDF attached for anyone arriving on set early.', timestampLabel: '9:12 AM', replyToMessageId: 'g10_m1', attachments: [{ id: 'att_g10_doc', kind: 'document', fileName: 'Launch-Call-Sheet.pdf', pageCount: 6 }], reactions: [], readReceipt: { status: 'read' } },
          { id: 'g10_m3', senderId: 'part_priya', type: 'poll', text: 'Lunch catering vote?', timestampLabel: '9:14 AM', attachments: [], reactions: [], readReceipt: { status: 'read' }, pollData: { question: 'Lunch catering vote?', allowMultiple: false, options: [{ id: 'p1', label: 'Mediterranean Bowls', voteCount: 6, votedBySelf: true }, { id: 'p2', label: 'Wood-Fired Pizza', voteCount: 4 }] } },
          { id: 'g10_m4', senderId: 'part_lucas', type: 'text', text: '', isDeleted: true, timestampLabel: '9:16 AM', attachments: [], reactions: [], readReceipt: { status: 'read' } },
          { id: 'g10_m5', senderId: 'part_self', type: 'text', text: 'Pinned the schedule above — see you all on Stage B!', timestampLabel: '9:18 AM', attachments: [], reactions: [{ emoji: '👍', participantIds: ['part_maya', 'part_sofia'], count: 5 }], readReceipt: { status: 'read' } },
        ];
        return {
          ...prev,
          updatedAt: new Date().toISOString(),
          cast: demoMembers,
          conversations: prev.conversations.map((c) =>
            c.id === prev.activeConversationId
              ? {
                ...c,
                participantIds: demoMembers.map((m) => m.id),
                selfParticipantId: 'part_self',
                groupMeta: {
                  ...c.groupMeta,
                  groupName: 'Launch Crew 2026 🚀',
                  groupDescription: 'Official 10-member production & launch coordination group.',
                  pinnedMessageId: 'g10_m1',
                  showSenderNamesInBubbles: true,
                  showSenderAvatarsInBubbles: true,
                },
                headerState: {
                  ...c.headerState,
                  statusText: 'You, Maya Lin, Daniel Ortiz, Priya Nair, +6 more',
                },
                messages: demoMsgs,
              }
              : c
          ),
        };
      });
    },

    updateHeaderState: (patch) => {
      commitMutation((prev) =>
        updateActiveConversation(prev, (conv) => ({
          ...conv,
          headerState: { ...conv.headerState, ...patch },
        }))
      );
    },

    updateGroupMeta: (patch) => {
      commitMutation((prev) =>
        updateActiveConversation(prev, (conv) => ({
          ...conv,
          groupMeta: {
            groupName: conv.groupMeta?.groupName ?? 'Group Chat',
            showSenderNamesInBubbles: conv.groupMeta?.showSenderNamesInBubbles ?? true,
            showSenderAvatarsInBubbles:
              conv.groupMeta?.showSenderAvatarsInBubbles ?? true,
            ...conv.groupMeta,
            ...patch,
          },
        }))
      );
    },

    updatePostMeta: (patch) => {
      commitMutation((prev) =>
        updateActiveConversation(prev, (conv) =>
          conv.postMeta
            ? { ...conv, postMeta: { ...conv.postMeta, ...patch } }
            : conv
        )
      );
    },

    addPostCarouselSlide: (slide) => {
      commitMutation((prev) =>
        updateActiveConversation(prev, (conv) => {
          if (!conv.postMeta) return conv;
          const current = conv.postMeta.carouselImages ?? [];
          const next = [...current, slide];
          return {
            ...conv,
            postMeta: {
              ...conv.postMeta,
              carouselImages: next,
              activeCarouselIndex: next.length - 1,
            },
          };
        })
      );
    },

    deletePostCarouselSlide: (slideIndex) => {
      commitMutation((prev) =>
        updateActiveConversation(prev, (conv) => {
          if (!conv.postMeta || !conv.postMeta.carouselImages) return conv;
          const next = conv.postMeta.carouselImages.filter((_, idx) => idx !== slideIndex);
          const currentActive = conv.postMeta.activeCarouselIndex ?? 0;
          const nextActive = Math.min(Math.max(0, currentActive >= slideIndex ? currentActive - 1 : currentActive), Math.max(0, next.length - 1));
          return {
            ...conv,
            postMeta: {
              ...conv.postMeta,
              carouselImages: next,
              activeCarouselIndex: nextActive,
            },
          };
        })
      );
    },

    updatePostCarouselSlide: (slideIndex, patch) => {
      commitMutation((prev) =>
        updateActiveConversation(prev, (conv) => {
          if (!conv.postMeta || !conv.postMeta.carouselImages) return conv;
          return {
            ...conv,
            postMeta: {
              ...conv.postMeta,
              carouselImages: conv.postMeta.carouselImages.map((s, idx) =>
                idx === slideIndex ? { ...s, ...patch } : s
              ),
            },
          };
        })
      );
    },

    setActivePostCarouselSlide: (index) => {
      commitMutation((prev) =>
        updateActiveConversation(prev, (conv) => {
          if (!conv.postMeta) return conv;
          return {
            ...conv,
            postMeta: {
              ...conv.postMeta,
              activeCarouselIndex: index,
            },
          };
        })
      );
    },

    reorderPostCarouselSlide: (slideIndex, direction) => {
      commitMutation((prev) =>
        updateActiveConversation(prev, (conv) => {
          if (!conv.postMeta || !conv.postMeta.carouselImages) return conv;
          const items = [...conv.postMeta.carouselImages];
          const targetIndex = direction === 'up' ? slideIndex - 1 : slideIndex + 1;
          if (targetIndex < 0 || targetIndex >= items.length) return conv;
          const [moved] = items.splice(slideIndex, 1);
          items.splice(targetIndex, 0, moved);
          return {
            ...conv,
            postMeta: {
              ...conv.postMeta,
              carouselImages: items,
              activeCarouselIndex: targetIndex,
            },
          };
        })
      );
    },

    toggleCommentPin: (messageId) => {
      commitMutation((prev) =>
        updateActiveConversation(prev, (conv) => ({
          ...conv,
          messages: conv.messages.map((m) =>
            m.id === messageId ? { ...m, isPinned: !m.isPinned } : m
          ),
        }))
      );
    },

    toggleCommentLike: (messageId) => {
      commitMutation((prev) =>
        updateActiveConversation(prev, (conv) => ({
          ...conv,
          messages: conv.messages.map((m) => {
            if (m.id !== messageId) return m;
            const currentLikes = m.commentLikes ?? 0;
            const hasHeart = m.reactions.some((r) => r.emoji === '❤️');
            const nextLikes = hasHeart ? Math.max(0, currentLikes - 1) : currentLikes + 1;
            const nextReactions = hasHeart
              ? m.reactions.filter((r) => r.emoji !== '❤️')
              : [...m.reactions, { emoji: '❤️', participantIds: [conv.selfParticipantId], count: 1 }];
            return {
              ...m,
              commentLikes: nextLikes,
              reactions: nextReactions,
            };
          }),
        }))
      );
    },

    updateStorySlide: (slideIndex, patch) => {
      commitMutation((prev) =>
        updateActiveConversation(prev, (conv) => {
          if (!conv.storyMeta) return conv;
          return {
            ...conv,
            storyMeta: {
              ...conv.storyMeta,
              slides: conv.storyMeta.slides.map((s, idx) =>
                idx === slideIndex ? { ...s, ...patch } : s
              ),
            },
          };
        })
      );
    },

    setActiveStorySlide: (index) => {
      commitMutation((prev) =>
        updateActiveConversation(prev, (conv) =>
          conv.storyMeta
            ? {
              ...conv,
              storyMeta: {
                ...conv.storyMeta,
                activeSlideIndex: Math.max(
                  0,
                  Math.min(index, conv.storyMeta.slides.length - 1)
                ),
              },
            }
            : conv
        )
      );
    },

    addStorySlide: () => {
      commitMutation((prev) =>
        updateActiveConversation(prev, (conv) => {
          if (!conv.storyMeta) return conv;
          const newSlide = {
            id: `slide_${Date.now()}`,
            backgroundCss:
              'linear-gradient(155deg, #18181b 0%, #27272a 50%, #3f3f46 100%)',
            headlineText: 'New Story Slide',
            postedAtLabel: 'Just now',
            elements: [],
          };
          const slides = [...conv.storyMeta.slides, newSlide];
          return {
            ...conv,
            storyMeta: {
              ...conv.storyMeta,
              slides,
              activeSlideIndex: slides.length - 1,
            },
          };
        })
      );
    },

    deleteStorySlide: (slideIndex) => {
      commitMutation((prev) =>
        updateActiveConversation(prev, (conv) => {
          if (!conv.storyMeta || conv.storyMeta.slides.length <= 1) return conv;
          const slides = conv.storyMeta.slides.filter((_, idx) => idx !== slideIndex);
          return {
            ...conv,
            storyMeta: {
              ...conv.storyMeta,
              slides,
              activeSlideIndex: Math.max(
                0,
                Math.min(conv.storyMeta.activeSlideIndex, slides.length - 1)
              ),
            },
          };
        })
      );
    },

    addStoryElement: (slideIndex, element) => {
      commitMutation((prev) =>
        updateActiveConversation(prev, (conv) => {
          if (!conv.storyMeta) return conv;
          return {
            ...conv,
            storyMeta: {
              ...conv.storyMeta,
              slides: conv.storyMeta.slides.map((s, idx) => {
                if (idx !== slideIndex) return s;
                return {
                  ...s,
                  elements: [...(s.elements ?? []), element],
                };
              }),
            },
          };
        })
      );
    },

    updateStoryElement: (slideIndex, elementId, patch) => {
      commitMutation((prev) =>
        updateActiveConversation(prev, (conv) => {
          if (!conv.storyMeta) return conv;
          return {
            ...conv,
            storyMeta: {
              ...conv.storyMeta,
              slides: conv.storyMeta.slides.map((s, idx) => {
                if (idx !== slideIndex) return s;
                return {
                  ...s,
                  elements: (s.elements ?? []).map((el) =>
                    el.id === elementId ? { ...el, ...patch } : el
                  ),
                };
              }),
            },
          };
        })
      );
    },

    deleteStoryElement: (slideIndex, elementId) => {
      commitMutation((prev) =>
        updateActiveConversation(prev, (conv) => {
          if (!conv.storyMeta) return conv;
          return {
            ...conv,
            storyMeta: {
              ...conv.storyMeta,
              slides: conv.storyMeta.slides.map((s, idx) => {
                if (idx !== slideIndex) return s;
                return {
                  ...s,
                  elements: (s.elements ?? []).filter((el) => el.id !== elementId),
                };
              }),
            },
          };
        })
      );
    },

    duplicateStoryElement: (slideIndex, elementId) => {
      commitMutation((prev) =>
        updateActiveConversation(prev, (conv) => {
          if (!conv.storyMeta) return conv;
          return {
            ...conv,
            storyMeta: {
              ...conv.storyMeta,
              slides: conv.storyMeta.slides.map((s, idx) => {
                if (idx !== slideIndex) return s;
                const existing = (s.elements ?? []).find((el) => el.id === elementId);
                if (!existing) return s;
                const duplicated: StoryElement = {
                  ...existing,
                  id: `el_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
                  x: Math.min(85, existing.x + 5),
                  y: Math.min(85, existing.y + 5),
                };
                return {
                  ...s,
                  elements: [...(s.elements ?? []), duplicated],
                };
              }),
            },
          };
        })
      );
    },

    reorderStoryElement: (slideIndex, elementId, direction) => {
      commitMutation((prev) =>
        updateActiveConversation(prev, (conv) => {
          if (!conv.storyMeta) return conv;
          return {
            ...conv,
            storyMeta: {
              ...conv.storyMeta,
              slides: conv.storyMeta.slides.map((s, idx) => {
                if (idx !== slideIndex) return s;
                const list = [...(s.elements ?? [])];
                const i = list.findIndex((el) => el.id === elementId);
                if (i === -1) return s;
                const targetIdx = direction === 'up' ? i + 1 : i - 1;
                if (targetIdx < 0 || targetIdx >= list.length) return s;
                const temp = list[i];
                list[i] = list[targetIdx];
                list[targetIdx] = temp;
                return { ...s, elements: list };
              }),
            },
          };
        })
      );
    },

    updateStoryMeta: (patch) => {
      commitMutation((prev) =>
        updateActiveConversation(prev, (conv) => {
          if (!conv.storyMeta) return conv;
          return {
            ...conv,
            storyMeta: {
              ...conv.storyMeta,
              ...patch,
            },
          };
        })
      );
    },

    updateCallMeta: (patch) => {
      commitMutation((prev) =>
        updateActiveConversation(prev, (conv) =>
          conv.callMeta
            ? { ...conv, callMeta: { ...conv.callMeta, ...patch } }
            : conv
        )
      );
    },

    updateTheme: (patch) => {
      commitMutation((prev) => ({
        ...prev,
        updatedAt: new Date().toISOString(),
        theme: { ...prev.theme, ...patch },
      }));
    },

    updateStatusBar: (patch) => {
      commitMutation((prev) => ({
        ...prev,
        updatedAt: new Date().toISOString(),
        theme: {
          ...prev.theme,
          statusBar: { ...prev.theme.statusBar, ...patch },
        },
      }));
    },

    setDeviceFrame: (deviceFrame) => {
      commitMutation((prev) => ({
        ...prev,
        updatedAt: new Date().toISOString(),
        exportSettings: { ...prev.exportSettings, deviceFrame },
      }));
    },

    setExportFormat: (format) => {
      commitMutation((prev) => ({
        ...prev,
        updatedAt: new Date().toISOString(),
        exportSettings: { ...prev.exportSettings, format },
      }));
    },

    setExportScale: (scaleFactor) => {
      commitMutation((prev) => ({
        ...prev,
        updatedAt: new Date().toISOString(),
        exportSettings: { ...prev.exportSettings, scaleFactor },
      }));
    },

    setExportQuality: (quality) => {
      commitMutation((prev) => ({
        ...prev,
        updatedAt: new Date().toISOString(),
        exportSettings: { ...prev.exportSettings, quality },
      }));
    },

    setExportAspectRatio: (aspectRatioPreset) => {
      commitMutation((prev) => ({
        ...prev,
        updatedAt: new Date().toISOString(),
        exportSettings: { ...prev.exportSettings, aspectRatioPreset },
      }));
    },

    setBackgroundMode: (backgroundMode) => {
      commitMutation((prev) => ({
        ...prev,
        updatedAt: new Date().toISOString(),
        exportSettings: { ...prev.exportSettings, backgroundMode },
      }));
    },

    setCustomDimensions: (useCustomDimensions, customWidthPx, customHeightPx) => {
      commitMutation((prev) => ({
        ...prev,
        updatedAt: new Date().toISOString(),
        exportSettings: {
          ...prev.exportSettings,
          useCustomDimensions,
          customWidthPx: customWidthPx ?? prev.exportSettings.customWidthPx ?? 1080,
          customHeightPx: customHeightPx ?? prev.exportSettings.customHeightPx ?? 1350,
        },
      }));
    },

    setSafetyBadge: (enabled) => {
      commitMutation((prev) => ({
        ...prev,
        updatedAt: new Date().toISOString(),
        theme: {
          ...prev.theme,
          safetyBadge: { ...prev.theme.safetyBadge, enabled },
        },
      }));
    },

    saveCurrentAsTemplate: async (title, category, description) => {
      const { project } = get();
      const conv = getActiveConversation(project);
      const roles = project.cast.map((p, idx) => ({
        roleKey: p.id,
        defaultName: p.displayName,
        isSelf: p.id === conv.selfParticipantId || idx === 0,
        verifiedBadge: p.verifiedBadge,
      }));
      const tpl: Template = {
        id: `tpl_custom_${Date.now()}`,
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        title: title.trim() || `${project.title} Template`,
        category,
        description: description.trim() || 'Saved custom template.',
        isCustom: true,
        supportedArchetypes: [project.archetype],
        roles,
        scriptMessages: conv.messages.map((m) => ({
          roleKey: m.senderId === 'system' ? roles[0]?.roleKey ?? 'self' : m.senderId,
          type: m.type,
          text: m.text ?? '',
          timestampLabel: m.timestampLabel,
          readStatus: m.readReceipt.status,
        })),
      };
      await saveCustomTemplateToIndexedDb(tpl);
      const list = await listCustomTemplates();
      set({ customTemplates: list });
      return tpl;
    },

    duplicateTemplate: async (template) => {
      const dup: Template = {
        ...JSON.parse(JSON.stringify(template)),
        id: `tpl_custom_${Date.now()}`,
        title: `${template.title} (Copy)`,
        isCustom: true,
      };
      await saveCustomTemplateToIndexedDb(dup);
      const list = await listCustomTemplates();
      set({ customTemplates: list });
      return dup;
    },

    updateCustomTemplate: async (template) => {
      await saveCustomTemplateToIndexedDb({ ...template, isCustom: true });
      const list = await listCustomTemplates();
      set({ customTemplates: list });
    },

    deleteCustomTemplate: async (templateId) => {
      await deleteCustomTemplateFromIndexedDb(templateId);
      const list = await listCustomTemplates();
      set({ customTemplates: list });
    },

    applyTemplate: (template) => {
      const colors = ['#4F46E5', '#059669', '#2563EB', '#DB2777', '#D97706'];
      const newParticipants: Participant[] = template.roles.map((r, i) => ({
        id: `part_tpl_${r.roleKey}`,
        displayName: r.defaultName,
        avatarFallbackColor: colors[i % colors.length],
        nameColorHex: colors[i % colors.length],
        verifiedBadge: r.verifiedBadge ?? 'none',
        isSelfDefault: r.isSelf,
      }));

      const selfPart =
        newParticipants.find((p) => p.isSelfDefault) ?? newParticipants[0];

      const newMessages: Message[] = template.scriptMessages.map((sm, idx) => ({
        id: `msg_tpl_${Date.now()}_${idx}`,
        senderId: `part_tpl_${sm.roleKey}`,
        type: sm.type,
        text: sm.text,
        timestampLabel: sm.timestampLabel,
        attachments: [],
        reactions: [],
        readReceipt: { status: sm.readStatus ?? 'read' },
      }));

      commitMutation((prev) => ({
        ...prev,
        title: template.title,
        cast: newParticipants,
        conversations: prev.conversations.map((c) =>
          c.id === prev.activeConversationId
            ? {
              ...c,
              participantIds: newParticipants.map((p) => p.id),
              selfParticipantId: selfPart.id,
              messages: newMessages,
            }
            : c
        ),
      }));
    },

    importScreenplay: (rawText) => {
      const parsed = parseScreenplayText(rawText);
      if (parsed.messages.length === 0) {
        return { importedCount: 0, warnings: parsed.warnings };
      }

      const colors = ['#4F46E5', '#059669', '#2563EB', '#DB2777', '#D97706'];
      const participantByName = new Map<string, Participant>();

      parsed.participants.forEach((p, idx) => {
        const id = `part_imp_${idx}_${Date.now()}`;
        participantByName.set(p.name, {
          id,
          displayName: p.name,
          avatarFallbackColor: colors[idx % colors.length],
          nameColorHex: colors[idx % colors.length],
          verifiedBadge: 'none',
          isSelfDefault: p.isSelf,
        });
      });

      const participants = Array.from(participantByName.values());
      const selfPart = participants.find((p) => p.isSelfDefault) ?? participants[0];

      const now = new Date();
      const messages: Message[] = parsed.messages.map((m, idx) => {
        const sender = participantByName.get(m.senderName);
        const msgTime = new Date(now.getTime() + idx * 60000);
        const timestampLabel = msgTime.toLocaleTimeString([], {
          hour: 'numeric',
          minute: '2-digit',
        });

        const attachments: Message['attachments'] =
          m.type === 'voice_note'
            ? [
              {
                id: `att_imp_${idx}`,
                kind: 'voice_note',
                durationSeconds: m.durationSeconds ?? 10,
                voiceNoteMeta: {
                  waveformPeaks: [
                    0.3, 0.7, 0.45, 0.85, 0.6, 0.35, 0.9, 0.5, 0.75, 0.4, 0.65, 0.3,
                  ],
                  playbackSpeed: '1x',
                  isListened: true,
                },
              },
            ]
            : [];

        return {
          id: `msg_imp_${Date.now()}_${idx}`,
          senderId: m.type === 'system' ? 'system' : sender?.id ?? selfPart.id,
          type: m.type,
          text: m.text,
          timestampLabel: m.type === 'system' ? '' : timestampLabel,
          attachments,
          reactions: [],
          readReceipt: { status: 'read' },
        };
      });

      commitMutation((prev) => ({
        ...prev,
        cast: participants,
        conversations: prev.conversations.map((c) =>
          c.id === prev.activeConversationId
            ? {
              ...c,
              participantIds: participants.map((p) => p.id),
              selfParticipantId: selfPart?.id ?? c.selfParticipantId,
              messages,
            }
            : c
        ),
      }));

      return { importedCount: messages.length, warnings: parsed.warnings };
    },

    setSelectedMessageId: (id) =>
      set((s) => ({ ui: { ...s.ui, selectedMessageId: id } })),
    setSelectedElement: (selectedElement) =>
      set((s) => ({
        ui: {
          ...s.ui,
          selectedElement,
          selectedMessageId:
            selectedElement?.kind === 'message' && selectedElement.targetId
              ? selectedElement.targetId
              : s.ui.selectedMessageId,
          activeTab:
            selectedElement?.kind === 'avatar' || selectedElement?.kind === 'contact_name'
              ? 'contact'
              : selectedElement?.kind === 'wallpaper' || selectedElement?.kind === 'status_bar'
                ? 'appearance'
                : selectedElement?.kind === 'message' ||
                    selectedElement?.kind === 'timestamp' ||
                    selectedElement?.kind === 'attachment' ||
                    selectedElement?.kind === 'chat_list_row'
                  ? 'messages'
                  : s.ui.activeTab,
          editorOpen: selectedElement ? true : s.ui.editorOpen,
          previewMode: selectedElement ? false : s.ui.previewMode,
        },
      })),
    setPreviewZoom: (previewZoom) =>
      set((s) => ({ ui: { ...s.ui, previewZoom } })),
    setEditorOpen: (editorOpen) =>
      set((s) => ({
        ui: {
          ...s.ui,
          editorOpen,
          previewMode: !editorOpen,
        },
      })),
    setActiveTab: (activeTab) =>
      set((s) => ({ ui: { ...s.ui, activeTab } })),
    setMobileDrawerOpen: (mobileDrawerOpen) =>
      set((s) => ({ ui: { ...s.ui, mobileDrawerOpen } })),
    setTimelineOpen: (isTimelineOpen) =>
      set((s) => ({ ui: { ...s.ui, isTimelineOpen } })),
    setPreviewMode: (previewMode) =>
      set((s) => ({ ui: { ...s.ui, previewMode } })),
    setTypingPreview: (isTypingPreview) =>
      set((s) => ({ ui: { ...s.ui, isTypingPreview } })),
    setLivePreviewEnabled: (livePreviewEnabled) =>
      set((s) => ({
        renderedProject: livePreviewEnabled ? s.project : s.renderedProject,
        ui: {
          ...s.ui,
          livePreviewEnabled,
          previewSyncStatus: livePreviewEnabled ? 'updating' : 'paused',
        },
      })),
    forceUpdatePreview: () =>
      set((s) => ({
        renderedProject: s.project,
        ui: {
          ...s.ui,
          previewSyncStatus: 'updating',
        },
      })),
    markPreviewRendered: (version) =>
      set((s) => {
        if (s.mutationVersion !== version) return s;
        if (s.ui.previewSyncStatus !== 'updating') return s;
        return {
          ui: {
            ...s.ui,
            previewSyncStatus: 'updated',
          },
        };
      }),
    playTimeline: () => {
      const conv = getActiveConversation(get().project);
      const currentCount = get().ui.timelineVisibleCount;
      const startCount =
        currentCount >= conv.messages.length ? 1 : Math.max(1, currentCount);
      set((s) => ({
        ui: {
          ...s.ui,
          isTimelineOpen: true,
          isPlayingTimeline: true,
          timelineVisibleCount: startCount,
        },
      }));
    },
    pauseTimeline: () =>
      set((s) => ({ ui: { ...s.ui, isPlayingTimeline: false } })),
    resetTimeline: () =>
      set((s) => ({
        ui: {
          ...s.ui,
          isPlayingTimeline: false,
          timelineVisibleCount: 999,
        },
      })),
    stepTimelineForward: () => {
      const conv = getActiveConversation(get().project);
      const curr = get().ui.timelineVisibleCount;
      if (curr >= conv.messages.length) {
        set((s) => ({
          ui: { ...s.ui, isPlayingTimeline: false, timelineVisibleCount: conv.messages.length },
        }));
        return;
      }
      set((s) => ({
        ui: { ...s.ui, timelineVisibleCount: curr + 1 },
      }));
    },
    setTimelineDelayMs: (defaultMessageDelayMs) =>
      commitMutation((prev) => ({
        ...prev,
        timeline: { ...prev.timeline, defaultMessageDelayMs },
      })),
    updateVideoOptions: (patch) =>
      commitMutation((prev) => ({
        ...prev,
        timeline: {
          ...prev.timeline,
          videoOptions: {
            aspectRatio: prev.timeline.videoOptions?.aspectRatio ?? '9:16',
            backgroundCss:
              prev.timeline.videoOptions?.backgroundCss ??
              'linear-gradient(135deg, #0f172a 0%, #312e81 55%, #1e1b4b 100%)',
            showKeyboard: prev.timeline.videoOptions?.showKeyboard ?? false,
            simulateVoicePlayback:
              prev.timeline.videoOptions?.simulateVoicePlayback ?? true,
            perMessageDelays: prev.timeline.videoOptions?.perMessageDelays ?? {},
            ...patch,
          },
        },
      })),
    clearError: () => set({ errorMessage: null }),
  };
});
