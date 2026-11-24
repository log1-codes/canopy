# Canopy

A collaborative, Notion-style notes app with workspaces, nested pages, a rich-text editor, and role-based sharing.

**Live:** [canopy.anurag.engineer](https://canopy.anurag.engineer)

## Features

- **Workspaces:** create, rename, and delete workspaces, each with its own page tree.
- **Nested pages:** pages can have child pages to any depth, shown as a collapsible tree in the sidebar. Deleting a page removes its children.
- **Rich-text editor (Tiptap):** headings, lists, task lists, tables, code blocks, quotes, links, images, highlights, text colour and alignment, and a live character count.
- **Sharing with roles:** invite collaborators to a workspace as **Owner**, **Editor**, or **Viewer**. Viewers get a read-only editor; editors can change content.
- **Authentication:** email and password sign-up and login with NextAuth (JWT sessions), bcrypt password hashing, and a forgot/reset-password flow over email (Resend).
- **Protection:** route guarding for the dashboard and per-IP rate limiting on sign-up, forgot-password, and reset-password endpoints.
- **Validation:** every API input checked with Zod.

## Tech stack

| Layer | Tools |
| --- | --- |
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Database | PostgreSQL 16, Prisma ORM |
| Auth | NextAuth (credentials, JWT), bcryptjs |
| Editor | Tiptap 3 |
| UI | Tailwind CSS 4, Radix UI, shadcn/ui, Framer Motion, Lucide icons |
| State | Zustand |
| Email | Resend |
| Analytics | Vercel Analytics |

## Data model

```
User ──< WorkspaceAccess (role: OWNER | EDITOR | VIEWER) >── Workspace ──< Page
                                                                         └─< Page (children)
```

- A user owns workspaces and joins others through `WorkspaceAccess`, one role per workspace.
- Pages belong to one workspace and can have a parent page, which gives the nested tree.
- Page content is stored as editor JSON.

## API routes

| Route | Purpose |
| --- | --- |
| `POST /api/auth/register` | Create an account |
| `/api/auth/[...nextauth]` | Login and session |
| `POST /api/auth/forgot-password` · `POST /api/reset-password` | Password reset by email |
| `POST /api/workspaces/create` · `GET /api/workspaces/all-workspaces` | Create and list workspaces |
| `PATCH/DELETE /api/workspaces/:id` | Rename or delete a workspace |
| `GET/POST/DELETE /api/workspaces/:id/access` | List, add, and remove collaborators |
| `GET /api/workspaces/:id/pages-hierarchy` | Page tree for the sidebar |
| `POST /api/pages` · `PUT /api/pages/:pageId` | Create and save pages |

## Run locally

```bash
git clone https://github.com/log1-codes/canopy.git
cd canopy
npm install
```

Create a `.env` file:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/canopy"
POSTGRES_USER=USER
POSTGRES_PASSWORD=PASSWORD
POSTGRES_DB=canopy
NEXTAUTH_SECRET="a-long-random-string"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
RESEND_API_KEY="your-resend-key"
```

Then start the database, apply the schema, and run the app:

```bash
docker compose up -d
npx prisma migrate dev
npm run dev        # http://localhost:3000
```

## Author

**Anurag Kumar** · [anurag.engineer](https://anurag.engineer) · [GitHub](https://github.com/log1-codes)
