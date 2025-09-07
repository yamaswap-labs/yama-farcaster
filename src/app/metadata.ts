import { APP_BASE_URL } from '@/lib/constants';
import { generateFrameMetadata } from '@/lib/generateFrameMetadata';
import type { Metadata } from 'next';

export async function generateAppMetadata(): Promise<Metadata> {
  const metadata: Metadata = {
    title: 'Your Page Name',
    description: 'Your Page Description',
  };

  const frameUrl = `${APP_BASE_URL}`;

  const frameMetadata = await generateFrameMetadata({
    name: metadata.title as string,
    title: metadata.title as string,
    url: frameUrl,
    description: metadata.description as string,
    imageUrl: `${frameUrl}/opengraph-image`,
    launchButtonName: 'Launch App',
  });

  return {
    ...metadata,
    ...frameMetadata,
  };
}