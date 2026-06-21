import { db } from "@/dbchatbot";
import { assets } from "@/chatbot_OM/schemas";
import { like, eq, and } from "drizzle-orm";

type AssetType =
  | "process"
  | "equipment"
  | "chemical"
  | "instrument"
  | "safety"
  | "maintenance";

export async function searchAssets(
  keyword: string,
  assetType?: AssetType
) {
  const conditions = [
    like(assets.name, `%${keyword}%`)
  ];

  if (assetType) {
    conditions.push(
      eq(assets.assetType, assetType)
    );
  }

  return db
    .select()
    .from(assets)
    .where(and(...conditions))
    .limit(5);
}