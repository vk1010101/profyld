# Portfolio SaaS - Setup Guide

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `portfolio-saas` (or whatever you want)
   - **Database Password**: Generate a strong one and SAVE IT
   - **Region**: Choose closest to your users
5. Click "Create new project" and wait ~2 minutes

## Step 2: Get Your API Keys

1. In your Supabase project, click **Project Settings** (gear icon in sidebar)
2. Click **API** in the left menu
3. You need these values:
   - **Project URL**: `https://xxxxxxxxxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## Step 3: Create .env.local File

Create a file called `.env.local` in your project root with:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Step 4: Run Database Schema

1. In Supabase dashboard, click **SQL Editor** in the sidebar
2. Click **New Query**
3. Open the file `supabase/schema.sql` from this project
4. Copy the ENTIRE contents and paste into the SQL Editor
5. Click **Run** (or press Ctrl+Enter)
6. You should see "Success. No rows returned" - this is correct!

## Step 5: Create Storage Buckets (REQUIRED - Manual Step)

Storage buckets MUST be created via the Supabase UI (not SQL):

1. Go to **Storage** in Supabase sidebar
2. Click **New Bucket** for each:

   | Bucket Name | Public? | Description |
   |-------------|---------|-------------|
   | `avatars` | ✅ Yes | Profile images |
   | `portfolio` | ✅ Yes | Project images, artwork, logos |
   | `documents` | ✅ Yes | CV/resume PDFs |

3. For each bucket, after creating:
   - Click the bucket name
   - Go to **Policies** tab
   - Click **New Policy** → **For full customization**
   - Create these policies:

**SELECT (Public Read):**
```sql
CREATE POLICY "Public read access" ON storage.objects
FOR SELECT USING (bucket_id = 'YOUR_BUCKET_NAME');
```

**INSERT (Authenticated Upload):**
```sql
CREATE POLICY "Authenticated users can upload" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'YOUR_BUCKET_NAME' AND auth.role() = 'authenticated');
```

**UPDATE/DELETE (Owner only):**
```sql
CREATE POLICY "Users can update own files" ON storage.objects
FOR UPDATE USING (bucket_id = 'YOUR_BUCKET_NAME' AND auth.uid()::text = (storage.foldername(name))[1]);
```

## Step 6: Configure Auth (Optional)

For Google/GitHub login later:

1. Go to **Authentication** > **Providers**
2. Enable desired providers
3. Add OAuth credentials

## Step 7: Run the App

```bash
npm run dev
```

Visit `http://localhost:3000` and you're ready!

---

## Troubleshooting

### "relation does not exist" error
Run the schema.sql again - something didn't execute properly.

### Storage upload fails
Check that storage buckets exist and RLS policies are applied.

### Auth redirect issues
Make sure `NEXT_PUBLIC_APP_URL` matches your actual URL.
