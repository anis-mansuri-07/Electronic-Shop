// Utility to build full image URL from backend-stored relative paths
// Handles values like:
//  - /images/products/abc.jpg
//  - images/products/abc.jpg
//  - images\\products\\abc.jpg (Windows backslashes)
//  - http(s) absolute URLs (returned as-is)
//  - data: URLs (returned as-is)
// Falls back to a transparent placeholder if empty.

const BASE_FALLBACK = "http://localhost:8080";
const PLACEHOLDER =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600"><rect width="100%" height="100%" fill="%23f3f4f6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="28" fill="%239ca3af" font-family="Arial">No Image</text></svg>';

export function buildImageUrl(raw: string | undefined | null): string {
  console.log("🖼️ buildImageUrl - Input:", raw);

  if (!raw || !raw.trim()) {
    console.log("❌ Empty or null image path, using placeholder");
    return PLACEHOLDER;
  }

  // Absolute or data URI - return directly
  if (/^(https?:)?\/\//i.test(raw) || raw.startsWith("data:")) {
    console.log("✅ Absolute/Data URL, returning as-is:", raw);
    return raw;
  }

  let path = raw.trim().replace(/\\/g, "/"); // convert backslashes

  // Remove leading ./ or .\
  path = path.replace(/^\.\/?/, "");

  // Add leading slash if not present
  // DB stores as "images/products/xxx.jpg" or "images/categories/xxx.jpg"
  if (!path.startsWith("/")) {
    path = "/" + path;
  }

  // Derive base host by stripping trailing /api from configured backend URL
  const base = (import.meta.env.VITE_API_URL || BASE_FALLBACK).replace(
    /\/api\/?$/,
    ""
  );

  const finalUrl = base + path;
  console.log("🔗 Final URL:", finalUrl);

  return finalUrl;
}

export function buildFirstImage(images: string[] | undefined | null): string {
  if (!images || images.length === 0) return PLACEHOLDER;
  return buildImageUrl(images[0]);
}

export function buildAllImages(images: string[] | undefined | null): string[] {
  if (!images || images.length === 0) return [];
  return images.map(buildImageUrl);
}
