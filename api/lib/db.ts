import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : undefined,
  max: 5,
});

const SELECT_COLS =
  "username, difficulty, score, avg_reaction_time, accuracy, created_at";

export async function getTopScores(difficulty?: string, limit = 10) {
  const latestPerUser = `
    SELECT DISTINCT ON (s.username, s.difficulty)
      ${SELECT_COLS}
    FROM clickbait_scores s
    ORDER BY s.username, s.difficulty, s.created_at DESC
  `;

  if (difficulty) {
    const { rows } = await pool.query(
      `SELECT * FROM (${latestPerUser}) sub
       WHERE sub.difficulty = $1
       ORDER BY sub.score DESC
       LIMIT $2`,
      [difficulty, limit]
    );
    return rows;
  }

  const { rows } = await pool.query(
    `SELECT * FROM (${latestPerUser}) sub
     ORDER BY sub.score DESC
     LIMIT $1`,
    [limit]
  );
  return rows;
}

export async function insertScore(
  username: string,
  difficulty: string,
  score: number,
  avgReactionTime: number,
  accuracy: number
) {
  const { rows } = await pool.query(
    `INSERT INTO clickbait_scores (username, difficulty, score, avg_reaction_time, accuracy)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING ${SELECT_COLS}`,
    [username, difficulty, score, avgReactionTime, accuracy]
  );

  // Prune: keep max 500 rows per difficulty (delete lowest clickbait_scores beyond that)
  await pool.query(
    `DELETE FROM clickbait_scores WHERE id IN (
       SELECT id FROM clickbait_scores WHERE difficulty = $1
       ORDER BY score DESC
       OFFSET 500
     )`,
    [difficulty]
  );

  return rows[0];
}

export default pool;
