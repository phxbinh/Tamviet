// src/lib/supabase/publicURL.ts

const BUCKET = "product-images";

export function getPublicImageUrl(path: string) {
  if (!path) return "";

  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`;
}