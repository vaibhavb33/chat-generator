import React from 'react';
import { DedicatedGeneratorPage } from '@/components/generator-page/DedicatedGeneratorPage';
import { buildGeneratorMetadata } from '@/components/generator-page/generatorMetadata';

export const metadata = buildGeneratorMetadata('whatsapp-group-chat');

export default function WhatsAppGroupChatGeneratorPage() {
  return <DedicatedGeneratorPage platformId="whatsapp-group-chat" />;
}
