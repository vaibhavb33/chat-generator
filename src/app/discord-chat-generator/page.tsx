import React from 'react';
import { DedicatedGeneratorPage } from '@/components/generator-page/DedicatedGeneratorPage';
import { buildGeneratorMetadata } from '@/components/generator-page/generatorMetadata';

export const metadata = buildGeneratorMetadata('discord-chat');

export default function DiscordChatGeneratorPage() {
  return <DedicatedGeneratorPage platformId="discord-chat" />;
}
