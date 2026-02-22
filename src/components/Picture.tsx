import { ImgHTMLAttributes } from 'react';

/**
 * Renders a <picture> element with WebP source and PNG fallback.
 *
 * Accepts all standard <img> attributes. The `src` prop should point
 * to the PNG path — the WebP path is derived automatically by
 * replacing the `.png` extension with `.webp`.
 */
export default function Picture({
  src,
  alt,
  ...rest
}: ImgHTMLAttributes<HTMLImageElement>) {
  const webpSrc = src?.replace(/\.png$/, '.webp');

  return (
    <picture>
      {webpSrc && <source srcSet={webpSrc} type="image/webp" />}
      <img src={src} alt={alt} {...rest} />
    </picture>
  );
}
