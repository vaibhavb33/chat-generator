import React from 'react';
import { DedicatedGeneratorPage } from '@/components/generator-page/DedicatedGeneratorPage';
import { buildGeneratorMetadata } from '@/components/generator-page/generatorMetadata';

export const metadata = buildGeneratorMetadata('instagram-post');

export default function InstagramPostGeneratorPage() {
  return <DedicatedGeneratorPage platformId="instagram-post" />;
}
