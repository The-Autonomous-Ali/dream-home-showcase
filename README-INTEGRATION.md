# Vercel and Supabase Integration

This frontend now assumes:

- the public website and owner dashboard both run from this app
- visitor enquiries are saved directly to Supabase
- owner login uses Supabase Auth

## Required environment variables

Set these in Vercel project settings and in `.env.local` for local development:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
VITE_ALLOW_OWNER_SIGNUP=false
```

`VITE_ALLOW_OWNER_SIGNUP` is optional. Leave it `false` for normal operation. Turn it on temporarily only if you want to create the first owner account from the site itself.

## Local development

1. Start the frontend:

```powershell
cd external\dream-home-showcase
npm.cmd run dev
```

2. Open the Vite URL shown in the terminal.

## Current behavior

- Contact page inserts rows into `public.leads`
- `/auth` signs owners in with Supabase Auth
- `/admin` shows leads and media tools only to users with the `admin` role
- Admin users can upload and delete gallery media from the `site-media` Supabase storage bucket
- Uploaded images appear on the public home/gallery pages automatically
- Admin users can delete leads from the dashboard

## First owner setup

Safest option:

1. Create the owner user in Supabase Auth.
2. Sign in at `/auth`.
3. Open `/admin` and click `Claim First Admin Access` if no admin exists yet.

Optional self-service option:

1. Set `VITE_ALLOW_OWNER_SIGNUP=true`.
2. Use `/auth` to create the first owner account.
3. Visit `/admin` to claim admin access.
4. Set `VITE_ALLOW_OWNER_SIGNUP=false` again and redeploy.

## Database

If your Supabase project does not already have the required tables and policies, run the SQL files in:

- `supabase/migrations/20260505162007_b8358eaf-9806-40a6-9f51-aee7df5f52a0.sql`
- `supabase/migrations/20260505162328_12db3f58-3d0f-4031-a71c-076f26b3226a.sql`
