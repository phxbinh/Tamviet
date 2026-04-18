import { cache } from "react";
import { getProductDetail_slug } from "./getProductDetail_slug";

export const getProductCached = cache(async (slug: string) => {
  return await getProductDetail_slug(slug);
});