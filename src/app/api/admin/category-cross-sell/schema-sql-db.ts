import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
//import * as schema from "@/db/schema"; // optional
import { categories } from "@/productchatbot/schemaCategories";
import { categoryCrossSell } from "@/productchatbot/schemaCategoryCrossSell";

export const schema = {
  categories,
  categoryCrossSell,
};

const sql = neon(process.env.DATABASE_URL!);

export const dbCrossSell = drizzle(sql, { schema }); // 👈 connect ở đây