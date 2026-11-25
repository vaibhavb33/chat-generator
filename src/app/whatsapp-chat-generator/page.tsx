import React from 'react';
import { DedicatedGeneratorPage } from '@/components/generator-page/DedicatedGeneratorPage';
import { buildGeneratorMetadata } from '@/components/generator-page/generatorMetadata';

export const metadata = buildGeneratorMetadata('whatsapp-chat');

export default function WhatsAppChatGeneratorPage() {
  return <DedicatedGeneratorPage platformId="whatsapp-chat" />;
}
