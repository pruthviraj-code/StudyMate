# StudyMate — Student Assignment & Activity Manager

StudyMate is a full-stack student dashboard built with React + Vite, Express, and SQLite. It includes email/password registration and login, protected API routes, and private assignments and activities for each account.

## Features

- Register with a name, email address, and password
- Sign in and sign out
- Passwords stored as bcrypt hashes (never stored as plain text)
- JWT bearer-token authentication (7-day expiry)
- Protected assignment, activity, and dashboard APIs
- Each account can only read or change its own assignments and activities
- Dashboard: total / pending / completed assignments and upcoming activities
- Assignments: add, list, edit, delete, mark completed / pending
- Activities: add, list, delete

## Requirements

- Node.js 22.12+ recommended for the included `better-sqlite3` 13.x dependency
- npm
- On Windows, if `better-sqlite3` cannot download a compatible prebuilt binary and tries to compile, install Visual Studio Build Tools with **Desktop development with C++**, MSVC, and a Windows SDK. See the [official troubleshooting guide](https://github.com/WiseLibs/better-sqlite3/blob/master/docs/troubleshooting.md).

## Install and run

Open two terminals from the project root.

### Terminal 1 — backend

```bash
cd server
npm install
```

Set a private JWT signing secret before using the app beyond local development. In PowerShell:

```powershell
$env:JWT_SECRET="replace-this-with-a-long-random-secret"
npm run dev
```

In Git Bash:

```bash
export JWT_SECRET="replace-this-with-a-long-random-secret"
npm run dev
```

The API runs at `http://localhost:5000`.

### Terminal 2 — frontend

```bash
cd client
npm install
npm run dev
```

Open `http://localhost:5173`, select **Create account**, register, and then use StudyMate. Use the **Log out** control in the sidebar to sign out.

## Authentication notes

- The frontend stores the short-lived access token in `localStorage`; the API requires it in the `Authorization: Bearer ...` header for protected routes. For a production deployment, prefer secure, HttpOnly cookies and add rate limiting, HTTPS, and a password-reset flow.
- The fallback JWT secret in source code is for local development only. Always set `JWT_SECRET` to a strong random value before deployment.
- Existing database files are migrated automatically to add `users` and `user_id` columns. Old assignments and activities created before accounts existed remain unassigned and are not shown to new accounts; back up `server/studymate.db` before changing database files.
- To reset local data, stop the server and delete `server/studymate.db` (this deletes accounts and all stored data).

## API endpoints

| Method | Endpoint | Authentication | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Create account |
| POST | `/api/auth/login` | Public | Sign in |
| GET | `/api/auth/me` | Bearer token | Current account |
| GET | `/api/assignments` | Bearer token | List own assignments |
| GET | `/api/assignments/:id` | Bearer token | Read own assignment |
| POST | `/api/assignments` | Bearer token | Create assignment |
| PUT | `/api/assignments/:id` | Bearer token | Update own assignment |
| PATCH | `/api/assignments/:id/status` | Bearer token | Change own assignment status |
| DELETE | `/api/assignments/:id` | Bearer token | Delete own assignment |
| GET | `/api/activities` | Bearer token | List own activities |
| POST | `/api/activities` | Bearer token | Create activity |
| DELETE | `/api/activities/:id` | Bearer token | Delete own activity |
| GET | `/api/dashboard/stats` | Bearer token | Current account's dashboard counts |

## Folder structure

```text
StudyMate-SQLite/
├── client/   React + Vite frontend
└── server/   Express API, authentication, SQLite database and routes
```
# StudyMate
