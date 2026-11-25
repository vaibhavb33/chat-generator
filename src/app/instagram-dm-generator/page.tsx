import React from 'react';
import { DedicatedGeneratorPage } from '@/components/generator-page/DedicatedGeneratorPage';
import { buildGeneratorMetadata } from '@/components/generator-page/generatorMetadata';

export const metadata = buildGeneratorMetadata('instagram-dm');

export default function InstagramDmGeneratorPage() {
  return <DedicatedGeneratorPage platformId="instagram-dm" />;
}
