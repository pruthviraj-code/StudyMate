import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';

// The database is a single file (studymate.db) created automatically in the server folder
const db = new Database(fileURLToPath(new URL('./studymate.db', import.meta.url)));

// Dates are stored as TEXT in YYYY-MM-DD format, so they reach the frontend unchanged
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE COLLATE NOCASE,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS assignments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    subject TEXT NOT NULL,
    description TEXT,
    due_date TEXT NOT NULL,
    priority TEXT NOT NULL DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High')),
    status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Completed')),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS activities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    activity_type TEXT NOT NULL DEFAULT 'Other' CHECK (activity_type IN ('Exam', 'Seminar', 'Practical', 'Event', 'Other')),
    activity_date TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'Upcoming' CHECK (status IN ('Upcoming', 'Completed')),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`);

// Migrate databases created by older StudyMate versions. Existing records remain
// unassigned until a user recreates them; new records are always user-scoped.
for (const table of ['assignments', 'activities']) {
  const columns = db.prepare(`PRAGMA table_info(${table})`).all();
  if (!columns.some((column) => column.name === 'user_id')) {
    db.exec(`ALTER TABLE ${table} ADD COLUMN user_id INTEGER REFERENCES users(id) ON DELETE CASCADE`);
  }
}

export default db;
