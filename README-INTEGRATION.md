# Lovable Frontend Integration

This frontend now assumes:

- public website runs from this Vite app
- secure lead API runs on the Express backend in the workspace root
- owner dashboard stays on the backend at `/admin/login`

## Development

1. Start the backend from the workspace root:

```powershell
npm.cmd run dev
```

2. Start this frontend in a second terminal:

```powershell
cd external\dream-home-showcase
npm.cmd run dev
```

## Backend URL

By default, local development assumes the backend is on `http://localhost:3000`.

If you change the backend port, create `.env.local` in this folder:

```env
VITE_BACKEND_URL=http://localhost:3000
```

## Current Behavior

- Contact page posts to `POST /api/leads`
- Gallery uses local static media only
- `/auth` and `/admin` in the frontend link to the secure backend dashboard
