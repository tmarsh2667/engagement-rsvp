
import { pool } from '../../lib/db'
export default async function handler(req, res)
  if(req.method==='GET'){
    const r=await pool.query('SELECT id,name FROM guests ORDER BY name');
    res.json(r.rows);return;
  }
  if(req.method==='POST'){
    const {names}=req.body;
    for(const n of names){
      await pool.query('INSERT INTO guests(name) VALUES($1) ON CONFLICT DO NOTHING',[n]);
    }
    res.json({ok:true});
  }
}
