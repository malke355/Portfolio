/**
 * Custom image loader for the GitHub Pages static export.
 * next/image with `images.unoptimized` does not always apply `basePath` to
 * the final src, so root-absolute paths like /images/hero.png resolve to
 * malke355.github.io/images/... (404) instead of .../Portfolio/images/...
 */
export default function portfolioImageLoader({ src }) {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? ''
  if (!src || src.startsWith('http') || src.startsWith('data:') || src.startsWith(base)) {
    return src
  }
  return `${base}${src.startsWith('/') ? src : `/${src}`}`
}
