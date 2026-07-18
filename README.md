# College Papers Portal (collegepapers.in)

This is a website built to help students in Chhattisgarh download previous year question papers (PYQs) for universities like PRSU, CSVTU, Amity, etc.

It's built using **Next.js (App Router)** and **Supabase** for database/file storage.

## Features
- **Easy navigation**: Click university -> college -> course -> semester -> subject to find papers.
- **Fast**: Pages are statically generated.
- **Bookmarks**: Save papers locally using local storage.
- **Direct Downloads**: Download papers with clean filenames.

## Tech Stack
- Next.js 14
- Supabase (PostgreSQL & Storage)
- CSS Modules

## Setup

1. Clone and install dependencies:
```bash
npm install
```

2. Create a `.env` file:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

3. Run locally:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

4. Build for production:
```bash
npm run build
```

