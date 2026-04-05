// lib/db/index.ts
import { drizzle } from 'drizzle-orm/node-postgres';
import { pool } from './pg'; // File pg.ts của bạn
import * as schema from './schemaEditor';

export const db = drizzle(pool, { schema });
