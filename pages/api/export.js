import { pool } from '../../lib/db'

export default async function handler(req,res){

  const r = await pool.query(`
    SELECT g.name,r.status,r.dietary
    FROM responses r
    JOIN guests g ON g.id=r.guest_id
  `);

  let csv = "Name,Status,Dietary\n";

  r.rows.forEach(x=>{
    csv+=`${x.name},${x.status},${x.dietary||''}\n`
  });

  res.setHeader("Content-Type","text/csv");
  res.send(csv);
}
