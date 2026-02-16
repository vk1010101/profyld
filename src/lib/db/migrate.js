const postgres = require('postgres');
const fs = require('fs');
const path = require('path');

// Manually load .env.local
try {
    const envPath = path.join(__dirname, '../../../.env.local');
    const envFile = fs.readFileSync(envPath, 'utf8');
    envFile.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length > 0) {
            const value = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
            process.env[key.trim()] = value;
        }
    });
} catch (e) {
    console.warn('⚠️ Could not read .env.local file');
}

const runMigration = async () => {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
        console.error('❌ DATABASE_URL is missing in .env.local');
        console.error('Please add your Supabase connection string to .env.local');
        process.exit(1);
    }

    console.log('🔌 Connecting to database...');
    const sql = postgres(connectionString, {
        ssl: 'require',
        max: 1
    });

    try {
        console.log('📂 Reading migration file...');
        const migrationPath = path.join(__dirname, '../../../supabase/migrations/relax_constraints.sql');
        const migrationSql = fs.readFileSync(migrationPath, 'utf8');

        console.log('🚀 Running migration...');

        // Split by semicolon to run individually if needed, but postgres.js file() or simple query might handle multi-statement.
        // postgres.js handles multi-statement queries in a single call usually.
        await sql.unsafe(migrationSql);

        console.log('✅ Migration completed successfully!');
        console.log('   - Tables created (if missing)');
        console.log('   - RLS policies applied');

    } catch (error) {
        console.error('❌ Migration failed:', error.message);
    } finally {
        await sql.end();
    }
};

runMigration();
