import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, "..", "data", "clickbait.db");

const db = new Database(DB_PATH);

db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS clickbait_scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    difficulty TEXT NOT NULL,
    score INTEGER NOT NULL,
    avg_reaction_time REAL,
    accuracy REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE INDEX IF NOT EXISTS idx_clickbait_scores_difficulty_score ON clickbait_scores(difficulty, score DESC);
`);

const SELECT_COLS =
  "username, difficulty, score, avg_reaction_time, accuracy, created_at";

export function getTopScores(difficulty?: string, limit = 10) {
  const latestPerUser = `
    SELECT ${SELECT_COLS} FROM clickbait_scores s1
    WHERE s1.id = (
      SELECT s2.id FROM clickbait_scores s2
      WHERE s2.username = s1.username AND s2.difficulty = s1.difficulty
      ORDER BY s2.created_at DESC LIMIT 1
    )
  `;

  if (difficulty) {
    return db
      .prepare(
        `${latestPerUser} AND s1.difficulty = ? ORDER BY s1.score DESC LIMIT ?`
      )
      .all(difficulty, limit);
  }
  return db
    .prepare(`${latestPerUser} ORDER BY s1.score DESC LIMIT ?`)
    .all(limit);
}

export function insertScore(
  username: string,
  difficulty: string,
  score: number,
  avgReactionTime: number,
  accuracy: number
) {
  const stmt = db.prepare(
    "INSERT INTO clickbait_scores (username, difficulty, score, avg_reaction_time, accuracy) VALUES (?, ?, ?, ?, ?)"
  );
  const result = stmt.run(username, difficulty, score, avgReactionTime, accuracy);
  return db
    .prepare(`SELECT ${SELECT_COLS} FROM clickbait_scores WHERE id = ?`)
    .get(result.lastInsertRowid);
}

export default db;
