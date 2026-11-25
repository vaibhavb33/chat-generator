import React from 'react';
import { DedicatedGeneratorPage } from '@/components/generator-page/DedicatedGeneratorPage';
import { buildGeneratorMetadata } from '@/components/generator-page/generatorMetadata';

export const metadata = buildGeneratorMetadata('instagram-story');

export default function InstagramStoryGeneratorPage() {
  return <DedicatedGeneratorPage platformId="instagram-story" />;
}
