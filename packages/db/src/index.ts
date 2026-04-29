import { neon } from "@neondatabase/serverless";
import { env } from "@prosopopeia/env/server";
import { drizzle } from "drizzle-orm/neon-http";
export * from "drizzle-orm";

import * as schema from "./schema";

export function createDb() {
  const sql = neon(env.DATABASE_URL);
  return drizzle(sql, { schema });
}

export const db = createDb();
