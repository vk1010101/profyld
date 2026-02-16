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
} catch (e) { console.log('No .env'); }

async function debug() {
    const sql = postgres(process.env.DATABASE_URL, { ssl: 'require', max: 1 });

    console.log('--- Checking Education Table Columns ---');
    const columns = await sql`
        SELECT column_name, data_type, character_maximum_length 
        FROM information_schema.columns 
        WHERE table_name = 'education';
    `;
    console.table(columns);

    console.log('--- Checking RLS Policies ---');
    const policies = await sql`
        SELECT tablename, policyname, cmd, qual, with_check 
        FROM pg_policies 
        WHERE tablename IN ('education', 'profiles');
    `;
    console.table(policies);

    await sql.end();
}

debug();
