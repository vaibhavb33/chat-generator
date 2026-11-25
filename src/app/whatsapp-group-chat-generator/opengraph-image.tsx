import { buildGeneratorOgImage } from '@/components/generator-page/generatorMetadata';

export const runtime = 'nodejs';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return buildGeneratorOgImage('whatsapp-group-chat');
}
