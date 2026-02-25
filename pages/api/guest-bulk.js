import { pool } from '../../lib/db'

export default async function handler(req, res) {

  const { names } = req.body;

  for (const n of names) {
    await pool.query(
      'INSERT INTO guests(name) VALUES($1) ON CONFLICT DO NOTHING',
      [n]
    );
  }

  res.json({ ok: true });
}
