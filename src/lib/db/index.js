import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

/**
 * Database Connection Setup
 * 
 * To move away from Supabase Client and use full Drizzle power:
 * 1. Add DATABASE_URL to your .env.local
 * 2. DATABASE_URL should look like: postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres
 */

const connectionString = process.env.DATABASE_URL;

// For development/initial setup where DATABASE_URL might be missing,
// we'll export a mock or warning to prevent the app from crashing.
// Once DATABASE_URL is added, it will use the real connection.

let db;

if (connectionString) {
    const client = postgres(connectionString);
    db = drizzle(client, { schema });
} else {
    // Fallback for when DB_URL is missing
    db = {
        // This allows us to use db.query... without crashing, 
        // though it will return errors until the URL is added.
        query: new Proxy({}, {
            get() {
                return {
                    findFirst: () => { throw new Error('DATABASE_URL is missing in .env.local') },
                    findMany: () => { throw new Error('DATABASE_URL is missing in .env.local') },
                }
            }
        })
    };
}

export { db };
