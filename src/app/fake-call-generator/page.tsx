import React from 'react';
import { DedicatedGeneratorPage } from '@/components/generator-page/DedicatedGeneratorPage';
import { buildGeneratorMetadata } from '@/components/generator-page/generatorMetadata';

export const metadata = buildGeneratorMetadata('fake-call-screen');

export default function FakeCallGeneratorPage() {
  return <DedicatedGeneratorPage platformId="fake-call-screen" />;
}
