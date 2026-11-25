import React from 'react';
import { DedicatedGeneratorPage } from '@/components/generator-page/DedicatedGeneratorPage';
import { buildGeneratorMetadata } from '@/components/generator-page/generatorMetadata';

export const metadata = buildGeneratorMetadata('android-messages');

export default function AndroidMessageGeneratorPage() {
  return <DedicatedGeneratorPage platformId="android-messages" />;
}
