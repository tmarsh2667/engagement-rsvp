import { useState,useEffect } from 'react'

export default function Admin(){

  const [responses,setResponses]=useState([]);
  const [file,setFile]=useState();

  const load=async()=>{
    setResponses(await fetch('/api/responses').then(r=>r.json()));
  }

  useEffect(()=>{load()},[]);

  const upload=async()=>{
    const txt=await file.text();
    const names=txt.split(/\r?\n/).map(x=>x.split(',')[0]).filter(Boolean);
    await fetch('/api/guests-bulk',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({names})
    });
    alert("Uploaded!");
  }

  const force=async(n,s)=>{
    await fetch('/api/force',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({name:n,status:s})
    });
    load();
  }

  return <div style={{padding:40}}>
    <h2>Admin Panel</h2>

    <input type="file" onChange={e=>setFile(e.target.files[0])}/>
    <button onClick={upload}>Upload CSV</button>

    <br/><br/>

    <a href="/api/export">Download Responses</a>

    {responses.map((r,i)=>
      <div key={i}>
        <b>{r.name}</b> — {r.status} • {r.dietary||'No dietary'}
        <button onClick={()=>force(r.name,'Attending')}>✓</button>
        <button onClick={()=>force(r.name,'Declined')}>✗</button>
      </div>
    )}
  </div>
}
