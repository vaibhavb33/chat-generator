import React from 'react';
import { DedicatedGeneratorPage } from '@/components/generator-page/DedicatedGeneratorPage';
import { buildGeneratorMetadata } from '@/components/generator-page/generatorMetadata';

export const metadata = buildGeneratorMetadata('telegram-chat');

export default function TelegramChatGeneratorPage() {
  return <DedicatedGeneratorPage platformId="telegram-chat" />;
}
