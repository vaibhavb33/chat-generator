import React from 'react';
import { DedicatedGeneratorPage } from '@/components/generator-page/DedicatedGeneratorPage';
import { buildGeneratorMetadata } from '@/components/generator-page/generatorMetadata';

export const metadata = buildGeneratorMetadata('imessage');

export default function IMessageGeneratorPage() {
  return <DedicatedGeneratorPage platformId="imessage" />;
}
