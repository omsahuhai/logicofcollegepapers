# College Papers Portal (`collegepapers.in`)

A premium, full-stack web application designed for students across Chhattisgarh to instantly search, navigate, and download Previous Year Question Papers (PYQs) for state and autonomous universities.

This repository features a complete rebuild migrating from a legacy client-side single-page app to a highly scalable, secure, and SEO-optimized architecture built on **Next.js 14 (App Router)** and **Supabase (PostgreSQL & Storage)**.

---

## 🚀 Key Features

*   **Seamless Selection Funnel**: Guides students through University ➔ College (if applicable) ➔ Course ➔ Semester selection.
*   **Automatic College Bypassing**: Private universities (e.g. *Amity University*, *Kalinga University*) or autonomous colleges automatically skip the college selection step, sending students straight to their course selection.
*   **Native Mobile Back-Button Integration**: The selection state is entirely URL-driven (using Next.js path tokens). Tapping the native browser or mobile back buttons navigates step-by-step backwards through the funnel instead of exiting the portal.
*   **Secure Native Downloads**: Downloads use standard HTML anchor links pointing to a Next.js Route Handler. The handler validates the paper, increments download statistics asynchronously, and performs a secure 60-second redirect containing explicit attachment headers (`Content-Disposition`).
*   **Modern Glassmorphic UI**: Designed with clean dark-mode visuals, vibrant gradients, and smooth spring animations using **Vanilla CSS Modules** (zero CSS bloat).

---

## 🛠️ Technology Stack

*   **Framework**: Next.js 14 (App Router, Server Components)
*   **Database**: Supabase PostgreSQL (Normalized relations, composite partial performance indexes)
*   **Storage**: Supabase Storage Buckets (Protected PDF access via short-lived signed URLs)
*   **Styling**: Vanilla CSS Modules (Scoped transitions and responsive layouts)
*   **Deployment**: Ready for Vercel / Netlify serverless deployment.

---

## 📂 Database Schema

The database is normalized to ensure data integrity and query speeds:

```
┌────────────────┐       ┌─────────────┐       ┌───────────┐       ┌──────────┐
│  universities  │ ───o{ │  colleges   │ ───o{ │  courses  │ ───o{ │  papers  │
└────────────────┘       └─────────────┘       └───────────┘       └──────────┘
```

*   **`universities`**: Stores primary state and private academic institutes (PRSU, CSVTU, Amity, etc.).
*   **`colleges`**: Affiliated institutions tied to a parent university.
*   **`courses`**: Degree levels (UG, PG, Diploma) mapped to colleges or directly to universities.
*   **`papers`**: Metadata for uploaded PYQs (Subject, Code, Year, Semester, Session, Storage Path, and Download Stats).

---

## ⚙️ Local Development Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 3. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🏗️ Production Build & Verification
Compile and verify the application for production:
```bash
npm run build
```
This builds optimized serverless functions ready for dynamic on-demand scaling.
