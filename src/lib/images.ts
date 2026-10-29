import type { ImageMetadata } from 'astro';

const assetModules = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/images/**/*.{jpg,jpeg,png,webp,avif}',
  { eager: true }
);

const imageRegistry = new Map<string, ImageMetadata>();

for (const [modulePath, mod] of Object.entries(assetModules)) {
  const publicLikePath = modulePath.replace('/src/assets', '');
  imageRegistry.set(publicLikePath, mod.default);
}

export function resolveLocalImage(src?: string): ImageMetadata | undefined {
  if (!src) return undefined;
  return imageRegistry.get(src);
}

