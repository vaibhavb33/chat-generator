import type { MessageType } from '@/core/types';

export interface ParsedScriptMessage {
  senderName: string;
  type: MessageType;
  text: string;
  durationSeconds?: number;
}

export interface ParsedScriptResult {
  participants: Array<{ name: string; isSelf: boolean }>;
  messages: ParsedScriptMessage[];
  warnings: string[];
}

const VOICE_DIRECTIVE_RE = /^\[voice\s+(\d+):(\d{2})\]\s*(.*)$/i;
const SYSTEM_DIRECTIVE_RE = /^\[system\]\s*:?\s*(.+)$/i;
const SPEAKER_LINE_RE =
  /^([^:\[\]]{1,36}?)(?:\s*\[voice\s+(\d+):(\d{2})\])?\s*:\s*(.+)$/i;

export function parseScreenplayText(
  rawText: string,
  selfNameHint?: string
): ParsedScriptResult {
  const lines = rawText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const participantsMap = new Map<string, { name: string; isSelf: boolean }>();
  const messages: ParsedScriptMessage[] = [];
  const warnings: string[] = [];

  if (lines.length === 0) {
    warnings.push('No lines found. Enter dialogue formatted as "Name: Message".');
    return { participants: [], messages: [], warnings };
  }

  for (const line of lines) {
    const sysMatch = line.match(SYSTEM_DIRECTIVE_RE);
    if (sysMatch) {
      messages.push({
        senderName: 'system',
        type: 'system',
        text: sysMatch[1].trim(),
      });
      continue;
    }

    const speakerMatch = line.match(SPEAKER_LINE_RE);
    if (!speakerMatch) {
      if (messages.length > 0 && messages[messages.length - 1].type === 'text') {
        messages[messages.length - 1].text += `\n${line}`;
      } else {
        warnings.push(`Skipped unformatted line: "${line.slice(0, 40)}"`);
      }
      continue;
    }

    const rawName = speakerMatch[1].trim();
    const prefixVoiceMin = speakerMatch[2];
    const prefixVoiceSec = speakerMatch[3];
    const rawBody = speakerMatch[4].trim();

    if (!participantsMap.has(rawName)) {
      const normalizedHint = selfNameHint?.trim().toLowerCase();
      const isSelf = normalizedHint
        ? rawName.toLowerCase() === normalizedHint
        : participantsMap.size === 0;
      participantsMap.set(rawName, { name: rawName, isSelf });
    }

    if (prefixVoiceMin && prefixVoiceSec) {
      messages.push({
        senderName: rawName,
        type: 'voice_note',
        text: rawBody || 'Voice message',
        durationSeconds: parseInt(prefixVoiceMin, 10) * 60 + parseInt(prefixVoiceSec, 10),
      });
      continue;
    }

    const voiceMatch = rawBody.match(VOICE_DIRECTIVE_RE);
    if (voiceMatch) {
      const minutes = parseInt(voiceMatch[1], 10);
      const seconds = parseInt(voiceMatch[2], 10);
      messages.push({
        senderName: rawName,
        type: 'voice_note',
        text: voiceMatch[3]?.trim() || 'Voice message',
        durationSeconds: minutes * 60 + seconds,
      });
      continue;
    }

    messages.push({
      senderName: rawName,
      type: 'text',
      text: rawBody,
    });
  }

  return {
    participants: Array.from(participantsMap.values()),
    messages,
    warnings,
  };
}
