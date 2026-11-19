/**
 * Cloudinary & asset optimization helper.
 * If VITE_CLOUDINARY_CLOUD_NAME is provided in the environment,
 * routes image requests through Cloudinary's dynamic CDN transformations (f_auto, q_auto).
 * Otherwise returns optimized local WebP / asset paths directly.
 */
export function getOptimizedImageUrl(src: string): string {
  const cloudName = (import.meta as any).env?.VITE_CLOUDINARY_CLOUD_NAME;
  if (cloudName && !src.startsWith('http://') && !src.startsWith('https://')) {
    const cleanPath = src.startsWith('/') ? src.slice(1) : src;
    return `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto/${cleanPath}`;
  }
  return src;
}
