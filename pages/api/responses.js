
import { pool } from '../../lib/db'
export default async function handler(req, res)
  const r=await pool.query(`
  SELECT g.name,r.status,r.dietary,r.updated_at as timestamp
  FROM responses r JOIN guests g ON g.id=r.guest_id`);
  res.json(r.rows);
}
