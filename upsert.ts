
import { pool } from '../../lib/db'
export default async function handler(req,res){
  const {name,status,dietary}=req.body;
  await pool.query(`
  INSERT INTO responses(guest_id,status,dietary)
  VALUES((SELECT id FROM guests WHERE name=$1),$2,$3)
  ON CONFLICT (guest_id)
  DO UPDATE SET status=$2,dietary=$3,updated_at=NOW()`,
  [name,status,dietary||'']);
  res.json({ok:true});
}
