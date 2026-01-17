# Duplifinance Admin Dashboard

A secure admin dashboard for managing content, images, and viewing analytics for the Duplifinance landing page.

## Features

- 🔐 **Secure Authentication** - Email/password login via Supabase Auth
- 📝 **Content Management** - Edit all text translations (EN/ES) in one place
- 🖼️ **Image Management** - Upload, view, and delete images via Supabase Storage
- 📊 **Analytics Dashboard** - View visitor stats with Chart.js visualizations
- 🎨 **Clean UI** - Modern admin interface with dark sidebar navigation

## Setup Instructions

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be provisioned

### 2. Configure Environment Variables

Create a `.env` file in the project root (copy from `.env.example`):

```env
PUBLIC_SUPABASE_URL=https://your-project.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Find these values in your Supabase project:
- Go to **Settings** → **API**
- Copy the **Project URL** → `PUBLIC_SUPABASE_URL`
- Copy the **anon public** key → `PUBLIC_SUPABASE_ANON_KEY`

### 3. Set Up Database Tables

1. Go to **SQL Editor** in your Supabase dashboard
2. Copy the contents of `supabase/schema.sql`
3. Paste and run the SQL to create the required tables

### 4. Create Storage Bucket

1. Go to **Storage** in your Supabase dashboard
2. Click **New bucket**
3. Name it `site-images`
4. Check **Public bucket** (for public image URLs)
5. Click **Create bucket**

### 5. Create Admin User

1. Go to **Authentication** → **Users** in Supabase dashboard
2. Click **Add user** → **Create new user**
3. Enter email and password for your admin account
4. Click **Create user**

### 6. Start the Development Server

```bash
npm run dev
```

### 7. Access the Admin Dashboard

Navigate to `http://localhost:4321/admin/login` and sign in with your admin credentials.

## Admin Routes

| Route | Description |
|-------|-------------|
| `/admin/login` | Admin login page |
| `/admin` | Dashboard with overview stats |
| `/admin/content` | Content/translations editor |
| `/admin/images` | Image upload and management |
| `/admin/analytics` | Analytics dashboard |

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/logout` | POST | Log out and clear session |
| `/api/content/update` | POST | Update content translations |
| `/api/content/sync` | POST | Sync translations from file to DB |
| `/api/images/upload` | POST | Upload image to storage |
| `/api/images/delete` | POST | Delete image from storage |

## Analytics Integration

The analytics page shows demo data by default. To integrate real analytics:

### Option 1: Plausible Analytics
1. Sign up at [plausible.io](https://plausible.io)
2. Add tracking script to `Layout.astro`
3. Use Plausible API to fetch data

### Option 2: Umami
1. Self-host or use [umami.is](https://umami.is)
2. Add tracking script
3. Use Umami API for dashboard

### Option 3: Custom (Supabase)
1. Create an edge function to track page views
2. Store data in `site_analytics` table
3. Fetch from the analytics page

### Option 4: Vercel Analytics
If deploying to Vercel, enable built-in analytics in your project settings.

## Security Notes

- All admin routes are protected with session-based authentication
- API routes verify the session token before processing requests
- Cookies are HTTP-only, secure, and SameSite=Lax
- Admin pages have `noindex, nofollow` meta tags

## File Structure

```
src/
├── lib/
│   └── supabase.ts          # Supabase client configuration
├── layouts/
│   └── AdminLayout.astro    # Admin dashboard layout
├── pages/
│   ├── admin/
│   │   ├── login.astro      # Login page
│   │   ├── index.astro      # Dashboard
│   │   ├── content.astro    # Content editor
│   │   ├── images.astro     # Image manager
│   │   └── analytics.astro  # Analytics view
│   └── api/
│       ├── auth/
│       │   └── logout.ts    # Logout endpoint
│       ├── content/
│       │   ├── update.ts    # Update content
│       │   └── sync.ts      # Sync from file
│       └── images/
│           ├── upload.ts    # Upload image
│           └── delete.ts    # Delete image
└── supabase/
    └── schema.sql           # Database schema
```
